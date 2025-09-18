'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  X,
  Save
} from 'lucide-react'

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

interface ReportGeneratorProps {
  onSuccess: (report: Report) => void
  onCancel: () => void
}

const reportTypes = [
  { value: 'PAYROLL', label: 'Nómina', icon: DollarSign },
  { value: 'ATTENDANCE', label: 'Asistencia', icon: Clock },
  { value: 'LABOR_CALCULATIONS', label: 'Cálculos Laborales', icon: BarChart3 },
  { value: 'INCIDENTS', label: 'Incidencias', icon: AlertCircle },
  { value: 'COMPREHENSIVE', label: 'Integral', icon: FileText },
]

const reportPeriods = [
  { value: 'WEEKLY', label: 'Semanal', weeks: 1 },
  { value: 'BIWEEKLY', label: 'Quincenal', weeks: 2 },
  { value: 'MONTHLY', label: 'Mensual', weeks: 4 },
  { value: 'QUARTERLY', label: 'Trimestral', weeks: 13 },
  { value: 'ANNUAL', label: 'Anual', weeks: 52 },
]

export function ReportGenerator({ onSuccess, onCancel }: ReportGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [generatedReport, setGeneratedReport] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    period: '',
    startWeek: 1,
    endWeek: 1,
    year: new Date().getFullYear(),
    generatedBy: 'Sistema',
  })

  const handlePeriodChange = (period: string) => {
    const periodInfo = reportPeriods.find(p => p.value === period)
    if (periodInfo) {
      setFormData({
        ...formData,
        period,
        endWeek: Math.min(formData.startWeek + periodInfo.weeks - 1, 52)
      })
    }
  }

  const handleStartWeekChange = (startWeek: number) => {
    const periodInfo = reportPeriods.find(p => p.value === formData.period)
    const weeks = periodInfo?.weeks || 1
    
    setFormData({
      ...formData,
      startWeek,
      endWeek: Math.min(startWeek + weeks - 1, 52)
    })
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Por favor ingrese un nombre para el reporte')
      return false
    }
    if (!formData.type) {
      alert('Por favor seleccione el tipo de reporte')
      return false
    }
    if (!formData.period) {
      alert('Por favor seleccione el período del reporte')
      return false
    }
    if (formData.startWeek < 1 || formData.startWeek > 52) {
      alert('La semana de inicio debe estar entre 1 y 52')
      return false
    }
    if (formData.endWeek < formData.startWeek || formData.endWeek > 52) {
      alert('La semana de fin debe ser mayor o igual a la semana de inicio y no mayor a 52')
      return false
    }
    return true
  }

  const handleGenerate = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const result = await response.json()
        setGeneratedReport(result)
        onSuccess(result.report)
      } else {
        const error = await response.json()
        alert('Error al generar reporte: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error al generar reporte')
    } finally {
      setLoading(false)
    }
  }

  const downloadCSV = () => {
    if (!generatedReport?.csvContent) return

    const blob = new Blob([generatedReport.csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${formData.name.replace(/\s+/g, '_')}_${formData.year}_S${formData.startWeek}-${formData.endWeek}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getWeekDateRange = (year: number, week: number) => {
    const startDate = new Date(year, 0, 1 + (week - 1) * 7)
    const dayOfWeek = startDate.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    startDate.setDate(startDate.getDate() + mondayOffset)
    
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 6)
    
    return {
      start: startDate.toLocaleDateString('es-MX'),
      end: endDate.toLocaleDateString('es-MX')
    }
  }

  const startRange = getWeekDateRange(formData.year, formData.startWeek)
  const endRange = getWeekDateRange(formData.year, formData.endWeek)

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Generar Nuevo Reporte
        </CardTitle>
        <CardDescription>
          Configure los parámetros del reporte que desea generar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!generatedReport ? (
          <>
            {/* Report Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del Reporte *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Reporte Nómina Enero 2024"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Report Type */}
              <div className="space-y-2">
                <Label>Tipo de Reporte *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes.map((type) => {
                      const Icon = type.icon
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <Icon className="mr-2 h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Report Period */}
              <div className="space-y-2">
                <Label>Período *</Label>
                <Select value={formData.period} onValueChange={handlePeriodChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportPeriods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label} ({period.weeks} semana{period.weeks > 1 ? 's' : ''})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label>Año *</Label>
                <Select 
                  value={formData.year.toString()} 
                  onValueChange={(value) => setFormData({ ...formData, year: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Generated By */}
              <div className="space-y-2">
                <Label>Generado por</Label>
                <Input
                  value={formData.generatedBy}
                  onChange={(e) => setFormData({ ...formData, generatedBy: e.target.value })}
                  placeholder="Nombre del usuario"
                />
              </div>
            </div>

            {/* Week Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Semana de Inicio (1-52) *</Label>
                <Input
                  type="number"
                  min="1"
                  max="52"
                  value={formData.startWeek}
                  onChange={(e) => handleStartWeekChange(parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-gray-600">
                  {startRange.start} - {startRange.end}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Semana de Fin (1-52) *</Label>
                <Input
                  type="number"
                  min={formData.startWeek}
                  max="52"
                  value={formData.endWeek}
                  onChange={(e) => setFormData({ ...formData, endWeek: parseInt(e.target.value) || formData.startWeek })}
                />
                <p className="text-xs text-gray-600">
                  {endRange.start} - {endRange.end}
                </p>
              </div>
            </div>

            {/* Period Summary */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Resumen del Período</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Período: {reportPeriods.find(p => p.value === formData.period)?.label || 'No seleccionado'}</div>
                <div>Semanas: {formData.startWeek} - {formData.endWeek} ({formData.endWeek - formData.startWeek + 1} semanas)</div>
                <div>Fechas: {startRange.start} - {endRange.end}</div>
                <div>Año: {formData.year}</div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
              <Button onClick={handleGenerate} disabled={loading}>
                <FileText className="mr-2 h-4 w-4" />
                {loading ? 'Generando...' : 'Generar Reporte'}
              </Button>
            </div>
          </>
        ) : (
          /* Report Generated */
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">¡Reporte Generado Exitosamente!</h3>
              <p className="text-gray-600">
                El reporte "{formData.name}" ha sido generado y está listo para descargar.
              </p>
            </div>

            {/* Report Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Resumen del Reporte</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Tipo:</span> {reportTypes.find(t => t.value === formData.type)?.label}
                </div>
                <div>
                  <span className="font-medium">Período:</span> {reportPeriods.find(p => p.value === formData.period)?.label}
                </div>
                <div>
                  <span className="font-medium">Semanas:</span> {formData.startWeek} - {formData.endWeek}
                </div>
                <div>
                  <span className="font-medium">Año:</span> {formData.year}
                </div>
                <div>
                  <span className="font-medium">Registros:</span> {generatedReport.summary?.recordCount || 0}
                </div>
                <div>
                  <span className="font-medium">Generado:</span> {new Date().toLocaleString('es-MX')}
                </div>
              </div>
            </div>

            {/* Download Actions */}
            <div className="flex justify-center space-x-4">
              <Button onClick={downloadCSV}>
                <Download className="mr-2 h-4 w-4" />
                Descargar CSV
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

