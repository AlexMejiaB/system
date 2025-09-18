import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateIncidentSchema = z.object({
  incidentType: z.enum(['LEAVE_WITHOUT_PAY', 'MEDICAL_LEAVE', 'PERSONAL_LEAVE', 'MATERNITY_LEAVE', 'PATERNITY_LEAVE', 'VACATION_REQUEST', 'SICK_LEAVE', 'EMERGENCY_LEAVE']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  reason: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED']).optional(),
  approvedBy: z.string().optional(),
  rejectionReason: z.string().optional(),
  isPaid: z.boolean().optional(),
})

// GET: Fetch incident by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            phone: true,
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
        }
      }
    })

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error fetching incident:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    )
  }
}

// PUT: Update incident (for approval/rejection by HR/Payroll)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const body = await request.json()
    const validatedData = updateIncidentSchema.parse(body)

    const updateData: any = { ...validatedData }
    
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate)
    }
    
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate)
    }

    // Set approval date if status is being approved
    if (validatedData.status === 'APPROVED') {
      updateData.approvalDate = new Date()
    }

    const incident = await prisma.incident.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            employeeId: true,
            email: true,
            phone: true,
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
        }
      }
    })

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error updating incident:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    )
  }
}

// DELETE: Delete incident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)

    await prisma.incident.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Incident deleted successfully' })
  } catch (error) {
    console.error('Error deleting incident:', error)
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    )
  }
}

