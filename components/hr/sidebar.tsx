'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Settings,
  Home,
  ClipboardList
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/hr',
    icon: Home,
  },
  {
    name: 'Applicant Tracking',
    href: '/hr/applicants',
    icon: Users,
  },
  {
    name: 'Interviews',
    href: '/hr/interviews',
    icon: Calendar,
  },
  {
    name: 'Onboarding',
    href: '/hr/onboarding',
    icon: UserCheck,
  },
  {
    name: 'Templates',
    href: '/hr/templates',
    icon: ClipboardList,
  },
  {
    name: 'Documents',
    href: '/hr/documents',
    icon: FileText,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">HR Management</h2>
        <p className="text-sm text-gray-600 mt-1">Applicant Tracking & Onboarding</p>
      </div>
      
      <nav className="mt-6">
        <div className="px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200">
        <Link
          href="/"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Main Dashboard
        </Link>
      </div>
    </div>
  )
}

