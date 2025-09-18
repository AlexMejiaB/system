import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.enum(['DOCUMENTATION', 'TRAINING', 'EQUIPMENT', 'SYSTEM_ACCESS', 'ORIENTATION', 'COMPLIANCE']).optional(),
  isRequired: z.boolean().optional(),
  dueDate: z.string().optional(),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'CANCELLED']).optional(),
  assignedTo: z.string().optional(),
})

// GET: Fetch onboarding task by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const task = await prisma.onboardingTask.findUnique({
      where: { id },
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

    if (!task) {
      return NextResponse.json(
        { error: 'Onboarding task not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching onboarding task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding task' },
      { status: 500 }
    )
  }
}

// PUT: Update onboarding task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const validatedData = updateTaskSchema.parse(body)

    const task = await prisma.onboardingTask.update({
      where: { id },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
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

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating onboarding task:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update onboarding task' },
      { status: 500 }
    )
  }
}

// DELETE: Delete onboarding task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.onboardingTask.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Onboarding task deleted successfully' })
  } catch (error) {
    console.error('Error deleting onboarding task:', error)
    return NextResponse.json(
      { error: 'Failed to delete onboarding task' },
      { status: 500 }
    )
  }
}

