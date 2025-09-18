import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import type { CollarType, SalaryFrequency } from "@/lib/types"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const plant = searchParams.get("plant")
    const collar = searchParams.get("collar") as CollarType | null
    const department = searchParams.get("department")
    const search = searchParams.get("search")
    const salaryType = searchParams.get("salaryType") as SalaryFrequency | null

    const where: any = {
      isActive: true,
    }

    if (plant) {
      where.plant = { name: plant }
    }

    if (collar) {
      where.collarType = collar
    }

    if (department) {
      where.department = { name: department }
    }

    if (salaryType) {
      where.salaryFrequency = salaryType
    }

    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
        { position: { contains: search, mode: "insensitive" } },
      ]
    }

    const employees = await prisma.employee.findMany({
      where,
      include: {
        plant: true,
        department: true,
        payrolls: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        benefits: true,
      },
      orderBy: { hireDate: "desc" },
    })

    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const employee = await prisma.employee.create({
      data: {
        employeeId: body.employeeId,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        hireDate: new Date(body.hireDate),
        position: body.position,
        baseSalary: body.baseSalary,
        salaryFrequency: body.salaryFrequency,
        collarType: body.collarType,
        plantId: body.plantId,
        departmentId: body.departmentId,
        isActive: true,
      },
      include: {
        plant: true,
        department: true,
      },
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error creating employee:", error)
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
  }
}
