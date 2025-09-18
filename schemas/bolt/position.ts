import { z } from 'zod'

// Enum de departamentos válidos
const departments = [
  'QCD', 'SCD', 'RDD', 'MMD', 'ADD', 'ADDIT',
  'EQD', 'CSD', 'ADEHS', 'AD', 'HRD', 'FD'
] as const

export const positionSchema = z.object({
  title: z.string().min(2, 'El título es obligatorio'),
  department: z.enum(departments, 'Departamento inválido'),
  dailySalary: z.number().positive('El salario debe ser positivo'),
  isFilled: z.boolean().optional(), // Campo opcional
})

