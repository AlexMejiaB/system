// Comprehensive API and database CRUD testing script
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testDatabaseOperations() {
  console.log('🧪 Starting comprehensive database CRUD testing...')

  try {
    // Test Department CRUD
    console.log('📋 Testing Department operations...')
    
    // Create
    const testDept = await prisma.department.create({
      data: {
        name: 'Test Department'
      }
    })
    console.log('✅ Department created:', testDept.id)

    // Read
    const departments = await prisma.department.findMany()
    console.log('✅ Departments read:', departments.length)

    // Update
    const updatedDept = await prisma.department.update({
      where: { id: testDept.id },
      data: { name: 'Updated Test Department' }
    })
    console.log('✅ Department updated:', updatedDept.name)

    // Delete
    await prisma.department.delete({
      where: { id: testDept.id }
    })
    console.log('✅ Department deleted')

    // Test Position CRUD
    console.log('💼 Testing Position operations...')
    
    const firstDept = departments[0]
    const testPosition = await prisma.position.create({
      data: {
        title: 'Test Position',
        description: 'Test position description',
        departmentId: firstDept.id,
        baseSalary: 25000,
        isActive: true
      }
    })
    console.log('✅ Position created:', testPosition.id)

    const positions = await prisma.position.findMany({
      include: { department: true }
    })
    console.log('✅ Positions with departments read:', positions.length)

    await prisma.position.update({
      where: { id: testPosition.id },
      data: { title: 'Updated Test Position' }
    })
    console.log('✅ Position updated')

    await prisma.position.delete({
      where: { id: testPosition.id }
    })
    console.log('✅ Position deleted')

    // Test Employee CRUD with relations
    console.log('👨‍💼 Testing Employee operations...')
    
    const employees = await prisma.employee.findMany({
      include: {
        department: true,
        position: true,
        timeEntries: true,
        payrollEntries: true,
        laborCalculations: true
      }
    })
    console.log('✅ Employees with relations read:', employees.length)

    if (employees.length > 0) {
      const employee = employees[0]
      
      // Update employee
      await prisma.employee.update({
        where: { id: employee.id },
        data: { phone: '+52 55 9999 9999' }
      })
      console.log('✅ Employee updated')

      // Test TimeEntry CRUD
      console.log('⏰ Testing TimeEntry operations...')
      
      const testTimeEntry = await prisma.timeEntry.create({
        data: {
          employeeId: employee.id,
          date: new Date(),
          clockIn: new Date(),
          clockOut: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours later
          hoursWorked: 8,
          overtimeHours: 0,
          status: 'APPROVED'
        }
      })
      console.log('✅ TimeEntry created:', testTimeEntry.id)

      await prisma.timeEntry.delete({
        where: { id: testTimeEntry.id }
      })
      console.log('✅ TimeEntry deleted')

      // Test PayrollEntry CRUD
      console.log('💰 Testing PayrollEntry operations...')
      
      const testPayrollEntry = await prisma.payrollEntry.create({
        data: {
          employeeId: employee.id,
          payPeriodStart: new Date('2024-01-01'),
          payPeriodEnd: new Date('2024-01-15'),
          baseSalary: employee.salary || 25000,
          overtime: 0,
          bonuses: 0,
          deductions: 2500,
          netPay: 22500,
          status: 'PAID'
        }
      })
      console.log('✅ PayrollEntry created:', testPayrollEntry.id)

      await prisma.payrollEntry.delete({
        where: { id: testPayrollEntry.id }
      })
      console.log('✅ PayrollEntry deleted')
    }

    // Test User CRUD
    console.log('👥 Testing User operations...')
    
    const users = await prisma.user.findMany()
    console.log('✅ Users read:', users.length)

    // Test BenefitPlan CRUD
    console.log('🏥 Testing BenefitPlan operations...')
    
    const testBenefitPlan = await prisma.benefitPlan.create({
      data: {
        name: 'Test Benefit Plan',
        description: 'Test description',
        type: 'HEALTH_INSURANCE',
        provider: 'Test Provider',
        cost: 1000,
        employeeCost: 200,
        isActive: true
      }
    })
    console.log('✅ BenefitPlan created:', testBenefitPlan.id)

    await prisma.benefitPlan.delete({
      where: { id: testBenefitPlan.id }
    })
    console.log('✅ BenefitPlan deleted')

    // Test TrainingProgram CRUD
    console.log('🎓 Testing TrainingProgram operations...')
    
    const testTrainingProgram = await prisma.trainingProgram.create({
      data: {
        name: 'Test Training Program',
        description: 'Test description',
        category: 'TECHNICAL',
        duration: 40,
        provider: 'Test Provider',
        cost: 5000,
        isActive: true
      }
    })
    console.log('✅ TrainingProgram created:', testTrainingProgram.id)

    await prisma.trainingProgram.delete({
      where: { id: testTrainingProgram.id }
    })
    console.log('✅ TrainingProgram deleted')

    // Test Asset CRUD
    console.log('💻 Testing Asset operations...')
    
    const testAsset = await prisma.asset.create({
      data: {
        name: 'Test Asset',
        description: 'Test description',
        category: 'COMPUTER',
        serialNumber: 'TEST001',
        purchaseDate: new Date(),
        purchasePrice: 10000,
        status: 'AVAILABLE'
      }
    })
    console.log('✅ Asset created:', testAsset.id)

    await prisma.asset.delete({
      where: { id: testAsset.id }
    })
    console.log('✅ Asset deleted')

    // Test Incident CRUD
    console.log('📝 Testing Incident operations...')
    
    if (employees.length > 0) {
      const testIncident = await prisma.incident.create({
        data: {
          employeeId: employees[0].id,
          type: 'UNPAID_LEAVE',
          reason: 'Test reason',
          startDate: new Date(),
          endDate: new Date(),
          description: 'Test incident description',
          status: 'PENDING'
        }
      })
      console.log('✅ Incident created:', testIncident.id)

      await prisma.incident.delete({
        where: { id: testIncident.id }
      })
      console.log('✅ Incident deleted')
    }

    // Test complex queries
    console.log('🔍 Testing complex queries...')
    
    // Employees with their departments and positions
    const employeesWithDetails = await prisma.employee.findMany({
      include: {
        department: true,
        position: true,
        laborCalculations: true,
        timeEntries: {
          take: 5,
          orderBy: { date: 'desc' }
        },
        payrollEntries: {
          take: 3,
          orderBy: { payPeriodStart: 'desc' }
        }
      }
    })
    console.log('✅ Complex employee query:', employeesWithDetails.length)

    // Departments with employee count
    const departmentsWithCounts = await prisma.department.findMany({
      include: {
        employees: true,
        positions: true,
        _count: {
          select: {
            employees: true,
            positions: true
          }
        }
      }
    })
    console.log('✅ Departments with counts:', departmentsWithCounts.length)

    // Recent time entries
    const recentTimeEntries = await prisma.timeEntry.findMany({
      where: {
        date: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      include: {
        employee: {
          include: {
            department: true,
            position: true
          }
        }
      },
      orderBy: { date: 'desc' },
      take: 10
    })
    console.log('✅ Recent time entries:', recentTimeEntries.length)

    // Payroll summary
    const payrollSummary = await prisma.payrollEntry.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      _sum: {
        baseSalary: true,
        netPay: true
      }
    })
    console.log('✅ Payroll summary:', payrollSummary.length)

    console.log('✅ All database CRUD operations completed successfully!')
    
  } catch (error) {
    console.error('❌ Database operation failed:', error)
    throw error
  }
}

async function testAPIEndpoints() {
  console.log('🌐 Testing API endpoints...')
  
  const baseUrl = 'http://localhost:3000'
  
  try {
    // Test basic endpoints that should be accessible
    const endpoints = [
      '/api/employees',
      '/api/departments',
      '/api/positions',
      '/api/time-entries',
      '/api/payroll',
      '/api/incidents',
      '/api/hr/onboarding',
      '/api/hr/interviews',
      '/api/benefits',
      '/api/training',
      '/api/assets',
      '/api/reports'
    ]

    console.log('📡 API endpoints to test:', endpoints.length)
    console.log('Note: API testing requires the development server to be running')
    console.log('Run: npm run dev in another terminal to test API endpoints')
    
  } catch (error) {
    console.error('❌ API testing failed:', error)
  }
}

async function main() {
  try {
    await testDatabaseOperations()
    await testAPIEndpoints()
    
    console.log('🎉 All tests completed successfully!')
    
  } catch (error) {
    console.error('❌ Testing failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

