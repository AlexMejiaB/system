import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const plants = await prisma.plant.findMany({
      include: {
        _count: {
          select: { employees: true },
        },
      },
      orderBy: { name: "asc" },
    })

    return NextResponse.json(plants)
  } catch (error) {
    console.error("Error fetching plants:", error)
    return NextResponse.json({ error: "Failed to fetch plants" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const plant = await prisma.plant.create({
      data: {
        name: body.name,
      },
    })

    return NextResponse.json(plant)
  } catch (error) {
    console.error("Error creating plant:", error)
    return NextResponse.json({ error: "Failed to create plant" }, { status: 500 })
  }
}
