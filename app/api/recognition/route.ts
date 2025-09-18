import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch employee recognitions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const nominatedBy = searchParams.get('nominatedBy')
    const type = searchParams.get('type')
    const isPublic = searchParams.get('isPublic')

    const where: any = {}
    if (employeeId) where.employeeId = parseInt(employeeId)
    if (nominatedBy) where.nominatedBy = parseInt(nominatedBy)
    if (type) where.type = type
    if (isPublic !== null) where.isPublic = isPublic === 'true'

    const recognitions = await prisma.recognition.findMany({
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
        nominator: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            department: { select: { name: true } }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(recognitions)
  } catch (error) {
    console.error('Error fetching recognitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recognitions' },
      { status: 500 }
    )
  }
}

// POST: Create new recognition
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      employeeId,
      nominatedBy,
      type,
      title,
      description,
      points,
      isPublic
    } = body

    const recognition = await prisma.recognition.create({
      data: {
        employeeId: parseInt(employeeId),
        nominatedBy: parseInt(nominatedBy),
        type,
        title,
        description,
        points: points ? parseInt(points) : null,
        isPublic: isPublic !== false // Default to true
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
        nominator: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            department: { select: { name: true } }
          }
        }
      }
    })

    return NextResponse.json(recognition, { status: 201 })
  } catch (error) {
    console.error('Error creating recognition:', error)
    return NextResponse.json(
      { error: 'Failed to create recognition' },
      { status: 500 }
    )
  }
}

