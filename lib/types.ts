export interface Employee {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  hireDate: Date
  position: string
  baseSalary: number
  salaryFrequency: SalaryFrequency
  collarType: CollarType
  isActive: boolean
  plantId: number
  departmentId: number
  plant: Plant
  department: Department
  payrolls: Payroll[]
  benefits: Benefit[]
}

export interface Plant {
  id: number
  name: string
  employees: Employee[]
}

export interface Department {
  id: number
  name: string
  employees: Employee[]
}

export enum CollarType {
  BLUE = "BLUE",
  WHITE = "WHITE",
  GRAY = "GRAY",
}

export enum SalaryFrequency {
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
}

export enum Role {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  HR = "HR",
  PAYROLL = "PAYROLL",
}

export interface Payroll {
  id: number
  employeeId: number
  payPeriodStart: Date
  payPeriodEnd: Date
  grossPay: number
  netPay: number
  deductions: number
  taxes: number
  createdAt: Date
  employee: Employee
}

export interface Benefit {
  id: number
  employeeId: number
  type: BenefitType
  amount: number
  description?: string
  effectiveDate: Date
  employee: Employee
}

export enum BenefitType {
  AGUINALDO = "AGUINALDO",
  VACATION = "VACATION",
  SAVING_FUNDS = "SAVING_FUNDS",
  SAVING_BOX = "SAVING_BOX",
  COMEDOR = "COMEDOR",
}

export interface PlantWithCount extends Plant {
  _count: {
    employees: number
  }
}

export interface DepartmentWithCount extends Department {
  _count: {
    employees: number
  }
}

export interface PayrollStats {
  totalEmployees: number
  totalPayroll: number
  avgSalary: number
  pendingPayments: number
  stats: Array<{
    month: string
    amount: number
  }>
}

export interface ReportFilters {
  plant?: string
  department?: string
  collar?: CollarType
  salaryType?: SalaryFrequency
  year?: string
  month?: string
  search?: string
}
