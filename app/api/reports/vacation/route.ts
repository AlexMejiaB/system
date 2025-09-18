import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { BenefitType, type CollarType, SalaryFrequency } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const year = searchParams.get("year") || new Date().getFullYear().toString()
    const plant = searchParams.get("plant")
    const department = searchParams.get("department")
    const collar = searchParams.get("collar") as CollarType | null

    const where: any = {
      isActive: true,
    }

    if (plant) {
      where.plant = { name: plant }
    }

    if (department) {
      where.department = { name: department }
    }

    if (collar) {
      where.collarType = collar
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        plant: true,
        department: true,
        benefits: {
          where: {
            type: BenefitType.VACATION,
            effectiveDate: {
              gte: new Date(`${year}-01-01`),
              lte: new Date(`${year}-12-31`),
            },
          },
        },
      },
    })

    const employeeData = employees.map((employee) => {
      const yearsWorked = Math.floor((new Date().getTime() - employee.hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365))
      const vacationDays = Math.min(15, Math.max(10, yearsWorked + 10)) // Base vacation days calculation

      // Calculate daily salary based on frequency
      let dailySalary = 0
      switch (employee.salaryFrequency) {
        case SalaryFrequency.WEEKLY:
          dailySalary = employee.baseSalary / 7
          break
        case SalaryFrequency.BIWEEKLY:
          dailySalary = employee.baseSalary / 14
          break
        case SalaryFrequency.MONTHLY:
          dailySalary = employee.baseSalary / 30
          break
      }

      const vacationBenefits = employee.benefits.filter((b) => b.type === BenefitType.VACATION)
      const usedDays = vacationBenefits.length
      const remainingDays = vacationDays - usedDays
      const vacationAmount = vacationDays * dailySalary

      return {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        department: employee.department.name,
        plant: employee.plant.name,
        dailySalary: Math.round(dailySalary * 100) / 100,
        vacationDays,
        usedDays,
        remainingDays,
        vacationAmount: Math.round(vacationAmount * 100) / 100,
        accrualRate: yearsWorked >= 5 ? 1.25 : 1.0,
        collarType: employee.collarType,
      }
    })

    const data = {
      year: Number.parseInt(year),
      employees: employeeData,
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching vacation data:", error)
    return NextResponse.json({ error: "Failed to fetch vacation data" }, { status: 500 })
  }
}
