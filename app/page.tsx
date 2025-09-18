"use client";

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Clock, Calculator, FileText, Building, UserCheck, AlertTriangle, BarChart3, Download, Plus, MessageSquare, Shield } from 'lucide-react'
import { useSession } from "next-auth/react"

export default function Home() {
  const { data: session } = useSession();
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            IMPRO
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            HR Information System
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive solution for employee management, time tracking, payroll processing, and reporting
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Payroll Dashboard System */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-6 w-6 text-blue-600" />
                Payroll Dashboard System
              </CardTitle>
              <CardDescription>
                Complete payroll management with employee records, positions, applicants, and detailed reporting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-green-600" />
                  Employee Management
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="h-4 w-4 text-purple-600" />
                  Position Management
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserCheck className="h-4 w-4 text-orange-600" />
                  Applicant Tracking
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-red-600" />
                  Advanced Reports
                </div>
              </div>
              <Link href="/dashboard">
                <Button className="w-full">
                  Access Payroll Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Bolt System */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-indigo-600" />
                Bolt Time & Payroll System
              </CardTitle>
              <CardDescription>
                Time tracking, payroll processing, and employee management with authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Time Tracking
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calculator className="h-4 w-4 text-green-600" />
                  Payroll Processing
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  Employee Records
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Reports & Analytics
                </div>
              </div>
              <Link href="/bolt">
                <Button className="w-full" variant="outline">
                  Access Bolt System
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* HR Management System */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-6 w-6 text-purple-600" />
                HR Management System
              </CardTitle>
              <CardDescription>
                Applicant tracking, interview scheduling, and onboarding management with comprehensive workflow automation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-purple-600" />
                  Applicant Tracking
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Interview Scheduling
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <UserCheck className="h-4 w-4 text-green-600" />
                  Onboarding Tasks
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-orange-600" />
                  Document Management
                </div>
              </div>
              <Link href="/hr">
                <Button className="w-full" variant="secondary">
                  Access HR System
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Quick Access Features */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Access</CardTitle>
            <CardDescription>
              Direct links to commonly used features across both systems
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
              <Link href="/dashboard/employees">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Employees</span>
                </Button>
              </Link>
              <Link href="/bolt/time-tracking">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Clock className="h-6 w-6" />
                  <span className="text-sm">Time Tracking</span>
                </Button>
              </Link>
              <Link href="/bolt/payroll">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <Calculator className="h-6 w-6" />
                  <span className="text-sm">Payroll</span>
                </Button>
              </Link>
              <Link href="/dashboard/reports">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <span className="text-sm">Reports</span>
                </Button>
              </Link>
              <Link href="/hr/onboarding">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <UserCheck className="h-6 w-6" />
                  <span className="text-sm">Onboarding</span>
                </Button>
              </Link>
              <Link href="/hr/interviews">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-sm">Interviews</span>
                </Button>
              </Link>
              <Link href="/incidents">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="text-sm">Incidents</span>
                </Button>
              </Link>
              <Link href="/labor-calculations">
                <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2">
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Labor Calc</span>
                </Button>
              </Link>
              {session?.user?.role === "ADMIN" && (
                <Link href="/admin">
                  <Button variant="ghost" className="h-auto p-4 flex flex-col items-center gap-2 border-2 border-red-200 bg-red-50 hover:bg-red-100">
                    <Shield className="h-6 w-6 text-red-600" />
                    <span className="text-sm text-red-600">Admin</span>
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

