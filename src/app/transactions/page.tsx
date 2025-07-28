import { Send, Download, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionHistory } from '@/components/shared/TransactionHistory'
import { formatCurrency } from '@/lib/data'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mr-4">
              <Send className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Send Money</h3>
              <p className="text-sm text-muted-foreground">Transfer to contacts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mr-4">
              <Plus className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold">Request Money</h3>
              <p className="text-sm text-muted-foreground">Request from others</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mr-4">
              <Download className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold">Pay Bills</h3>
              <p className="text-sm text-muted-foreground">Manage payments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(1247.53)}</div>
            <p className="text-sm text-muted-foreground">Total spent</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{formatCurrency(3950.00)}</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(124.75)}</div>
            <p className="text-sm text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Largest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(450.00)}</div>
            <p className="text-sm text-muted-foreground">Food & Dining</p>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <TransactionHistory />
    </div>
  )
}