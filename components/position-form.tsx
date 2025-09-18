"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from "axios"

const positionSchema = z.object({
  title: z.string().min(1, "Position title is required"),
  description: z.string().optional(),
  departmentId: z.number().min(1, "Department is required"),
  baseSalary: z.number().min(0, "Base salary must be positive"),
  isActive: z.boolean().default(true),
})

type PositionFormData = z.infer<typeof positionSchema>

interface Department {
  id: number
  name: string
}

interface Position {
  id: number
  title: string
  description?: string
  departmentId: number
  baseSalary: number
  isActive: boolean
}

interface PositionFormProps {
  position?: Position
  onSuccess?: () => void
  onCancel?: () => void
}

export default function PositionForm({ position, onSuccess, onCancel }: PositionFormProps) {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PositionFormData>({
    resolver: zodResolver(positionSchema),
    defaultValues: position
      ? {
          title: position.title,
          description: position.description || "",
          departmentId: position.departmentId,
          baseSalary: position.baseSalary,
          isActive: position.isActive,
        }
      : {
          isActive: true,
        },
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments")
      setDepartments(response.data)
    } catch (error) {
      console.error("Error fetching departments:", error)
    }
  }

  const onSubmit = async (data: PositionFormData) => {
    setLoading(true)
    try {
      if (position) {
        await axios.put(`/api/positions/${position.id}`, data)
      } else {
        await axios.post("/api/positions", data)
      }
      onSuccess?.()
      if (!position) reset()
    } catch (error) {
      console.error("Error saving position:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{position ? "Edit Position" : "Add New Position"}</h2>
        {onCancel && (
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position Title *</label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Software Engineer"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
            <select
              {...register("departmentId", { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </select>
            {errors.departmentId && <p className="text-red-500 text-sm mt-1">{errors.departmentId.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary (Daily) *</label>
            <input
              {...register("baseSalary", { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
            />
            {errors.baseSalary && <p className="text-red-500 text-sm mt-1">{errors.baseSalary.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              {...register("isActive")}
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">Active Position</label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Position description and responsibilities..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : position ? "Update Position" : "Create Position"}
          </button>
        </div>
      </form>
    </div>
  )
}
