import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const applicants = await prisma.applicant.findMany({
      include: {
        position: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        applicationDate: "desc",
      },
    })

    return NextResponse.json(applicants)
  } catch (error) {
    console.error("Error fetching applicants:", error)
    return NextResponse.json({ error: "Failed to fetch applicants" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const applicant = await prisma.applicant.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        positionId: data.positionId,
        status: data.status,
        experience: data.experience,
        education: data.education,
        applicationDate: new Date(data.applicationDate),
        resume: data.resume,
        notes: data.notes,
      },
      include: {
        position: {
          select: {
            title: true,
          },
        },
      },
    })

    return NextResponse.json(applicant, { status: 201 })
  } catch (error) {
    console.error("Error creating applicant:", error)
    return NextResponse.json({ error: "Failed to create applicant" }, { status: 500 })
  }
}
