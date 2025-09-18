import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const positions = await prisma.position.findMany({
      include: {
        department: {
          select: { name: true },
        },
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { title: "asc" },
    })

    return NextResponse.json(positions)
  } catch (error) {
    console.error("Error fetching positions:", error)
    return NextResponse.json({ error: "Failed to fetch positions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, departmentId, baseSalary, isActive } = body

    const position = await prisma.position.create({
      data: {
        title,
        description,
        departmentId,
        baseSalary,
        isActive: isActive ?? true,
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

    return NextResponse.json(position, { status: 201 })
  } catch (error) {
    console.error("Error creating position:", error)
    return NextResponse.json({ error: "Failed to create position" }, { status: 500 })
  }
}
