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
      type: BenefitType.AGUINALDO,
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

    const [benefits, totalStats] = await Promise.all([
      prisma.benefit.findMany({
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
      }),

      prisma.benefit.aggregate({
        where,
        _sum: { amount: true },
        _count: { id: true },
      }),
    ])

    const employees = benefits.map((benefit) => ({
      id: benefit.employee.id,
      name: `${benefit.employee.firstName} ${benefit.employee.lastName}`,
      department: benefit.employee.department.name,
      plant: benefit.employee.plant.name,
      baseSalary: benefit.employee.baseSalary,
      monthsWorked: Math.floor(
        (new Date().getTime() - benefit.employee.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 30),
      ),
      aguinaldoAmount: benefit.amount,
      paymentDate: benefit.effectiveDate.toISOString().split("T")[0],
      collarType: benefit.employee.collarType,
    }))

    const data = {
      year: Number.parseInt(year),
      totalAmount: totalStats._sum.amount || 0,
      employeeCount: totalStats._count || 0,
      employees,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching aguinaldo data:", error)
    return NextResponse.json({ error: "Failed to fetch aguinaldo data" }, { status: 500 })
  }
}
