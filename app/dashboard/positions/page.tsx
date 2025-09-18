"use client"

import { useState } from "react"
import PositionList from "@/components/position-list"
import PositionForm from "@/components/position-form"

interface Position {
  id: number
  title: string
  description?: string
  departmentId: number
  baseSalary: number
  isActive: boolean
}

export default function PositionsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | undefined>()
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleEdit = (position: Position) => {
    setEditingPosition(position)
    setShowForm(true)
  }

  const handleSuccess = () => {
    setShowForm(false)
    setEditingPosition(undefined)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingPosition(undefined)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Position Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Position
        </button>
      </div>

      {showForm && <PositionForm position={editingPosition} onSuccess={handleSuccess} onCancel={handleCancel} />}

      <PositionList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
    </div>
  )
}
