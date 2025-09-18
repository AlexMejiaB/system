import { ComedorReport } from "@/components/reports/comedor-report"

export default function ComedorPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Comedor Report</h1>
      </div>
      <ComedorReport />
    </div>
  )
}
