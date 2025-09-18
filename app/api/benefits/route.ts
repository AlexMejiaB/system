import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch benefit plans or enrollments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'plans' or 'enrollments'
    const employeeId = searchParams.get('employeeId')
    const benefitType = searchParams.get('benefitType')

    if (type === 'enrollments') {
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)
      if (benefitType) where.benefitPlan = { type: benefitType }

      const enrollments = await prisma.benefitEnrollment.findMany({
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
          benefitPlan: true
        },
        orderBy: {
          enrollmentDate: 'desc'
        }
      })

      return NextResponse.json(enrollments)
    } else {
      // Fetch benefit plans
      const where: any = { isActive: true }
      if (benefitType) where.type = benefitType

      const plans = await prisma.benefitPlan.findMany({
        where,
        include: {
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
          name: 'asc'
        }
      })

      return NextResponse.json(plans)
    }
  } catch (error) {
    console.error('Error fetching benefits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch benefits' },
      { status: 500 }
    )
  }
}

// POST: Create benefit plan or enrollment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'plan') {
      const plan = await prisma.benefitPlan.create({
        data: {
          name: data.name,
          description: data.description,
          type: data.benefitType,
          provider: data.provider,
          cost: data.cost ? parseFloat(data.cost) : null,
          employeeCost: data.employeeCost ? parseFloat(data.employeeCost) : null,
          eligibilityRules: data.eligibilityRules ? JSON.stringify(data.eligibilityRules) : null
        }
      })

      return NextResponse.json(plan, { status: 201 })
    } else if (type === 'enrollment') {
      const enrollment = await prisma.benefitEnrollment.create({
        data: {
          employeeId: parseInt(data.employeeId),
          benefitPlanId: parseInt(data.benefitPlanId),
          enrollmentDate: new Date(data.enrollmentDate),
          effectiveDate: new Date(data.effectiveDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
          dependents: data.dependents ? JSON.stringify(data.dependents) : null
        },
        include: {
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true
            }
          },
          benefitPlan: true
        }
      })

      return NextResponse.json(enrollment, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid type specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating benefit:', error)
    return NextResponse.json(
      { error: 'Failed to create benefit' },
      { status: 500 }
    )
  }
}

