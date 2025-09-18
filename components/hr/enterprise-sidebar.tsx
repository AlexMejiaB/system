'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Users, 
  UserCheck, 
  MessageSquare, 
  FileText, 
  Calendar,
  BarChart3,
  Award,
  GraduationCap,
  DollarSign,
  Laptop,
  Clock,
  Heart,
  TrendingUp,
  MessageCircle,
  Settings,
  Home,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/hr',
    icon: BarChart3,
    description: 'Vista general de RH'
  },
  {
    name: 'Gestión de Empleados',
    icon: Users,
    children: [
      {
        name: 'Candidatos',
        href: '/hr/applicants',
        icon: UserCheck,
        description: 'Seguimiento de candidatos'
      },
      {
        name: 'Entrevistas',
        href: '/hr/interviews',
        icon: MessageSquare,
        description: 'Programar entrevistas'
      },
      {
        name: 'Onboarding',
        href: '/hr/onboarding',
        icon: UserCheck,
        description: 'Proceso de incorporación'
      },
      {
        name: 'Documentos',
        href: '/hr/documents',
        icon: FileText,
        description: 'Gestión documental'
      }
    ]
  },
  {
    name: 'Gestión del Desempeño',
    icon: TrendingUp,
    children: [
      {
        name: 'Evaluaciones',
        href: '/hr/performance',
        icon: BarChart3,
        description: 'Evaluaciones de desempeño'
      },
      {
        name: 'Reconocimientos',
        href: '/hr/recognition',
        icon: Award,
        description: 'Reconocimiento de empleados'
      }
    ]
  },
  {
    name: 'Beneficios y Compensación',
    icon: DollarSign,
    children: [
      {
        name: 'Planes de Beneficios',
        href: '/hr/benefits',
        icon: Heart,
        description: 'Administrar beneficios'
      },
      {
        name: 'Compensación',
        href: '/hr/compensation',
        icon: DollarSign,
        description: 'Salarios y bonos'
      },
      {
        name: 'Tiempo Libre',
        href: '/hr/time-off',
        icon: Calendar,
        description: 'Vacaciones y permisos'
      }
    ]
  },
  {
    name: 'Capacitación y Desarrollo',
    icon: GraduationCap,
    children: [
      {
        name: 'Programas de Capacitación',
        href: '/hr/training',
        icon: GraduationCap,
        description: 'Gestión de capacitación'
      }
    ]
  },
  {
    name: 'Gestión de Activos',
    icon: Laptop,
    children: [
      {
        name: 'Inventario',
        href: '/hr/assets',
        icon: Laptop,
        description: 'Gestión de activos'
      }
    ]
  },
  {
    name: 'Engagement y Encuestas',
    icon: MessageCircle,
    children: [
      {
        name: 'Encuestas',
        href: '/hr/surveys',
        icon: MessageCircle,
        description: 'Encuestas de empleados'
      }
    ]
  }
]

export function EnterpriseSidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<string[]>(['Gestión de Empleados'])

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Sistema de RH</h2>
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedSections.includes(item.name)
            const hasActiveChild = item.children.some(child => pathname === child.href)
            
            return (
              <div key={item.name} className="space-y-1">
                <button
                  onClick={() => toggleSection(item.name)}
                  className={cn(
                    'w-full flex items-center justify-between px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    hasActiveChild || isExpanded
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <div className="flex items-center">
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {item.children.map((child) => {
                      const isActive = pathname === child.href
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                            isActive
                              ? 'bg-blue-100 text-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          )}
                          title={child.description}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          {child.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
              title={item.description}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="border-t border-gray-200 p-4 space-y-2">
        <Link
          href="/"
          className="flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <Home className="mr-2 h-4 w-4" />
          Dashboard Principal
        </Link>
        <div className="flex items-center text-sm text-gray-500">
          <Settings className="mr-2 h-4 w-4" />
          Configuración
        </div>
      </div>
    </div>
  )
}

