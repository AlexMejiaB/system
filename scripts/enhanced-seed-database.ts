// Enhanced seeding script with comprehensive Mexican labor law examples
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting comprehensive database seeding...')

  // Clear existing data in correct order
  await prisma.timeEntry.deleteMany()
  await prisma.payrollEntry.deleteMany()
  await prisma.laborCalculation.deleteMany()
  await prisma.incident.deleteMany()
  await prisma.performanceReview.deleteMany()
  await prisma.benefitEnrollment.deleteMany()
  await prisma.benefitPlan.deleteMany()
  await prisma.trainingEnrollment.deleteMany()
  await prisma.trainingProgram.deleteMany()
  await prisma.assetAssignment.deleteMany()
  await prisma.asset.deleteMany()
  await prisma.survey.deleteMany()
  await prisma.employeeRole.deleteMany()
  await prisma.employeeProfile.deleteMany()
  await prisma.employee.deleteMany()
  await prisma.position.deleteMany()
  await prisma.department.deleteMany()
  await prisma.user.deleteMany()

  console.log('🧹 Cleared existing data')

  // Create departments with more variety
  const departments = await Promise.all([
    prisma.department.create({
      data: {
        name: 'Recursos Humanos'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Tecnología e Innovación'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Finanzas y Contabilidad'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Marketing y Ventas'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Operaciones y Logística'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Calidad y Procesos'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Legal y Cumplimiento'
      }
    }),
    prisma.department.create({
      data: {
        name: 'Producción'
      }
    })
  ])

  console.log('🏢 Created departments')

  // Create comprehensive positions
  const positions = await Promise.all([
    // HR Positions
    prisma.position.create({
      data: {
        title: 'Director de Recursos Humanos',
        description: 'Liderazgo estratégico de la gestión del capital humano',
        departmentId: departments[0].id,
        minSalary: 80000,
        maxSalary: 120000,
        requirements: 'Maestría en RH o Administración, 10+ años de experiencia directiva',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Gerente de Recursos Humanos',
        description: 'Gestión integral del capital humano y desarrollo organizacional',
        departmentId: departments[0].id,
        minSalary: 45000,
        maxSalary: 65000,
        requirements: 'Licenciatura en Psicología o Administración, 5+ años de experiencia',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Especialista en Reclutamiento',
        description: 'Atracción y selección de talento',
        departmentId: departments[0].id,
        minSalary: 25000,
        maxSalary: 35000,
        requirements: 'Licenciatura en Psicología, 2+ años en reclutamiento',
        isActive: true
      }
    }),
    // Technology Positions
    prisma.position.create({
      data: {
        title: 'Arquitecto de Software',
        description: 'Diseño de arquitecturas de software escalables y robustas',
        departmentId: departments[1].id,
        minSalary: 60000,
        maxSalary: 85000,
        requirements: 'Ingeniería en Sistemas, 7+ años de experiencia, certificaciones en cloud',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Desarrollador Senior Full Stack',
        description: 'Desarrollo de aplicaciones web y móviles completas',
        departmentId: departments[1].id,
        minSalary: 40000,
        maxSalary: 55000,
        requirements: 'Ingeniería en Sistemas, 4+ años de experiencia en desarrollo',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Desarrollador Junior',
        description: 'Desarrollo de componentes y funcionalidades bajo supervisión',
        departmentId: departments[1].id,
        minSalary: 18000,
        maxSalary: 25000,
        requirements: 'Ingeniería en Sistemas o afín, conocimientos en programación',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Analista de Sistemas',
        description: 'Análisis y diseño de sistemas de información empresariales',
        departmentId: departments[1].id,
        minSalary: 25000,
        maxSalary: 35000,
        requirements: 'Ingeniería en Sistemas, conocimiento en bases de datos y análisis',
        isActive: true
      }
    }),
    // Finance Positions
    prisma.position.create({
      data: {
        title: 'Director Financiero (CFO)',
        description: 'Liderazgo estratégico de las finanzas corporativas',
        departmentId: departments[2].id,
        minSalary: 100000,
        maxSalary: 150000,
        requirements: 'Maestría en Finanzas, CPA, 10+ años de experiencia directiva',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Contador General',
        description: 'Gestión contable y fiscal integral de la empresa',
        departmentId: departments[2].id,
        minSalary: 30000,
        maxSalary: 45000,
        requirements: 'Licenciatura en Contaduría, cédula profesional, experiencia fiscal',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Analista Financiero',
        description: 'Análisis financiero y elaboración de reportes ejecutivos',
        departmentId: departments[2].id,
        minSalary: 22000,
        maxSalary: 32000,
        requirements: 'Licenciatura en Finanzas o Economía, Excel avanzado',
        isActive: true
      }
    }),
    // Marketing Positions
    prisma.position.create({
      data: {
        title: 'Gerente de Marketing',
        description: 'Estrategia integral de marketing y comunicación corporativa',
        departmentId: departments[3].id,
        minSalary: 40000,
        maxSalary: 60000,
        requirements: 'Licenciatura en Marketing, 5+ años de experiencia gerencial',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Especialista en Marketing Digital',
        description: 'Estrategias de marketing digital, SEO/SEM y redes sociales',
        departmentId: departments[3].id,
        minSalary: 22000,
        maxSalary: 32000,
        requirements: 'Licenciatura en Marketing, certificaciones en Google Ads y Analytics',
        isActive: true
      }
    }),
    // Operations Positions
    prisma.position.create({
      data: {
        title: 'Gerente de Operaciones',
        description: 'Optimización de procesos operativos y cadena de suministro',
        departmentId: departments[4].id,
        minSalary: 45000,
        maxSalary: 65000,
        requirements: 'Ingeniería Industrial, 5+ años en operaciones',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Supervisor de Producción',
        description: 'Supervisión directa de líneas de producción',
        departmentId: departments[7].id,
        minSalary: 20000,
        maxSalary: 28000,
        requirements: 'Técnico o Ingeniería, experiencia en manufactura',
        isActive: true
      }
    }),
    prisma.position.create({
      data: {
        title: 'Operador de Producción',
        description: 'Operación de maquinaria y equipos de producción',
        departmentId: departments[7].id,
        minSalary: 12000,
        maxSalary: 16000,
        requirements: 'Secundaria terminada, capacitación en seguridad industrial',
        isActive: true
      }
    })
  ])

  console.log('💼 Created comprehensive positions')

  // Create users with different roles
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const hrPassword = await bcrypt.hash('hr123', 10)
  const payrollPassword = await bcrypt.hash('payroll123', 10)
  const managerPassword = await bcrypt.hash('manager123', 10)
  const employeePassword = await bcrypt.hash('employee123', 10)

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
        password: hrPassword,
        name: 'María García López',
        role: 'HR'
      }
    }),
    prisma.user.create({
      data: {
        email: 'payroll@company.com',
        password: payrollPassword,
        name: 'Ana Fernández Ruiz',
        role: 'PAYROLL'
      }
    }),
    prisma.user.create({
      data: {
        email: 'manager@company.com',
        password: managerPassword,
        name: 'Carlos Rodríguez Martín',
        role: 'MANAGER'
      }
    }),
    prisma.user.create({
      data: {
        email: 'employee@company.com',
        password: employeePassword,
        name: 'Luis Martínez Sánchez',
        role: 'EMPLOYEE'
      }
    })
  ])

  console.log('👥 Created users with roles')

  // Create comprehensive employee data
  const employees = await Promise.all([
    // Executive Level
    prisma.employee.create({
      data: {
        employeeId: 'EMP001',
        name: 'Roberto Mendoza Vega',
        email: 'roberto.mendoza@company.com',
        phone: '+52 55 1111 1111',
        address: 'Av. Polanco 100, Col. Polanco, CDMX, CP 11560',
        dateOfBirth: new Date('1975-01-15'),
        hireDate: new Date('2015-03-01'), // 9+ años
        departmentId: departments[2].id,
        positionId: positions[7].id, // CFO
        salary: 125000,
        isActive: true,
        emergencyContact: 'Patricia Vega - 55 1111 2222',
        rfc: 'MEVR750115ABC',
        curp: 'MEVR750115HDFNGT01',
        nss: '11111111111',
        bankAccount: '1111111111111111'
      }
    }),
    // Management Level
    prisma.employee.create({
      data: {
        employeeId: 'EMP002',
        name: 'María García López',
        email: 'maria.garcia@company.com',
        phone: '+52 55 2222 2222',
        address: 'Calle Roma Norte 200, Col. Roma Norte, CDMX, CP 06700',
        dateOfBirth: new Date('1985-03-15'),
        hireDate: new Date('2018-01-15'), // 6+ años
        departmentId: departments[0].id,
        positionId: positions[1].id, // Gerente RH
        salary: 55000,
        isActive: true,
        emergencyContact: 'Juan García - 55 2222 3333',
        rfc: 'GAML850315DEF',
        curp: 'GAML850315MDFRRR02',
        nss: '22222222222',
        bankAccount: '2222222222222222'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP003',
        name: 'Carlos Rodríguez Martín',
        email: 'carlos.rodriguez@company.com',
        phone: '+52 55 3333 3333',
        address: 'Av. Insurgentes Sur 300, Col. Del Valle, CDMX, CP 03100',
        dateOfBirth: new Date('1988-07-22'),
        hireDate: new Date('2019-06-01'), // 5+ años
        departmentId: departments[1].id,
        positionId: positions[3].id, // Arquitecto Software
        salary: 72000,
        isActive: true,
        emergencyContact: 'Laura Martín - 55 3333 4444',
        rfc: 'ROMC880722GHI',
        curp: 'ROMC880722HDFDRR03',
        nss: '33333333333',
        bankAccount: '3333333333333333'
      }
    }),
    // Senior Level
    prisma.employee.create({
      data: {
        employeeId: 'EMP004',
        name: 'Ana Fernández Ruiz',
        email: 'ana.fernandez@company.com',
        phone: '+52 55 4444 4444',
        address: 'Calle Condesa 400, Col. Condesa, CDMX, CP 06140',
        dateOfBirth: new Date('1990-11-08'),
        hireDate: new Date('2020-03-01'), // 4+ años
        departmentId: departments[2].id,
        positionId: positions[8].id, // Contador General
        salary: 37000,
        isActive: true,
        emergencyContact: 'Pedro Ruiz - 55 4444 5555',
        rfc: 'FERA901108JKL',
        curp: 'FERA901108MDFRNR04',
        nss: '44444444444',
        bankAccount: '4444444444444444'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP005',
        name: 'Luis Martínez Sánchez',
        email: 'luis.martinez@company.com',
        phone: '+52 55 5555 5555',
        address: 'Av. Universidad 500, Col. Narvarte, CDMX, CP 03020',
        dateOfBirth: new Date('1992-05-12'),
        hireDate: new Date('2021-01-15'), // 3+ años
        departmentId: departments[1].id,
        positionId: positions[4].id, // Desarrollador Senior
        salary: 47000,
        isActive: true,
        emergencyContact: 'Carmen Sánchez - 55 5555 6666',
        rfc: 'MASL920512MNO',
        curp: 'MASL920512HDFRNR05',
        nss: '55555555555',
        bankAccount: '5555555555555555'
      }
    }),
    // Mid Level
    prisma.employee.create({
      data: {
        employeeId: 'EMP006',
        name: 'Carmen Jiménez Torres',
        email: 'carmen.jimenez@company.com',
        phone: '+52 55 6666 6666',
        address: 'Calle Doctores 600, Col. Doctores, CDMX, CP 06720',
        dateOfBirth: new Date('1987-09-30'),
        hireDate: new Date('2021-09-01'), // 3+ años
        departmentId: departments[3].id,
        positionId: positions[11].id, // Especialista Marketing Digital
        salary: 27000,
        isActive: true,
        emergencyContact: 'Roberto Torres - 55 6666 7777',
        rfc: 'JITC870930PQR',
        curp: 'JITC870930MDFRRR06',
        nss: '66666666666',
        bankAccount: '6666666666666666'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP007',
        name: 'Diego Morales Herrera',
        email: 'diego.morales@company.com',
        phone: '+52 55 7777 7777',
        address: 'Av. Coyoacán 700, Col. Del Valle Sur, CDMX, CP 03104',
        dateOfBirth: new Date('1993-12-03'),
        hireDate: new Date('2022-02-01'), // 2+ años
        departmentId: departments[1].id,
        positionId: positions[6].id, // Analista Sistemas
        salary: 30000,
        isActive: true,
        emergencyContact: 'Sofia Herrera - 55 7777 8888',
        rfc: 'MOHD931203STU',
        curp: 'MOHD931203HDFRRR07',
        nss: '77777777777',
        bankAccount: '7777777777777777'
      }
    }),
    // Junior Level
    prisma.employee.create({
      data: {
        employeeId: 'EMP008',
        name: 'Sofía Ramírez Castro',
        email: 'sofia.ramirez@company.com',
        phone: '+52 55 8888 8888',
        address: 'Calle Álamos 800, Col. Álamos, CDMX, CP 03400',
        dateOfBirth: new Date('1996-04-18'),
        hireDate: new Date('2023-01-15'), // 1+ año
        departmentId: departments[1].id,
        positionId: positions[5].id, // Desarrollador Junior
        salary: 21000,
        isActive: true,
        emergencyContact: 'Miguel Castro - 55 8888 9999',
        rfc: 'RACS960418VWX',
        curp: 'RACS960418MDFMST08',
        nss: '88888888888',
        bankAccount: '8888888888888888'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP009',
        name: 'Alejandro Vázquez Peña',
        email: 'alejandro.vazquez@company.com',
        phone: '+52 55 9999 9999',
        address: 'Av. Tlalpan 900, Col. Portales, CDMX, CP 03300',
        dateOfBirth: new Date('1994-08-25'),
        hireDate: new Date('2023-06-01'), // Menos de 1 año
        departmentId: departments[2].id,
        positionId: positions[9].id, // Analista Financiero
        salary: 27000,
        isActive: true,
        emergencyContact: 'Elena Peña - 55 9999 0000',
        rfc: 'VAPA940825YZA',
        curp: 'VAPA940825HDFZNL09',
        nss: '99999999999',
        bankAccount: '9999999999999999'
      }
    }),
    // Production Workers
    prisma.employee.create({
      data: {
        employeeId: 'EMP010',
        name: 'José Antonio López Ruiz',
        email: 'jose.lopez@company.com',
        phone: '+52 55 1010 1010',
        address: 'Calle Trabajadores 1000, Col. Industrial, CDMX, CP 02300',
        dateOfBirth: new Date('1980-06-10'),
        hireDate: new Date('2016-08-15'), // 8+ años
        departmentId: departments[7].id,
        positionId: positions[13].id, // Supervisor Producción
        salary: 24000,
        isActive: true,
        emergencyContact: 'María López - 55 1010 2020',
        rfc: 'LORA800610BCD',
        curp: 'LORA800610HDFPZS10',
        nss: '10101010101',
        bankAccount: '1010101010101010'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP011',
        name: 'Pedro Hernández Gómez',
        email: 'pedro.hernandez@company.com',
        phone: '+52 55 1111 0000',
        address: 'Av. Industrial 1100, Col. Vallejo, CDMX, CP 07870',
        dateOfBirth: new Date('1985-02-28'),
        hireDate: new Date('2019-11-01'), // 5+ años
        departmentId: departments[7].id,
        positionId: positions[14].id, // Operador Producción
        salary: 14000,
        isActive: true,
        emergencyContact: 'Ana Gómez - 55 1111 1010',
        rfc: 'HEGP850228EFG',
        curp: 'HEGP850228HDFRMR11',
        nss: '11110000111',
        bankAccount: '1111000011110000'
      }
    }),
    prisma.employee.create({
      data: {
        employeeId: 'EMP012',
        name: 'Rosa María Flores Díaz',
        email: 'rosa.flores@company.com',
        phone: '+52 55 1212 1212',
        address: 'Calle Obreros 1200, Col. Obrera, CDMX, CP 06800',
        dateOfBirth: new Date('1991-10-14'),
        hireDate: new Date('2022-05-01'), // 2+ años
        departmentId: departments[7].id,
        positionId: positions[14].id, // Operador Producción
        salary: 13500,
        isActive: true,
        emergencyContact: 'Carlos Díaz - 55 1212 2121',
        rfc: 'FODR911014HIJ',
        curp: 'FODR911014MDFLDS12',
        nss: '12121212121',
        bankAccount: '1212121212121212'
      }
    })
  ])

  console.log('👨‍💼 Created comprehensive employee data')

  // Create employee profiles for each employee
  for (const employee of employees) {
    await prisma.employeeProfile.create({
      data: {
        employeeId: employee.id,
        skills: 'Liderazgo, Comunicación, Trabajo en equipo, Resolución de problemas',
        education: 'Licenciatura en área correspondiente',
        certifications: 'Certificaciones profesionales relevantes',
        languages: 'Español (Nativo), Inglés (Intermedio)',
        hobbies: 'Lectura, Deportes, Música',
        notes: 'Empleado comprometido con excelente desempeño'
      }
    })
  }

  console.log('📋 Created employee profiles')

  // Create employee roles
  for (const employee of employees) {
    await prisma.employeeRole.create({
      data: {
        employeeId: employee.id,
        role: employee.salary > 50000 ? 'MANAGER' : employee.salary > 30000 ? 'SENIOR' : employee.salary > 20000 ? 'MID_LEVEL' : 'JUNIOR',
        permissions: employee.salary > 50000 ? 'FULL_ACCESS' : 'LIMITED_ACCESS',
        isActive: true,
        assignedDate: employee.hireDate
      }
    })
  }

  console.log('🔐 Created employee roles')

  // Create labor calculations for each employee
  for (const employee of employees) {
    const yearsWorked = Math.floor((new Date().getTime() - employee.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365))
    
    // Aguinaldo calculation (15 days minimum)
    const aguinaldoDays = 15
    const dailySalary = employee.salary / 30
    const aguinaldoAmount = dailySalary * aguinaldoDays
    
    // Vacation days calculation (6 days first year + 2 additional per year, max 12 first 4 years)
    let vacationDays = 6
    if (yearsWorked >= 1) vacationDays = 6 + Math.min(yearsWorked - 1, 3) * 2
    if (yearsWorked >= 5) vacationDays = 12 + Math.floor((yearsWorked - 4) / 5) * 2
    
    const vacationAmount = dailySalary * vacationDays
    
    // Vacation premium (25% of vacation amount)
    const vacationPremium = vacationAmount * 0.25
    
    // Savings fund (10% of salary - equivalent, not deduction)
    const savingsFund = employee.salary * 0.10

    await prisma.laborCalculation.create({
      data: {
        employeeId: employee.id,
        calculationDate: new Date(),
        yearsWorked,
        dailySalary,
        aguinaldoDays,
        aguinaldoAmount,
        vacationDays,
        vacationAmount,
        vacationPremium,
        savingsFund,
        isActive: true
      }
    })
  }

  console.log('📊 Created comprehensive labor calculations')

  // Create benefit plans
  const benefitPlans = await Promise.all([
    prisma.benefitPlan.create({
      data: {
        name: 'Seguro de Gastos Médicos Mayores',
        description: 'Cobertura médica integral para empleado y familia',
        type: 'HEALTH_INSURANCE',
        provider: 'Seguros Monterrey New York Life',
        cost: 2500,
        employeeCost: 500,
        isActive: true
      }
    }),
    prisma.benefitPlan.create({
      data: {
        name: 'Seguro Dental',
        description: 'Cobertura dental preventiva y correctiva',
        type: 'DENTAL_INSURANCE',
        provider: 'MetLife México',
        cost: 400,
        employeeCost: 100,
        isActive: true
      }
    }),
    prisma.benefitPlan.create({
      data: {
        name: 'Seguro de Vida',
        description: 'Protección financiera para beneficiarios',
        type: 'LIFE_INSURANCE',
        provider: 'AXA Seguros',
        cost: 300,
        employeeCost: 0,
        isActive: true
      }
    }),
    prisma.benefitPlan.create({
      data: {
        name: 'Fondo de Ahorro Empresarial',
        description: 'Plan de ahorro con aportación patronal',
        type: 'RETIREMENT_401K',
        provider: 'Banco Santander',
        cost: 0,
        employeeCost: 0,
        isActive: true
      }
    })
  ])

  console.log('🏥 Created benefit plans')

  // Create benefit enrollments
  for (let i = 0; i < employees.length; i++) {
    const employee = employees[i]
    // Enroll senior employees in more benefits
    const benefitsToEnroll = employee.salary > 40000 ? benefitPlans : benefitPlans.slice(0, 2)
    
    for (const plan of benefitsToEnroll) {
      await prisma.benefitEnrollment.create({
        data: {
          employeeId: employee.id,
          benefitPlanId: plan.id,
          enrollmentDate: new Date(employee.hireDate.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days after hire
          effectiveDate: new Date(employee.hireDate.getTime() + 30 * 24 * 60 * 60 * 1000),
          status: 'ACTIVE'
        }
      })
    }
  }

  console.log('📋 Created benefit enrollments')

  // Create training programs
  const trainingPrograms = await Promise.all([
    prisma.trainingProgram.create({
      data: {
        name: 'Inducción Corporativa',
        description: 'Programa de inducción para nuevos empleados',
        category: 'ORIENTATION',
        duration: 40,
        provider: 'Recursos Humanos Internos',
        cost: 0,
        isActive: true
      }
    }),
    prisma.trainingProgram.create({
      data: {
        name: 'Liderazgo y Gestión de Equipos',
        description: 'Desarrollo de habilidades directivas y liderazgo',
        category: 'LEADERSHIP',
        duration: 80,
        provider: 'Instituto Tecnológico de Monterrey',
        cost: 15000,
        isActive: true
      }
    }),
    prisma.trainingProgram.create({
      data: {
        name: 'Seguridad Industrial y Prevención',
        description: 'Capacitación en seguridad y prevención de riesgos',
        category: 'SAFETY',
        duration: 24,
        provider: 'STPS Certificado',
        cost: 3000,
        isActive: true
      }
    }),
    prisma.trainingProgram.create({
      data: {
        name: 'Tecnologías de Desarrollo Web',
        description: 'Actualización en frameworks y tecnologías web modernas',
        category: 'TECHNICAL',
        duration: 120,
        provider: 'Platzi for Business',
        cost: 8000,
        isActive: true
      }
    })
  ])

  console.log('🎓 Created training programs')

  // Create assets
  const assets = await Promise.all([
    prisma.asset.create({
      data: {
        name: 'Laptop Dell Latitude 5520',
        description: 'Laptop corporativa para desarrollo',
        category: 'COMPUTER',
        serialNumber: 'DL5520001',
        purchaseDate: new Date('2023-01-15'),
        purchasePrice: 25000,
        status: 'AVAILABLE'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'iPhone 14 Pro',
        description: 'Teléfono corporativo para ejecutivos',
        category: 'PHONE',
        serialNumber: 'IP14P001',
        purchaseDate: new Date('2023-03-01'),
        purchasePrice: 35000,
        status: 'AVAILABLE'
      }
    }),
    prisma.asset.create({
      data: {
        name: 'Monitor LG 27" 4K',
        description: 'Monitor adicional para estación de trabajo',
        category: 'MONITOR',
        serialNumber: 'LG27K001',
        purchaseDate: new Date('2023-02-01'),
        purchasePrice: 8000,
        status: 'AVAILABLE'
      }
    })
  ])

  console.log('💻 Created assets')

  // Create comprehensive time entries (last 60 days)
  const timeEntries = []
  for (let i = 0; i < 60; i++) {
    for (const employee of employees.slice(0, 8)) { // Only for office workers
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue
      
      const clockIn = new Date(date)
      clockIn.setHours(8 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 60)) // 8-9 AM
      
      const clockOut = new Date(date)
      clockOut.setHours(17 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60)) // 5-7 PM
      
      const hoursWorked = Math.round((clockOut.getTime() - clockIn.getTime()) / (1000 * 60 * 60) * 100) / 100
      const overtimeHours = Math.max(0, hoursWorked - 8)
      
      timeEntries.push(
        prisma.timeEntry.create({
          data: {
            employeeId: employee.id,
            date,
            clockIn,
            clockOut,
            hoursWorked: Math.min(hoursWorked, 8),
            overtimeHours,
            status: 'APPROVED'
          }
        })
      )
    }
  }

  await Promise.all(timeEntries)
  console.log('⏰ Created comprehensive time entries')

  // Create payroll entries for last 3 months
  for (const employee of employees) {
    for (let month = 0; month < 3; month++) {
      const payPeriodStart = new Date()
      payPeriodStart.setMonth(payPeriodStart.getMonth() - month)
      payPeriodStart.setDate(1)
      
      const payPeriodEnd = new Date(payPeriodStart)
      payPeriodEnd.setMonth(payPeriodEnd.getMonth() + 1)
      payPeriodEnd.setDate(0)
      
      // Calculate deductions (approximate Mexican rates)
      const imssEmployee = employee.salary * 0.0325 // IMSS employee portion
      const isrDeduction = employee.salary * 0.10 // Simplified ISR
      const totalDeductions = imssEmployee + isrDeduction
      
      await prisma.payrollEntry.create({
        data: {
          employeeId: employee.id,
          payPeriodStart,
          payPeriodEnd,
          baseSalary: employee.salary,
          overtime: Math.floor(Math.random() * 5000),
          bonuses: month === 0 ? Math.floor(Math.random() * 10000) : 0, // Random bonus in current month
          deductions: totalDeductions,
          netPay: employee.salary - totalDeductions,
          status: 'PAID'
        }
      })
    }
  }

  console.log('💰 Created comprehensive payroll entries')

  // Create sample incidents
  const incidents = [
    {
      employeeId: employees[4].id, // Luis Martínez
      type: 'UNPAID_LEAVE',
      reason: 'Asuntos personales familiares',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-17'),
      description: 'Solicito permiso sin goce de sueldo por asuntos familiares urgentes',
      status: 'APPROVED'
    },
    {
      employeeId: employees[5].id, // Carmen Jiménez
      type: 'MEDICAL_LEAVE',
      reason: 'Cita médica especializada',
      startDate: new Date('2024-01-20'),
      endDate: new Date('2024-01-20'),
      description: 'Cita médica con especialista que no se puede reprogramar',
      status: 'PENDING'
    },
    {
      employeeId: employees[7].id, // Sofía Ramírez
      type: 'PERSONAL_LEAVE',
      reason: 'Trámites legales',
      startDate: new Date('2024-01-25'),
      endDate: new Date('2024-01-25'),
      description: 'Trámites legales que requieren presencia personal',
      status: 'APPROVED'
    }
  ]

  for (const incident of incidents) {
    await prisma.incident.create({
      data: incident
    })
  }

  console.log('📝 Created sample incidents')

  console.log('✅ Comprehensive database seeding completed successfully!')
  console.log(`📊 Created:
  - ${departments.length} departments
  - ${positions.length} positions  
  - ${users.length} users
  - ${employees.length} employees
  - ${benefitPlans.length} benefit plans
  - ${trainingPrograms.length} training programs
  - ${assets.length} assets
  - Multiple time entries, payroll entries, and incidents`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

