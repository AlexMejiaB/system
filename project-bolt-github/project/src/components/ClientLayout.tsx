"use client"

import { usePathname } from "next/navigation"
import Navigation from "@/components/Navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const noNavRoutes = ["/login"]
  const hideNav = noNavRoutes.includes(pathname)

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNav && <Navigation />}
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
