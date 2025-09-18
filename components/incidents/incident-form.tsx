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
import { CalendarIcon, Save, X, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Employee {
  id: number
  name: string
  employeeId: string
  email?: string
  department?: {
    name: string
  }
  position?: {
    title: string
  }
}

interface Incident {
  id: number
  employeeId: number
  incidentType: string
  startDate: string
  endDate?: string
  reason: string
  description?: string
  status: string
  isPaid: boolean
  employee: Employee
}

interface IncidentFormProps {
  incident?: Incident | null
  onSuccess: (incident: Incident) => void
  onCancel: () => void
}

const incidentTypes = [
  { value: 'LEAVE_WITHOUT_PAY', label: 'Permiso sin Goce de Sueldo' },
  { value: 'MEDICAL_LEAVE', label: 'Incapacidad Médica' },
  { value: 'PERSONAL_LEAVE', label: 'Permiso Personal' },
  { value: 'MATERNITY_LEAVE', label: 'Licencia de Maternidad' },
  { value: 'PATERNITY_LEAVE', label: 'Licencia de Paternidad' },
  { value: 'VACATION_REQUEST', label: 'Solicitud de Vacaciones' },
  { value: 'SICK_LEAVE', label: 'Permiso por Enfermedad' },
  { value: 'EMERGENCY_LEAVE', label: 'Permiso de Emergencia' },
]

export function IncidentForm({ incident, onSuccess, onCancel }: IncidentFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    employeeId: incident?.employeeId || 0,
    incidentType: incident?.incidentType || '',
    startDate: incident?.startDate ? new Date(incident.startDate) : new Date(),
    endDate: incident?.endDate ? new Date(incident.endDate) : null as Date | null,
    reason: incident?.reason || '',
    description: incident?.description || '',
    isPaid: incident?.isPaid || false,
  })

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data.employees || data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.employeeId) {
      newErrors.employeeId = 'Seleccione un empleado'
    }
    if (!formData.incidentType) {
      newErrors.incidentType = 'Seleccione el tipo de incidencia'
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'El motivo es requerido'
    }
    if (formData.endDate && formData.endDate < formData.startDate) {
      newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate?.toISOString() || null,
      }

      const url = incident ? `/api/incidents/${incident.id}` : '/api/incidents'
      const method = incident ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        const result = await response.json()
        onSuccess(result)
      } else {
        const error = await response.json()
        console.error('Error saving incident:', error)
      }
    } catch (error) {
      console.error('Error saving incident:', error)
    } finally {
      setLoading(false)
    }
  }

  const selectedEmployee = employees.find(emp => emp.id === formData.employeeId)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          {incident ? 'Editar Incidencia' : 'Nueva Incidencia'}
        </CardTitle>
        <CardDescription>
          {incident ? 'Modificar los datos de la incidencia' : 'Registrar una nueva incidencia de empleado'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Employee Selection */}
            <div className="space-y-2">
              <Label htmlFor="employeeId">Empleado *</Label>
              <Select
                value={formData.employeeId.toString()}
                onValueChange={(value) => setFormData({ ...formData, employeeId: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name} ({employee.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.employeeId && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.employeeId}
                </p>
              )}
            </div>

            {/* Incident Type */}
            <div className="space-y-2">
              <Label htmlFor="incidentType">Tipo de Incidencia *</Label>
              <Select
                value={formData.incidentType}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  incidentType: value,
                  isPaid: value !== 'LEAVE_WITHOUT_PAY' // Auto-set isPaid based on type
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incidentType && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.incidentType}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label>Fecha de Inicio *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label>Fecha de Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "PPP", { locale: es })
                    ) : (
                      <span>Seleccionar fecha (opcional)</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Employee Info Display */}
          {selectedEmployee && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Información del Empleado</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Nombre:</span> {selectedEmployee.name}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {selectedEmployee.employeeId}
                </div>
                <div>
                  <span className="font-medium">Departamento:</span> {selectedEmployee.department?.name || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Puesto:</span> {selectedEmployee.position?.title || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {selectedEmployee.email || 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo *</Label>
            <Input
              id="reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Motivo de la incidencia"
            />
            {errors.reason && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.reason}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descripción Adicional</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalles adicionales sobre la incidencia"
              rows={3}
            />
          </div>

          {/* Is Paid Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) => setFormData({ ...formData, isPaid: !!checked })}
            />
            <Label htmlFor="isPaid" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Con goce de sueldo
            </Label>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Guardando...' : (incident ? 'Actualizar' : 'Crear Incidencia')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

