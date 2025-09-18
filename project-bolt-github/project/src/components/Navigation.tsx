"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()

  // Dynamic navigation based on user role
  const getNavItems = () => {
    const role = session?.user?.role
    
    const baseItems = [
      { href: "/", label: "Dashboard", icon: "📊" }
    ]

    if (role === 'ADMIN') {
      return [
        ...baseItems,
        { href: "/employees", label: "Employees", icon: "👥" },
        { href: "/positions", label: "Positions", icon: "💼" },
        { href: "/payroll", label: "Payroll", icon: "💰" },
        { href: "/time-tracking", label: "Time Tracking", icon: "⏰" },
        { href: "/reports", label: "Reports", icon: "📈" },
      ]
    }

    if (role === 'PAYROLL') {
      return [
        ...baseItems,
        { href: "/employees", label: "Employees", icon: "👥" },
        { href: "/payroll", label: "Payroll", icon: "💰" },
        { href: "/time-tracking", label: "Time Tracking", icon: "⏰" },
        { href: "/reports", label: "Reports", icon: "📈" },
      ]
    }

    if (role === 'HR') {
      return [
        ...baseItems,
        { href: "/employees", label: "Employees", icon: "👥" },
        { href: "/positions", label: "Positions", icon: "💼" },
        { href: "/reports", label: "Reports", icon: "📈" },
      ]
    }

    if (role === 'MANAGER') {
      return [
        ...baseItems,
        { href: "/employees", label: "Employees", icon: "👥" },
        { href: "/positions", label: "Positions", icon: "💼" },
        { href: "/reports", label: "Reports", icon: "📈" },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  const oldNavItems = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/employees", label: "Employees", icon: "👥" },
    { href: "/positions", label: "Positions", icon: "💼" },
    { href: "/payroll", label: "Payroll", icon: "💰" },
    { href: "/reports", label: "Reports", icon: "📈" },
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Nav */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              IMPRO ERP
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <div className="text-sm font-medium text-gray-800">
                  Welcome, {session.user.name ?? session.user.email}
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
