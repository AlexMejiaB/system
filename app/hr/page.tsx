'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Users, 
  UserCheck, 
  Calendar, 
  FileText, 
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalApplicants: number
  activeApplicants: number
  scheduledInterviews: number
  pendingOnboarding: number
  completedOnboarding: number
  documentsToReview: number
}

export default function HRDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplicants: 0,
    activeApplicants: 0,
    scheduledInterviews: 0,
    pendingOnboarding: 0,
    completedOnboarding: 0,
    documentsToReview: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API calls to get dashboard stats
    const fetchStats = async () => {
      try {
        // In a real app, these would be actual API calls
        setStats({
          totalApplicants: 45,
          activeApplicants: 12,
          scheduledInterviews: 8,
          pendingOnboarding: 5,
          completedOnboarding: 23,
          documentsToReview: 7,
        })
      } catch (error) {
        console.error('Error fetching dashboard stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Applicants',
      value: stats.totalApplicants,
      description: 'All time applications',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Applications',
      value: stats.activeApplicants,
      description: 'Currently in process',
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Scheduled Interviews',
      value: stats.scheduledInterviews,
      description: 'This week',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pending Onboarding',
      value: stats.pendingOnboarding,
      description: 'Tasks to complete',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  const quickActions = [
    {
      title: 'Schedule Interview',
      description: 'Set up a new interview',
      href: '/hr/interviews',
      icon: Calendar,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Start Onboarding',
      description: 'Begin onboarding process',
      href: '/hr/onboarding',
      icon: UserCheck,
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'Review Applications',
      description: 'Check new applications',
      href: '/hr/applicants',
      icon: FileText,
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Manage Templates',
      description: 'Update onboarding templates',
      href: '/hr/templates',
      icon: FileText,
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">HR Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Manage applicant tracking and onboarding processes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-600 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-lg">{action.title}</CardTitle>
              <CardDescription>{action.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={action.href}>
                <Button className="w-full">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New application received</p>
                  <p className="text-xs text-gray-500">John Doe applied for Software Engineer</p>
                </div>
                <Badge variant="secondary">2h ago</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Interview scheduled</p>
                  <p className="text-xs text-gray-500">Sarah Smith - Marketing Manager</p>
                </div>
                <Badge variant="secondary">4h ago</Badge>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Onboarding completed</p>
                  <p className="text-xs text-gray-500">Mike Johnson finished all tasks</p>
                </div>
                <Badge variant="secondary">1d ago</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Review applications</p>
                  <p className="text-xs text-gray-500">3 new applications pending</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Schedule interviews</p>
                  <p className="text-xs text-gray-500">5 candidates waiting</p>
                </div>
                <Badge variant="outline">Medium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Update templates</p>
                  <p className="text-xs text-gray-500">Onboarding process review</p>
                </div>
                <Badge variant="secondary">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

