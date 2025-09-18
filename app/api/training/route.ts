import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch training programs, sessions, or enrollments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'programs', 'sessions', 'enrollments'
    const employeeId = searchParams.get('employeeId')
    const programId = searchParams.get('programId')
    const trainingType = searchParams.get('trainingType')
    const status = searchParams.get('status')

    if (type === 'enrollments') {
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)
      if (programId) where.programId = parseInt(programId)
      if (status) where.status = status

      const enrollments = await prisma.trainingEnrollment.findMany({
        where,
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } }
            }
          },
          program: true,
          session: true
        },
        orderBy: {
          enrollmentDate: 'desc'
        }
      })

      return NextResponse.json(enrollments)
    } else if (type === 'sessions') {
      const where: any = {}
      if (programId) where.programId = parseInt(programId)
      if (status) where.status = status

      const sessions = await prisma.trainingSession.findMany({
        where,
        include: {
          program: true,
          enrollments: {
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  employeeId: true
                }
              }
            }
          }
        },
        orderBy: {
          startDate: 'asc'
        }
      })

      return NextResponse.json(sessions)
    } else {
      // Fetch training programs
      const where: any = { isActive: true }
      if (trainingType) where.type = trainingType

      const programs = await prisma.trainingProgram.findMany({
        where,
        include: {
          sessions: {
            include: {
              enrollments: true
            }
          },
          enrollments: {
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  employeeId: true
                }
              }
            }
          }
        },
        orderBy: {
          title: 'asc'
        }
      })

      return NextResponse.json(programs)
    }
  } catch (error) {
    console.error('Error fetching training data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch training data' },
      { status: 500 }
    )
  }
}

// POST: Create training program, session, or enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'program') {
      const program = await prisma.trainingProgram.create({
        data: {
          title: data.title,
          description: data.description,
          type: data.trainingType,
          duration: data.duration ? parseInt(data.duration) : null,
          provider: data.provider,
          cost: data.cost ? parseFloat(data.cost) : null,
          maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null,
          requirements: data.requirements
        }
      })

      return NextResponse.json(program, { status: 201 })
    } else if (type === 'session') {
      const session = await prisma.trainingSession.create({
        data: {
          programId: parseInt(data.programId),
          title: data.title,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          location: data.location,
          instructor: data.instructor,
          maxParticipants: data.maxParticipants ? parseInt(data.maxParticipants) : null
        },
        include: {
          program: true
        }
      })

      return NextResponse.json(session, { status: 201 })
    } else if (type === 'enrollment') {
      const enrollment = await prisma.trainingEnrollment.create({
        data: {
          employeeId: parseInt(data.employeeId),
          programId: parseInt(data.programId),
          sessionId: data.sessionId ? parseInt(data.sessionId) : null,
          enrollmentDate: new Date(data.enrollmentDate || new Date())
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          },
          program: true,
          session: true
        }
      })

      return NextResponse.json(enrollment, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid type specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating training data:', error)
    return NextResponse.json(
      { error: 'Failed to create training data' },
      { status: 500 }
    )
  }
}

