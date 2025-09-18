import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BenefitType, type CollarType } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const plant = searchParams.get("plant")
    const department = searchParams.get("department")
    const collar = searchParams.get("collar") as CollarType | null

    const where: any = {
      employee: {
        isActive: true,
      },
      type: BenefitType.SAVING_BOX,
      effectiveDate: {
        gte: new Date(`${year}-01-01`),
        lte: new Date(`${year}-12-31`),
      },
    }

    if (plant) {
      where.employee.plant = { name: plant }
    }

    if (department) {
      where.employee.department = { name: department }
    }

    if (collar) {
      where.employee.collarType = collar
    }

    const benefits = await prisma.benefit.findMany({
      where,
      include: {
        employee: {
          include: {
            plant: true,
            department: true,
          },
        },
      },
      orderBy: { effectiveDate: "desc" },
    })

    const employees = benefits.map((benefit) => ({
      id: benefit.employee.id,
      name: `${benefit.employee.firstName} ${benefit.employee.lastName}`,
      department: benefit.employee.department.name,
      plant: benefit.employee.plant.name,
      monthlyContribution: benefit.amount,
      totalSaved: benefit.amount * 12, // Simplified calculation
      withdrawals: 0, // Would need additional tracking
      currentBalance: benefit.amount * 12,
      collarType: benefit.employee.collarType,
    }))

    return NextResponse.json({ year: Number.parseInt(year), employees })
  } catch (error) {
    console.error("Error fetching saving box data:", error)
    return NextResponse.json({ error: "Failed to fetch saving box data" }, { status: 500 })
  }
}
