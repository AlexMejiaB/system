'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { Calendar, DollarSign, Users, Clock, Calculator, FileText, CheckCircle } from 'lucide-react'

interface PayrollPeriod {
  id: number
  name: string
  startDate: string
  endDate: string
  payDate: string
  status: 'DRAFT' | 'PROCESSING' | 'PROCESSED' | 'PAID'
  type: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
}

interface PayrollEntry {
  id: number
  employeeId: number
  periodId: number
  regularHours: number
  overtimeHours: number
  grossPay: number
  totalDeductions: number
  netPay: number
  status: string
  employee?: {
    id: number
    name: string
    payrollNumber: number
    department: string
    dailySalary: number
    payrollType: string
  }
}

interface PayrollSummary {
  totalEmployees: number
  totalGrossPay: number
  totalDeductions: number
  totalNetPay: number
  averageHours: number
  overtimeHours: number
}

interface OldPayrollData {
  id: number
  name: string
  payrollNumber: number
  position: { title: string }
  department: string
  dailySalary: number
  payrollType: string
  bankAccount: string
}

export default function PayrollPage() {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null)
  const [payrollEntries, setPayrollEntries] = useState<PayrollEntry[]>([])
  const [payrollSummary, setPayrollSummary] = useState<PayrollSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [calculating, setCalculating] = useState(false)
  const [showCreatePeriod, setShowCreatePeriod] = useState(false)
  
  const [newPeriod, setNewPeriod] = useState({
    name: '',
    startDate: '',
    endDate: '',
    payDate: '',
    type: 'BIWEEKLY' as 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
  })

  useEffect(() => {
    fetchPeriods()
  }, [])

  useEffect(() => {
    if (selectedPeriod) {
      fetchPayrollEntries()
      fetchPayrollSummary()
    }
  }, [selectedPeriod])

  const fetchPeriods = async () => {
    try {
      const response = await axios.get<PayrollPeriod[]>('/api/payroll/periods')
      setPeriods(response.data)
      if (response.data.length > 0 && !selectedPeriod) {
        setSelectedPeriod(response.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching periods:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPayrollEntries = async () => {
    if (!selectedPeriod) return
    
    try {
      const response = await axios.get<PayrollEntry[]>(`/api/payroll/periods/${selectedPeriod}/entries`)
      setPayrollEntries(response.data)
    } catch (error) {
      console.error('Error fetching payroll entries:', error)
    }
  }

  const fetchPayrollSummary = async () => {
    if (!selectedPeriod) return
    
    try {
      const response = await axios.get<PayrollSummary>(`/api/payroll/periods/${selectedPeriod}/summary`)
      setPayrollSummary(response.data)
    } catch (error) {
      console.error('Error fetching payroll summary:', error)
    }
  }

  const handleCalculatePayroll = async () => {
    if (!selectedPeriod) return
    
    setCalculating(true)
    try {
      await axios.post(`/api/payroll/periods/${selectedPeriod}/calculate`)
      await fetchPayrollEntries()
      await fetchPayrollSummary()
    } catch (error) {
      console.error('Error calculating payroll:', error)
    } finally {
      setCalculating(false)
    }
  }

  const handleCreatePeriod = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('/api/payroll/periods', {
        ...newPeriod,
        status: 'DRAFT'
      })
      setShowCreatePeriod(false)
      setNewPeriod({
        name: '',
        startDate: '',
        endDate: '',
        payDate: '',
        type: 'BIWEEKLY'
      })
      fetchPeriods()
    } catch (error) {
      console.error('Error creating period:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'bg-gray-100 text-gray-800'
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800'
      case 'PROCESSED':
        return 'bg-green-100 text-green-800'
      case 'PAID':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const currentPeriod = periods.find(p => p.id === selectedPeriod)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 mt-2">Complete payroll processing and management system</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowCreatePeriod(true)}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            + New Period
          </button>
          {currentPeriod?.status === 'DRAFT' && (
            <button
              onClick={handleCalculatePayroll}
              disabled={calculating}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {calculating ? 'Calculating...' : 'Calculate Payroll'}
            </button>
          )}
        </div>
      </div>

      {/* Period Selection */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Payroll Periods</h2>
            <p className="text-gray-600">Select a payroll period to view details</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPeriod || ''}
              onChange={(e) => setSelectedPeriod(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {periods.map(period => (
                <option key={period.id} value={period.id}>
                  {period.name} ({period.type})
                </option>
              ))}
            </select>
            {currentPeriod && (
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentPeriod.status)}`}>
                {currentPeriod.status}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Create Period Form */}
      {showCreatePeriod && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Payroll Period</h2>
            <button
              onClick={() => setShowCreatePeriod(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕ Close
            </button>
          </div>

          <form onSubmit={handleCreatePeriod} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period Name
                </label>
                <input
                  type="text"
                  value={newPeriod.name}
                  onChange={(e) => setNewPeriod({ ...newPeriod, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., January 2025 - Week 3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Period Type
                </label>
                <select
                  value={newPeriod.type}
                  onChange={(e) => setNewPeriod({ ...newPeriod, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="WEEKLY">Weekly</option>
                  <option value="BIWEEKLY">Bi-weekly</option>
                  <option value="MONTHLY">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newPeriod.startDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={newPeriod.endDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pay Date
                </label>
                <input
                  type="date"
                  value={newPeriod.payDate}
                  onChange={(e) => setNewPeriod({ ...newPeriod, payDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowCreatePeriod(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Period
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Payroll Summary */}
      {payrollSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-3xl font-bold text-gray-900">{payrollSummary.totalEmployees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gross Pay</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${payrollSummary.totalGrossPay.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Deductions</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${payrollSummary.totalDeductions.toLocaleString()}
                </p>
              </div>
              <FileText className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Pay</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${payrollSummary.totalNetPay.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>
      )}

      {/* Payroll Details Table */}
      {currentPeriod && (
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {currentPeriod.name}
                </h2>
                <p className="text-gray-600">
                  {new Date(currentPeriod.startDate).toLocaleDateString()} - {new Date(currentPeriod.endDate).toLocaleDateString()}
                  {' • Pay Date: '}{new Date(currentPeriod.payDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentPeriod.status)}`}>
                  {currentPeriod.status}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gross Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deductions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Net Pay
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payrollEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {entry.employee?.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {entry.employee?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            #{entry.employee?.payrollNumber} • {entry.employee?.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>Regular: {entry.regularHours.toFixed(1)}h</div>
                      {entry.overtimeHours > 0 && (
                        <div className="text-orange-600">OT: {entry.overtimeHours.toFixed(1)}h</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${entry.grossPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${entry.totalDeductions.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${entry.netPay.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payrollEntries.length === 0 && (
            <div className="text-center py-12">
              <Calculator className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payroll entries</h3>
              <p className="mt-1 text-sm text-gray-500">
                {currentPeriod.status === 'DRAFT' 
                  ? 'Click "Calculate Payroll" to generate entries for this period.'
                  : 'No entries found for this period.'
                }
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      {currentPeriod && payrollEntries.length > 0 && (
        <div className="flex justify-end space-x-4">
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Export to CSV
          </button>
          <button className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Generate Pay Stubs
          </button>
          {currentPeriod.status === 'PROCESSING' && (
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Approve Payroll
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// Legacy code for reference - can be removed
function LegacyPayrollPage() {
  const [employees, setEmployees] = useState<OldPayrollData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [payrollType, setPayrollType] = useState('all')

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<OldPayrollData[]>('/api/employees')
        setEmployees(response.data)
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }

    // fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter(emp => 
    payrollType === 'all' || emp.payrollType === payrollType
  )

  const calculatePayroll = (employee: OldPayrollData) => {
    const daysInPeriod = employee.payrollType === 'SEMANAL' ? 7 : 14
    const grossPay = employee.dailySalary * daysInPeriod
    const taxes = grossPay * 0.16 // 16% tax rate
    const socialSecurity = grossPay * 0.0725 // 7.25% social security
    const totalDeductions = taxes + socialSecurity
    const netPay = grossPay - totalDeductions

    return {
      grossPay,
      taxes,
      socialSecurity,
      totalDeductions,
      netPay,
      daysInPeriod
    }
  }

  const totalPayroll = filteredEmployees.reduce((sum, emp) => {
    return sum + calculatePayroll(emp).netPay
  }, 0)
}
