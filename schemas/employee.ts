import { z } from "zod"

export const employeeSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  payrollNumber: z.number().min(1, "Payroll number is required"),
  positionId: z.string().min(1, "Position is required"),
  shift: z.string().min(1, "Shift is required"),
  nss: z.string().length(11, "NSS must be 11 characters"),
  rfc: z.string().max(13, "RFC must be max 13 characters"),
  curp: z.string().length(18, "CURP must be 18 characters"),
  birthDate: z.string().min(1, "Birth date is required"),
  birthPlace: z.string().min(1, "Birth place is required"),
  gender: z.enum(["M", "F", "Otro"], { required_error: "Gender is required" }),
  bloodType: z.string().min(1, "Blood type is required"),
  plant: z.enum(["PM", "SSD", "CHU"], { required_error: "Plant is required" }),
  department: z.enum(["QCD", "SCD", "RDD", "MMD", "ADD", "ADDIT", "EQD", "CSD", "ADEHS", "AD", "HRD", "FD"], {
    required_error: "Department is required",
  }),
  dailySalary: z.number().min(0, "Daily salary must be positive"),
  hireDate: z.string().min(1, "Hire date is required"),
  payrollType: z.enum(["CATORCENAL", "SEMANAL"], { required_error: "Payroll type is required" }),
  source: z.enum(["BESTJOBS", "IMPRO"], { required_error: "Hiring source is required" }),
  transportRoute: z.enum(["RUTA_1", "RUTA_2", "RUTA_3"], { required_error: "Transport route is required" }),
  transportStop: z.enum(["PARADA_1", "PARADA_2", "PARADA_3"], { required_error: "Transport stop is required" }),
  costCenter: z.string().min(1, "Cost center is required"),
  transportType: z.enum(["PROPIO", "RUTA"], { required_error: "Transport type is required" }),
  bankAccount: z.string().min(1, "Bank account is required"),
  collarType: z.enum(["BLUECOLLAR", "WHITECOLLAR", "GREYCOLLAR"], { required_error: "Collar type is required" }),
})

export type Employee = z.infer<typeof employeeSchema>
