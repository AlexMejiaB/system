import type React from "react"
import Navigation from "@/components/navigation"
import { FilterNavbar } from "@/components/dashboard/filter-navbar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="flex flex-col">
        <FilterNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
