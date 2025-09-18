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
      type: BenefitType.SAVING_FUNDS,
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
      }),
    ])

    // Group benefits by employee to calculate totals
    const employeeMap = new Map()
    benefits.forEach((benefit) => {
      const empId = benefit.employee.id
      if (!employeeMap.has(empId)) {
        employeeMap.set(empId, {
          employee: benefit.employee,
          contributions: [],
        })
      }
      employeeMap.get(empId).contributions.push(benefit)
    })

    const employees = Array.from(employeeMap.values()).map(({ employee, contributions }) => {
      const totalContribution = contributions.reduce((sum, c) => sum + c.amount, 0)
      const employeeContribution = totalContribution / 2 // Assuming 50/50 split
      const companyContribution = totalContribution / 2
      const monthsContributing = contributions.length
      const balance = totalContribution * monthsContributing // Simplified balance calculation

      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department.name,
        plant: employee.plant.name,
        employeeContribution: Math.round(employeeContribution * 100) / 100,
        companyContribution: Math.round(companyContribution * 100) / 100,
        totalContribution: Math.round(totalContribution * 100) / 100,
        balance: Math.round(balance * 100) / 100,
        collarType: employee.collarType,
      }
    })

    const data = {
      year: Number.parseInt(year),
      totalContributions: totalStats._sum.amount || 0,
      employees,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching saving funds data:", error)
    return NextResponse.json({ error: "Failed to fetch saving funds data" }, { status: 500 })
  }
}
