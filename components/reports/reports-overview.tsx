"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, DollarSign, PiggyBank as Piggy, Utensils, TrendingUp } from "lucide-react"

const reports = [
  {
    title: "Aguinaldo",
    description: "Year-end bonus calculations and payments",
    href: "/dashboard/reports/aguinaldo",
    icon: DollarSign,
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Vacation",
    description: "Vacation days tracking and dollar equivalents",
    href: "/dashboard/reports/vacation",
    icon: Calendar,
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Saving Funds",
    description: "Employee and company contribution tracking",
    href: "/dashboard/reports/saving-funds",
    icon: TrendingUp,
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Saving Box",
    description: "Personal savings program management",
    href: "/dashboard/reports/saving-box",
    icon: Piggy,
    color: "bg-pink-100 text-pink-600",
  },
  {
    title: "Comedor",
    description: "Meal allowance tracking ($20 per day)",
    href: "/dashboard/reports/comedor",
    icon: Utensils,
    color: "bg-orange-100 text-orange-600",
  },
]

export function ReportsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {reports.map((report) => (
        <Card key={report.title} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${report.color}`}>
                <report.icon className="h-6 w-6" />
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href={report.href}>
                  <FileText className="h-4 w-4 mr-2" />
                  View Report
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <CardTitle className="text-lg mb-2">{report.title}</CardTitle>
            <p className="text-sm text-gray-600">{report.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
