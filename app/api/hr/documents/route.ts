import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const documentSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['RESUME', 'COVER_LETTER', 'ID_DOCUMENT', 'DIPLOMA', 'CERTIFICATE', 'CONTRACT', 'TAX_FORM', 'BANK_INFO', 'EMERGENCY_CONTACT', 'PHOTO', 'OTHER']),
  filePath: z.string().optional(),
  fileUrl: z.string().optional(),
  isRequired: z.boolean().default(false),
  applicantId: z.number().optional(),
  employeeId: z.number().optional(),
  uploadedBy: z.string().optional(),
})

// GET: Fetch all documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const applicantId = searchParams.get('applicantId')
    const employeeId = searchParams.get('employeeId')
    const type = searchParams.get('type')

    const where: any = {}
    if (applicantId) where.applicantId = parseInt(applicantId)
    if (employeeId) where.employeeId = parseInt(employeeId)
    if (type) where.type = type

    const documents = await prisma.document.findMany({
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

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST: Create new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = documentSchema.parse(body)

    const document = await prisma.document.create({
      data: validatedData,
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

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error('Error creating document:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    )
  }
}

