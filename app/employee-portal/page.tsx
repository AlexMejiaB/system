'use client'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function EmployeePortal() {
  const [attendance, setAttendance] = useState([])
  const [vacationDays, setVacationDays] = useState(0)
  const [savingBox, setSavingBox] = useState(0)
  const [savingFund, setSavingFund] = useState(0)
  const [dailySalary, setDailySalary] = useState(0)
  const [insurancePolicy, setInsurancePolicy] = useState('')
  const [requestType, setRequestType] = useState('VACATION')
  const [requestWithPay, setRequestWithPay] = useState(true)
  const [requestDays, setRequestDays] = useState(1)

  useEffect(() => {
    // Connect to your API to fetch real data here
    // Example: axios.get('/api/employee/me').then(...)
  }, [])

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault()
    // Connect to your API to submit vacation/absence request here
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50 flex flex-col items-center py-10">
      <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-4xl">
        <h2 className="text-2xl font-extrabold text-blue-900 mb-6 text-center">Employee Portal</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Attendance</h3>
            <ul className="bg-gray-100 p-3 rounded-lg text-sm">
              {attendance.length === 0 ? (
                <li className="text-gray-400">No records to display</li>
              ) : (
                attendance.map((a, i) => (
                  <li key={i}>{a.date} - {a.status}</li>
                ))
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Accrued Vacation Days</h3>
            <p className="text-xl font-bold">{vacationDays} days</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Voluntary Savings Box</h3>
            <p className="text-lg font-bold">${savingBox}</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Savings Fund</h3>
            <p className="text-lg font-bold">${savingFund}</p>
            <span className="text-xs text-gray-500">(10% of monthly salary)</span>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Daily Salary</h3>
            <p className="text-lg font-bold">${dailySalary}</p>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-2">Insurance Policy</h3>
            <p className="text-lg font-bold">{insurancePolicy || 'Not assigned'}</p>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="font-semibold text-blue-800 mb-4">Request Vacation or Absence</h3>
          <form onSubmit={handleRequest} className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Request Type</label>
              <select value={requestType} onChange={e => setRequestType(e.target.value)} className="border rounded px-2 py-1">
                <option value="VACATION">Vacation</option>
                <option value="ABSENCE">Absence</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-gray-700">Days</label>
              <input
                type="number"
                min={1}
                max={vacationDays || 1}
                value={requestDays}
                onChange={e => setRequestDays(Number(e.target.value))}
                className="border rounded px-2 py-1"
                placeholder="Days"
              />
            </div>
            <div className="flex items-center gap-2 md:mt-6">
              <input
                type="checkbox"
                checked={requestWithPay}
                onChange={e => setRequestWithPay(e.target.checked)}
                id="withPay"
              />
              <label htmlFor="withPay" className="text-sm text-gray-700">With pay</label>
            </div>
            <button className="px-6 py-2 bg-blue-700 text-white rounded-lg font-semibold shadow hover:bg-blue-900 transition md:ml-4" type="submit">
              Submit Request
            </button>
          </form>
        </div>
      </div>
      <footer className="mt-10 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Employee Portal. Confidential.
      </footer>
    </div>
  )
}
