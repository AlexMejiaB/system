import { VacationReport } from "@/components/reports/vacation-report"

export default function VacationPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Vacation Report</h1>
      </div>
      <VacationReport />
    </div>
  )
}
