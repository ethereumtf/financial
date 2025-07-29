import { Send, Download, Plus, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { TransactionHistory } from '@/components/shared/TransactionHistory'
import { formatCurrency } from '@/lib/data'

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Stablecoin Transactions
          </h1>
          <p className="text-muted-foreground mt-1">Complete history of your stablecoin activity</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stablecoin Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4">
              <Send className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold">Send Stablecoins</h3>
              <p className="text-sm text-muted-foreground">Transfer USDC, USDT, DAI</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mr-4">
              <Plus className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold">Add Stablecoins</h3>
              <p className="text-sm text-muted-foreground">Deposit from exchange</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-200">
          <CardContent className="flex items-center p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mr-4">
              <Download className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold">Earn Yield</h3>
              <p className="text-sm text-muted-foreground">Stake for rewards</p>
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