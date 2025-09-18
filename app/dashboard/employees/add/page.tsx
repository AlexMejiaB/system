"use client"

import { useRouter } from "next/navigation"
import EmployeeForm from "@/components/employee-form"

export default function AddEmployeePage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push("/dashboard/employees")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Add New Employee</h1>
      </div>

      <EmployeeForm onSuccess={handleSuccess} />
    </div>
  )
}
