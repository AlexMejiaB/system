import { AguinaldoReport } from "@/components/reports/aguinaldo-report"

export default function AguinaldoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Aguinaldo Report</h1>
      </div>
      <AguinaldoReport />
    </div>
  )
}
