import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch time-off requests or balances
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'requests' or 'balances'
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const timeOffType = searchParams.get('timeOffType')
    const year = searchParams.get('year')

    if (type === 'balances') {
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)
      if (timeOffType) where.type = timeOffType
      if (year) where.year = parseInt(year)

      const balances = await prisma.timeOffBalance.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } }
            }
          }
        },
        orderBy: [
          { employeeId: 'asc' },
          { type: 'asc' }
        ]
      })

      return NextResponse.json(balances)
    } else {
      // Fetch time-off requests
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)
      if (status) where.status = status
      if (timeOffType) where.type = timeOffType
      if (year) {
        const startDate = new Date(parseInt(year), 0, 1)
        const endDate = new Date(parseInt(year), 11, 31)
        where.startDate = { gte: startDate, lte: endDate }
      }

      const requests = await prisma.timeOffRequest.findMany({
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

      return NextResponse.json(requests)
    }
  } catch (error) {
    console.error('Error fetching time-off data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch time-off data' },
      { status: 500 }
    )
  }
}

// POST: Create time-off request or balance
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'request') {
      // Calculate days between start and end date
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.endDate)
      const timeDiff = endDate.getTime() - startDate.getTime()
      const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1 // Include both start and end dates

      const request = await prisma.timeOffRequest.create({
        data: {
          employeeId: parseInt(data.employeeId),
          type: data.timeOffType,
          startDate,
          endDate,
          days,
          reason: data.reason
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
          }
        }
      })

      // Update pending balance
      await prisma.timeOffBalance.upsert({
        where: {
          employeeId_type_year: {
            employeeId: parseInt(data.employeeId),
            type: data.timeOffType,
            year: startDate.getFullYear()
          }
        },
        update: {
          pending: {
            increment: days
          }
        },
        create: {
          employeeId: parseInt(data.employeeId),
          type: data.timeOffType,
          year: startDate.getFullYear(),
          allocated: getDefaultAllocation(data.timeOffType),
          pending: days
        }
      })

      return NextResponse.json(request, { status: 201 })
    } else if (type === 'balance') {
      const balance = await prisma.timeOffBalance.create({
        data: {
          employeeId: parseInt(data.employeeId),
          type: data.timeOffType,
          year: parseInt(data.year),
          allocated: parseFloat(data.allocated),
          carryOver: data.carryOver ? parseFloat(data.carryOver) : 0
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          }
        }
      })

      return NextResponse.json(balance, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid type specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating time-off data:', error)
    return NextResponse.json(
      { error: 'Failed to create time-off data' },
      { status: 500 }
    )
  }
}

// Helper function to get default allocation based on time-off type
function getDefaultAllocation(type: string): number {
  switch (type) {
    case 'VACATION':
      return 15 // 15 days vacation per year
    case 'SICK_LEAVE':
      return 10 // 10 days sick leave per year
    case 'PERSONAL_LEAVE':
      return 5 // 5 days personal leave per year
    case 'BEREAVEMENT':
      return 3 // 3 days bereavement leave per year
    default:
      return 0
  }
}

