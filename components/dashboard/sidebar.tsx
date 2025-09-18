"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  Users,
  Calculator,
  Calendar,
  Settings,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Briefcase,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  {
    name: "Reports",
    icon: FileText,
    children: [
      { name: "Overview", href: "/dashboard/reports" },
      { name: "Aguinaldo", href: "/dashboard/reports/aguinaldo" },
      { name: "Vacation", href: "/dashboard/reports/vacation" },
      { name: "Saving Funds", href: "/dashboard/reports/saving-funds" },
      { name: "Saving Box", href: "/dashboard/reports/saving-box" },
      { name: "Comedor", href: "/dashboard/reports/comedor" },
    ],
  },
  { name: "Employees", href: "/dashboard/employees", icon: Users },
  { name: "Applicants", href: "/dashboard/applicants", icon: UserCheck }, // Added applicants to sidebar
  { name: "Positions", href: "/dashboard/positions", icon: Briefcase }, // Added positions to sidebar
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>(["Reports"])

  const toggleExpanded = (name: string) => {
    setExpandedItems((prev) => (prev.includes(name) ? prev.filter((item) => item !== name) : [...prev, name]))
  }

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-gray-900">Payroll System</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <div key={item.name}>
            {item.children ? (
              <div>
                <button
                  onClick={() => toggleExpanded(item.name)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    pathname.startsWith("/dashboard/reports")
                      ? "bg-cyan-50 text-cyan-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </div>
                  {expandedItems.includes(item.name) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedItems.includes(item.name) && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 text-sm rounded-md transition-colors",
                          pathname === child.href
                            ? "bg-cyan-100 text-cyan-700 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Calendar Widget */}
      <div className="p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Calendar className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Calendar</span>
          </div>
          <div className="text-xs text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Quick Calculator */}
      <div className="p-4 border-t">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center mb-2">
            <Calculator className="h-4 w-4 mr-2 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Quick Calc</span>
          </div>
          <input type="text" placeholder="Calculate..." className="w-full text-xs p-2 border rounded" />
        </div>
      </div>
    </div>
  )
}
