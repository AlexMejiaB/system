'use client'
import { useState } from 'react'
import PositionForm from '@/components/PositionForm'
import PositionList from '@/components/PositionList'

export default function PositionsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingPosition, setEditingPosition] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSuccess = () => {
    setShowForm(false)
    setEditingPosition(null)
    setRefreshTrigger(prev => prev + 1)
  }

  const handleEdit = (position: any) => {
    setEditingPosition(position)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingPosition(null)
    setShowForm(true)
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Position Management</h1>
          <p className="text-gray-600 mt-2">Define and manage job positions across departments</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          + Create Position
        </button>
      </div>

      {showForm && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editingPosition ? 'Edit Position' : 'Create New Position'}
            </h2>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
          </div>
          <PositionForm 
            editData={editingPosition} 
            onSuccess={handleSuccess}
          />
        </div>
      )}

      <PositionList 
        onEdit={handleEdit}
        refreshTrigger={refreshTrigger}
      />
    </div>
  )
}