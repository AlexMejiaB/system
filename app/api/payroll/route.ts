import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CollarType, SalaryFrequency } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const plant = searchParams.get("plant")
    const collar = searchParams.get("collar") as CollarType | null
    const department = searchParams.get("department")
    const salaryType = searchParams.get("salaryType") as SalaryFrequency | null

    const where: any = {
      employee: {
        isActive: true,
      },
    }

    if (plant) {
      where.employee.plant = { name: plant }
    }

    if (collar) {
      where.employee.collarType = collar
    }

    if (department) {
      where.employee.department = { name: department }
    }

    if (salaryType) {
      where.employee.salaryFrequency = salaryType
    }

    // Get payroll statistics
    const [totalEmployees, payrollStats, monthlyStats] = await Promise.all([
      prisma.employee.count({
        where: {
          isActive: true,
          ...(plant && { plant: { name: plant } }),
          ...(collar && { collarType: collar }),
          ...(department && { department: { name: department } }),
          ...(salaryType && { salaryFrequency: salaryType }),
        },
      }),

      prisma.payroll.aggregate({
        where,
        _sum: { grossPay: true, netPay: true },
        _avg: { grossPay: true },
      }),

      prisma.payroll.groupBy({
        by: ["payPeriodStart"],
        where,
        _sum: { grossPay: true },
        orderBy: { payPeriodStart: "desc" },
        take: 6,
      }),
    ])

    const pendingPayments = await prisma.employee.count({
      where: {
        isActive: true,
        payrolls: {
          none: {
            payPeriodStart: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
        },
      },
    })

    const stats = monthlyStats
      .map((stat) => ({
        month: stat.payPeriodStart.toLocaleDateString("en-US", { month: "short" }),
        amount: stat._sum.grossPay || 0,
      }))
      .reverse()

    const data = {
      totalEmployees,
      totalPayroll: payrollStats._sum.grossPay || 0,
      avgSalary: payrollStats._avg.grossPay || 0,
      pendingPayments,
      stats,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching payroll data:", error)
    return NextResponse.json({ error: "Failed to fetch payroll data" }, { status: 500 })
  }
}
