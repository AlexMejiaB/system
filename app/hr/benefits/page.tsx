'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, Heart, Users, DollarSign, Calendar } from 'lucide-react'

export default function BenefitsPage() {
  const [plans, setPlans] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('plans')
  const [isCreatePlanDialogOpen, setIsCreatePlanDialogOpen] = useState(false)
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)

  const [newPlan, setNewPlan] = useState({
    name: '',
    description: '',
    benefitType: '',
    provider: '',
    cost: '',
    employeeCost: ''
  })

  const [newEnrollment, setNewEnrollment] = useState({
    employeeId: '',
    benefitPlanId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
    effectiveDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchPlans()
    fetchEnrollments()
    fetchEmployees()
  }, [])

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/benefits?type=plans')
      if (response.ok) {
        const data = await response.json()
        setPlans(data)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/benefits?type=enrollments')
      if (response.ok) {
        const data = await response.json()
        setEnrollments(data)
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees')
      if (response.ok) {
        const data = await response.json()
        setEmployees(data)
      }
    } catch (error) {
      console.error('Error fetching employees:', error)
    }
  }

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'plan', ...newPlan }),
      })

      if (response.ok) {
        const createdPlan = await response.json()
        setPlans([createdPlan, ...plans])
        setIsCreatePlanDialogOpen(false)
        setNewPlan({ name: '', description: '', benefitType: '', provider: '', cost: '', employeeCost: '' })
      }
    } catch (error) {
      console.error('Error creating plan:', error)
    }
  }

  const handleCreateEnrollment = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/benefits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'enrollment', ...newEnrollment }),
      })

      if (response.ok) {
        const createdEnrollment = await response.json()
        setEnrollments([createdEnrollment, ...enrollments])
        setIsEnrollDialogOpen(false)
        setNewEnrollment({
          employeeId: '',
          benefitPlanId: '',
          enrollmentDate: new Date().toISOString().split('T')[0],
          effectiveDate: new Date().toISOString().split('T')[0]
        })
      }
    } catch (error) {
      console.error('Error creating enrollment:', error)
    }
  }

  const getBenefitTypeLabel = (type: string) => {
    const types = {
      HEALTH_INSURANCE: 'Seguro Médico',
      DENTAL_INSURANCE: 'Seguro Dental',
      VISION_INSURANCE: 'Seguro de Visión',
      LIFE_INSURANCE: 'Seguro de Vida',
      RETIREMENT_401K: 'Plan de Retiro 401K',
      FLEXIBLE_SPENDING: 'Cuenta de Gastos Flexibles',
      HEALTH_SAVINGS: 'Cuenta de Ahorros de Salud',
      DISABILITY_INSURANCE: 'Seguro de Discapacidad',
      PAID_TIME_OFF: 'Tiempo Libre Pagado',
      OTHER: 'Otro'
    }
    return types[type as keyof typeof types] || type
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { label: 'Activo', variant: 'success' as const },
      INACTIVE: { label: 'Inactivo', variant: 'secondary' as const },
      PENDING: { label: 'Pendiente', variant: 'default' as const },
      CANCELLED: { label: 'Cancelado', variant: 'destructive' as const }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'secondary' as const }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando beneficios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Beneficios</h1>
          <p className="text-gray-600">Administración de planes de beneficios y inscripciones de empleados</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Planes Activos</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.filter((p: any) => p.isActive).length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscripciones Activas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {enrollments.filter((e: any) => e.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Costo Total Mensual</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${enrollments.reduce((acc: number, e: any) => acc + (e.benefitPlan?.cost || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados Inscritos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(enrollments.filter((e: any) => e.status === 'ACTIVE').map((e: any) => e.employeeId)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="plans">Planes de Beneficios</TabsTrigger>
          <TabsTrigger value="enrollments">Inscripciones</TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Planes de Beneficios</h2>
            <Dialog open={isCreatePlanDialogOpen} onOpenChange={setIsCreatePlanDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nuevo Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Crear Nuevo Plan de Beneficios</DialogTitle>
                  <DialogDescription>
                    Configura un nuevo plan de beneficios para los empleados
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatePlan} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Plan</Label>
                    <Input
                      id="name"
                      value={newPlan.name}
                      onChange={(e) => setNewPlan({...newPlan, name: e.target.value})}
                      placeholder="ej. Seguro Médico Premium"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="benefitType">Tipo de Beneficio</Label>
                    <Select value={newPlan.benefitType} onValueChange={(value) => setNewPlan({...newPlan, benefitType: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HEALTH_INSURANCE">Seguro Médico</SelectItem>
                        <SelectItem value="DENTAL_INSURANCE">Seguro Dental</SelectItem>
                        <SelectItem value="VISION_INSURANCE">Seguro de Visión</SelectItem>
                        <SelectItem value="LIFE_INSURANCE">Seguro de Vida</SelectItem>
                        <SelectItem value="RETIREMENT_401K">Plan de Retiro 401K</SelectItem>
                        <SelectItem value="FLEXIBLE_SPENDING">Cuenta de Gastos Flexibles</SelectItem>
                        <SelectItem value="HEALTH_SAVINGS">Cuenta de Ahorros de Salud</SelectItem>
                        <SelectItem value="DISABILITY_INSURANCE">Seguro de Discapacidad</SelectItem>
                        <SelectItem value="PAID_TIME_OFF">Tiempo Libre Pagado</SelectItem>
                        <SelectItem value="OTHER">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={newPlan.description}
                      onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                      placeholder="Descripción del plan de beneficios"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider">Proveedor</Label>
                      <Input
                        id="provider"
                        value={newPlan.provider}
                        onChange={(e) => setNewPlan({...newPlan, provider: e.target.value})}
                        placeholder="Nombre del proveedor"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cost">Costo Total</Label>
                      <Input
                        id="cost"
                        type="number"
                        step="0.01"
                        value={newPlan.cost}
                        onChange={(e) => setNewPlan({...newPlan, cost: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employeeCost">Costo del Empleado</Label>
                    <Input
                      id="employeeCost"
                      type="number"
                      step="0.01"
                      value={newPlan.employeeCost}
                      onChange={(e) => setNewPlan({...newPlan, employeeCost: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreatePlanDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Crear Plan</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {plans.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay planes de beneficios</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Comienza creando tu primer plan de beneficios para los empleados.
                  </p>
                  <Button onClick={() => setIsCreatePlanDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Primer Plan
                  </Button>
                </CardContent>
              </Card>
            ) : (
              plans.map((plan: any) => (
                <Card key={plan.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                          <Badge variant={plan.isActive ? 'success' : 'secondary'}>
                            {plan.isActive ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>Tipo:</strong> {getBenefitTypeLabel(plan.type)}</p>
                            <p><strong>Proveedor:</strong> {plan.provider || 'N/A'}</p>
                            <p><strong>Inscripciones:</strong> {plan.enrollments?.length || 0}</p>
                          </div>
                          <div>
                            <p><strong>Costo Total:</strong> ${plan.cost?.toLocaleString() || 'N/A'}</p>
                            <p><strong>Costo Empleado:</strong> ${plan.employeeCost?.toLocaleString() || 'N/A'}</p>
                          </div>
                        </div>
                        
                        {plan.description && (
                          <p className="mt-3 text-sm text-gray-600">{plan.description}</p>
                        )}
                        
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">Ver Detalles</Button>
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setNewEnrollment({...newEnrollment, benefitPlanId: plan.id.toString()})
                              setIsEnrollDialogOpen(true)
                            }}
                          >
                            Inscribir Empleado
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Inscripciones de Empleados</h2>
            <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Nueva Inscripción
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Inscribir Empleado en Plan de Beneficios</DialogTitle>
                  <DialogDescription>
                    Inscribe a un empleado en un plan de beneficios disponible
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateEnrollment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Empleado</Label>
                    <Select value={newEnrollment.employeeId} onValueChange={(value) => setNewEnrollment({...newEnrollment, employeeId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar empleado" />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((employee: any) => (
                          <SelectItem key={employee.id} value={employee.id.toString()}>
                            {employee.name} ({employee.employeeId})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="benefitPlanId">Plan de Beneficios</Label>
                    <Select value={newEnrollment.benefitPlanId} onValueChange={(value) => setNewEnrollment({...newEnrollment, benefitPlanId: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {plans.filter((p: any) => p.isActive).map((plan: any) => (
                          <SelectItem key={plan.id} value={plan.id.toString()}>
                            {plan.name} - {getBenefitTypeLabel(plan.type)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="enrollmentDate">Fecha de Inscripción</Label>
                      <Input
                        id="enrollmentDate"
                        type="date"
                        value={newEnrollment.enrollmentDate}
                        onChange={(e) => setNewEnrollment({...newEnrollment, enrollmentDate: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="effectiveDate">Fecha Efectiva</Label>
                      <Input
                        id="effectiveDate"
                        type="date"
                        value={newEnrollment.effectiveDate}
                        onChange={(e) => setNewEnrollment({...newEnrollment, effectiveDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsEnrollDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit">Inscribir</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {enrollments.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inscripciones</h3>
                  <p className="text-gray-600 text-center mb-4">
                    Comienza inscribiendo empleados en los planes de beneficios disponibles.
                  </p>
                  <Button onClick={() => setIsEnrollDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Primera Inscripción
                  </Button>
                </CardContent>
              </Card>
            ) : (
              enrollments.map((enrollment: any) => (
                <Card key={enrollment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {enrollment.employee?.name}
                          </h3>
                          {getStatusBadge(enrollment.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div>
                            <p><strong>ID Empleado:</strong> {enrollment.employee?.employeeId}</p>
                            <p><strong>Departamento:</strong> {enrollment.employee?.department?.name}</p>
                            <p><strong>Plan:</strong> {enrollment.benefitPlan?.name}</p>
                          </div>
                          <div>
                            <p><strong>Tipo:</strong> {getBenefitTypeLabel(enrollment.benefitPlan?.type)}</p>
                            <p><strong>Fecha Inscripción:</strong> {new Date(enrollment.enrollmentDate).toLocaleDateString()}</p>
                            <p><strong>Fecha Efectiva:</strong> {new Date(enrollment.effectiveDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">Ver Detalles</Button>
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                            Cancelar Inscripción
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

