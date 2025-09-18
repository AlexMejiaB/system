'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  FileText,
  XCircle
} from 'lucide-react'
import { IncidentForm } from '@/components/incidents/incident-form'
import { IncidentList } from '@/components/incidents/incident-list'

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
  employee: {
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
  createdAt: string
  updatedAt: string
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingIncident, setEditingIncident] = useState<Incident | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      const response = await fetch('/api/incidents')
      if (response.ok) {
        const data = await response.json()
        setIncidents(data.incidents || data)
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleIncidentCreated = (newIncident: Incident) => {
    setIncidents([newIncident, ...incidents])
    setShowForm(false)
  }

  const handleIncidentUpdated = (updatedIncident: Incident) => {
    setIncidents(incidents.map(incident => 
      incident.id === updatedIncident.id ? updatedIncident : incident
    ))
    setEditingIncident(null)
    setShowForm(false)
  }

  const handleIncidentDeleted = (incidentId: number) => {
    setIncidents(incidents.filter(incident => incident.id !== incidentId))
  }

  const handleEdit = (incident: Incident) => {
    setEditingIncident(incident)
    setShowForm(true)
  }

  const handleAddNew = () => {
    setEditingIncident(null)
    setShowForm(true)
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.reason.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter
    const matchesType = typeFilter === 'all' || incident.incidentType === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusStats = () => {
    const stats = {
      total: incidents.length,
      pending: incidents.filter(i => i.status === 'PENDING').length,
      approved: incidents.filter(i => i.status === 'APPROVED').length,
      rejected: incidents.filter(i => i.status === 'REJECTED').length,
      cancelled: incidents.filter(i => i.status === 'CANCELLED').length,
    }
    return stats
  }

  const stats = getStatusStats()

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Incidencias</h1>
          <p className="text-gray-600 mt-2">
            Administrar permisos, faltas y solicitudes de empleados
          </p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" />
          Nueva Incidencia
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Pendientes
            </CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aprobadas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Rechazadas
            </CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por empleado, ID o motivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="PENDING">Pendiente</SelectItem>
                <SelectItem value="APPROVED">Aprobado</SelectItem>
                <SelectItem value="REJECTED">Rechazado</SelectItem>
                <SelectItem value="CANCELLED">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                <SelectItem value="LEAVE_WITHOUT_PAY">Permiso sin Goce</SelectItem>
                <SelectItem value="MEDICAL_LEAVE">Incapacidad Médica</SelectItem>
                <SelectItem value="PERSONAL_LEAVE">Permiso Personal</SelectItem>
                <SelectItem value="MATERNITY_LEAVE">Licencia de Maternidad</SelectItem>
                <SelectItem value="PATERNITY_LEAVE">Licencia de Paternidad</SelectItem>
                <SelectItem value="VACATION_REQUEST">Solicitud de Vacaciones</SelectItem>
                <SelectItem value="SICK_LEAVE">Permiso por Enfermedad</SelectItem>
                <SelectItem value="EMERGENCY_LEAVE">Permiso de Emergencia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Incident Form */}
      {showForm && (
        <IncidentForm
          incident={editingIncident}
          onSuccess={editingIncident ? handleIncidentUpdated : handleIncidentCreated}
          onCancel={() => {
            setShowForm(false)
            setEditingIncident(null)
          }}
        />
      )}

      {/* Incident List */}
      <IncidentList
        incidents={filteredIncidents}
        onEdit={handleEdit}
        onDelete={handleIncidentDeleted}
        onUpdate={handleIncidentUpdated}
      />
    </div>
  )
}

