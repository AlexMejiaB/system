import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Calendar } from "lucide-react"

export function PayStubCard() {
  const payStubs = [
    {
      period: "December 2024",
      payDate: "2024-12-31",
      grossPay: 8500,
      netPay: 6375,
      status: "Paid",
    },
    {
      period: "November 2024",
      payDate: "2024-11-30",
      grossPay: 8500,
      netPay: 6375,
      status: "Paid",
    },
    {
      period: "October 2024",
      payDate: "2024-10-31",
      grossPay: 8500,
      netPay: 6375,
      status: "Paid",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Current Pay Period</CardTitle>
          <CardDescription>December 1-31, 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Gross Pay</p>
              <p className="text-2xl font-bold text-foreground">$8,500.00</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Deductions</p>
              <p className="text-2xl font-bold text-foreground">$2,125.00</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Net Pay</p>
              <p className="text-2xl font-bold text-primary">$6,375.00</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Earnings</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Salary</span>
                  <span className="text-foreground">$8,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Overtime</span>
                  <span className="text-foreground">$500.00</span>
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Deductions</h4>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Federal Tax</span>
                  <span className="text-foreground">$1,275.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">State Tax</span>
                  <span className="text-foreground">$425.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Social Security</span>
                  <span className="text-foreground">$527.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Medicare</span>
                  <span className="text-foreground">$123.25</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Pay Stub
            </Button>
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              View Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Pay History</CardTitle>
          <CardDescription>Previous pay stubs and payment records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payStubs.map((stub, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-medium text-foreground">{stub.period}</p>
                    <p className="text-sm text-muted-foreground">Pay Date: {stub.payDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium text-foreground">${stub.netPay.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Net Pay</p>
                  </div>
                  <Badge variant="secondary">{stub.status}</Badge>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
