import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const onboardSchema = z.object({
  templateId: z.number().optional(),
  startDate: z.string().optional(),
})

// POST: Start onboarding process for an applicant
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const applicantId = parseInt(params.id)
    const body = await request.json()
    const { templateId, startDate } = onboardSchema.parse(body)

    // Check if applicant exists
    const applicant = await prisma.applicant.findUnique({
      where: { id: applicantId },
      include: {
        position: true
      }
    })

    if (!applicant) {
      return NextResponse.json(
        { error: 'Applicant not found' },
        { status: 404 }
      )
    }

    // Update applicant status to HIRED
    await prisma.applicant.update({
      where: { id: applicantId },
      data: { status: 'HIRED' }
    })

    let tasks = []

    if (templateId) {
      // Use specific template
      const template = await prisma.onboardingTemplate.findUnique({
        where: { id: templateId },
        include: { tasks: true }
      })

      if (template) {
        const baseDate = startDate ? new Date(startDate) : new Date()
        
        tasks = await Promise.all(
          template.tasks.map(async (templateTask) => {
            const dueDate = new Date(baseDate)
            dueDate.setDate(dueDate.getDate() + templateTask.dayOffset)

            return await prisma.onboardingTask.create({
              data: {
                title: templateTask.title,
                description: templateTask.description,
                category: templateTask.category,
                isRequired: templateTask.isRequired,
                dueDate,
                assignedTo: templateTask.assignedTo,
                applicantId,
              }
            })
          })
        )
      }
    } else {
      // Create default onboarding tasks
      const defaultTasks = [
        {
          title: 'Complete Employment Contract',
          description: 'Review and sign employment contract',
          category: 'DOCUMENTATION' as const,
          isRequired: true,
          dayOffset: 0,
        },
        {
          title: 'Submit Required Documents',
          description: 'Provide ID, tax forms, and bank information',
          category: 'DOCUMENTATION' as const,
          isRequired: true,
          dayOffset: 1,
        },
        {
          title: 'Company Orientation',
          description: 'Attend company orientation session',
          category: 'ORIENTATION' as const,
          isRequired: true,
          dayOffset: 1,
        },
        {
          title: 'IT Setup',
          description: 'Set up computer, email, and system access',
          category: 'SYSTEM_ACCESS' as const,
          isRequired: true,
          dayOffset: 2,
        },
        {
          title: 'Safety Training',
          description: 'Complete workplace safety training',
          category: 'TRAINING' as const,
          isRequired: true,
          dayOffset: 3,
        },
      ]

      const baseDate = startDate ? new Date(startDate) : new Date()
      
      tasks = await Promise.all(
        defaultTasks.map(async (task) => {
          const dueDate = new Date(baseDate)
          dueDate.setDate(dueDate.getDate() + task.dayOffset)

          return await prisma.onboardingTask.create({
            data: {
              title: task.title,
              description: task.description,
              category: task.category,
              isRequired: task.isRequired,
              dueDate,
              applicantId,
            }
          })
        })
      )
    }

    return NextResponse.json({
      message: 'Onboarding process started successfully',
      applicant,
      tasks,
    })
  } catch (error) {
    console.error('Error starting onboarding process:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to start onboarding process' },
      { status: 500 }
    )
  }
}

