import { NextResponse } from 'next/server'
import { PayrollService } from '@/lib/payroll'

export async function GET() {
  try {
    const timeEntries = PayrollService.getAllTimeEntries()
    return NextResponse.json(timeEntries)
  } catch (error) {
    console.error('Error fetching time entries:', error)
    return NextResponse.json({ error: 'Failed to fetch time entries' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const timeEntry = PayrollService.createTimeEntry(body)
    return NextResponse.json(timeEntry, { status: 201 })
  } catch (error) {
    console.error('Error creating time entry:', error)
    return NextResponse.json({ error: 'Failed to create time entry' }, { status: 500 })
  }
}