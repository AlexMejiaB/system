'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeSchema } from '@/schemas/employee'
import { useEffect, useState } from 'react'
import axios from 'axios'

interface EmployeeFormProps {
  editData?: any
  onSuccess?: () => void
}

export default function EmployeeForm({ editData, onSuccess }: EmployeeFormProps) {
  const [positions, setPositions] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: editData || {}
  })

  useEffect(() => {
    axios.get('/api/positions')
      .then(response => setPositions(response.data))
      .catch(error => console.error('Error fetching positions:', error))
  }, [])

  useEffect(() => {
    if (editData) {
      reset(editData)
    }
  }, [editData, reset])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      const url = editData ? `/api/employees/${editData.id}` : '/api/employees'
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
      if (axios.isAxiosError(error)) {
        console.error('Response data:', error.response?.data)
        console.error('Status code:', error.response?.status)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const formFields = [
    { name: 'name', label: 'Full Name', type: 'text', required: true },
    { name: 'payrollNumber', label: 'Payroll Number', type: 'number', required: true },
    { name: 'positionId', label: 'Position', type: 'select', required: true, options: positions },
    { name: 'shift', label: 'Shift', type: 'text', required: true },
    { name: 'nss', label: 'NSS (Social Security)', type: 'text', required: true, maxLength: 11 },
    { name: 'rfc', label: 'RFC', type: 'text', required: true, maxLength: 13 },
    { name: 'curp', label: 'CURP', type: 'text', required: true, maxLength: 18 },
    { name: 'birthDate', label: 'Birth Date', type: 'date', required: true },
    { name: 'birthPlace', label: 'Birth Place', type: 'text', required: true },
    { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
      { id: 'M', title: 'Male' },
      { id: 'F', title: 'Female' },
      { id: 'Otro', title: 'Other' }
    ]},
    { name: 'bloodType', label: 'Blood Type', type: 'text', required: true },
    { name: 'plant', label: 'Plant', type: 'select', required: true, options: [
      { id: 'PM', title: 'PM' },
      { id: 'SSD', title: 'SSD' },
      { id: 'CHU', title: 'CHU' }
    ]},
    { name: 'department', label: 'Department', type: 'select', required: true, options: [
      { id: 'QCD', title: 'QCD' },
      { id: 'SCD', title: 'SCD' },
      { id: 'RDD', title: 'RDD' },
      { id: 'MMD', title: 'MMD' },
      { id: 'ADD', title: 'ADD' },
      { id: 'ADDIT', title: 'ADDIT' },
      { id: 'EQD', title: 'EQD' },
      { id: 'CSD', title: 'CSD' },
      { id: 'ADEHS', title: 'ADEHS' },
      { id: 'AD', title: 'AD' },
      { id: 'HRD', title: 'HRD' },
      { id: 'FD', title: 'FD' }
    ]},
    { name: 'dailySalary', label: 'Daily Salary', type: 'number', required: true, step: '0.01' },
    { name: 'hireDate', label: 'Hire Date', type: 'date', required: true },
    { name: 'payrollType', label: 'Payroll Type', type: 'select', required: true, options: [
      { id: 'CATORCENAL', title: 'Bi-weekly' },
      { id: 'SEMANAL', title: 'Weekly' }
    ]},
    { name: 'source', label: 'Hiring Source', type: 'select', required: true, options: [
      { id: 'BESTJOBS', title: 'BestJobs' },
      { id: 'IMPRO', title: 'IMPRO' }
    ]},
    { name: 'transportRoute', label: 'Transport Route', type: 'select', required: true, options: [
      { id: 'RUTA_1', title: 'Route 1' },
      { id: 'RUTA_2', title: 'Route 2' },
      { id: 'RUTA_3', title: 'Route 3' }
    ]},
    { name: 'transportStop', label: 'Transport Stop', type: 'select', required: true, options: [
      { id: 'PARADA_1', title: 'Stop 1' },
      { id: 'PARADA_2', title: 'Stop 2' },
      { id: 'PARADA_3', title: 'Stop 3' }
    ]},
    { name: 'costCenter', label: 'Cost Center', type: 'text', required: true },
    { name: 'transportType', label: 'Transport Type', type: 'select', required: true, options: [
      { id: 'PROPIO', title: 'Own Transport' },
      { id: 'RUTA', title: 'Company Route' }
    ]},
    { name: 'bankAccount', label: 'Bank Account', type: 'text', required: true },
    { name: 'collarType', label: 'Collar Type', type: 'select', required: true, options: [
      { id: 'BLUECOLLAR', title: 'Blue Collar' },
      { id: 'WHITECOLLAR', title: 'White Collar' },
      { id: 'GREYCOLLAR', title: 'Grey Collar' }
    ]}
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">
        {editData ? 'Edit Employee' : 'Add New Employee'}
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formFields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium text-gray-800">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'select' ? (
                <select
                  {...register(field.name)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white 
                             text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600 
                             focus:border-blue-600 transition"
                >
                  <option value="">Select {field.label}</option>
                  {field.options?.map((option: any) => (
                    <option key={option.id} value={option.id}>
                      {option.title}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  {...register(field.name, { 
                    valueAsNumber: field.type === 'number' ? true : false 
                  })}
                  type={field.type}
                  step={field.step}
                  maxLength={field.maxLength}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white 
                             text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 
                             focus:ring-blue-600 focus:border-blue-600 transition"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
              
              {errors[field.name] && (
                <p className="text-sm text-red-600">
                  {errors[field.name]?.message as string}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={() => reset()}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 
                       hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : (editData ? 'Update Employee' : 'Add Employee')}
          </button>
        </div>
      </form>
    </div>
  )
}
