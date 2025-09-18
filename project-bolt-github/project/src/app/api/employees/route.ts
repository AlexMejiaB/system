import { NextResponse } from 'next/server'
import { EmployeeService } from '@/modules/employee'
import { employeeSchema } from '@/schemas/employee'

// GET: List all employees
export async function GET() {
  const employees = EmployeeService.getAll()
  return NextResponse.json(employees)
}

// POST: Create a new employee
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const result = employeeSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ error: result.error.format() }, { status: 400 })
    }

    // 🔧 Ensure dates are strings
    const data = {
      ...result.data,
      birthDate: result.data.birthDate instanceof Date
        ? result.data.birthDate.toISOString().split('T')[0]
        : result.data.birthDate,
      hireDate: result.data.hireDate instanceof Date
        ? result.data.hireDate.toISOString().split('T')[0]
        : result.data.hireDate,
    }

    const employee = EmployeeService.create(data)
    return NextResponse.json(employee, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
