import { NextResponse } from 'next/server'
import { PayrollService } from '@/lib/payroll'

export async function GET() {
  try {
    const deductions = PayrollService.getAllDeductions()
    return NextResponse.json(deductions)
  } catch (error) {
    console.error('Error fetching deductions:', error)
    return NextResponse.json({ error: 'Failed to fetch deductions' }, { status: 500 })
  }
}