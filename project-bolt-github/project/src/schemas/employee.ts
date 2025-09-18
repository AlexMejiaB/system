import { z } from 'zod'

const transportRoutes = ['RUTA_1', 'RUTA_2', 'RUTA_3'] as const
const transportStops = ['PARADA_1', 'PARADA_2', 'PARADA_3'] as const
const plants = ['PM', 'SSD', 'CHU'] as const
const departments = ['QCD','SCD','RDD','MMD','ADD','ADDIT','EQD','CSD','ADEHS','AD','HRD','FD'] as const
const payrollTypes = ['CATORCENAL', 'SEMANAL'] as const
const sources = ['BESTJOBS', 'IMPRO'] as const
const transportTypes = ['PROPIO', 'RUTA'] as const
const collarTypes = ['BLUECOLLAR', 'WHITECOLLAR', 'GREYCOLLAR'] as const

export const employeeSchema = z.object({
  payrollNumber: z.number().int().positive(),
  name: z.string().min(2),
  positionId: z.number().int().positive(),
  shift: z.string().min(2),
  nss: z.string().length(11),
  rfc: z.string().length(13),
  curp: z.string().length(18),
  birthDate: z.coerce.date(),
  birthPlace: z.string().min(2),
  gender: z.enum(['M', 'F', 'Otro']),
  bloodType: z.string().min(2),
  plant: z.enum(plants),
  department: z.enum(departments),
  dailySalary: z.number().positive(),
  hireDate: z.coerce.date(),
  payrollType: z.enum(payrollTypes),
  source: z.enum(sources),
  transportRoute: z.enum(transportRoutes),
  transportStop: z.enum(transportStops),
  costCenter: z.string().min(1),
  transportType: z.enum(transportTypes),
  bankAccount: z.string().min(10),
  collarType: z.enum(collarTypes),
})

