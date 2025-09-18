'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, Save, X, AlertCircle, User } from 'lucide-react'

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
}

interface LaborCalculationFormProps {
  year: number
  onSuccess: (calculation: LaborCalculation) => void
  onCancel: () => void
}

export function LaborCalculationForm({ year, onSuccess, onCancel }: LaborCalculationFormProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [calculating, setCalculating] = useState(false)

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

  const handleCalculate = async () => {
    if (!selectedEmployeeId) {
      alert('Por favor seleccione un empleado')
      return
    }

    setCalculating(true)

    try {
      const response = await fetch('/api/labor-calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: selectedEmployeeId,
          year: year,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        onSuccess(result)
      } else {
        const error = await response.json()
        console.error('Error calculating:', error)
        alert('Error al calcular: ' + (error.error || 'Error desconocido'))
      }
    } catch (error) {
      console.error('Error calculating:', error)
      alert('Error al calcular')
    } finally {
      setCalculating(false)
    }
  }

  const selectedEmployee = employees.find(emp => emp.id === selectedEmployeeId)

  // Calculate preview values
  const getPreviewCalculations = (employee: Employee) => {
    const hireDate = new Date(employee.hireDate)
    const currentDate = new Date(year, 11, 31)
    const yearsOfService = Math.floor((currentDate.getTime() - hireDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000))

    // Vacation days calculation based on Mexican Labor Law
    let vacationDays = 6 // Default for first year
    if (yearsOfService === 1) vacationDays = 6
    else if (yearsOfService === 2) vacationDays = 8
    else if (yearsOfService === 3) vacationDays = 10
    else if (yearsOfService === 4) vacationDays = 12
    else if (yearsOfService >= 5 && yearsOfService <= 9) vacationDays = 14
    else if (yearsOfService >= 10 && yearsOfService <= 14) vacationDays = 16
    else if (yearsOfService >= 15 && yearsOfService <= 19) vacationDays = 18
    else if (yearsOfService >= 20 && yearsOfService <= 24) vacationDays = 20
    else if (yearsOfService >= 25 && yearsOfService <= 29) vacationDays = 22
    else vacationDays = 22 + Math.floor((yearsOfService - 25) / 5) * 2

    const monthlySalary = employee.monthlySalary || (employee.dailySalary * 30)
    const dailySalary = employee.dailySalary

    const aguinaldoAmount = dailySalary * 15 // Minimum 15 days
    const vacationAmount = dailySalary * vacationDays
    const vacationBonus = vacationAmount * 0.25 // 25% vacation bonus
    const savingsFundAmount = monthlySalary * 0.10 // 10% equivalent
    const imssEmployee = monthlySalary * 0.025 // 2.5%
    const imssEmployer = monthlySalary * 0.105 // 10.5%
    const infonavit = monthlySalary * 0.05 // 5%

    return {
      yearsOfService,
      vacationDays,
      aguinaldoAmount,
      vacationAmount,
      vacationBonus,
      savingsFundAmount,
      imssEmployee,
      imssEmployer,
      infonavit,
    }
  }

  const preview = selectedEmployee ? getPreviewCalculations(selectedEmployee) : null

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5" />
          Nuevo Cálculo Laboral - {year}
        </CardTitle>
        <CardDescription>
          Calcular aguinaldo, vacaciones, fondo de ahorro y contribuciones según la Ley Federal del Trabajo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Employee Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Empleado *</label>
          <Select
            value={selectedEmployeeId.toString()}
            onValueChange={(value) => setSelectedEmployeeId(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar empleado" />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name} ({employee.employeeId}) - ${employee.dailySalary}/día
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Employee Information */}
        {selectedEmployee && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
              <User className="mr-2 h-4 w-4" />
              Información del Empleado
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Nombre:</span> {selectedEmployee.name}
              </div>
              <div>
                <span className="font-medium">ID:</span> {selectedEmployee.employeeId}
              </div>
              <div>
                <span className="font-medium">Fecha de Ingreso:</span>{' '}
                {new Date(selectedEmployee.hireDate).toLocaleDateString('es-MX')}
              </div>
              <div>
                <span className="font-medium">Años de Servicio:</span> {preview?.yearsOfService} años
              </div>
              <div>
                <span className="font-medium">Salario Diario:</span> ${selectedEmployee.dailySalary.toLocaleString('es-MX')}
              </div>
              <div>
                <span className="font-medium">Salario Mensual:</span>{' '}
                ${(selectedEmployee.monthlySalary || selectedEmployee.dailySalary * 30).toLocaleString('es-MX')}
              </div>
              <div>
                <span className="font-medium">Departamento:</span> {selectedEmployee.department?.name || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Puesto:</span> {selectedEmployee.position?.title || 'N/A'}
              </div>
            </div>
          </div>
        )}

        {/* Calculation Preview */}
        {preview && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Vista Previa de Cálculos</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Aguinaldo */}
              <div className="p-4 bg-green-50 rounded-lg">
                <h5 className="font-medium text-green-800 mb-2">Aguinaldo</h5>
                <div className="space-y-1 text-sm">
                  <div>Días: 15 (mínimo legal)</div>
                  <div className="font-medium text-lg">
                    Monto: ${preview.aguinaldoAmount.toLocaleString('es-MX')}
                  </div>
                </div>
              </div>

              {/* Vacaciones */}
              <div className="p-4 bg-purple-50 rounded-lg">
                <h5 className="font-medium text-purple-800 mb-2">Vacaciones</h5>
                <div className="space-y-1 text-sm">
                  <div>Días: {preview.vacationDays}</div>
                  <div>Pago: ${preview.vacationAmount.toLocaleString('es-MX')}</div>
                  <div className="font-medium text-lg">
                    Prima (25%): ${preview.vacationBonus.toLocaleString('es-MX')}
                  </div>
                </div>
              </div>

              {/* Fondo de Ahorro */}
              <div className="p-4 bg-orange-50 rounded-lg">
                <h5 className="font-medium text-orange-800 mb-2">Fondo de Ahorro</h5>
                <div className="space-y-1 text-sm">
                  <div>Porcentaje: 10% (equivalente)</div>
                  <div className="font-medium text-lg">
                    Monto: ${preview.savingsFundAmount.toLocaleString('es-MX')}
                  </div>
                  <div className="text-xs text-orange-700">*No se descuenta del salario</div>
                </div>
              </div>

              {/* Contribuciones */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-medium text-blue-800 mb-2">Contribuciones</h5>
                <div className="space-y-1 text-sm">
                  <div>IMSS Empleado (2.5%): ${preview.imssEmployee.toLocaleString('es-MX')}</div>
                  <div>IMSS Patrón (10.5%): ${preview.imssEmployer.toLocaleString('es-MX')}</div>
                  <div>INFONAVIT (5%): ${preview.infonavit.toLocaleString('es-MX')}</div>
                </div>
              </div>
            </div>

            {/* Legal Information */}
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                Información Legal
              </h5>
              <div className="text-sm text-yellow-700 space-y-1">
                <div>• Aguinaldo: Artículo 87 de la Ley Federal del Trabajo (mínimo 15 días)</div>
                <div>• Vacaciones: Artículo 76 LFT (según años de servicio)</div>
                <div>• Prima Vacacional: Artículo 80 LFT (25% sobre salario de vacaciones)</div>
                <div>• Contribuciones IMSS e INFONAVIT según tarifas vigentes 2024</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={handleCalculate} 
            disabled={!selectedEmployeeId || calculating}
          >
            <Calculator className="mr-2 h-4 w-4" />
            {calculating ? 'Calculando...' : 'Calcular y Guardar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

