import { db } from '@/lib/database'

// ────────────────
// DB Row (raw shape after SELECT with JOIN)
// ────────────────
interface EmployeeRow {
  id: number
  payrollNumber: number
  name: string
  shift: string
  nss: string
  rfc: string
  curp: string
  birthDate: string
  birthPlace: string
  gender: string
  bloodType: string
  plant: string
  department: string
  dailySalary: number
  hireDate: string
  payrollType: string
  source: string
  transportRoute: string
  transportStop: string
  costCenter: string
  transportType: string
  bankAccount: string
  collarType: string
  positionId: number      // from JOIN
  positionTitle: string   // from JOIN
}

// ────────────────
// Domain Type (used in app)
// ────────────────
export interface Employee {
  id: number
  payrollNumber: number
  name: string
  shift: string
  nss: string
  rfc: string
  curp: string
  birthDate: string
  birthPlace: string
  gender: string
  bloodType: string
  plant: string
  department: string
  dailySalary: number
  hireDate: string
  payrollType: string
  source: string
  transportRoute: string
  transportStop: string
  costCenter: string
  transportType: string
  bankAccount: string
  collarType: string
  position: {
    id: number
    title: string
  }
}

export interface CreateEmployeeData {
  payrollNumber: number
  name: string
  positionId: number
  shift: string
  nss: string
  rfc: string
  curp: string
  birthDate: string
  birthPlace: string
  gender: string
  bloodType: string
  plant: string
  department: string
  dailySalary: number
  hireDate: string
  payrollType: string
  source: string
  transportRoute: string
  transportStop: string
  costCenter: string
  transportType: string
  bankAccount: string
  collarType: string
}

// ────────────────
// Service
// ────────────────
export class EmployeeService {
  // Convert raw row → domain object
  private static mapRow(row: EmployeeRow): Employee {
    const { positionId, positionTitle, ...employeeData } = row
    return {
      ...employeeData,
      position: {
        id: positionId,
        title: positionTitle,
      },
    }
  }

  static getAll(): Employee[] {
    const stmt = db.prepare(`
      SELECT e.*, p.id as positionId, p.title as positionTitle
      FROM employees e
      JOIN positions p ON e.positionId = p.id
    `)

    const rows = stmt.all() as EmployeeRow[]
    return rows.map(this.mapRow)
  }

  static getById(id: number): Employee | null {
    const stmt = db.prepare(`
      SELECT e.*, p.id as positionId, p.title as positionTitle
      FROM employees e
      JOIN positions p ON e.positionId = p.id
      WHERE e.id = ?
    `)

    const row = stmt.get(id) as EmployeeRow | undefined
    return row ? this.mapRow(row) : null
  }

  static create(data: CreateEmployeeData): Employee {
    const stmt = db.prepare(`
      INSERT INTO employees (
        payrollNumber, name, positionId, shift, nss, rfc, curp, birthDate,
        birthPlace, gender, bloodType, plant, department, dailySalary,
        hireDate, payrollType, source, transportRoute, transportStop,
        costCenter, transportType, bankAccount, collarType
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = stmt.run(
      data.payrollNumber, data.name, data.positionId, data.shift, data.nss,
      data.rfc, data.curp, data.birthDate, data.birthPlace, data.gender,
      data.bloodType, data.plant, data.department, data.dailySalary,
      data.hireDate, data.payrollType, data.source, data.transportRoute,
      data.transportStop, data.costCenter, data.transportType,
      data.bankAccount, data.collarType
    )

    return this.getById(result.lastInsertRowid as number)!
  }

  static update(id: number, data: Partial<CreateEmployeeData>): Employee | null {
    const current = this.getById(id)
    if (!current) return null

    const updates: string[] = []
    const values: any[] = []

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`)
        values.push(value)
      }
    })

    if (updates.length === 0) return current

    values.push(id)
    const stmt = db.prepare(
      `UPDATE employees SET ${updates.join(', ')} WHERE id = ?`
    )
    stmt.run(...values)

    return this.getById(id)!
  }

  static delete(id: number): boolean {
    const stmt = db.prepare('DELETE FROM employees WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }
}
