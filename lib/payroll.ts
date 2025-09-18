import { db } from '@/lib/database'

export interface PayrollPeriod {
  id: number
  name: string
  startDate: string
  endDate: string
  payDate: string
  status: 'DRAFT' | 'PROCESSING' | 'PROCESSED' | 'PAID'
  type: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
  createdAt: string
  updatedAt: string
}

export interface PayrollEntry {
  id: number
  employeeId: number
  periodId: number
  regularHours: number
  overtimeHours: number
  doubleTimeHours: number
  regularPay: number
  overtimePay: number
  doubleTimePay: number
  grossPay: number
  federalTax: number
  stateTax: number
  socialSecurity: number
  medicare: number
  otherDeductions: number
  totalDeductions: number
  netPay: number
  bonus: number
  commission: number
  status: 'PENDING' | 'CALCULATED' | 'APPROVED' | 'PAID'
  employee?: {
    id: number
    name: string
    payrollNumber: number
    department: string
    dailySalary: number
    payrollType: string
  }
}

export interface TimeEntry {
  id: number
  employeeId: number
  date: string
  clockIn: string | null
  clockOut: string | null
  breakStart: string | null
  breakEnd: string | null
  regularHours: number
  overtimeHours: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  notes: string | null
  employee?: {
    name: string
    payrollNumber: number
  }
}

export interface Deduction {
  id: number
  name: string
  type: 'TAX' | 'BENEFIT' | 'RETIREMENT' | 'OTHER'
  amount: number | null
  percentage: number | null
  isActive: boolean
}

export interface PayrollSummary {
  totalEmployees: number
  totalGrossPay: number
  totalDeductions: number
  totalNetPay: number
  averageHours: number
  overtimeHours: number
}

export class PayrollService {
  // Payroll Periods
  static getAllPeriods(): PayrollPeriod[] {
    const stmt = db.prepare(`
      SELECT * FROM payroll_periods 
      ORDER BY startDate DESC
    `)
    return stmt.all() as PayrollPeriod[]
  }

  static getPeriodById(id: number): PayrollPeriod | null {
    const stmt = db.prepare('SELECT * FROM payroll_periods WHERE id = ?')
    return stmt.get(id) as PayrollPeriod | null
  }

