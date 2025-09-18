"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, Utensils, Calendar } from "lucide-react"

interface ComedorData {
  month: number
  year: number
  dailyRate: number
  totalAmount: number
  employees: Array<{
    id: number
    name: string
    department: string
    plant: string
    daysWorked: number
    comedorDays: number
    totalAmount: number
    dailyRate: number
  }>
}

export function ComedorReport() {
  const [data, setData] = useState<ComedorData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/comedor")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching comedor data:", error)
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

  const totalDaysWorked = data.employees.reduce((sum, emp) => sum + emp.daysWorked, 0)
  const totalComedorDays = data.employees.reduce((sum, emp) => sum + emp.comedorDays, 0)
  const monthName = new Date(data.year, data.month).toLocaleDateString("en-US", { month: "long" })

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Rate</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.dailyRate.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comedor Days</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComedorDays}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalAmount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Period</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {monthName} {data.year}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Comedor Usage Details</CardTitle>
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
                  <th className="text-right p-3">Days Worked</th>
                  <th className="text-right p-3">Comedor Days</th>
                  <th className="text-right p-3">Usage %</th>
                  <th className="text-right p-3">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.employees.map((employee) => {
                  const usagePercentage = ((employee.comedorDays / employee.daysWorked) * 100).toFixed(1)
                  return (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{employee.name}</td>
                      <td className="p-3">{employee.department}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {employee.plant}
                        </span>
                      </td>
                      <td className="p-3 text-right">{employee.daysWorked}</td>
                      <td className="p-3 text-right">{employee.comedorDays}</td>
                      <td className="p-3 text-right">{usagePercentage}%</td>
                      <td className="p-3 text-right font-semibold">${employee.totalAmount.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
