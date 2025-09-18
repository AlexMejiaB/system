import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bulkCalculationSchema = z.object({
  year: z.number(),
  employeeIds: z.array(z.number()).optional(), // If not provided, calculate for all active employees
})

// Mexican Labor Law Calculation Functions (same as in main route)
function calculateVacationDays(yearsOfService: number): number {
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
  return 22 + Math.floor((yearsOfService - 25) / 5) * 2
}

function calculateIMSSContributions(salary: number) {
  const employeeRate = 0.025
  const employerRate = 0.105
  
  return {
    employee: salary * employeeRate,
    employer: salary * employerRate
  }
}

function calculateINFONAVIT(salary: number) {
  return salary * 0.05
}

// POST: Bulk calculate labor calculations for multiple employees
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { year, employeeIds } = bulkCalculationSchema.parse(body)

    // Get employees to calculate for
    const where: any = { isActive: true }
    if (employeeIds && employeeIds.length > 0) {
      where.id = { in: employeeIds }
    }

    const employees = await prisma.employee.findMany({
      where,
      select: {
        id: true,
        name: true,
        employeeId: true,
        hireDate: true,
        dailySalary: true,
        monthlySalary: true,
      }
    })

    const calculations = []
    const errors = []

    for (const employee of employees) {
      try {
        // Calculate years of service
        const hireDate = new Date(employee.hireDate)
        const currentDate = new Date(year, 11, 31)
        const yearsOfService = Math.floor((currentDate.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

        // Skip if employee was hired after the calculation year
        if (yearsOfService < 0) {
          continue
        }

        const monthlySalary = employee.monthlySalary || (employee.dailySalary * 30)
        const dailySalary = employee.dailySalary

        const vacationDays = calculateVacationDays(yearsOfService)
        const vacationAmount = (dailySalary * vacationDays)
        const vacationBonus = vacationAmount * 0.25
        const vacationPremium = vacationBonus
        
        const aguinaldoDays = 15
        const aguinaldoAmount = dailySalary * aguinaldoDays
        
        const savingsFundAmount = monthlySalary * 0.10
        
        const imssContributions = calculateIMSSContributions(monthlySalary)
        const infonavitAmount = calculateINFONAVIT(monthlySalary)

        // Create or update calculation
        const calculation = await prisma.laborCalculation.upsert({
          where: {
            employeeId_year: {
              employeeId: employee.id,
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
            employeeId: employee.id,
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
          }
        })

        calculations.push({
          employeeId: employee.id,
          employeeName: employee.name,
          calculation
        })
      } catch (error) {
        errors.push({
          employeeId: employee.id,
          employeeName: employee.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }

    return NextResponse.json({
      success: true,
      processed: calculations.length,
      errors: errors.length,
      calculations,
      errors
    })
  } catch (error) {
    console.error('Error in bulk labor calculations:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to perform bulk calculations' },
      { status: 500 }
    )
  }
}

