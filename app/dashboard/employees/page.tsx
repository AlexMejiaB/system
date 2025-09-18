"use client"

import { useState } from "react"
import Link from "next/link"
import { UserPlus } from "lucide-react"
import EmployeeList from "@/components/employee-list"

interface Employee {
  id: number
  name: string
  payrollNumber: number
  position: { title: string }
  department: string
  plant: string
  dailySalary: number
  hireDate: string
  shift: string
  transportType: string
  collarType: string
}

export default function EmployeesPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEdit = (employee: Employee) => {
    window.location.href = `/dashboard/employees/edit/${employee.id}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
        <Link
          href="/dashboard/employees/add"
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Employee</span>
        </Link>
      </div>

      <EmployeeList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
    </div>
  )
}
