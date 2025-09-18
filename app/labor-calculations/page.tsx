'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Calculator, 
  DollarSign, 
  Calendar, 
  Users,
  Download,
  RefreshCw,
  TrendingUp,
  PiggyBank,
  Gift,
  Umbrella
} from 'lucide-react'
import { LaborCalculationForm } from '@/components/labor-calculations/labor-calculation-form'
import { LaborCalculationList } from '@/components/labor-calculations/labor-calculation-list'

interface LaborCalculation {
  id: number
  employeeId: number
  year: number
  aguinaldoDays: number
  aguinaldoAmount: number
  vacationDays: number
  vacationAmount: number
  vacationBonus: number
  savingsFundAmount: number
  vacationPremium: number
  imssEmployee: number
  imssEmployer: number
  infonavit: number
  employee: {
    id: number
    name: string
    employeeId: string
    hireDate: string
    dailySalary: number
    monthlySalary?: number
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

export default function LaborCalculationsPage() {
  const [calculations, setCalculations] = useState<LaborCalculation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [bulkCalculating, setBulkCalculating] = useState(false)

  useEffect(() => {
    fetchCalculations()
  }, [selectedYear])

  const fetchCalculations = async () => {
    try {
      const response = await fetch(`/api/labor-calculations?year=${selectedYear}`)
      if (response.ok) {
        const data = await response.json()
        setCalculations(data)
      }
    } catch (error) {
      console.error('Error fetching labor calculations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleBulkCalculation = async () => {
    setBulkCalculating(true)
    try {
      const response = await fetch('/api/labor-calculations/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year: selectedYear }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Bulk calculation result:', result)
        await fetchCalculations() // Refresh the list
      }
    } catch (error) {
      console.error('Error performing bulk calculation:', error)
    } finally {
      setBulkCalculating(false)
    }
  }

  const handleCalculationCreated = (newCalculation: LaborCalculation) => {
    setCalculations([newCalculation, ...calculations.filter(c => c.id !== newCalculation.id)])
    setShowForm(false)
  }

  const getCalculationStats = () => {
    const totalAguinaldo = calculations.reduce((sum, calc) => sum + calc.aguinaldoAmount, 0)
    const totalVacations = calculations.reduce((sum, calc) => sum + calc.vacationAmount, 0)
    const totalSavings = calculations.reduce((sum, calc) => sum + calc.savingsFundAmount, 0)
    const totalIMSS = calculations.reduce((sum, calc) => sum + calc.imssEmployer, 0)

    return {
      totalEmployees: calculations.length,
      totalAguinaldo,
      totalVacations,
      totalSavings,
      totalIMSS,
    }
  }

  const stats = getCalculationStats()

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i)

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
          <h1 className="text-3xl font-bold text-gray-900">Cálculos Laborales</h1>
          <p className="text-gray-600 mt-2">
            Aguinaldo, vacaciones, fondo de ahorro y contribuciones según la Ley Federal del Trabajo
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleBulkCalculation} 
            disabled={bulkCalculating}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${bulkCalculating ? 'animate-spin' : ''}`} />
            {bulkCalculating ? 'Calculando...' : 'Calcular Todo'}
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Calculator className="mr-2 h-4 w-4" />
            Nuevo Cálculo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Empleados
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Aguinaldo Total
            </CardTitle>
            <Gift className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalAguinaldo.toLocaleString('es-MX')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Vacaciones Total
            </CardTitle>
            <Umbrella className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalVacations.toLocaleString('es-MX')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Fondo de Ahorro
            </CardTitle>
            <PiggyBank className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalSavings.toLocaleString('es-MX')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              IMSS Patronal
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalIMSS.toLocaleString('es-MX')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mexican Labor Law Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Información Legal - Ley Federal del Trabajo
          </CardTitle>
          <CardDescription>
            Cálculos basados en la legislación laboral mexicana vigente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800 mb-1">Aguinaldo</h4>
              <p className="text-green-700">Mínimo 15 días de salario (Art. 87 LFT)</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800 mb-1">Vacaciones</h4>
              <p className="text-purple-700">Según años de servicio (Art. 76 LFT)</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800 mb-1">Prima Vacacional</h4>
              <p className="text-orange-700">25% sobre salario de vacaciones (Art. 80 LFT)</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-1">Fondo de Ahorro</h4>
              <p className="text-blue-700">10% equivalente (no descontado)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Form */}
      {showForm && (
        <LaborCalculationForm
          year={selectedYear}
          onSuccess={handleCalculationCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Calculations List */}
      <LaborCalculationList
        calculations={calculations}
        year={selectedYear}
        onRefresh={fetchCalculations}
      />
    </div>
  )
}

