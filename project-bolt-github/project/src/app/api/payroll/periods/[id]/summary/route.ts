import { NextResponse } from 'next/server'
import { PayrollService } from '@/modules/payroll'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const periodId = Number(params.id)
    const summary = PayrollService.getPayrollSummary(periodId)
    return NextResponse.json(summary)
  } catch (error) {
    console.error('Error fetching payroll summary:', error)
    return NextResponse.json({ error: 'Failed to fetch summary' }, { status: 500 })
  }
}