import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch salary history or bonuses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'salary' or 'bonuses'
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const year = searchParams.get('year')

    if (type === 'bonuses') {
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)
      if (status) where.status = status
      if (year) {
        const startDate = new Date(parseInt(year), 0, 1)
        const endDate = new Date(parseInt(year), 11, 31)
        where.createdAt = { gte: startDate, lte: endDate }
      }

      const bonuses = await prisma.bonus.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } },
              position: { select: { title: true } }
            }
          },
          approver: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return NextResponse.json(bonuses)
    } else {
      // Fetch salary history
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)
      if (year) {
        const startDate = new Date(parseInt(year), 0, 1)
        const endDate = new Date(parseInt(year), 11, 31)
        where.effectiveDate = { gte: startDate, lte: endDate }
      }

      const salaryHistory = await prisma.salaryHistory.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } },
              position: { select: { title: true } }
            }
          },
          approver: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          }
        },
        orderBy: {
          effectiveDate: 'desc'
        }
      })

      return NextResponse.json(salaryHistory)
    }
  } catch (error) {
    console.error('Error fetching compensation data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch compensation data' },
      { status: 500 }
    )
  }
}

// POST: Create salary change or bonus
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'salary') {
      // Get current salary
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(data.employeeId) },
        select: { monthlySalary: true, dailySalary: true }
      })

      if (!employee) {
        return NextResponse.json(
          { error: 'Employee not found' },
          { status: 404 }
        )
      }

      const previousSalary = employee.monthlySalary || employee.dailySalary * 30
      const newSalary = parseFloat(data.newSalary)

      // Create salary history record
      const salaryChange = await prisma.salaryHistory.create({
        data: {
          employeeId: parseInt(data.employeeId),
          previousSalary,
          newSalary,
          changeType: data.changeType,
          reason: data.reason,
          effectiveDate: new Date(data.effectiveDate),
          approvedBy: data.approvedBy ? parseInt(data.approvedBy) : null
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } },
              position: { select: { title: true } }
            }
          },
          approver: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          }
        }
      })

      // Update employee's current salary
      await prisma.employee.update({
        where: { id: parseInt(data.employeeId) },
        data: {
          monthlySalary: newSalary,
          dailySalary: newSalary / 30
        }
      })

      return NextResponse.json(salaryChange, { status: 201 })
    } else if (type === 'bonus') {
      const bonus = await prisma.bonus.create({
        data: {
          employeeId: parseInt(data.employeeId),
          type: data.bonusType,
          amount: parseFloat(data.amount),
          reason: data.reason,
          payPeriod: data.payPeriod,
          approvedBy: data.approvedBy ? parseInt(data.approvedBy) : null
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } },
              position: { select: { title: true } }
            }
          },
          approver: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          }
        }
      })

      return NextResponse.json(bonus, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid type specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating compensation data:', error)
    return NextResponse.json(
      { error: 'Failed to create compensation data' },
      { status: 500 }
    )
  }
}

