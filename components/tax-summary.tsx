import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Download, FileText } from "lucide-react"

export function TaxSummary() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">2024 Tax Summary</CardTitle>
            <CardDescription>Year-to-date tax withholdings and contributions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">Federal Income Tax</span>
                <span className="text-sm text-foreground">$15,300.00</span>
              </div>
              <Progress value={68} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">State Income Tax</span>
                <span className="text-sm text-foreground">$5,100.00</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">Social Security</span>
                <span className="text-sm text-foreground">$6,324.00</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-foreground">Medicare</span>
                <span className="text-sm text-foreground">$1,479.00</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between">
                <span className="font-medium text-foreground">Total Withheld</span>
                <span className="font-bold text-primary">$28,203.00</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Tax Documents</CardTitle>
            <CardDescription>Available tax forms and documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">W-2 Form 2024</p>
                  <p className="text-sm text-muted-foreground">Wage and Tax Statement</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">1099-MISC 2024</p>
                  <p className="text-sm text-muted-foreground">Miscellaneous Income</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Tax Summary Report</p>
                  <p className="text-sm text-muted-foreground">Detailed breakdown</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Tax Planning</CardTitle>
          <CardDescription>Estimated tax liability and planning tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Estimated Annual Income</p>
              <p className="text-2xl font-bold text-foreground">$102,000</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Estimated Tax Liability</p>
              <p className="text-2xl font-bold text-foreground">$24,480</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Refund/Owed</p>
              <p className="text-2xl font-bold text-chart-3">$3,723 Refund</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-foreground mb-2">Tax Optimization Tips</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Consider increasing your 401(k) contribution to reduce taxable income</li>
              <li>• Review your withholding allowances for optimal tax planning</li>
              <li>• Keep track of business expenses for potential deductions</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
