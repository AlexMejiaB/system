"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Filter, Search, Calendar, FileBarChart, Calculator } from "lucide-react"
import { DollarSign, TrendingUp, Users, FileText, CreditCard, PieChart, Bell, Settings } from "lucide-react"
import { PayrollChart } from "@/components/payroll-chart"
import { PayStubCard } from "@/components/pay-stub-card"
import { TaxSummary } from "@/components/tax-summary"
import { useState } from "react"

export function PayrollDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const FilterNavbar = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <CardTitle className="text-lg">Filters & Search</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search employees..." className="pl-10" />
          </div>

          {/* Date/Order Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Order by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="salary-high">Salary High-Low</SelectItem>
              <SelectItem value="salary-low">Salary Low-High</SelectItem>
            </SelectContent>
          </Select>

          {/* Plant Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Plant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plants</SelectItem>
              <SelectItem value="chu">CHU Plant</SelectItem>
              <SelectItem value="ssd">SSD Plant</SelectItem>
            </SelectContent>
          </Select>

          {/* Collar Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Collar Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Collars</SelectItem>
              <SelectItem value="blue">Blue Collar</SelectItem>
              <SelectItem value="white">White Collar</SelectItem>
              <SelectItem value="gray">Gray Collar</SelectItem>
            </SelectContent>
          </Select>

          {/* Department Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="engineering">Engineering</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="quality">Quality Control</SelectItem>
            </SelectContent>
          </Select>

          {/* Salary Type Filter */}
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pay Frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="biweekly">Bi-weekly (2 weeks)</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="hourly">Hourly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters Display */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Badge variant="secondary" className="gap-1">
            CHU Plant
            <button className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">×</button>
          </Badge>
          <Badge variant="secondary" className="gap-1">
            Blue Collar
            <button className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5">×</button>
          </Badge>
          <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
            Clear all
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">PayrollPro</h1>
        </div>

        <nav className="space-y-2">
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("dashboard")}
          >
            <PieChart className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          <Button
            variant={activeTab === "paystubs" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("paystubs")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Pay Stubs
          </Button>
          <Button
            variant={activeTab === "taxes" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("taxes")}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Tax Documents
          </Button>

          <div className="space-y-1">
            <Button
              variant={activeTab.startsWith("reports") ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports-overview")}
            >
              <FileBarChart className="w-4 h-4 mr-2" />
              Reports
            </Button>
            <div className="ml-6 space-y-1">
              <Button
                variant={activeTab === "reports-aguinaldo" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveTab("reports-aguinaldo")}
              >
                Aguinaldo
              </Button>
              <Button
                variant={activeTab === "reports-vacation" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveTab("reports-vacation")}
              >
                Vacation
              </Button>
              <Button
                variant={activeTab === "reports-saving-funds" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveTab("reports-saving-funds")}
              >
                Saving Funds
              </Button>
              <Button
                variant={activeTab === "reports-saving-box" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveTab("reports-saving-box")}
              >
                Saving Box
              </Button>
              <Button
                variant={activeTab === "reports-comedor" ? "default" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveTab("reports-comedor")}
              >
                Comedor
              </Button>
            </div>
          </div>

          <Button
            variant={activeTab === "employees" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("employees")}
          >
            <Users className="w-4 h-4 mr-2" />
            Employee Records
          </Button>
          <Button
            variant={activeTab === "settings" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </nav>

        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Calendar</h3>
          </div>
          <Card className="p-3">
            <div className="text-xs text-muted-foreground mb-2">December 2024</div>
            <div className="grid grid-cols-7 gap-1 text-xs">
              <div className="text-center text-muted-foreground">S</div>
              <div className="text-center text-muted-foreground">M</div>
              <div className="text-center text-muted-foreground">T</div>
              <div className="text-center text-muted-foreground">W</div>
              <div className="text-center text-muted-foreground">T</div>
              <div className="text-center text-muted-foreground">F</div>
              <div className="text-center text-muted-foreground">S</div>
              <div className="text-center p-1">1</div>
              <div className="text-center p-1">2</div>
              <div className="text-center p-1">3</div>
              <div className="text-center p-1">4</div>
              <div className="text-center p-1">5</div>
              <div className="text-center p-1">6</div>
              <div className="text-center p-1">7</div>
              <div className="text-center p-1">8</div>
              <div className="text-center p-1">9</div>
              <div className="text-center p-1">10</div>
              <div className="text-center p-1">11</div>
              <div className="text-center p-1">12</div>
              <div className="text-center p-1">13</div>
              <div className="text-center p-1">14</div>
              <div className="text-center p-1 bg-primary text-primary-foreground rounded">15</div>
              <div className="text-center p-1">16</div>
              <div className="text-center p-1">17</div>
              <div className="text-center p-1">18</div>
              <div className="text-center p-1">19</div>
              <div className="text-center p-1">20</div>
              <div className="text-center p-1">21</div>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold text-foreground">Quick Calculator</h3>
          </div>
          <Card className="p-3">
            <div className="space-y-2">
              <Input placeholder="Hours worked" className="text-xs" />
              <Input placeholder="Hourly rate" className="text-xs" />
              <Button size="sm" className="w-full text-xs">
                Calculate
              </Button>
              <div className="text-xs text-muted-foreground text-center">Total: $0.00</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-foreground text-balance">
              {activeTab === "dashboard" && "Payroll Dashboard"}
              {activeTab === "reports-overview" && "Reports Overview"}
              {activeTab === "reports-aguinaldo" && "Aguinaldo Report"}
              {activeTab === "reports-vacation" && "Vacation Report"}
              {activeTab === "reports-saving-funds" && "Saving Funds Report"}
              {activeTab === "reports-saving-box" && "Saving Box Report"}
              {activeTab === "reports-comedor" && "Comedor Report"}
              {activeTab === "paystubs" && "Pay Stubs"}
              {activeTab === "taxes" && "Tax Documents"}
              {activeTab === "employees" && "Employee Records"}
              {activeTab === "settings" && "Settings"}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === "dashboard" && "Manage payroll, view analytics, and access employee records"}
              {activeTab === "reports-overview" && "Generate comprehensive payroll reports and benefits analysis"}
              {activeTab === "reports-aguinaldo" && "Year-end bonus calculations and employee eligibility"}
              {activeTab === "reports-vacation" && "Vacation days tracking and equivalent dollar calculations"}
              {activeTab === "reports-saving-funds" && "Employee savings contributions and fund management"}
              {activeTab === "reports-saving-box" && "Employee savings box program tracking"}
              {activeTab === "reports-comedor" && "Daily meal allowance tracking and calculations"}
              {activeTab === "paystubs" && "View and manage employee pay stubs"}
              {activeTab === "taxes" && "Access tax documents and withholding information"}
              {activeTab === "employees" && "Manage employee information and records"}
              {activeTab === "settings" && "Configure payroll settings and preferences"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
            <Avatar>
              <AvatarImage src="/professional-headshot.png" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Aguinaldo Report Page */}
        {activeTab === "reports-aguinaldo" && (
          <div className="space-y-6">
            <FilterNavbar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Aguinaldo Details</CardTitle>
                  <CardDescription>Year-end bonus calculations by employee</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div>Employee</div>
                      <div>Department</div>
                      <div>Months Worked</div>
                      <div>Aguinaldo Amount</div>
                    </div>
                    {[
                      { name: "Maria Rodriguez", dept: "Engineering", months: 12, amount: 1250 },
                      { name: "Carlos Martinez", dept: "Sales", months: 8, amount: 833 },
                      { name: "Ana Lopez", dept: "Marketing", months: 12, amount: 950 },
                      { name: "Juan Perez", dept: "Operations", months: 6, amount: 500 },
                    ].map((employee, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-muted-foreground">{employee.dept}</div>
                        <div>{employee.months} months</div>
                        <div className="font-semibold text-chart-3">${employee.amount}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Eligible</span>
                    <span className="font-semibold">247 employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Amount</span>
                    <span className="font-semibold text-chart-3">$185,250</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Average</span>
                    <span className="font-semibold">$750</span>
                  </div>
                  <Button className="w-full">Generate Full Report</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Export to Excel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Vacation Report Page */}
        {activeTab === "reports-vacation" && (
          <div className="space-y-6">
            <FilterNavbar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Vacation Tracking</CardTitle>
                  <CardDescription>Days earned, used, and equivalent dollar values</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div>Employee</div>
                      <div>Days Earned</div>
                      <div>Days Used</div>
                      <div>Days Remaining</div>
                      <div>Dollar Value</div>
                    </div>
                    {[
                      { name: "Maria Rodriguez", earned: 20, used: 12, remaining: 8, value: 2200 },
                      { name: "Carlos Martinez", earned: 15, used: 8, remaining: 7, value: 1925 },
                      { name: "Ana Lopez", earned: 18, used: 15, remaining: 3, value: 825 },
                      { name: "Juan Perez", earned: 12, used: 5, remaining: 7, value: 1925 },
                    ].map((employee, i) => (
                      <div key={i} className="grid grid-cols-5 gap-4 text-sm py-2 border-b">
                        <div className="font-medium">{employee.name}</div>
                        <div>{employee.earned}</div>
                        <div>{employee.used}</div>
                        <div className="font-semibold">{employee.remaining}</div>
                        <div className="font-semibold text-chart-1">${employee.value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Vacation Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Days</span>
                    <span className="font-semibold">3,705 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Rate</span>
                    <span className="font-semibold">$275</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Value</span>
                    <span className="font-semibold text-chart-1">$1,018,875</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Used This Year</span>
                    <span className="font-semibold">2,140 days</span>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Saving Funds Report Page */}
        {activeTab === "reports-saving-funds" && (
          <div className="space-y-6">
            <FilterNavbar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Saving Funds Contributions</CardTitle>
                  <CardDescription>Employee savings fund participation and contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div>Employee</div>
                      <div>Monthly Contribution</div>
                      <div>Total Saved</div>
                      <div>Status</div>
                    </div>
                    {[
                      { name: "Maria Rodriguez", monthly: 200, total: 2400, status: "Active" },
                      { name: "Carlos Martinez", monthly: 150, total: 1200, status: "Active" },
                      { name: "Ana Lopez", monthly: 180, total: 2160, status: "Active" },
                      { name: "Juan Perez", monthly: 100, total: 600, status: "Paused" },
                    ].map((employee, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                        <div className="font-medium">{employee.name}</div>
                        <div>${employee.monthly}</div>
                        <div className="font-semibold text-chart-2">${employee.total}</div>
                        <div>
                          <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                            {employee.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Fund Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Contributions</span>
                    <span className="font-semibold text-chart-2">$425,680</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Participants</span>
                    <span className="font-semibold">198 employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Monthly</span>
                    <span className="font-semibold">$180</span>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Saving Box Report Page */}
        {activeTab === "reports-saving-box" && (
          <div className="space-y-6">
            <FilterNavbar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Saving Box Program</CardTitle>
                  <CardDescription>Employee savings box balances and activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div>Employee</div>
                      <div>Current Balance</div>
                      <div>Last Deposit</div>
                      <div>Status</div>
                    </div>
                    {[
                      { name: "Maria Rodriguez", balance: 2150, lastDeposit: "Dec 10", status: "Active" },
                      { name: "Carlos Martinez", balance: 1800, lastDeposit: "Dec 8", status: "Active" },
                      { name: "Ana Lopez", balance: 950, lastDeposit: "Nov 25", status: "Active" },
                      { name: "Juan Perez", balance: 1200, lastDeposit: "Dec 5", status: "Active" },
                    ].map((employee, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                        <div className="font-medium">{employee.name}</div>
                        <div className="font-semibold text-chart-4">${employee.balance}</div>
                        <div>{employee.lastDeposit}</div>
                        <div>
                          <Badge variant="default">{employee.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Box Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Savings</span>
                    <span className="font-semibold text-chart-4">$156,420</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Participants</span>
                    <span className="font-semibold">89 employees</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg. Balance</span>
                    <span className="font-semibold">$1,758</span>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Comedor Report Page */}
        {activeTab === "reports-comedor" && (
          <div className="space-y-6">
            <FilterNavbar />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-xl">Comedor Allowance</CardTitle>
                  <CardDescription>$20 per day meal allowance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 text-sm font-medium text-muted-foreground border-b pb-2">
                      <div>Employee</div>
                      <div>Days This Month</div>
                      <div>Monthly Total</div>
                      <div>YTD Total</div>
                    </div>
                    {[
                      { name: "Maria Rodriguez", days: 22, monthly: 440, ytd: 5280 },
                      { name: "Carlos Martinez", days: 20, monthly: 400, ytd: 3200 },
                      { name: "Ana Lopez", days: 22, monthly: 440, ytd: 5280 },
                      { name: "Juan Perez", days: 18, monthly: 360, ytd: 2160 },
                    ].map((employee, i) => (
                      <div key={i} className="grid grid-cols-4 gap-4 text-sm py-2 border-b">
                        <div className="font-medium">{employee.name}</div>
                        <div>{employee.days} days</div>
                        <div className="font-semibold text-chart-5">${employee.monthly}</div>
                        <div className="font-semibold">${employee.ytd}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Comedor Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Daily Rate</span>
                    <span className="font-semibold">$20.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Eligible Employees</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Monthly Total</span>
                    <span className="font-semibold text-chart-5">$108,680</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Working Days</span>
                    <span className="font-semibold">22 days</span>
                  </div>
                  <Button className="w-full">Generate Report</Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Export Data
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Reports Overview Page */}
        {activeTab === "reports-overview" && (
          <div className="space-y-6">
            <FilterNavbar />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Aguinaldo Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Aguinaldo</CardTitle>
                  <CardDescription>Year-end bonus calculations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Eligible Employees</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Aguinaldo Amount</span>
                      <span className="font-semibold text-chart-3">$185,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Average per Employee</span>
                      <span className="font-semibold">$750</span>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setActiveTab("reports-aguinaldo")}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Vacation Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vacation</CardTitle>
                  <CardDescription>Days and equivalent $ per day worked</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Vacation Days</span>
                      <span className="font-semibold">3,705 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Daily Rate</span>
                      <span className="font-semibold">$275</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Vacation Value</span>
                      <span className="font-semibold text-chart-1">$1,018,875</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Days Used This Year</span>
                      <span className="font-semibold">2,140 days</span>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setActiveTab("reports-vacation")}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Saving Funds Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saving Funds</CardTitle>
                  <CardDescription>Employee savings contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Contributions</span>
                      <span className="font-semibold text-chart-2">$425,680</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Participating Employees</span>
                      <span className="font-semibold">198</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Monthly Contribution</span>
                      <span className="font-semibold">$180</span>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setActiveTab("reports-saving-funds")}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Saving Box Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Saving Box</CardTitle>
                  <CardDescription>Employee savings box program</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Savings</span>
                      <span className="font-semibold text-chart-4">$156,420</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Active Participants</span>
                      <span className="font-semibold">89</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Avg. Balance</span>
                      <span className="font-semibold">$1,758</span>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setActiveTab("reports-saving-box")}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Comedor Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Comedor</CardTitle>
                  <CardDescription>$20 per day meal allowance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Daily Rate</span>
                      <span className="font-semibold">$20.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Eligible Employees</span>
                      <span className="font-semibold">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Monthly Total</span>
                      <span className="font-semibold text-chart-5">$108,680</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Working Days/Month</span>
                      <span className="font-semibold">22 days</span>
                    </div>
                    <Button className="w-full" size="sm" onClick={() => setActiveTab("reports-comedor")}>
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Summary Report */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Benefits Summary</CardTitle>
                  <CardDescription>Complete benefits overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Benefits Value</span>
                      <span className="font-semibold text-primary">$1,894,905</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Vacation</span>
                        <span>53.8%</span>
                      </div>
                      <Progress value={53.8} className="h-1" />
                      <div className="flex justify-between text-xs">
                        <span>Saving Funds</span>
                        <span>22.5%</span>
                      </div>
                      <Progress value={22.5} className="h-1" />
                      <div className="flex justify-between text-xs">
                        <span>Aguinaldo</span>
                        <span>9.8%</span>
                      </div>
                      <Progress value={9.8} className="h-1" />
                    </div>
                    <Button className="w-full" size="sm">
                      Generate Full Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {activeTab === "dashboard" && (
          <>
            <FilterNavbar />
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Payroll</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$847,250</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-chart-3">+12.5%</span> from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">247</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-chart-1">+3</span> new hires this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$68,500</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-chart-2">+2.1%</span> year over year
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tax Withholdings</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">$203,175</div>
                  <p className="text-xs text-muted-foreground">24% of total payroll</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="paystubs">Pay Stubs</TabsTrigger>
                <TabsTrigger value="taxes">Tax Summary</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Payroll Trends</CardTitle>
                      <CardDescription>Monthly payroll expenses over the last 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <PayrollChart />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Recent Activity</CardTitle>
                      <CardDescription>Latest payroll processing updates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-chart-3 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Payroll processed for December 2024</p>
                          <p className="text-xs text-muted-foreground">2 hours ago</p>
                        </div>
                        <Badge variant="secondary">Completed</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-chart-2 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">Tax documents generated</p>
                          <p className="text-xs text-muted-foreground">1 day ago</p>
                        </div>
                        <Badge variant="outline">Generated</Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-chart-1 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">New employee onboarded</p>
                          <p className="text-xs text-muted-foreground">3 days ago</p>
                        </div>
                        <Badge variant="outline">New</Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Payroll Processing Status</CardTitle>
                    <CardDescription>Current month processing progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Employee Data Verification</span>
                        <span className="text-sm text-muted-foreground">100%</span>
                      </div>
                      <Progress value={100} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Salary Calculations</span>
                        <span className="text-sm text-muted-foreground">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />

                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">Tax Withholdings</span>
                        <span className="text-sm text-muted-foreground">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="paystubs">
                <PayStubCard />
              </TabsContent>

              <TabsContent value="taxes">
                <TaxSummary />
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Department Breakdown</CardTitle>
                      <CardDescription>Payroll distribution by department</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Engineering</span>
                          <span className="text-sm text-muted-foreground">$425,000 (50.2%)</span>
                        </div>
                        <Progress value={50.2} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Sales</span>
                          <span className="text-sm text-muted-foreground">$212,500 (25.1%)</span>
                        </div>
                        <Progress value={25.1} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Marketing</span>
                          <span className="text-sm text-muted-foreground">$127,500 (15.1%)</span>
                        </div>
                        <Progress value={15.1} className="h-2" />

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">Operations</span>
                          <span className="text-sm text-muted-foreground">$82,250 (9.7%)</span>
                        </div>
                        <Progress value={9.7} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-foreground">Salary Ranges</CardTitle>
                      <CardDescription>Employee distribution by salary range</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">$100k+</span>
                          <span className="text-sm text-muted-foreground">45 employees</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">$75k - $100k</span>
                          <span className="text-sm text-muted-foreground">89 employees</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">$50k - $75k</span>
                          <span className="text-sm text-muted-foreground">78 employees</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-foreground">$25k - $50k</span>
                          <span className="text-sm text-muted-foreground">35 employees</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Other tab contents with filter navbar */}
        {activeTab === "paystubs" && (
          <>
            <FilterNavbar />
            <PayStubCard />
          </>
        )}

        {activeTab === "taxes" && (
          <>
            <FilterNavbar />
            <TaxSummary />
          </>
        )}

        {activeTab === "employees" && (
          <>
            <FilterNavbar />
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Employee Records</h3>
              <p className="text-muted-foreground">Employee management features coming soon.</p>
            </div>
          </>
        )}

        {activeTab === "settings" && (
          <>
            <FilterNavbar />
            <div className="text-center py-12">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Settings</h3>
              <p className="text-muted-foreground">Configuration options coming soon.</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
