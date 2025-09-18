import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reportGenerationSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['PAYROLL', 'ATTENDANCE', 'LABOR_CALCULATIONS', 'INCIDENTS', 'COMPREHENSIVE']),
  period: z.enum(['WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'ANNUAL']),
  startWeek: z.number().min(1).max(52),
  endWeek: z.number().min(1).max(52),
  year: z.number(),
  generatedBy: z.string(),
})

// Helper function to get date range from week numbers
function getDateRangeFromWeeks(year: number, startWeek: number, endWeek: number) {
  const startDate = new Date(year, 0, 1 + (startWeek - 1) * 7)
  const endDate = new Date(year, 0, 1 + endWeek * 7 - 1)
  
  // Adjust to Monday as start of week
  const dayOfWeek = startDate.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  startDate.setDate(startDate.getDate() + mondayOffset)
  
  return { startDate, endDate }
}

// Helper function to generate CSV content
function generateCSV(headers: string[], rows: any[][]): string {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => 
      typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
    ).join(','))
  ].join('\n')
  
  return csvContent
}

// POST: Generate report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = reportGenerationSchema.parse(body)

    const { startDate, endDate } = getDateRangeFromWeeks(
      validatedData.year, 
      validatedData.startWeek, 
      validatedData.endWeek
    )

    let reportData: any = {}
    let csvContent = ''

    switch (validatedData.type) {
      case 'PAYROLL':
        // Generate payroll report
        const payrollData = await prisma.payrollEntry.findMany({
          where: {
            payrollPeriod: {
              startDate: { gte: startDate },
              endDate: { lte: endDate }
            }
          },
          include: {
            employee: {
              select: {
                name: true,
                employeeId: true,
                department: { select: { name: true } },
                position: { select: { title: true } }
              }
            },
            payrollPeriod: true
          }
        })

        const payrollHeaders = [
          'Employee ID', 'Employee Name', 'Department', 'Position',
          'Period Start', 'Period End', 'Regular Hours', 'Overtime Hours',
          'Regular Pay', 'Overtime Pay', 'Gross Pay', 'Deductions', 'Net Pay'
        ]

        const payrollRows = payrollData.map(entry => [
          entry.employee.employeeId,
          entry.employee.name,
          entry.employee.department?.name || '',
          entry.employee.position?.title || '',
          entry.payrollPeriod.startDate.toISOString().split('T')[0],
          entry.payrollPeriod.endDate.toISOString().split('T')[0],
          entry.regularHours,
          entry.overtimeHours,
          entry.regularPay,
          entry.overtimePay,
          entry.grossPay,
          entry.deductions,
          entry.netPay
        ])

        csvContent = generateCSV(payrollHeaders, payrollRows)
        reportData = { payrollData }
        break

      case 'LABOR_CALCULATIONS':
        // Generate labor calculations report
        const laborData = await prisma.laborCalculation.findMany({
          where: {
            year: validatedData.year
          },
          include: {
            employee: {
              select: {
                name: true,
                employeeId: true,
                hireDate: true,
                dailySalary: true,
                monthlySalary: true,
                department: { select: { name: true } },
                position: { select: { title: true } }
              }
            }
          }
        })

        const laborHeaders = [
          'Employee ID', 'Employee Name', 'Department', 'Position', 'Hire Date',
          'Daily Salary', 'Monthly Salary', 'Aguinaldo Days', 'Aguinaldo Amount',
          'Vacation Days', 'Vacation Amount', 'Vacation Bonus', 'Savings Fund',
          'IMSS Employee', 'IMSS Employer', 'INFONAVIT'
        ]

        const laborRows = laborData.map(calc => [
          calc.employee.employeeId,
          calc.employee.name,
          calc.employee.department?.name || '',
          calc.employee.position?.title || '',
          calc.employee.hireDate.toISOString().split('T')[0],
          calc.employee.dailySalary,
          calc.employee.monthlySalary || '',
          calc.aguinaldoDays,
          calc.aguinaldoAmount,
          calc.vacationDays,
          calc.vacationAmount,
          calc.vacationBonus,
          calc.savingsFundAmount,
          calc.imssEmployee,
          calc.imssEmployer,
          calc.infonavit
        ])

        csvContent = generateCSV(laborHeaders, laborRows)
        reportData = { laborData }
        break

      case 'INCIDENTS':
        // Generate incidents report
        const incidentData = await prisma.incident.findMany({
          where: {
            startDate: { gte: startDate },
            endDate: { lte: endDate }
          },
          include: {
            employee: {
              select: {
                name: true,
                employeeId: true,
                department: { select: { name: true } },
                position: { select: { title: true } }
              }
            }
          }
        })

        const incidentHeaders = [
          'Employee ID', 'Employee Name', 'Department', 'Position',
          'Incident Type', 'Start Date', 'End Date', 'Reason', 'Status',
          'Is Paid', 'Approved By', 'Approval Date'
        ]

        const incidentRows = incidentData.map(incident => [
          incident.employee.employeeId,
          incident.employee.name,
          incident.employee.department?.name || '',
          incident.employee.position?.title || '',
          incident.incidentType,
          incident.startDate.toISOString().split('T')[0],
          incident.endDate?.toISOString().split('T')[0] || '',
          incident.reason,
          incident.status,
          incident.isPaid ? 'Yes' : 'No',
          incident.approvedBy || '',
          incident.approvalDate?.toISOString().split('T')[0] || ''
        ])

        csvContent = generateCSV(incidentHeaders, incidentRows)
        reportData = { incidentData }
        break

      case 'ATTENDANCE':
        // Generate attendance report
        const attendanceData = await prisma.timeEntry.findMany({
          where: {
            date: { gte: startDate, lte: endDate }
          },
          include: {
            employee: {
              select: {
                name: true,
                employeeId: true,
                department: { select: { name: true } },
                position: { select: { title: true } }
              }
            }
          }
        })

        const attendanceHeaders = [
          'Employee ID', 'Employee Name', 'Department', 'Position',
          'Date', 'Clock In', 'Clock Out', 'Hours Worked', 'Overtime', 'Notes'
        ]

        const attendanceRows = attendanceData.map(entry => [
          entry.employee.employeeId,
          entry.employee.name,
          entry.employee.department?.name || '',
          entry.employee.position?.title || '',
          entry.date.toISOString().split('T')[0],
          entry.clockIn?.toISOString() || '',
          entry.clockOut?.toISOString() || '',
          entry.hoursWorked || 0,
          entry.overtime || 0,
          entry.notes || ''
        ])

        csvContent = generateCSV(attendanceHeaders, attendanceRows)
        reportData = { attendanceData }
        break

      case 'COMPREHENSIVE':
        // Generate comprehensive report with all data
        const [payroll, labor, incidents, attendance] = await Promise.all([
          prisma.payrollEntry.findMany({
            where: {
              payrollPeriod: {
                startDate: { gte: startDate },
                endDate: { lte: endDate }
              }
            },
            include: { employee: true, payrollPeriod: true }
          }),
          prisma.laborCalculation.findMany({
            where: { year: validatedData.year },
            include: { employee: true }
          }),
          prisma.incident.findMany({
            where: {
              startDate: { gte: startDate },
              endDate: { lte: endDate }
            },
            include: { employee: true }
          }),
          prisma.timeEntry.findMany({
            where: {
              date: { gte: startDate, lte: endDate }
            },
            include: { employee: true }
          })
        ])

        reportData = { payroll, labor, incidents, attendance }
        csvContent = `Comprehensive Report for ${validatedData.name}\n` +
                    `Period: Week ${validatedData.startWeek} to ${validatedData.endWeek}, ${validatedData.year}\n` +
                    `Generated: ${new Date().toISOString()}\n\n` +
                    `Payroll Entries: ${payroll.length}\n` +
                    `Labor Calculations: ${labor.length}\n` +
                    `Incidents: ${incidents.length}\n` +
                    `Attendance Records: ${attendance.length}`
        break
    }

    // Save report record
    const report = await prisma.report.create({
      data: {
        name: validatedData.name,
        type: validatedData.type,
        period: validatedData.period,
        startWeek: validatedData.startWeek,
        endWeek: validatedData.endWeek,
        year: validatedData.year,
        generatedBy: validatedData.generatedBy,
      }
    })

    return NextResponse.json({
      report,
      data: reportData,
      csvContent,
      summary: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        recordCount: Object.values(reportData).flat().length
      }
    })
  } catch (error) {
    console.error('Error generating report:', error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

