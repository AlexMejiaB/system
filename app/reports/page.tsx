'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  TrendingUp
} from 'lucide-react'
import { ReportGenerator } from '@/components/reports/report-generator'
import { ReportHistory } from '@/components/reports/report-history'

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

const reportTypes = [
  { value: 'PAYROLL', label: 'Nómina', icon: DollarSign, description: 'Reportes de nómina y pagos' },
  { value: 'ATTENDANCE', label: 'Asistencia', icon: Clock, description: 'Registros de entrada y salida' },
  { value: 'LABOR_CALCULATIONS', label: 'Cálculos Laborales', icon: BarChart3, description: 'Aguinaldo, vacaciones, fondo de ahorro' },
  { value: 'INCIDENTS', label: 'Incidencias', icon: AlertCircle, description: 'Permisos, faltas y solicitudes' },
  { value: 'COMPREHENSIVE', label: 'Integral', icon: FileText, description: 'Reporte completo con todos los datos' },
]

const reportPeriods = [
  { value: 'WEEKLY', label: 'Semanal', weeks: 1 },
  { value: 'BIWEEKLY', label: 'Quincenal', weeks: 2 },
  { value: 'MONTHLY', label: 'Mensual', weeks: 4 },
  { value: 'QUARTERLY', label: 'Trimestral', weeks: 13 },
  { value: 'ANNUAL', label: 'Anual', weeks: 52 },
]

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [showGenerator, setShowGenerator] = useState(false)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const data = await response.json()
        setReports(data)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReportGenerated = (newReport: Report) => {
    setReports([newReport, ...reports])
    setShowGenerator(false)
  }

  const getReportStats = () => {
    const currentYear = new Date().getFullYear()
    const currentYearReports = reports.filter(r => r.year === currentYear)
    
    const stats = {
      total: reports.length,
      thisYear: currentYearReports.length,
      payroll: reports.filter(r => r.type === 'PAYROLL').length,
      labor: reports.filter(r => r.type === 'LABOR_CALCULATIONS').length,
      incidents: reports.filter(r => r.type === 'INCIDENTS').length,
      attendance: reports.filter(r => r.type === 'ATTENDANCE').length,
    }
    
    return stats
  }

  const stats = getReportStats()

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">Generación de Reportes</h1>
          <p className="text-gray-600 mt-2">
            Generar y exportar reportes semanales, quincenales y mensuales (semanas 1-52)
          </p>
        </div>
        <Button onClick={() => setShowGenerator(true)}>
          <FileText className="mr-2 h-4 w-4" />
          Generar Reporte
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Reportes
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">
              {stats.thisYear} este año
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Nómina
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.payroll}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Cálculos Laborales
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.labor}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Incidencias
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incidents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5" />
            Tipos de Reportes Disponibles
          </CardTitle>
          <CardDescription>
            Seleccione el tipo de reporte que desea generar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => {
              const Icon = type.icon
              return (
                <div key={type.value} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center mb-2">
                    <Icon className="mr-2 h-5 w-5 text-blue-600" />
                    <h4 className="font-medium">{type.label}</h4>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Period Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Períodos de Reporte (Sistema de 52 Semanas)
          </CardTitle>
          <CardDescription>
            Todos los reportes se basan en un sistema de 52 semanas por año
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {reportPeriods.map((period) => (
              <div key={period.value} className="p-3 bg-blue-50 rounded-lg text-center">
                <h4 className="font-medium text-blue-800">{period.label}</h4>
                <p className="text-sm text-blue-600">{period.weeks} semana(s)</p>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <h4 className="font-medium text-yellow-800 mb-2 flex items-center">
              <AlertCircle className="mr-2 h-4 w-4" />
              Información Importante
            </h4>
            <div className="text-sm text-yellow-700 space-y-1">
              <div>• Semana 1: Primera semana del año (1-7 enero)</div>
              <div>• Semana 52: Última semana del año (25-31 diciembre)</div>
              <div>• Los reportes quincenales cubren 2 semanas consecutivas</div>
              <div>• Los reportes mensuales cubren aproximadamente 4 semanas</div>
              <div>• Puede seleccionar rangos personalizados de semanas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Generator */}
      {showGenerator && (
        <ReportGenerator
          onSuccess={handleReportGenerated}
          onCancel={() => setShowGenerator(false)}
        />
      )}

      {/* Report History */}
      <ReportHistory
        reports={reports}
        onRefresh={fetchReports}
      />
    </div>
  )
}

