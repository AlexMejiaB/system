"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign, User, FileText } from "lucide-react"

const recentActivities = [
  {
    id: 1,
    type: "payment",
    description: "Payroll processed for Manufacturing department",
    amount: "$45,230.50",
    time: "2 hours ago",
    status: "completed",
  },
  {
    id: 2,
    type: "report",
    description: "Aguinaldo report generated",
    time: "4 hours ago",
    status: "completed",
  },
  {
    id: 3,
    type: "employee",
    description: "New employee added: Carlos Mendez",
    time: "1 day ago",
    status: "pending",
  },
  {
    id: 4,
    type: "payment",
    description: "Vacation payment processed",
    amount: "$2,150.00",
    time: "2 days ago",
    status: "completed",
  },
]

const getIcon = (type: string) => {
  switch (type) {
    case "payment":
      return <DollarSign className="h-4 w-4" />
    case "report":
      return <FileText className="h-4 w-4" />
    case "employee":
      return <User className="h-4 w-4" />
    default:
      return <Clock className="h-4 w-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "failed":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-full">{getIcon(activity.type)}</div>
                <div>
                  <p className="text-sm font-medium">{activity.description}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {activity.amount && <span className="text-sm font-semibold">{activity.amount}</span>}
                <Badge className={getStatusColor(activity.status)}>{activity.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
