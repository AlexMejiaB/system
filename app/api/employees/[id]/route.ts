import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    const employee = await prisma.employee.update({
      where: { id: params.id },
      data: {
        ...data,
        birthDate: new Date(data.birthDate),
        hireDate: new Date(data.hireDate),
        plant: {
          connect: { name: data.plant },
        },
        department: {
          connect: { name: data.department },
        },
      },
      include: {
        plant: true,
        department: true,
      },
    })

    return NextResponse.json(employee)
  } catch (error) {
    console.error("Error updating employee:", error)
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.employee.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Employee deleted successfully" })
  } catch (error) {
    console.error("Error deleting employee:", error)
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
  }
}
