import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const employeeProfileSchema = z.object({
  employeeId: z.number(),
  roleId: z.number().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  middleName: z.string().optional(),
  birthDate: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  maritalStatus: z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED']).optional(),
  nationality: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().default('México'),
  personalEmail: z.string().email().optional(),
  homePhone: z.string().optional(),
  mobilePhone: z.string().optional(),
  contractType: z.enum(['PERMANENT', 'TEMPORARY', 'CONTRACTOR', 'INTERN', 'PART_TIME']).optional(),
  workSchedule: z.string().optional(),
  supervisor: z.string().optional(),
})

// GET: Fetch all employee profiles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    const where: any = {}
    if (employeeId) where.employeeId = parseInt(employeeId)

    const profiles = await prisma.employeeProfile.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            phone: true,
            hireDate: true,
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
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true
          }
        }
      },
      orderBy: {
        employee: {
          name: 'asc'
        }
      }
    })

    return NextResponse.json(profiles)
  } catch (error) {
    console.error('Error fetching employee profiles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch employee profiles' },
      { status: 500 }
    )
  }
}

// POST: Create new employee profile
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = employeeProfileSchema.parse(body)

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

    // Check if profile already exists
    const existingProfile = await prisma.employeeProfile.findUnique({
      where: { employeeId: validatedData.employeeId }
    })

    if (existingProfile) {
      return NextResponse.json(
        { error: 'Employee profile already exists' },
        { status: 409 }
      )
    }

    const profileData: any = { ...validatedData }
    if (validatedData.birthDate) {
      profileData.birthDate = new Date(validatedData.birthDate)
    }

    const profile = await prisma.employeeProfile.create({
      data: profileData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            phone: true,
            hireDate: true,
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
        },
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            permissions: true
          }
        }
      }
    })

    return NextResponse.json(profile, { status: 201 })
  } catch (error) {
    console.error('Error creating employee profile:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create employee profile' },
      { status: 500 }
    )
  }
}

