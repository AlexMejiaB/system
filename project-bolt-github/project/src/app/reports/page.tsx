'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

interface Employee {
  id: number
  name: string
  department: string
  plant: string
  payrollType: string
  collarType: string
  dailySalary: number
}

interface Position {
  id: number
  title: string
}

interface ReportData {
  totalEmployees: number
  totalPositions: number
  departmentBreakdown: Record<string, number>
  plantBreakdown: Record<string, number>
  payrollTypeBreakdown: Record<string, number>
  collarTypeBreakdown: Record<string, number>
  averageSalary: number
  totalPayroll: number
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState('overview')

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [employeesRes, positionsRes] = await Promise.all([
          axios.get<Employee[]>('/api/employees'),
          axios.get<Position[]>('/api/positions')
        ])

        const employees = employeesRes.data
        const positions = positionsRes.data

        // Calculations
        const departmentBreakdown = employees.reduce<Record<string, number>>((acc, emp) => {
          acc[emp.department] = (acc[emp.department] || 0) + 1
          return acc
        }, {})

        const plantBreakdown = employees.reduce<Record<string, number>>((acc, emp) => {
          acc[emp.plant] = (acc[emp.plant] || 0) + 1
          return acc
        }, {})

        const payrollTypeBreakdown = employees.reduce<Record<string, number>>((acc, emp) => {
          acc[emp.payrollType] = (acc[emp.payrollType] || 0) + 1
          return acc
        }, {})

        const collarTypeBreakdown = employees.reduce<Record<string, number>>((acc, emp) => {
          acc[emp.collarType] = (acc[emp.collarType] || 0) + 1
          return acc
        }, {})

        const totalPayroll = employees.reduce((sum, emp) => sum + emp.dailySalary, 0)
        const averageSalary = employees.length > 0 ? totalPayroll / employees.length : 0

        setReportData({
          totalEmployees: employees.length,
          totalPositions: positions.length,
          departmentBreakdown,
          plantBreakdown,
          payrollTypeBreakdown,
          collarTypeBreakdown,
          averageSalary,
          totalPayroll
        })
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReportData()
  }, [])

  if (loading || !reportData) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const reportTypes = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'departments', name: 'Departments', icon: '🏢' },
    { id: 'plants', name: 'Plants', icon: '🏭' },
    { id: 'payroll', name: 'Payroll', icon: '💰' },
    { id: 'workforce', name: 'Workforce', icon: '👥' }
  ]

  const renderChart = (data: Record<string, number>, title: string, color: string) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => {
          const percentage = (value / reportData.totalEmployees) * 100
          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{key}</span>
                <span className="font-medium text-black">
                  {value} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${color} h-2 rounded-full`} 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into your workforce</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedReport}
            onChange={(e) => setSelectedReport(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {reportTypes.map(type => (
              <option key={type.id} value={type.id}>
                {type.icon} {type.name}
              </option>
            ))}
          </select>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Total Employees</p>
          <p className="text-3xl font-bold text-black">{reportData.totalEmployees}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Total Positions</p>
          <p className="text-3xl font-bold text-black">{reportData.totalPositions}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Average Salary</p>
          <p className="text-3xl font-bold text-black">
            ${reportData.averageSalary.toLocaleString()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm font-medium text-gray-600">Total Daily Payroll</p>
          <p className="text-3xl font-bold text-black">
            ${reportData.totalPayroll.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {renderChart(reportData.departmentBreakdown, 'Department Distribution', 'bg-blue-500')}
        {renderChart(reportData.plantBreakdown, 'Plant Distribution', 'bg-green-500')}
        {renderChart(reportData.payrollTypeBreakdown, 'Payroll Type Distribution', 'bg-purple-500')}
        {renderChart(reportData.collarTypeBreakdown, 'Collar Type Distribution', 'bg-orange-500')}
      </div>
    </div>
  )
}
