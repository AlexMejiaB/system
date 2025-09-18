import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const interviewSchema = z.object({
  applicantId: z.number(),
  interviewerName: z.string().min(1),
  interviewerEmail: z.string().email(),
  scheduledDate: z.string(),
  duration: z.number().default(60),
  type: z.enum(['PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'BEHAVIORAL', 'PANEL']),
  location: z.string().optional(),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
})

// GET: Fetch all interviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    const where: any = {}
    if (applicantId) where.applicantId = parseInt(applicantId)
    if (status) where.status = status
    if (type) where.type = type

    const interviews = await prisma.interview.findMany({
      where,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            position: {
              select: {
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        scheduledDate: 'asc'
      }
    })

    return NextResponse.json(interviews)
  } catch (error) {
    console.error('Error fetching interviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}

// POST: Create new interview
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = interviewSchema.parse(body)

    const interview = await prisma.interview.create({
      data: {
        ...validatedData,
        scheduledDate: new Date(validatedData.scheduledDate),
      },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
            position: {
              select: {
                title: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(interview, { status: 201 })
  } catch (error) {
    console.error('Error creating interview:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    )
  }
}

