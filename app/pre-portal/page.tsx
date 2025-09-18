'use client'
import { useRouter } from 'next/navigation'

export default function PrePortal() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="bg-white shadow-xl rounded-xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-blue-900 mb-4 text-center">Corporate Portal Access</h1>
        <p className="text-gray-600 mb-8 text-center">Please select the type of access you would like to use.</p>
        <div className="flex flex-col gap-6">
          <button
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
            onClick={() => router.push('/employee-portal')}
          >
            Employee Portal
          </button>
          <button
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
            onClick={() => router.push('/hr-payroll-selection')}
          >
            HR / Payroll Portal
          </button>
        </div>
      </div>
      <footer className="mt-10 text-xs text-gray-400 text-center">
        © {new Date().getFullYear()} Corporate System. All rights reserved.
      </footer>
    </div>
  )
}
