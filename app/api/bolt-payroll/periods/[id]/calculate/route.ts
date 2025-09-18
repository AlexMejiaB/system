import { NextResponse } from 'next/server'
import { PayrollService } from '@/lib/payroll'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const periodId = Number(params.id)
    const payrollEntries = PayrollService.calculatePayrollForPeriod(periodId)
    
    // Save the calculated entries
    PayrollService.savePayrollEntries(payrollEntries)
    
    // Update period status
    PayrollService.updatePeriodStatus(periodId, 'PROCESSING')
    
    return NextResponse.json({ 
      message: 'Payroll calculated successfully',
      entries: payrollEntries.length 
    })
  } catch (error) {
    console.error('Error calculating payroll:', error)
    return NextResponse.json({ error: 'Failed to calculate payroll' }, { status: 500 })
  }
}