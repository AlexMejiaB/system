import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const templateTaskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(['DOCUMENTATION', 'TRAINING', 'EQUIPMENT', 'SYSTEM_ACCESS', 'ORIENTATION', 'COMPLIANCE']),
  isRequired: z.boolean().default(true),
  dayOffset: z.number().default(0),
  assignedTo: z.string().optional(),
})

const templateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  positionId: z.number().optional(),
  isActive: z.boolean().default(true),
  tasks: z.array(templateTaskSchema).optional(),
})

// GET: Fetch all onboarding templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const positionId = searchParams.get('positionId')
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (positionId) where.positionId = parseInt(positionId)
    if (isActive !== null) where.isActive = isActive === 'true'

    const templates = await prisma.onboardingTemplate.findMany({
      where,
      include: {
        position: {
          select: {
            id: true,
            title: true,
          }
        },
        tasks: {
          orderBy: {
            dayOffset: 'asc'
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching onboarding templates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch onboarding templates' },
      { status: 500 }
    )
  }
}

// POST: Create new onboarding template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = templateSchema.parse(body)

    const template = await prisma.onboardingTemplate.create({
      data: {
        name: validatedData.name,
        description: validatedData.description,
        positionId: validatedData.positionId,
        isActive: validatedData.isActive,
        tasks: validatedData.tasks ? {
          create: validatedData.tasks
        } : undefined,
      },
      include: {
        position: {
          select: {
            id: true,
            title: true,
          }
        },
        tasks: {
          orderBy: {
            dayOffset: 'asc'
          }
        }
      }
    })

    return NextResponse.json(template, { status: 201 })
  } catch (error) {
    console.error('Error creating onboarding template:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create onboarding template' },
      { status: 500 }
    )
  }
}

