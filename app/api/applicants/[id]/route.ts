import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const data = await request.json()

    const applicant = await prisma.applicant.update({
      where: { id },
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

    return NextResponse.json(applicant)
  } catch (error) {
    console.error("Error updating applicant:", error)
    return NextResponse.json({ error: "Failed to update applicant" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)

    await prisma.applicant.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Applicant deleted successfully" })
  } catch (error) {
    console.error("Error deleting applicant:", error)
    return NextResponse.json({ error: "Failed to delete applicant" }, { status: 500 })
  }
}
