'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  User,
  Calendar,
  FileText,
  AlertTriangle
} from 'lucide-react'
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
  approvedBy?: string
  approvalDate?: string
  rejectionReason?: string
  isPaid: boolean
  employee: Employee
  createdAt: string
  updatedAt: string
}

interface IncidentListProps {
  incidents: Incident[]
  onEdit: (incident: Incident) => void
  onDelete: (incidentId: number) => void
  onUpdate: (incident: Incident) => void
}

const incidentTypeLabels: Record<string, string> = {
  'LEAVE_WITHOUT_PAY': 'Permiso sin Goce',
  'MEDICAL_LEAVE': 'Incapacidad Médica',
  'PERSONAL_LEAVE': 'Permiso Personal',
  'MATERNITY_LEAVE': 'Licencia de Maternidad',
  'PATERNITY_LEAVE': 'Licencia de Paternidad',
  'VACATION_REQUEST': 'Solicitud de Vacaciones',
  'SICK_LEAVE': 'Permiso por Enfermedad',
  'EMERGENCY_LEAVE': 'Permiso de Emergencia',
}

const statusLabels: Record<string, string> = {
  'PENDING': 'Pendiente',
  'APPROVED': 'Aprobado',
  'REJECTED': 'Rechazado',
  'CANCELLED': 'Cancelado',
}

const statusColors: Record<string, string> = {
  'PENDING': 'bg-orange-100 text-orange-800',
  'APPROVED': 'bg-green-100 text-green-800',
  'REJECTED': 'bg-red-100 text-red-800',
  'CANCELLED': 'bg-gray-100 text-gray-800',
}

export function IncidentList({ incidents, onEdit, onDelete, onUpdate }: IncidentListProps) {
  const [updatingIncident, setUpdatingIncident] = useState<number | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const handleStatusUpdate = async (incident: Incident, newStatus: string, approvedBy?: string) => {
    setUpdatingIncident(incident.id)
    
    try {
      const updateData: any = {
        status: newStatus,
        approvedBy: approvedBy || 'Sistema',
      }

      if (newStatus === 'REJECTED' && rejectionReason) {
        updateData.rejectionReason = rejectionReason
      }

      const response = await fetch(`/api/incidents/${incident.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedIncident = await response.json()
        onUpdate(updatedIncident)
        setRejectionReason('')
      }
    } catch (error) {
      console.error('Error updating incident:', error)
    } finally {
      setUpdatingIncident(null)
    }
  }

  const handleDelete = async (incidentId: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta incidencia?')) {
      return
    }

    try {
      const response = await fetch(`/api/incidents/${incidentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onDelete(incidentId)
      }
    } catch (error) {
      console.error('Error deleting incident:', error)
    }
  }

  if (incidents.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay incidencias</h3>
          <p className="text-gray-600 text-center">
            No se encontraron incidencias que coincidan con los filtros seleccionados.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <Card key={incident.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center">
                  <User className="mr-2 h-5 w-5 text-blue-600" />
                  {incident.employee.name}
                  <Badge variant="outline" className="ml-2">
                    {incident.employee.employeeId}
                  </Badge>
                </CardTitle>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <span>{incident.employee.department?.name}</span>
                  {incident.employee.position?.title && (
                    <>
                      <span className="mx-2">•</span>
                      <span>{incident.employee.position.title}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={statusColors[incident.status]}>
                  {statusLabels[incident.status]}
                </Badge>
                {incident.isPaid ? (
                  <Badge variant="secondary">Con Goce</Badge>
                ) : (
                  <Badge variant="destructive">Sin Goce</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Incident Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Detalles de la Incidencia</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="font-medium">Tipo:</span>
                    <span className="ml-2">{incidentTypeLabels[incident.incidentType]}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span className="font-medium">Inicio:</span>
                    <span className="ml-2">
                      {format(new Date(incident.startDate), "PPP", { locale: es })}
                    </span>
                  </div>
                  {incident.endDate && (
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="font-medium">Fin:</span>
                      <span className="ml-2">
                        {format(new Date(incident.endDate), "PPP", { locale: es })}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Motivo</h4>
                <p className="text-sm text-gray-700">{incident.reason}</p>
                {incident.description && (
                  <>
                    <h4 className="font-medium text-gray-900 mb-2 mt-3">Descripción</h4>
                    <p className="text-sm text-gray-700">{incident.description}</p>
                  </>
                )}
              </div>
            </div>

            {/* Approval Information */}
            {incident.status === 'APPROVED' && incident.approvedBy && (
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center text-green-800">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Aprobado por: {incident.approvedBy}</span>
                  {incident.approvalDate && (
                    <span className="ml-2">
                      el {format(new Date(incident.approvalDate), "PPP", { locale: es })}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Rejection Information */}
            {incident.status === 'REJECTED' && (
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="flex items-center text-red-800 mb-2">
                  <XCircle className="mr-2 h-4 w-4" />
                  <span className="font-medium">Rechazado</span>
                  {incident.approvedBy && (
                    <span className="ml-2">por {incident.approvedBy}</span>
                  )}
                </div>
                {incident.rejectionReason && (
                  <p className="text-sm text-red-700">
                    <span className="font-medium">Motivo:</span> {incident.rejectionReason}
                  </p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(incident)}
                  disabled={incident.status === 'APPROVED'}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(incident.id)}
                  disabled={incident.status === 'APPROVED'}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>

              {/* Status Update Actions */}
              {incident.status === 'PENDING' && (
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleStatusUpdate(incident, 'APPROVED', 'HR Manager')}
                    disabled={updatingIncident === incident.id}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Aprobar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const reason = prompt('Motivo del rechazo:')
                      if (reason) {
                        setRejectionReason(reason)
                        handleStatusUpdate(incident, 'REJECTED', 'HR Manager')
                      }
                    }}
                    disabled={updatingIncident === incident.id}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Rechazar
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

