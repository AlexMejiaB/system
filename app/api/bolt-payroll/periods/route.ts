import { NextResponse } from 'next/server'
import { PayrollService } from '@/lib/payroll'

export async function GET() {
  try {
    const periods = PayrollService.getAllPeriods()
    return NextResponse.json(periods)
  } catch (error) {
    console.error('Error fetching payroll periods:', error)
    return NextResponse.json({ error: 'Failed to fetch periods' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const period = PayrollService.createPeriod(body)
    return NextResponse.json(period, { status: 201 })
  } catch (error) {
    console.error('Error creating payroll period:', error)
    return NextResponse.json({ error: 'Failed to create period' }, { status: 500 })
  }
}