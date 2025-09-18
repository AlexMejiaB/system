"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, PiggyBank as Piggy, Users } from "lucide-react"

export function SavingBoxReport() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Replace with actual API call
        const mockData = {
          year: 2024,
          totalSavings: 45678.9,
          employees: [
            {
              id: 1,
              name: "Juan Pérez",
              department: "Manufacturing",
              plant: "CHU",
              monthlyContribution: 150.0,
              totalSaved: 1800.0,
              withdrawals: 0,
              currentBalance: 1800.0,
            },
            {
              id: 2,
              name: "María González",
              department: "Production",
              plant: "SSD",
              monthlyContribution: 120.0,
              totalSaved: 1440.0,
              withdrawals: 200.0,
              currentBalance: 1240.0,
            },
          ],
        }
        setData(mockData)
      } catch (error) {
        console.error("Error fetching saving box data:", error)
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

  const totalContributions = data.employees.reduce((sum: number, emp: any) => sum + emp.monthlyContribution, 0)
  const totalBalance = data.employees.reduce((sum: number, emp: any) => sum + emp.currentBalance, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contributions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalContributions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Piggy Bank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${data.totalSavings.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.employees.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Saving Box Details</CardTitle>
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
                  <th className="text-right p-3">Monthly Contribution</th>
                  <th className="text-right p-3">Total Saved</th>
                  <th className="text-right p-3">Withdrawals</th>
                  <th className="text-right p-3">Current Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.employees.map((employee: any) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{employee.name}</td>
                    <td className="p-3">{employee.department}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{employee.plant}</span>
                    </td>
                    <td className="p-3 text-right">${employee.monthlyContribution.toFixed(2)}</td>
                    <td className="p-3 text-right">${employee.totalSaved.toFixed(2)}</td>
                    <td className="p-3 text-right">${employee.withdrawals.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-green-600">${employee.currentBalance.toFixed(2)}</td>
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
