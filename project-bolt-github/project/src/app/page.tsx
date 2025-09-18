'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  Users,
  Briefcase,
  CheckCircle,
  DollarSign,
  UserPlus,
  LayoutTemplate,
  Calculator
} from 'lucide-react'

interface Employee {
  id: number
  name: string
  dailySalary: number
}

interface Position {
  id: number
  title: string
  isFilled: boolean
}

interface DashboardStats {
  totalEmployees: number
  totalPositions: number
  filledPositions: number
  totalPayroll: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalPositions: 0,
    filledPositions: 0,
    totalPayroll: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [employeesRes, positionsRes] = await Promise.all([
          axios.get<Employee[]>('/api/employees'),
          axios.get<Position[]>('/api/positions')
        ])

        const employees = employeesRes.data
        const positions = positionsRes.data

        const totalPayroll = employees.reduce((sum, emp) => sum + emp.dailySalary, 0)
        const filledPositions = positions.filter((pos) => pos.isFilled).length

        setStats({
          totalEmployees: employees.length,
          totalPositions: positions.length,
          filledPositions,
          totalPayroll
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Employees',
      value: stats.totalEmployees,
      icon: <Users className="h-6 w-6" />,
      color: 'from-blue-500 to-blue-600',
      href: '/employees'
    },
    {
      title: 'Total Positions',
      value: stats.totalPositions,
      icon: <Briefcase className="h-6 w-6" />,
      color: 'from-green-500 to-green-600',
      href: '/positions'
    },
    {
      title: 'Filled Positions',
      value: stats.filledPositions,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'from-purple-500 to-purple-600',
      href: '/positions'
    },
    {
      title: 'Daily Payroll',
      value: `$${stats.totalPayroll.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'from-orange-500 to-orange-600',
      href: '/payroll'
    }
  ]

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          IMPRO ERP Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Workforce insights and payroll overview at a glance
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link key={card.title} href={card.href}>
            <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 cursor-pointer p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div
                  className={`bg-gradient-to-r ${card.color} p-3 rounded-xl text-white shadow-md`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/employees"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                <UserPlus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Add New Employee</p>
                <p className="text-sm text-gray-600">Register a new team member</p>
              </div>
            </Link>
            <Link
              href="/positions"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors"
            >
              <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                <LayoutTemplate className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Create Position</p>
                <p className="text-sm text-gray-600">Define a new job role</p>
              </div>
            </Link>
            <Link
              href="/payroll"
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors"
            >
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Process Payroll</p>
                <p className="text-sm text-gray-600">Calculate employee payments</p>
              </div>
            </Link>
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employee Utilization</span>
              <span className="font-semibold">
                {stats.totalPositions > 0
                  ? Math.round((stats.filledPositions / stats.totalPositions) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{
                  width: `${
                    stats.totalPositions > 0
                      ? (stats.filledPositions / stats.totalPositions) * 100
                      : 0
                  }%`
                }}
              ></div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-blue-600">
                  {stats.totalEmployees}
                </p>
                <p className="text-sm text-gray-600">Active Employees</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-xl">
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalPositions - stats.filledPositions}
                </p>
                <p className="text-sm text-gray-600">Open Positions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
