import { SavingBoxReport } from "@/components/reports/saving-box-report"

export default function SavingBoxPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Saving Box Report</h1>
      </div>
      <SavingBoxReport />
    </div>
  )
}
