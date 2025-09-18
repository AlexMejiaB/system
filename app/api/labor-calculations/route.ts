import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const laborCalculationSchema = z.object({
  employeeId: z.number(),
  year: z.number(),
})

// Mexican Labor Law Calculation Functions
function calculateVacationDays(yearsOfService: number): number {
  // Mexican Labor Law: Article 76
  if (yearsOfService < 1) return 6
  if (yearsOfService === 1) return 6
  if (yearsOfService === 2) return 8
  if (yearsOfService === 3) return 10
  if (yearsOfService === 4) return 12
  if (yearsOfService >= 5 && yearsOfService <= 9) return 14
  if (yearsOfService >= 10 && yearsOfService <= 14) return 16
  if (yearsOfService >= 15 && yearsOfService <= 19) return 18
  if (yearsOfService >= 20 && yearsOfService <= 24) return 20
  if (yearsOfService >= 25 && yearsOfService <= 29) return 22
  // After 30 years, 2 additional days every 5 years
  return 22 + Math.floor((yearsOfService - 25) / 5) * 2
}

function calculateIMSSContributions(salary: number) {
  // IMSS contributions based on 2024 rates
  const employeeRate = 0.025 // 2.5% for employee
  const employerRate = 0.105 // 10.5% for employer (approximate)
  
  return {
    employee: salary * employeeRate,
    employer: salary * employerRate
  }
}

function calculateINFONAVIT(salary: number) {
  // INFONAVIT: 5% of salary (employer contribution)
  return salary * 0.05
}

// GET: Fetch labor calculations
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const year = searchParams.get('year')

    const where: any = {}
    if (employeeId) where.employeeId = parseInt(employeeId)
    if (year) where.year = parseInt(year)

    const calculations = await prisma.laborCalculation.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            hireDate: true,
            dailySalary: true,
            monthlySalary: true,
            department: {
              select: {
                name: true
              }
            },
            position: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { employee: { name: 'asc' } }
      ]
    })

    return NextResponse.json(calculations)
  } catch (error) {
    console.error('Error fetching labor calculations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch labor calculations' },
      { status: 500 }
    )
  }
}

// POST: Create or update labor calculation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { employeeId, year } = laborCalculationSchema.parse(body)

    // Get employee data
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Calculate years of service
    const hireDate = new Date(employee.hireDate)
    const currentDate = new Date(year, 11, 31) // End of the calculation year
    const yearsOfService = Math.floor((currentDate.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

    // Use monthly salary if available, otherwise calculate from daily salary
    const monthlySalary = employee.monthlySalary || (employee.dailySalary * 30)
    const dailySalary = employee.dailySalary

    // Calculate vacation days based on years of service
    const vacationDays = calculateVacationDays(yearsOfService)
    
    // Calculate amounts
    const vacationAmount = (dailySalary * vacationDays)
    const vacationBonus = vacationAmount * 0.25 // 25% vacation bonus (Prima Vacacional)
    const vacationPremium = vacationBonus // Same as vacation bonus
    
    // Aguinaldo: Minimum 15 days, but can be more based on company policy
    const aguinaldoDays = 15
    const aguinaldoAmount = dailySalary * aguinaldoDays
    
    // Fondo de Ahorro: 10% equivalent (not deducted from salary)
    const savingsFundAmount = monthlySalary * 0.10
    
    // IMSS and INFONAVIT calculations
    const imssContributions = calculateIMSSContributions(monthlySalary)
    const infonavitAmount = calculateINFONAVIT(monthlySalary)

    // Create or update calculation
    const calculation = await prisma.laborCalculation.upsert({
      where: {
        employeeId_year: {
          employeeId,
          year
        }
      },
      update: {
        aguinaldoDays,
        aguinaldoAmount,
        vacationDays,
        vacationAmount,
        vacationBonus,
        savingsFundAmount,
        vacationPremium,
        imssEmployee: imssContributions.employee,
        imssEmployer: imssContributions.employer,
        infonavit: infonavitAmount,
      },
      create: {
        employeeId,
        year,
        aguinaldoDays,
        aguinaldoAmount,
        vacationDays,
        vacationAmount,
        vacationBonus,
        savingsFundAmount,
        vacationPremium,
        imssEmployee: imssContributions.employee,
        imssEmployer: imssContributions.employer,
        infonavit: infonavitAmount,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            hireDate: true,
            dailySalary: true,
            monthlySalary: true,
            department: {
              select: {
                name: true
              }
            },
            position: {
              select: {
                title: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(calculation, { status: 201 })
  } catch (error) {
    console.error('Error creating/updating labor calculation:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create/update labor calculation' },
      { status: 500 }
    )
  }
}

