'use client'
import { useRouter } from 'next/navigation'

export default function HRPayrollSelection() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-800 mb-4 text-center">HR and Payroll Modules</h1>
        <p className="text-gray-600 mb-8 text-center">Select the module you wish to manage.</p>
        <div className="flex flex-col gap-6">
          <button
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => router.push('/dashboard')}
          >
            Payroll Dashboard
          </button>
          <button
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
            onClick={() => router.push('/hr-management')}
          >
            HR Management System
          </button>
        </div>
      </div>
      <footer className="mt-10 text-xs text-gray-400 text-center">
        Access restricted to authorized personnel only.
      </footer>
    </div>
  )
}
