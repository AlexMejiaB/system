import { SavingFundsReport } from "@/components/reports/saving-funds-report"

export default function SavingFundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Saving Funds Report</h1>
      </div>
      <SavingFundsReport />
    </div>
  )
}
