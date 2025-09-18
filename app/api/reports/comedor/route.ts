import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BenefitType, type CollarType } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get("month") || new Date().getMonth().toString()
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const plant = searchParams.get("plant")
    const department = searchParams.get("department")
    const collar = searchParams.get("collar") as CollarType | null

    const startDate = new Date(Number.parseInt(year), Number.parseInt(month), 1)
    const endDate = new Date(Number.parseInt(year), Number.parseInt(month) + 1, 0)

    const where: any = {
      employee: {
        isActive: true,
      },
      type: BenefitType.COMEDOR,
      effectiveDate: {
        gte: startDate,
        lte: endDate,
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
      }),
    ])

    // Group benefits by employee to calculate monthly totals
    const employeeMap = new Map()
    benefits.forEach((benefit) => {
      const empId = benefit.employee.id
      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          employee: benefit.employee,
          comedorDays: 0,
          totalAmount: 0,
        })
      }
      const empData = employeeMap.get(empId)
      empData.comedorDays += 1 // Each benefit record represents one day
      empData.totalAmount += benefit.amount
    })

    const employees = Array.from(employeeMap.values()).map(({ employee, comedorDays, totalAmount }) => {
      const daysInMonth = endDate.getDate()
      const workingDays = Math.floor((daysInMonth * 22) / 30) // Approximate working days

      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department.name,
        plant: employee.plant.name,
        daysWorked: workingDays,
        comedorDays,
        totalAmount: Math.round(totalAmount * 100) / 100,
        dailyRate: 20.0,
        collarType: employee.collarType,
      }
    })

    const data = {
      month: Number.parseInt(month),
      year: Number.parseInt(year),
      dailyRate: 20.0,
      totalAmount: totalStats._sum.amount || 0,
      employees,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching comedor data:", error)
    return NextResponse.json({ error: "Failed to fetch comedor data" }, { status: 500 })
  }
}
