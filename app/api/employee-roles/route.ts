import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const employeeRoleSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  permissions: z.string(), // JSON string of permissions
  isActive: z.boolean().default(true),
})

// GET: Fetch all employee roles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const isActive = searchParams.get('isActive')

    const where: any = {}
    if (isActive !== null) where.isActive = isActive === 'true'

    const roles = await prisma.employeeRole.findMany({
      where,
      include: {
        profiles: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                employeeId: true,
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(roles)
  } catch (error) {
    console.error('Error fetching employee roles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee roles' },
      { status: 500 }
    )
  }
}

// POST: Create new employee role
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = employeeRoleSchema.parse(body)

    // Validate permissions JSON
    try {
      JSON.parse(validatedData.permissions)
    } catch {
      return NextResponse.json(
        { error: 'Invalid permissions JSON format' },
        { status: 400 }
      )
    }

    const role = await prisma.employeeRole.create({
      data: validatedData,
      include: {
        profiles: {
          include: {
            employee: {
              select: {
                id: true,
                name: true,
                employeeId: true,
              }
            }
          }
        }
      }
    })

    return NextResponse.json(role, { status: 201 })
  } catch (error) {
    console.error('Error creating employee role:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create employee role' },
      { status: 500 }
    )
  }
}

