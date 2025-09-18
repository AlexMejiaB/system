import { NextResponse } from 'next/server'
import { PayrollService } from '@/modules/payroll'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const periodId = Number(params.id)
    const entries = PayrollService.getPayrollEntriesByPeriod(periodId)
    return NextResponse.json(entries)
  } catch (error) {
    console.error('Error fetching payroll entries:', error)
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 })
  }
}