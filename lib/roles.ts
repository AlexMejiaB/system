// src/lib/roles.ts
export type Role = 'ADMIN' | 'HR' | 'PAYROLL' | 'MANAGER'

export const ROLE_PAGES: Record<Role, string[]> = {
  ADMIN: ['dashboard', 'employees', 'positions', 'payroll', 'reports', 'applicants'],
  HR: ['dashboard', 'employees', 'positions', 'reports', 'applicants'],
  PAYROLL: ['dashboard', 'employees', 'payroll', 'reports'],
  MANAGER: ['dashboard', 'employees', 'positions', 'reports']
}
