import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// Mexican names for realistic data
const mexicanNames = [
  'María Guadalupe García López',
  'José Luis Hernández Martínez',
  'Ana Patricia Rodríguez Sánchez',
  'Carlos Eduardo Pérez González',
  'Leticia Fernández Ramírez',
  'Miguel Ángel Torres Morales',
  'Rosa Elena Jiménez Castro',
  'Francisco Javier Ruiz Ortega',
  'Carmen Dolores Vargas Herrera',
  'Roberto Carlos Mendoza Silva',
  'Silvia Alejandra Cruz Delgado',
  'Juan Manuel Flores Aguilar',
  'Esperanza Moreno Vázquez',
  'Alejandro Reyes Guerrero',
  'Guadalupe Castillo Romero',
  'Fernando Díaz Medina',
  'Maricela Gutiérrez Ramos',
  'Arturo Salinas Navarro',
  'Verónica Luna Espinoza',
  'Raúl Domínguez Cortés'
]

const departments = [
  'Recursos Humanos',
  'Contabilidad y Finanzas',
  'Producción',
  'Ventas y Marketing',
  'Sistemas y Tecnología',
  'Calidad',
  'Mantenimiento',
  'Compras y Logística'
]

const positions = [
  { title: 'Gerente General', baseSalary: 45000, departmentName: 'Recursos Humanos' },
  { title: 'Gerente de RH', baseSalary: 35000, departmentName: 'Recursos Humanos' },
  { title: 'Analista de RH', baseSalary: 18000, departmentName: 'Recursos Humanos' },
  { title: 'Contador General', baseSalary: 28000, departmentName: 'Contabilidad y Finanzas' },
  { title: 'Auxiliar Contable', baseSalary: 15000, departmentName: 'Contabilidad y Finanzas' },
  { title: 'Supervisor de Producción', baseSalary: 25000, departmentName: 'Producción' },
  { title: 'Operador de Máquina', baseSalary: 12000, departmentName: 'Producción' },
  { title: 'Gerente de Ventas', baseSalary: 32000, departmentName: 'Ventas y Marketing' },
  { title: 'Ejecutivo de Ventas', baseSalary: 16000, departmentName: 'Ventas y Marketing' },
  { title: 'Jefe de Sistemas', baseSalary: 30000, departmentName: 'Sistemas y Tecnología' },
  { title: 'Desarrollador', baseSalary: 22000, departmentName: 'Sistemas y Tecnología' },
  { title: 'Inspector de Calidad', baseSalary: 14000, departmentName: 'Calidad' },
  { title: 'Técnico de Mantenimiento', baseSalary: 13000, departmentName: 'Mantenimiento' },
  { title: 'Coordinador de Compras', baseSalary: 20000, departmentName: 'Compras y Logística' }
]

const employeeRoles = [
  {
    name: 'Administrador',
    description: 'Acceso completo al sistema',
    permissions: JSON.stringify({
      employees: { read: true, write: true, delete: true },
      payroll: { read: true, write: true, delete: true },
      reports: { read: true, write: true, delete: true },
      hr: { read: true, write: true, delete: true },
      incidents: { read: true, write: true, delete: true },
      laborCalculations: { read: true, write: true, delete: true }
    })
  },
  {
    name: 'Gerente de RH',
    description: 'Gestión completa de recursos humanos',
    permissions: JSON.stringify({
      employees: { read: true, write: true, delete: false },
      payroll: { read: true, write: false, delete: false },
      reports: { read: true, write: true, delete: false },
      hr: { read: true, write: true, delete: true },
      incidents: { read: true, write: true, delete: false },
      laborCalculations: { read: true, write: true, delete: false }
    })
  },
  {
    name: 'Supervisor',
    description: 'Supervisión de empleados y reportes básicos',
    permissions: JSON.stringify({
      employees: { read: true, write: false, delete: false },
      payroll: { read: true, write: false, delete: false },
      reports: { read: true, write: false, delete: false },
      hr: { read: true, write: false, delete: false },
      incidents: { read: true, write: true, delete: false },
      laborCalculations: { read: true, write: false, delete: false }
    })
  },
  {
    name: 'Empleado',
    description: 'Acceso básico para empleados',
    permissions: JSON.stringify({
      employees: { read: false, write: false, delete: false },
      payroll: { read: false, write: false, delete: false },
      reports: { read: false, write: false, delete: false },
      hr: { read: false, write: false, delete: false },
      incidents: { read: true, write: true, delete: false },
      laborCalculations: { read: false, write: false, delete: false }
    })
  }
]

