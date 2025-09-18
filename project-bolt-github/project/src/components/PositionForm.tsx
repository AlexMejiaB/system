'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { positionSchema } from '@/schemas/position'
import { useState, useEffect } from 'react'
import axios from 'axios'

interface PositionFormProps {
  editData?: any
  onSuccess?: () => void
}

export default function PositionForm({ editData, onSuccess }: PositionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(positionSchema),
    defaultValues: editData || {}
  })

  useEffect(() => {
    if (editData) {
      reset(editData)
    }
  }, [editData, reset])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const url = editData ? `/api/positions/${editData.id}` : '/api/positions'
      
      // Using Axios instead of fetch
      if (editData) {
        await axios.put(url, data, {
          headers: { 'Content-Type': 'application/json' }
        })
      } else {
        await axios.post(url, data, {
          headers: { 'Content-Type': 'application/json' }
        })
      }

      reset()
      onSuccess?.()
    } catch (error) {
      console.error('Error submitting form:', error)
      // Better error handling with Axios
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data)
        console.error('Status code:', error.response?.status)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = [
    { id: 'QCD', title: 'Quality Control Department' },
    { id: 'SCD', title: 'Supply Chain Department' },
    { id: 'RDD', title: 'Research & Development Department' },
    { id: 'MMD', title: 'Manufacturing & Maintenance Department' },
    { id: 'ADD', title: 'Administration Department' },
    { id: 'ADDIT', title: 'Additional Department' },
    { id: 'EQD', title: 'Equipment Department' },
    { id: 'CSD', title: 'Customer Service Department' },
    { id: 'ADEHS', title: 'Environmental Health & Safety Department' },
    { id: 'AD', title: 'Administrative Department' },
    { id: 'HRD', title: 'Human Resources Department' },
    { id: 'FD', title: 'Finance Department' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {editData ? 'Edit Position' : 'Create New Position'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Position Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter position title"
            />
            {errors.title && (
              <p className="text-sm text-red-600">{String(errors.title.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              {...register('department')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>
                  {dept.title}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="text-sm text-red-600">{String(errors.department.message || '')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Daily Salary <span className="text-red-500">*</span>
            </label>
            <input
              {...register('dailySalary', { valueAsNumber: true })}
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter daily salary"
            />
            {errors.dailySalary && (
              <p className="text-sm text-red-600">{String(errors.dailySalary.message || '')}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Position Status
            </label>
            <div className="flex items-center space-x-3">
              <input
                {...register('isFilled')}
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Position is currently filled</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (editData ? 'Update Position' : 'Create Position')}
          </button>
        </div>
      </form>
    </div>
  )
}