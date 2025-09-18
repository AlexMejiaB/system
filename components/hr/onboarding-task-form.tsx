'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, X } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface OnboardingTask {
  id: number
  title: string
  description?: string
  category: string
  status: string
  isRequired: boolean
  dueDate?: string
  assignedTo?: string
  applicantId?: number
  employeeId?: number
}

interface OnboardingTaskFormProps {
  task?: OnboardingTask | null
  onSuccess: (task: OnboardingTask) => void
  onCancel: () => void
}

export function OnboardingTaskForm({ task, onSuccess, onCancel }: OnboardingTaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    isRequired: true,
    dueDate: undefined as Date | undefined,
    assignedTo: '',
    applicantId: '',
    employeeId: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        category: task.category,
        isRequired: task.isRequired,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        assignedTo: task.assignedTo || '',
        applicantId: task.applicantId?.toString() || '',
        employeeId: task.employeeId?.toString() || '',
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category,
        isRequired: formData.isRequired,
        dueDate: formData.dueDate?.toISOString(),
        assignedTo: formData.assignedTo || undefined,
        applicantId: formData.applicantId ? parseInt(formData.applicantId) : undefined,
        employeeId: formData.employeeId ? parseInt(formData.employeeId) : undefined,
      }

      const url = task ? `/api/hr/onboarding/${task.id}` : '/api/hr/onboarding'
      const method = task ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        const result = await response.json()
        onSuccess(result)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to save task')
      }
    } catch (error) {
      setError('An error occurred while saving the task')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              {task ? 'Edit Onboarding Task' : 'Create New Onboarding Task'}
            </CardTitle>
            <CardDescription>
              {task ? 'Update the task details' : 'Add a new task to the onboarding process'}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter task title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCUMENTATION">Documentation</SelectItem>
                  <SelectItem value="TRAINING">Training</SelectItem>
                  <SelectItem value="EQUIPMENT">Equipment</SelectItem>
                  <SelectItem value="SYSTEM_ACCESS">System Access</SelectItem>
                  <SelectItem value="ORIENTATION">Orientation</SelectItem>
                  <SelectItem value="COMPLIANCE">Compliance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? format(formData.dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate}
                    onSelect={(date) => setFormData({ ...formData, dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                placeholder="Email or name"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="applicantId">Applicant ID (Optional)</Label>
              <Input
                id="applicantId"
                type="number"
                value={formData.applicantId}
                onChange={(e) => setFormData({ ...formData, applicantId: e.target.value })}
                placeholder="Enter applicant ID"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID (Optional)</Label>
              <Input
                id="employeeId"
                type="number"
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="Enter employee ID"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isRequired"
              checked={formData.isRequired}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, isRequired: checked as boolean })
              }
            />
            <Label htmlFor="isRequired">This task is required</Label>
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

