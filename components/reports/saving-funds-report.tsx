"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, DollarSign, TrendingUp, Users } from "lucide-react"

interface SavingFundsData {
  year: number
  totalContributions: number
  employees: Array<{
    id: number
    name: string
    department: string
    plant: string
    employeeContribution: number
    companyContribution: number
    totalContribution: number
    balance: number
  }>
}

export function SavingFundsReport() {
  const [data, setData] = useState<SavingFundsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/saving-funds")
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching saving funds data:", error)
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

  const totalEmployeeContributions = data.employees.reduce((sum, emp) => sum + emp.employeeContribution, 0)
  const totalCompanyContributions = data.employees.reduce((sum, emp) => sum + emp.companyContribution, 0)
  const totalBalance = data.employees.reduce((sum, emp) => sum + emp.balance, 0)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Contributions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEmployeeContributions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Company Match</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCompanyContributions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBalance.toLocaleString()}</div>
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
          <CardTitle>Saving Funds Details</CardTitle>
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
                  <th className="text-right p-3">Employee Contribution</th>
                  <th className="text-right p-3">Company Match</th>
                  <th className="text-right p-3">Monthly Total</th>
                  <th className="text-right p-3">Current Balance</th>
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
                    <td className="p-3 text-right">${employee.employeeContribution.toFixed(2)}</td>
                    <td className="p-3 text-right">${employee.companyContribution.toFixed(2)}</td>
                    <td className="p-3 text-right font-semibold">${employee.totalContribution.toFixed(2)}</td>
                    <td className="p-3 text-right font-bold text-green-600">${employee.balance.toLocaleString()}</td>
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