// Generate RFC (Mexican tax ID) - simplified version
function generateRFC(name: string): string {
  const names = name.split(' ')
  const lastName1 = names[names.length - 2] || 'XXX'
  const lastName2 = names[names.length - 1] || 'XXX'
  const firstName = names[0] || 'XXX'
  
  const rfc = (lastName1.substring(0, 2) + lastName2.substring(0, 1) + firstName.substring(0, 1)).toUpperCase()
  const year = Math.floor(Math.random() * 30) + 70 // 70-99
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
  const homoclave = String(Math.floor(Math.random() * 900) + 100)
  
  return `${rfc}${year}${month}${day}${homoclave}`
}

// Generate CURP (Mexican unique population registry code) - simplified version
function generateCURP(name: string, gender: 'MALE' | 'FEMALE'): string {
  const names = name.split(' ')
  const lastName1 = names[names.length - 2] || 'XXX'
  const lastName2 = names[names.length - 1] || 'XXX'
  const firstName = names[0] || 'XXX'
  
  const curp = (lastName1.substring(0, 2) + lastName2.substring(0, 1) + firstName.substring(0, 1)).toUpperCase()
  const year = String(Math.floor(Math.random() * 30) + 70).padStart(2, '0')
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')
  const genderCode = gender === 'MALE' ? 'H' : 'M'
  const state = 'DF' // Mexico City
  const consonants = 'BCDFGHJKLMNPQRSTVWXYZ'
  const consonant1 = consonants[Math.floor(Math.random() * consonants.length)]
  const consonant2 = consonants[Math.floor(Math.random() * consonants.length)]
  const digit = Math.floor(Math.random() * 10)
  
  return `${curp}${year}${month}${day}${genderCode}${state}${consonant1}${consonant2}${digit}`
}

