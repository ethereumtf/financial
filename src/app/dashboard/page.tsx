import { ArrowUpRight, Plus, Send, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { mockTransactions, accountBalance, balanceChange, formatCurrency, formatDate, getTransactionIcon } from '@/lib/data'

export default function Dashboard() {
  const recentTransactions = mockTransactions.slice(0, 4)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Exchange
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Total Balance Card */}
        <Card className="lg:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">
              💰
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3 mb-4">
              <div className="text-4xl font-bold">{formatCurrency(accountBalance)}</div>
              <div className={`flex items-center text-sm ${balanceChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                <ArrowUpRight className="h-4 w-4 mr-1" />
                +{formatCurrency(balanceChange.amount)} ({balanceChange.percentage}%)
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Money
              </Button>
              <Button size="sm" variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
              <Button size="sm" variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Exchange
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              Your latest financial activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {getTransactionIcon(transaction.category)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-foreground'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                <Send className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Send Money</h3>
              <p className="text-sm text-muted-foreground">Transfer to friends</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-semibold">Add Funds</h3>
              <p className="text-sm text-muted-foreground">Top up your account</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Exchange</h3>
              <p className="text-sm text-muted-foreground">Currency exchange</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
                📈
              </div>
              <h3 className="font-semibold">Invest</h3>
              <p className="text-sm text-muted-foreground">Grow your wealth</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <CardDescription>
              Your spending and income for this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Income</p>
                <p className="text-2xl font-bold text-green-600">+{formatCurrency(3950.00)}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Expenses</p>
                <p className="text-2xl font-bold">{formatCurrency(1247.53)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Savings Goal</CardTitle>
            <CardDescription>
              Emergency fund progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">73%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-primary h-2 rounded-full" style={{ width: '73%' }}></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{formatCurrency(7300)}</span>
                <span className="text-muted-foreground">{formatCurrency(10000)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}