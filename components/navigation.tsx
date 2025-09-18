"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  BarChart3,
  Users,
  FileText,
  Calculator,
  Calendar,
  Settings,
  UserPlus,
  Briefcase,
  ChevronDown,
  ChevronRight,
  UserCheck,
} from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const [isReportsOpen, setIsReportsOpen] = useState(false)

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/dashboard/employees", label: "Employees", icon: Users },
    { href: "/dashboard/employees/add", label: "Add Employee", icon: UserPlus },
    { href: "/dashboard/positions", label: "Positions", icon: Briefcase },
  ]

  const reportsItems = [
    { href: "/dashboard/reports/aguinaldo", label: "Aguinaldo", icon: Calculator },
    { href: "/dashboard/reports/vacation", label: "Vacation", icon: Calendar },
    { href: "/dashboard/reports/saving-funds", label: "Saving Funds", icon: Users },
    { href: "/dashboard/reports/saving-box", label: "Saving Box", icon: Settings },
    { href: "/dashboard/reports/comedor", label: "Comedor", icon: Settings },
  ]

  const isReportsActive = pathname.startsWith("/dashboard/reports")

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-2xl font-bold text-blue-600">
              PAYROLL ERP
            </Link>
            <div className="hidden md:flex space-x-6">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === item.href
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}

              <div className="relative">
                <button
                  onClick={() => setIsReportsOpen(!isReportsOpen)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isReportsActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                  {isReportsOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>

                {isReportsOpen && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-50">
                    <div className="py-1">
                      {reportsItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center space-x-2 px-4 py-2 text-sm transition-colors ${
                              pathname === item.href ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setIsReportsOpen(false)}
                          >
                            <Icon className="w-4 h-4" />
                            <span>{item.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* User Info & Actions */}
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-800">Welcome, Admin</div>
            <button className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