// Generate NSS (Social Security Number) - simplified version
function generateNSS(): string {
  const delegation = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
  const year = String(Math.floor(Math.random() * 30) + 70).padStart(2, '0')
  const consecutive = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0')
  const verifier = Math.floor(Math.random() * 10)
  
  return `${delegation}${year}${consecutive}${verifier}`
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.laborCalculation.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.employeeProfile.deleteMany()
  await prisma.employeeRole.deleteMany()
  await prisma.payrollEntry.deleteMany()
  await prisma.payrollPeriod.deleteMany()
  await prisma.timeEntry.deleteMany()
  await prisma.document.deleteMany()
  await prisma.onboardingTask.deleteMany()
  await prisma.onboardingTemplateTask.deleteMany()
  await prisma.onboardingTemplate.deleteMany()
  await prisma.interview.deleteMany()
  await prisma.applicant.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.position.deleteMany()
  await prisma.department.deleteMany()
  await prisma.plant.deleteMany()
  await prisma.deduction.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@company.com',
        password: hashedPassword,
        name: 'Administrador del Sistema',
        role: 'ADMIN'
      }
    }),
    prisma.user.create({
      data: {
        email: 'hr@company.com',
        password: hashedPassword,
        name: 'Gerente de Recursos Humanos',
        role: 'HR'
      }
    }),
    prisma.user.create({
      data: {
        email: 'payroll@company.com',
        password: hashedPassword,
        name: 'Especialista en Nómina',
        role: 'PAYROLL'
      }
    }),
    prisma.user.create({
      data: {
        email: 'manager@company.com',
        password: hashedPassword,
        name: 'Gerente General',
        role: 'MANAGER'
      }
    })
  ])

  // Create employee roles
  console.log('🎭 Creating employee roles...')
  const createdRoles = await Promise.all(
    employeeRoles.map(role => 
      prisma.employeeRole.create({ data: role })
    )
  )

  // Create plant
  console.log('🏭 Creating plant...')
  const plant = await prisma.plant.create({
    data: {
      name: 'Planta Principal México'
    }
  })

  // Create departments
  console.log('🏢 Creating departments...')
  const createdDepartments = await Promise.all(
    departments.map(name => 
      prisma.department.create({ data: { name } })
    )
  )

  // Create positions
  console.log('💼 Creating positions...')
  const createdPositions = await Promise.all(
    positions.map(pos => {
      const department = createdDepartments.find(d => d.name === pos.departmentName)!
      return prisma.position.create({
        data: {
          title: pos.title,
          description: `Posición de ${pos.title} en el departamento de ${pos.departmentName}`,
          departmentId: department.id,
          baseSalary: pos.baseSalary
        }
      })
    })
  )

  // Create employees with Mexican labor law data
  console.log('👨‍💼 Creating employees with Mexican labor law data...')
  const employees = []
  
  for (let i = 0; i < mexicanNames.length; i++) {
    const name = mexicanNames[i]
    const position = createdPositions[Math.floor(Math.random() * createdPositions.length)]
    const department = createdDepartments.find(d => d.id === position.departmentId)!
    const gender = Math.random() > 0.5 ? 'MALE' : 'FEMALE'
    
    // Calculate hire date (1-10 years ago)
    const yearsAgo = Math.floor(Math.random() * 10) + 1
    const hireDate = new Date()
    hireDate.setFullYear(hireDate.getFullYear() - yearsAgo)
    hireDate.setMonth(Math.floor(Math.random() * 12))
    hireDate.setDate(Math.floor(Math.random() * 28) + 1)
    
    // Calculate salaries based on position
    const dailySalary = Math.floor(position.baseSalary / 30)
    const monthlySalary = position.baseSalary
    
    const employee = await prisma.employee.create({
      data: {
        employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
        name,
        payrollNumber: 1000 + i,
        email: `empleado${i + 1}@empresa.com.mx`,
        phone: `55${Math.floor(Math.random() * 90000000) + 10000000}`,
        hireDate,
        dailySalary,
        monthlySalary,
        shift: Math.random() > 0.7 ? 'Nocturno' : 'Matutino',
        transportType: Math.random() > 0.5 ? 'Propio' : 'Público',
        collarType: position.baseSalary > 20000 ? 'WHITE' : 'BLUE',
        plantId: plant.id,
        departmentId: department.id,
        positionId: position.id,
        rfc: generateRFC(name),
        curp: generateCURP(name, gender),
        nss: generateNSS(),
        bankAccount: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        emergencyContact: `Contacto de emergencia para ${name.split(' ')[0]}`
      }
    })

    // Create employee profile
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 2] || nameParts[1] || ''
    const middleName = nameParts[1] !== lastName ? nameParts[1] : undefined
    
    const birthDate = new Date(hireDate)
    birthDate.setFullYear(birthDate.getFullYear() - (Math.floor(Math.random() * 20) + 25)) // 25-45 years old
    
    const role = createdRoles[Math.floor(Math.random() * createdRoles.length)]
    
    await prisma.employeeProfile.create({
      data: {
        employeeId: employee.id,
        roleId: role.id,
        firstName,
        lastName,
        middleName,
        birthDate,
        gender,
        maritalStatus: ['SINGLE', 'MARRIED', 'DIVORCED'][Math.floor(Math.random() * 3)] as any,
        nationality: 'Mexicana',
        street: `Calle ${Math.floor(Math.random() * 100) + 1} #${Math.floor(Math.random() * 200) + 1}`,
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
        country: 'México',
        personalEmail: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
        homePhone: `55${Math.floor(Math.random() * 90000000) + 10000000}`,
        mobilePhone: employee.phone,
        contractType: Math.random() > 0.8 ? 'TEMPORARY' : 'PERMANENT',
        workSchedule: 'Lunes a Viernes 8:00-17:00',
        supervisor: i > 0 ? employees[Math.floor(Math.random() * Math.min(i, 3))]?.name : undefined
      }
    })

    employees.push(employee)
  }

  // Create labor calculations for current year
  console.log('📊 Creating labor calculations (Mexican Labor Law)...')
  const currentYear = new Date().getFullYear()
  
  for (const employee of employees) {
    // Calculate years of service
    const hireDate = new Date(employee.hireDate)
    const currentDate = new Date(currentYear, 11, 31)
    const yearsOfService = Math.floor((currentDate.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

    // Calculate vacation days based on Mexican Labor Law (Article 76)
    let vacationDays = 6
    if (yearsOfService === 1) vacationDays = 6
    else if (yearsOfService === 2) vacationDays = 8
    else if (yearsOfService === 3) vacationDays = 10
    else if (yearsOfService === 4) vacationDays = 12
    else if (yearsOfService >= 5 && yearsOfService <= 9) vacationDays = 14
    else if (yearsOfService >= 10 && yearsOfService <= 14) vacationDays = 16
    else if (yearsOfService >= 15 && yearsOfService <= 19) vacationDays = 18
    else if (yearsOfService >= 20 && yearsOfService <= 24) vacationDays = 20
    else if (yearsOfService >= 25 && yearsOfService <= 29) vacationDays = 22
    else vacationDays = 22 + Math.floor((yearsOfService - 25) / 5) * 2

    const monthlySalary = employee.monthlySalary || (employee.dailySalary * 30)
    const dailySalary = employee.dailySalary

    // Mexican Labor Law calculations
    const aguinaldoDays = 15 // Minimum by law (Article 87)
    const aguinaldoAmount = dailySalary * aguinaldoDays
    const vacationAmount = dailySalary * vacationDays
    const vacationBonus = vacationAmount * 0.25 // 25% vacation bonus (Article 80)
    const savingsFundAmount = monthlySalary * 0.10 // 10% equivalent (not deducted)
    const vacationPremium = vacationBonus // Same as vacation bonus
    
    // IMSS and INFONAVIT contributions (2024 rates)
    const imssEmployee = monthlySalary * 0.025 // 2.5% employee contribution
    const imssEmployer = monthlySalary * 0.105 // 10.5% employer contribution (approximate)
    const infonavit = monthlySalary * 0.05 // 5% INFONAVIT

    await prisma.laborCalculation.create({
      data: {
        employeeId: employee.id,
        year: currentYear,
        aguinaldoDays,
        aguinaldoAmount,
        vacationDays,
        vacationAmount,
        vacationBonus,
        savingsFundAmount,
        vacationPremium,
        imssEmployee,
        imssEmployer,
        infonavit
      }
    })
  }

  // Create sample incidents
  console.log('📝 Creating sample incidents...')
  const incidentTypes = [
    'LEAVE_WITHOUT_PAY',
    'MEDICAL_LEAVE', 
    'PERSONAL_LEAVE',
    'VACATION_REQUEST',
    'SICK_LEAVE'
  ]

  const incidentReasons = [
    'Asuntos personales urgentes',
    'Cita médica especializada',
    'Trámites gubernamentales',
    'Vacaciones programadas',
    'Enfermedad común',
    'Emergencia familiar',
    'Incapacidad temporal',
    'Permiso por matrimonio',
    'Cuidado de familiar enfermo',
    'Trámites bancarios importantes'
  ]

  for (let i = 0; i < 15; i++) {
    const employee = employees[Math.floor(Math.random() * employees.length)]
    const incidentType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
    const reason = incidentReasons[Math.floor(Math.random() * incidentReasons.length)]
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 90)) // Last 90 days
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1) // 1-5 days duration
    
    const status = ['PENDING', 'APPROVED', 'REJECTED'][Math.floor(Math.random() * 3)]
    
    await prisma.incident.create({
      data: {
        employeeId: employee.id,
        incidentType: incidentType as any,
        startDate,
        endDate,
        reason,
        description: `Descripción detallada: ${reason}`,
        status: status as any,
        approvedBy: status !== 'PENDING' ? 'Gerente de RH' : undefined,
        approvalDate: status === 'APPROVED' ? new Date() : undefined,
        rejectionReason: status === 'REJECTED' ? 'No cumple con los requisitos establecidos' : undefined,
        isPaid: incidentType !== 'LEAVE_WITHOUT_PAY'
      }
    })
  }

  // Create sample time entries
  console.log('⏰ Creating sample time entries...')
  const today = new Date()
  
  for (const employee of employees.slice(0, 10)) { // First 10 employees
    for (let day = 0; day < 30; day++) { // Last 30 days
      const entryDate = new Date(today)
      entryDate.setDate(today.getDate() - day)
      
      // Skip weekends
      if (entryDate.getDay() === 0 || entryDate.getDay() === 6) continue
      
      const clockIn = new Date(entryDate)
      clockIn.setHours(8, Math.floor(Math.random() * 30), 0, 0) // 8:00-8:30 AM
      
      const clockOut = new Date(entryDate)
      clockOut.setHours(17, Math.floor(Math.random() * 30), 0, 0) // 5:00-5:30 PM
      
      const hoursWorked = (clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60)
      const overtime = Math.max(0, hoursWorked - 8)
      
      await prisma.timeEntry.create({
        data: {
          employeeId: employee.id,
          date: entryDate,
          clockIn,
          clockOut,
          hoursWorked: Math.round(hoursWorked * 100) / 100,
          overtime: Math.round(overtime * 100) / 100,
          notes: Math.random() > 0.8 ? 'Tiempo extra autorizado' : undefined
        }
      })
    }
  }

  // Create sample payroll periods and entries
  console.log('💰 Creating sample payroll data...')
  const payrollPeriod = await prisma.payrollPeriod.create({
    data: {
      startDate: new Date(currentYear, 0, 1), // January 1st
      endDate: new Date(currentYear, 0, 15), // January 15th
      status: 'COMPLETED'
    }
  })

  for (const employee of employees.slice(0, 10)) {
    const regularHours = 80 // Bi-weekly
    const overtimeHours = Math.floor(Math.random() * 10)
    const hourlyRate = employee.dailySalary / 8
    const regularPay = regularHours * hourlyRate
    const overtimePay = overtimeHours * hourlyRate * 1.5 // 50% overtime premium
    const grossPay = regularPay + overtimePay
    const deductions = grossPay * 0.15 // 15% total deductions (taxes, IMSS, etc.)
    const netPay = grossPay - deductions
    
    await prisma.payrollEntry.create({
      data: {
        employeeId: employee.id,
        payrollPeriodId: payrollPeriod.id,
        regularHours,
        overtimeHours,
        regularPay,
        overtimePay,
        grossPay,
        deductions,
        netPay
      }
    })
  }

  // Create deductions
  console.log('💸 Creating deductions...')
  const deductions = [
    { name: 'IMSS Empleado', type: 'PERCENTAGE', percentage: 2.5 },
    { name: 'ISR', type: 'TAX', percentage: 10.0 },
    { name: 'Fondo de Retiro', type: 'PERCENTAGE', percentage: 1.0 },
    { name: 'Seguro de Vida', type: 'FIXED', amount: 150.0 },
    { name: 'Préstamo Personal', type: 'FIXED', amount: 500.0 }
  ]

  for (const deduction of deductions) {
    await prisma.deduction.create({
      data: {
        name: deduction.name,
        type: deduction.type as any,
        amount: deduction.amount,
        percentage: deduction.percentage
      }
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log(`
📊 Summary:
- ${users.length} users created
- ${createdRoles.length} employee roles created
- ${createdDepartments.length} departments created
- ${createdPositions.length} positions created
- ${employees.length} employees created with Mexican labor law data
- ${employees.length} labor calculations created (Aguinaldo, Vacaciones, Fondo de Ahorro)
- 15 sample incidents created
- Time entries for last 30 days (first 10 employees)
- Payroll data for January 2024
- ${deductions.length} deduction types created

🔑 Login credentials:
- Admin: admin@company.com / admin123
- HR: hr@company.com / admin123
- Payroll: payroll@company.com / admin123
- Manager: manager@company.com / admin123

🇲🇽 Mexican Labor Law compliance:
- Aguinaldo: 15 days minimum (Article 87 LFT)
- Vacaciones: Based on years of service (Article 76 LFT)
- Prima Vacacional: 25% of vacation pay (Article 80 LFT)
- Fondo de Ahorro: 10% equivalent (company benefit)
- IMSS contributions: Employee 2.5%, Employer 10.5%
- INFONAVIT: 5% employer contribution
- All employees have RFC, CURP, and NSS numbers
  `)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

