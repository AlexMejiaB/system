"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Calendar, DollarSign, Clock } from "lucide-react"

interface VacationData {
  year: number
  employees: Array<{
    id: number
    name: string
    department: string
    plant: string
    dailySalary: number
    vacationDays: number
    usedDays: number
    remainingDays: number
    vacationAmount: number
    accrualRate: number
  }>
}

export function VacationReport() {
  const [data, setData] = useState<VacationData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/vacation")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching vacation data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>
  }

  if (!data) {
    return <div className="text-center p-8">No data available</div>
  }

  const totalVacationDays = data.employees.reduce((sum, emp) => sum + emp.vacationDays, 0)
  const totalUsedDays = data.employees.reduce((sum, emp) => sum + emp.usedDays, 0)
  const totalAmount = data.employees.reduce((sum, emp) => sum + emp.vacationAmount, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVacationDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Used Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsedDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVacationDays - totalUsedDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Employee Vacation Details</CardTitle>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Employee</th>
                  <th className="text-left p-3">Department</th>
                  <th className="text-left p-3">Plant</th>
                  <th className="text-right p-3">Daily Salary</th>
                  <th className="text-right p-3">Total Days</th>
                  <th className="text-right p-3">Used</th>
                  <th className="text-right p-3">Remaining</th>
                  <th className="text-right p-3">Value ($)</th>
                </tr>
              </thead>
              <tbody>
                {data.employees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{employee.name}</td>
                    <td className="p-3">{employee.department}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{employee.plant}</span>
                    </td>
                    <td className="p-3 text-right">${employee.dailySalary.toFixed(2)}</td>
                    <td className="p-3 text-right">{employee.vacationDays}</td>
                    <td className="p-3 text-right">{employee.usedDays}</td>
                    <td className="p-3 text-right">{employee.remainingDays}</td>
                    <td className="p-3 text-right font-semibold">${employee.vacationAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
