'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  FileText
} from 'lucide-react'
import { format } from 'date-fns'

interface OnboardingTask {
  id: number
  title: string
  description?: string
  category: string
  status: string
  isRequired: boolean
  dueDate?: string
  assignedTo?: string
  applicant?: {
    id: number
    name: string
    email: string
  }
  employee?: {
    id: number
    name: string
    email: string
  }
  createdAt: string
  updatedAt: string
}

interface OnboardingTaskListProps {
  tasks: OnboardingTask[]
  onEdit: (task: OnboardingTask) => void
  onDelete: (taskId: number) => void
  onUpdate: (task: OnboardingTask) => void
}

export function OnboardingTaskList({ tasks, onEdit, onDelete, onUpdate }: OnboardingTaskListProps) {
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, icon: Clock, color: 'text-orange-600' },
      IN_PROGRESS: { variant: 'default' as const, icon: User, color: 'text-blue-600' },
      COMPLETED: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      OVERDUE: { variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' },
      CANCELLED: { variant: 'outline' as const, icon: AlertCircle, color: 'text-gray-600' },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const categoryColors = {
      DOCUMENTATION: 'bg-blue-100 text-blue-800',
      TRAINING: 'bg-green-100 text-green-800',
      EQUIPMENT: 'bg-purple-100 text-purple-800',
      SYSTEM_ACCESS: 'bg-orange-100 text-orange-800',
      ORIENTATION: 'bg-pink-100 text-pink-800',
      COMPLIANCE: 'bg-red-100 text-red-800',
    }

    const colorClass = categoryColors[category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-800'

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
        {category.replace('_', ' ')}
      </span>
    )
  }

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    setUpdatingStatus(taskId)
    try {
      const response = await fetch(`/api/hr/onboarding/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        const updatedTask = await response.json()
        onUpdate(updatedTask)
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDelete = async (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/hr/onboarding/${taskId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          onDelete(taskId)
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No onboarding tasks found</h3>
          <p className="text-gray-600 text-center">
            Create your first onboarding task to get started with the process.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-lg">{task.title}</CardTitle>
                  {task.isRequired && (
                    <Badge variant="outline" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  {getCategoryBadge(task.category)}
                  {getStatusBadge(task.status)}
                  {task.dueDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(task.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {task.description && (
              <p className="text-gray-700 mb-4">{task.description}</p>
            )}
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4 text-sm text-gray-600">
                {task.assignedTo && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Assigned to: {task.assignedTo}
                  </div>
                )}
                {task.applicant && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Applicant: {task.applicant.name}
                  </div>
                )}
                {task.employee && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Employee: {task.employee.name}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Select
                  value={task.status}
                  onValueChange={(value) => handleStatusChange(task.id, value)}
                  disabled={updatingStatus === task.id}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="OVERDUE">Overdue</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

