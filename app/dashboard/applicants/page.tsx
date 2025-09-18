"use client"

import { useState } from "react"
import ApplicantList from "@/components/applicant-list"
import ApplicantForm from "@/components/applicant-form"
import axios from "axios"

export default function ApplicantsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAddApplicant = () => {
    setEditingApplicant(null)
    setShowForm(true)
  }

  const handleEditApplicant = (applicant: any) => {
    setEditingApplicant(applicant)
    setShowForm(true)
  }

  const handleSubmit = async (data: any) => {
    try {
      if (editingApplicant) {
        await axios.put(`/api/applicants/${editingApplicant.id}`, data)
      } else {
        await axios.post("/api/applicants", data)
      }
      setShowForm(false)
      setEditingApplicant(null)
      setRefreshTrigger((prev) => prev + 1)
    } catch (error) {
      console.error("Error saving applicant:", error)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingApplicant(null)
  }

  if (showForm) {
    return <ApplicantForm applicant={editingApplicant} onSubmit={handleSubmit} onCancel={handleCancel} />
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Applicants</h1>
        <button onClick={handleAddApplicant} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Applicant
        </button>
      </div>

      <ApplicantList onEdit={handleEditApplicant} refreshTrigger={refreshTrigger} />
    </div>
  )
}
