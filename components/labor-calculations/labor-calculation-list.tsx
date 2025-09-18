'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Calendar, 
  DollarSign,
  Download,
  Gift,
  Umbrella,
  PiggyBank,
  TrendingUp
} from 'lucide-react'

interface Employee {
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
  employee: Employee
  createdAt: string
  updatedAt: string
}

interface LaborCalculationListProps {
  calculations: LaborCalculation[]
  year: number
  onRefresh: () => void
}

export function LaborCalculationList({ calculations, year, onRefresh }: LaborCalculationListProps) {
  const exportToCSV = () => {
    const headers = [
      'ID Empleado',
      'Nombre',
      'Departamento',
      'Puesto',
      'Fecha Ingreso',
      'Salario Diario',
      'Salario Mensual',
      'Días Aguinaldo',
      'Monto Aguinaldo',
      'Días Vacaciones',
      'Monto Vacaciones',
      'Prima Vacacional',
      'Fondo de Ahorro',
      'IMSS Empleado',
      'IMSS Patrón',
      'INFONAVIT'
    ]

    const csvContent = [
      headers.join(','),
      ...calculations.map(calc => [
        calc.employee.employeeId,
        `"${calc.employee.name}"`,
        `"${calc.employee.department?.name || ''}"`,
        `"${calc.employee.position?.title || ''}"`,
        new Date(calc.employee.hireDate).toLocaleDateString('es-MX'),
        calc.employee.dailySalary,
        calc.employee.monthlySalary || calc.employee.dailySalary * 30,
        calc.aguinaldoDays,
        calc.aguinaldoAmount,
        calc.vacationDays,
        calc.vacationAmount,
        calc.vacationBonus,
        calc.savingsFundAmount,
        calc.imssEmployee,
        calc.imssEmployer,
        calc.infonavit
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `calculos_laborales_${year}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const calculateYearsOfService = (hireDate: string, year: number) => {
    const hire = new Date(hireDate)
    const endOfYear = new Date(year, 11, 31)
    return Math.floor((endOfYear.getTime() - hire.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  }

  if (calculations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay cálculos para {year}</h3>
          <p className="text-gray-600 text-center">
            No se encontraron cálculos laborales para el año seleccionado.
            <br />
            Use el botón "Calcular Todo" para generar los cálculos automáticamente.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Cálculos Laborales {year}</h2>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      <div className="grid gap-4">
        {calculations.map((calculation) => {
          const yearsOfService = calculateYearsOfService(calculation.employee.hireDate, year)
          
          return (
            <Card key={calculation.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center">
                      <User className="mr-2 h-5 w-5 text-blue-600" />
                      {calculation.employee.name}
                      <Badge variant="outline" className="ml-2">
                        {calculation.employee.employeeId}
                      </Badge>
                    </CardTitle>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <span>{calculation.employee.department?.name}</span>
                      {calculation.employee.position?.title && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{calculation.employee.position.title}</span>
                        </>
                      )}
                      <span className="mx-2">•</span>
                      <span>{yearsOfService} años de servicio</span>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Salario Diario: ${calculation.employee.dailySalary.toLocaleString('es-MX')}</div>
                    <div>Salario Mensual: ${(calculation.employee.monthlySalary || calculation.employee.dailySalary * 30).toLocaleString('es-MX')}</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Aguinaldo */}
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-green-800 flex items-center">
                        <Gift className="mr-1 h-4 w-4" />
                        Aguinaldo
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-green-700">
                        {calculation.aguinaldoDays} días
                      </div>
                      <div className="font-bold text-green-800">
                        ${calculation.aguinaldoAmount.toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>

                  {/* Vacaciones */}
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-purple-800 flex items-center">
                        <Umbrella className="mr-1 h-4 w-4" />
                        Vacaciones
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-purple-700">
                        {calculation.vacationDays} días
                      </div>
                      <div className="text-purple-700">
                        Pago: ${calculation.vacationAmount.toLocaleString('es-MX')}
                      </div>
                      <div className="font-bold text-purple-800">
                        Prima: ${calculation.vacationBonus.toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>

                  {/* Fondo de Ahorro */}
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-orange-800 flex items-center">
                        <PiggyBank className="mr-1 h-4 w-4" />
                        Fondo de Ahorro
                      </h4>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="text-orange-700">
                        10% equivalente
                      </div>
                      <div className="font-bold text-orange-800">
                        ${calculation.savingsFundAmount.toLocaleString('es-MX')}
                      </div>
                      <div className="text-xs text-orange-600">
                        No descontado
                      </div>
                    </div>
                  </div>

                  {/* Contribuciones */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-blue-800 flex items-center">
                        <TrendingUp className="mr-1 h-4 w-4" />
                        Contribuciones
                      </h4>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="text-blue-700">
                        IMSS Emp: ${calculation.imssEmployee.toLocaleString('es-MX')}
                      </div>
                      <div className="text-blue-700">
                        IMSS Pat: ${calculation.imssEmployer.toLocaleString('es-MX')}
                      </div>
                      <div className="text-blue-700">
                        INFONAVIT: ${calculation.infonavit.toLocaleString('es-MX')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">
                      Calculado el: {new Date(calculation.createdAt).toLocaleDateString('es-MX')}
                    </span>
                    <div className="flex space-x-4">
                      <span className="font-medium">
                        Total Beneficios: ${(
                          calculation.aguinaldoAmount + 
                          calculation.vacationAmount + 
                          calculation.vacationBonus + 
                          calculation.savingsFundAmount
                        ).toLocaleString('es-MX')}
                      </span>
                      <span className="font-medium">
                        Total Contribuciones: ${(
                          calculation.imssEmployer + 
                          calculation.infonavit
                        ).toLocaleString('es-MX')}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

