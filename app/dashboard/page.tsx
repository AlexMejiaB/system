import { PayrollOverview } from "@/components/dashboard/payroll-overview"
import { PayrollStats } from "@/components/dashboard/payroll-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default async function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Payroll Dashboard</h1>
      </div>

      <PayrollStats />
      <PayrollOverview />
      <RecentActivity />
    </div>
  )
}
