import { NextResponse } from 'next/server'
import { EmployeeService } from '@/modules/employee'
import { employeeSchema } from '@/schemas/employee'

// GET: Fetch one employee by ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const employee = EmployeeService.getById(Number(params.id))
  return employee
    ? NextResponse.json(employee)
    : NextResponse.json({ error: 'Employee not found' }, { status: 404 })
}

// PUT: Update an employee by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const updated = EmployeeService.update(Number(params.id), data)
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: Remove an employee by ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    EmployeeService.delete(Number(params.id))
    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
