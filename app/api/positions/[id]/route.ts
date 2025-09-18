import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const position = await prisma.position.findUnique({
      where: { id: Number.parseInt(params.id) },
      include: {
        department: {
          select: { name: true },
        },
        _count: {
          select: { employees: true },
        },
      },
    })

    if (!position) {
      return NextResponse.json({ error: "Position not found" }, { status: 404 })
    }

    return NextResponse.json(position)
  } catch (error) {
    console.error("Error fetching position:", error)
    return NextResponse.json({ error: "Failed to fetch position" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { title, description, departmentId, baseSalary, isActive } = body

    const position = await prisma.position.update({
      where: { id: Number.parseInt(params.id) },
      data: {
        title,
        description,
        departmentId,
        baseSalary,
        isActive,
      },
      include: {
        department: {
          select: { name: true },
        },
        _count: {
          select: { employees: true },
        },
      },
    })

    return NextResponse.json(position)
  } catch (error) {
    console.error("Error updating position:", error)
    return NextResponse.json({ error: "Failed to update position" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if position has employees
    const employeeCount = await prisma.employee.count({
      where: { positionId: Number.parseInt(params.id) },
    })

    if (employeeCount > 0) {
      return NextResponse.json({ error: "Cannot delete position with assigned employees" }, { status: 400 })
    }

    await prisma.position.delete({
      where: { id: Number.parseInt(params.id) },
    })

    return NextResponse.json({ message: "Position deleted successfully" })
  } catch (error) {
    console.error("Error deleting position:", error)
    return NextResponse.json({ error: "Failed to delete position" }, { status: 500 })
  }
}
