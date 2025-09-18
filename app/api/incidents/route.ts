import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const incidentSchema = z.object({
  employeeId: z.number(),
  incidentType: z.enum(['LEAVE_WITHOUT_PAY', 'MEDICAL_LEAVE', 'PERSONAL_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'VACATION_REQUEST', 'SICK_LEAVE', 'EMERGENCY_LEAVE']),
  startDate: z.string(),
  endDate: z.string().optional(),
  reason: z.string().min(1),
  description: z.string().optional(),
  isPaid: z.boolean().default(false),
})

// GET: Fetch all incidents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const where: any = {}
    if (employeeId) where.employeeId = parseInt(employeeId)
    if (status) where.status = status
    if (type) where.incidentType = type

    const [incidents, total] = await Promise.all([
      prisma.incident.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              email: true,
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
        orderBy: {
          createdAt: 'desc'
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.incident.count({ where })
    ])

    return NextResponse.json({
      incidents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

// POST: Create new incident
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = incidentSchema.parse(body)

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: validatedData.employeeId }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    const incident = await prisma.incident.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
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

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error('Error creating incident:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}

