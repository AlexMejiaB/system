import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardingTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['DOCUMENTATION', 'TRAINING', 'EQUIPMENT', 'SYSTEM_ACCESS', 'ORIENTATION', 'COMPLIANCE']),
  isRequired: z.boolean().default(true),
  dueDate: z.string().optional(),
  assignedTo: z.string().optional(),
  applicantId: z.number().optional(),
  employeeId: z.number().optional(),
})

// GET: Fetch all onboarding tasks
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')
    const employeeId = searchParams.get('employeeId')
    const status = searchParams.get('status')

    const where: any = {}
    if (applicantId) where.applicantId = parseInt(applicantId)
    if (employeeId) where.employeeId = parseInt(employeeId)
    if (status) where.status = status

    const tasks = await prisma.onboardingTask.findMany({
      where,
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching onboarding tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding tasks' },
      { status: 500 }
    )
  }
}

// POST: Create new onboarding task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = onboardingTaskSchema.parse(body)

    const task = await prisma.onboardingTask.create({
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
      include: {
        applicant: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        employee: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating onboarding task:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create onboarding task' },
      { status: 500 }
    )
  }
}

