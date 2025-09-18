'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  DollarSign,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Trash2,
  Eye
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Report {
  id: number
  name: string
  type: string
  period: string
  startWeek: number
  endWeek: number
  year: number
  filePath?: string
  fileUrl?: string
  generatedBy: string
  createdAt: string
  updatedAt: string
}

interface ReportHistoryProps {
  reports: Report[]
  onRefresh: () => void
}

const reportTypeLabels: Record<string, string> = {
  'PAYROLL': 'Nómina',
  'ATTENDANCE': 'Asistencia',
  'LABOR_CALCULATIONS': 'Cálculos Laborales',
  'INCIDENTS': 'Incidencias',
  'COMPREHENSIVE': 'Integral',
}

const reportTypeIcons: Record<string, any> = {
  'PAYROLL': DollarSign,
  'ATTENDANCE': Clock,
  'LABOR_CALCULATIONS': BarChart3,
  'INCIDENTS': AlertCircle,
  'COMPREHENSIVE': FileText,
}

const reportTypeColors: Record<string, string> = {
  'PAYROLL': 'bg-green-100 text-green-800',
  'ATTENDANCE': 'bg-blue-100 text-blue-800',
  'LABOR_CALCULATIONS': 'bg-purple-100 text-purple-800',
  'INCIDENTS': 'bg-orange-100 text-orange-800',
  'COMPREHENSIVE': 'bg-gray-100 text-gray-800',
}

const periodLabels: Record<string, string> = {
  'WEEKLY': 'Semanal',
  'BIWEEKLY': 'Quincenal',
  'MONTHLY': 'Mensual',
  'QUARTERLY': 'Trimestral',
  'ANNUAL': 'Anual',
}

export function ReportHistory({ reports, onRefresh }: ReportHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === 'all' || report.type === typeFilter
    const matchesYear = yearFilter === 'all' || report.year.toString() === yearFilter

    return matchesSearch && matchesType && matchesYear
  })

  const availableYears = [...new Set(reports.map(r => r.year))].sort((a, b) => b - a)

  const handleDelete = async (reportId: number) => {
    if (!confirm('¿Está seguro de que desea eliminar este reporte?')) {
      return
    }

    try {
      const response = await fetch(`/api/reports/${reportId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        onRefresh()
      }
    } catch (error) {
      console.error('Error deleting report:', error)
    }
  }

  const regenerateReport = async (report: Report) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${report.name} (Regenerado)`,
          type: report.type,
          period: report.period,
          startWeek: report.startWeek,
          endWeek: report.endWeek,
          year: report.year,
          generatedBy: 'Sistema (Regenerado)',
        }),
      })

      if (response.ok) {
        const result = await response.json()
        
        // Download the regenerated report
        if (result.csvContent) {
          const blob = new Blob([result.csvContent], { type: 'text/csv;charset=utf-8;' })
          const link = document.createElement('a')
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', `${report.name.replace(/\s+/g, '_')}_regenerado.csv`)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
        
        onRefresh()
      }
    } catch (error) {
      console.error('Error regenerating report:', error)
    }
  }

  const getWeekDateRange = (year: number, startWeek: number, endWeek: number) => {
    const startDate = new Date(year, 0, 1 + (startWeek - 1) * 7)
    const dayOfWeek = startDate.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startDate.setDate(startDate.getDate() + mondayOffset)
    
    const endDate = new Date(year, 0, 1 + endWeek * 7 - 1)
    const endDayOfWeek = endDate.getDay()
    const sundayOffset = endDayOfWeek === 0 ? 0 : 7 - endDayOfWeek
    endDate.setDate(endDate.getDate() + sundayOffset)
    
    return {
      start: startDate.toLocaleDateString('es-MX'),
      end: endDate.toLocaleDateString('es-MX')
    }
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reportes generados</h3>
          <p className="text-gray-600 text-center">
            Aún no se han generado reportes. Use el botón "Generar Reporte" para crear su primer reporte.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Historial de Reportes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nombre o generado por..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Tipos</SelectItem>
                {Object.entries(reportTypeLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const Icon = reportTypeIcons[report.type] || FileText
              const dateRange = getWeekDateRange(report.year, report.startWeek, report.endWeek)
              
              return (
                <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <Icon className="mr-2 h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-gray-900">{report.name}</h4>
                        <Badge className={`ml-2 ${reportTypeColors[report.type]}`}>
                          {reportTypeLabels[report.type]}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 space-x-4">
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          {periodLabels[report.period]}
                        </span>
                        <span>
                          Semanas {report.startWeek}-{report.endWeek}, {report.year}
                        </span>
                        <span>
                          {dateRange.start} - {dateRange.end}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regenerateReport(report)}
                        title="Regenerar y descargar"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(report.id)}
                        title="Eliminar reporte"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      Generado por: {report.generatedBy}
                    </span>
                    <span>
                      {format(new Date(report.createdAt), "PPP 'a las' p", { locale: es })}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredReports.length === 0 && reports.length > 0 && (
            <div className="text-center py-8">
              <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron reportes</h3>
              <p className="text-gray-600">
                No hay reportes que coincidan con los filtros seleccionados.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

