'use client'
import { useState } from 'react'
import EmployeeForm from '@/components/EmployeeForm'
import EmployeeList from '@/components/EmployeeList'

export default function EmployeesPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setEditingEmployee(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEdit = (employee: any) => {
    setEditingEmployee(employee)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingEmployee(null)
    setShowForm(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-2">Manage your workforce and employee information</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Add Employee
        </button>
      </div>

      {showForm && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
          </div>
          <EmployeeForm 
            editData={editingEmployee} 
            onSuccess={handleSuccess}
          />
        </div>
      )}

      <EmployeeList 
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}