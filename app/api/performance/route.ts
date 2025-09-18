import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch performance reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const reviewerId = searchParams.get('reviewerId')
    const status = searchParams.get('status')
    const year = searchParams.get('year')

    const where: any = {}
    if (employeeId) where.employeeId = parseInt(employeeId)
    if (reviewerId) where.reviewerId = parseInt(reviewerId)
    if (status) where.status = status
    if (year) {
      const startDate = new Date(parseInt(year), 0, 1)
      const endDate = new Date(parseInt(year), 11, 31)
      where.startDate = { gte: startDate, lte: endDate }
    }

    const reviews = await prisma.performanceReview.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            department: { select: { name: true } },
            position: { select: { title: true } }
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            employeeId: true
          }
        },
        goals_relation: true,
        competencies: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching performance reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch performance reviews' },
      { status: 500 }
    )
  }
}

// POST: Create new performance review
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      reviewerId,
      reviewPeriod,
      startDate,
      endDate,
      goals,
      competencies
    } = body

    // Create the performance review
    const review = await prisma.performanceReview.create({
      data: {
        employeeId: parseInt(employeeId),
        reviewerId: parseInt(reviewerId),
        reviewPeriod,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'DRAFT'
      },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            department: { select: { name: true } },
            position: { select: { title: true } }
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            employeeId: true
          }
        }
      }
    })

    // Create goals if provided
    if (goals && goals.length > 0) {
      await prisma.performanceGoal.createMany({
        data: goals.map((goal: any) => ({
          reviewId: review.id,
          title: goal.title,
          description: goal.description,
          targetDate: goal.targetDate ? new Date(goal.targetDate) : null,
          weight: goal.weight || 1.0
        }))
      })
    }

    // Create competencies if provided
    if (competencies && competencies.length > 0) {
      await prisma.performanceCompetency.createMany({
        data: competencies.map((comp: any) => ({
          reviewId: review.id,
          competencyName: comp.name,
          rating: comp.rating || 0,
          comments: comp.comments
        }))
      })
    }

    // Fetch the complete review with goals and competencies
    const completeReview = await prisma.performanceReview.findUnique({
      where: { id: review.id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            department: { select: { name: true } },
            position: { select: { title: true } }
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            employeeId: true
          }
        },
        goals_relation: true,
        competencies: true
      }
    })

    return NextResponse.json(completeReview, { status: 201 })
  } catch (error) {
    console.error('Error creating performance review:', error)
    return NextResponse.json(
      { error: 'Failed to create performance review' },
      { status: 500 }
    )
  }
}