  static createPeriod(data: Omit<PayrollPeriod, 'id' | 'createdAt' | 'updatedAt'>): PayrollPeriod {
    const stmt = db.prepare(`
      INSERT INTO payroll_periods (name, startDate, endDate, payDate, status, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(data.name, data.startDate, data.endDate, data.payDate, data.status, data.type)
    return this.getPeriodById(result.lastInsertRowid as number)!
  }

  // Time Entries
  static getAllTimeEntries(): TimeEntry[] {
    const stmt = db.prepare(`
      SELECT t.*, e.name as employeeName, e.payrollNumber
      FROM time_entries t
      JOIN employees e ON t.employeeId = e.id
      ORDER BY t.date DESC, e.name
    `)
    const rows = stmt.all() as any[]
    return rows.map(row => ({
      id: row.id,
      employeeId: row.employeeId,
      date: row.date,
      clockIn: row.clockIn,
      clockOut: row.clockOut,
      breakStart: row.breakStart,
      breakEnd: row.breakEnd,
      regularHours: row.regularHours,
      overtimeHours: row.overtimeHours,
      status: row.status,
      notes: row.notes,
      employee: {
        name: row.employeeName,
        payrollNumber: row.payrollNumber
      }
    }))
  }

  static getTimeEntriesByEmployee(employeeId: number, startDate?: string, endDate?: string): TimeEntry[] {
    let query = `
      SELECT t.*, e.name as employeeName, e.payrollNumber
      FROM time_entries t
      JOIN employees e ON t.employeeId = e.id
      WHERE t.employeeId = ?
    `
    const params: any[] = [employeeId]

    if (startDate && endDate) {
      query += ' AND t.date BETWEEN ? AND ?'
      params.push(startDate, endDate)
    }

    query += ' ORDER BY t.date DESC'

    const stmt = db.prepare(query)
    const rows = stmt.all(...params) as any[]
    return rows.map(row => ({
      id: row.id,
      employeeId: row.employeeId,
      date: row.date,
      clockIn: row.clockIn,
      clockOut: row.clockOut,
      breakStart: row.breakStart,
      breakEnd: row.breakEnd,
      regularHours: row.regularHours,
      overtimeHours: row.overtimeHours,
      status: row.status,
      notes: row.notes,
      employee: {
        name: row.employeeName,
        payrollNumber: row.payrollNumber
      }
    }))
  }

  static createTimeEntry(data: Omit<TimeEntry, 'id' | 'employee'>): TimeEntry {
    const stmt = db.prepare(`
      INSERT INTO time_entries (employeeId, date, clockIn, clockOut, breakStart, breakEnd, regularHours, overtimeHours, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    const result = stmt.run(
      data.employeeId, data.date, data.clockIn, data.clockOut,
      data.breakStart, data.breakEnd, data.regularHours, data.overtimeHours,
      data.status, data.notes
    )
    return this.getAllTimeEntries().find(entry => entry.id === result.lastInsertRowid)!
  }

  // Payroll Calculations
  static calculatePayrollForPeriod(periodId: number): PayrollEntry[] {
    const period = this.getPeriodById(periodId)
    if (!period) throw new Error('Period not found')

    // Get all active employees
    const employeesStmt = db.prepare(`
      SELECT id, name, payrollNumber, department, dailySalary, payrollType
      FROM employees 
      WHERE isActive = 1
    `)
    const employees = employeesStmt.all() as any[]

    const payrollEntries: PayrollEntry[] = []

    for (const employee of employees) {
      // Get time entries for this period
      const timeEntries = this.getTimeEntriesByEmployee(employee.id, period.startDate, period.endDate)
      
      const totalRegularHours = timeEntries.reduce((sum, entry) => sum + entry.regularHours, 0)
      const totalOvertimeHours = timeEntries.reduce((sum, entry) => sum + entry.overtimeHours, 0)

      // Calculate pay
      const hourlyRate = employee.dailySalary / 8 // Assuming 8-hour workday
      const regularPay = totalRegularHours * hourlyRate
      const overtimePay = totalOvertimeHours * hourlyRate * 1.5
      const grossPay = regularPay + overtimePay

      // Calculate deductions
      const federalTax = grossPay * 0.22
      const stateTax = grossPay * 0.05
      const socialSecurity = grossPay * 0.062
      const medicare = grossPay * 0.0145
      const otherDeductions = 175 // Health + Dental insurance

      const totalDeductions = federalTax + stateTax + socialSecurity + medicare + otherDeductions
      const netPay = grossPay - totalDeductions

      const payrollEntry: PayrollEntry = {
        id: 0, // Will be set after insertion
        employeeId: employee.id,
        periodId: periodId,
        regularHours: totalRegularHours,
        overtimeHours: totalOvertimeHours,
        doubleTimeHours: 0,
        regularPay: regularPay,
        overtimePay: overtimePay,
        doubleTimePay: 0,
        grossPay: grossPay,
        federalTax: federalTax,
        stateTax: stateTax,
        socialSecurity: socialSecurity,
        medicare: medicare,
        otherDeductions: otherDeductions,
        totalDeductions: totalDeductions,
        netPay: netPay,
        bonus: 0,
        commission: 0,
        status: 'CALCULATED',
        employee: {
          id: employee.id,
          name: employee.name,
          payrollNumber: employee.payrollNumber,
          department: employee.department,
          dailySalary: employee.dailySalary,
          payrollType: employee.payrollType
        }
      }

      payrollEntries.push(payrollEntry)
    }

    return payrollEntries
  }

  static savePayrollEntries(entries: PayrollEntry[]): void {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO payroll_entries (
        employeeId, periodId, regularHours, overtimeHours, doubleTimeHours,
        regularPay, overtimePay, doubleTimePay, grossPay,
        federalTax, stateTax, socialSecurity, medicare, otherDeductions,
        totalDeductions, netPay, bonus, commission, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const insertMany = db.transaction((payrollEntries: PayrollEntry[]) => {
      for (const entry of payrollEntries) {
        stmt.run(
          entry.employeeId, entry.periodId, entry.regularHours, entry.overtimeHours, entry.doubleTimeHours,
          entry.regularPay, entry.overtimePay, entry.doubleTimePay, entry.grossPay,
          entry.federalTax, entry.stateTax, entry.socialSecurity, entry.medicare, entry.otherDeductions,
          entry.totalDeductions, entry.netPay, entry.bonus, entry.commission, entry.status
        )
      }
    })

    insertMany(entries)
  }

  static getPayrollEntriesByPeriod(periodId: number): PayrollEntry[] {
    const stmt = db.prepare(`
      SELECT pe.*, e.name, e.payrollNumber, e.department, e.dailySalary, e.payrollType
      FROM payroll_entries pe
      JOIN employees e ON pe.employeeId = e.id
      WHERE pe.periodId = ?
      ORDER BY e.name
    `)
    const rows = stmt.all(periodId) as any[]
    return rows.map(row => ({
      id: row.id,
      employeeId: row.employeeId,
      periodId: row.periodId,
      regularHours: row.regularHours,
      overtimeHours: row.overtimeHours,
      doubleTimeHours: row.doubleTimeHours,
      regularPay: row.regularPay,
      overtimePay: row.overtimePay,
      doubleTimePay: row.doubleTimePay,
      grossPay: row.grossPay,
      federalTax: row.federalTax,
      stateTax: row.stateTax,
      socialSecurity: row.socialSecurity,
      medicare: row.medicare,
      otherDeductions: row.otherDeductions,
      totalDeductions: row.totalDeductions,
      netPay: row.netPay,
      bonus: row.bonus,
      commission: row.commission,
      status: row.status,
      employee: {
        id: row.employeeId,
        name: row.name,
        payrollNumber: row.payrollNumber,
        department: row.department,
        dailySalary: row.dailySalary,
        payrollType: row.payrollType
      }
    }))
  }

  static getPayrollSummary(periodId: number): PayrollSummary {
    const entries = this.getPayrollEntriesByPeriod(periodId)
    
    return {
      totalEmployees: entries.length,
      totalGrossPay: entries.reduce((sum, entry) => sum + entry.grossPay, 0),
      totalDeductions: entries.reduce((sum, entry) => sum + entry.totalDeductions, 0),
      totalNetPay: entries.reduce((sum, entry) => sum + entry.netPay, 0),
      averageHours: entries.reduce((sum, entry) => sum + entry.regularHours, 0) / entries.length,
      overtimeHours: entries.reduce((sum, entry) => sum + entry.overtimeHours, 0)
    }
  }

  // Deductions
  static getAllDeductions(): Deduction[] {
    const stmt = db.prepare('SELECT * FROM deductions WHERE isActive = 1 ORDER BY name')
    return stmt.all() as Deduction[]
  }

  static updatePeriodStatus(periodId: number, status: PayrollPeriod['status']): void {
    const stmt = db.prepare('UPDATE payroll_periods SET status = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?')
    stmt.run(status, periodId)
  }
}