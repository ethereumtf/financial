import { ArrowUpRight, Plus, Send, ArrowLeftRight, TrendingUp, Zap, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { 
  stablecoinPortfolio, 
  totalPortfolioValue, 
  portfolioChange, 
  formatCurrency, 
  formatDate, 
  getStablecoinIcon, 
  getTransactionTypeIcon,
  mockStablecoinTransactions,
  yieldPositions,
  calculateTotalYield,
  getWeightedAverageAPY
} from '@/lib/data'

export default function Dashboard() {
  const recentTransactions = mockStablecoinTransactions.slice(0, 4)
  const totalYield = calculateTotalYield()
  const averageAPY = getWeightedAverageAPY()

  return (
    <AuthGuard>
      <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Stablecoin Portfolio</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Yield Farm
          </Button>
          <Button variant="outline" size="sm">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Bridge
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Portfolio Value */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio</CardTitle>
            <div className="h-4 w-4 text-emerald-600">
              💰
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPortfolioValue)}</div>
            <div className={`flex items-center text-sm ${portfolioChange.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              <ArrowUpRight className="h-4 w-4 mr-1" />
              +{formatCurrency(portfolioChange.amount)} ({portfolioChange.percentage}%)
            </div>
          </CardContent>
        </Card>

        {/* Total Yield Earned */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Yield Earned</CardTitle>
            <div className="h-4 w-4 text-green-600">
              📈
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalYield)}</div>
            <p className="text-xs text-muted-foreground">
              All-time earnings
            </p>
          </CardContent>
        </Card>

        {/* Average APY */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weighted APY</CardTitle>
            <div className="h-4 w-4 text-blue-600">
              📊
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{averageAPY.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              Current average
            </p>
          </CardContent>
        </Card>

        {/* Active Positions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <div className="h-4 w-4 text-purple-600">
              ⚡
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{yieldPositions.filter(p => p.isActive).length}</div>
            <p className="text-xs text-muted-foreground">
              Yield positions
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Stablecoin Holdings */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Stablecoin Holdings</CardTitle>
            <CardDescription>
              Your multi-chain stablecoin portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stablecoinPortfolio.map((balance, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getStablecoinIcon(balance.symbol)}
                    </div>
                    <div>
                      <p className="font-medium">{balance.symbol}</p>
                      <p className="text-sm text-muted-foreground">
                        {balance.protocol && `via ${balance.protocol}`} • Chain {balance.chainId}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(balance.amount)}</p>
                    {balance.apy && (
                      <p className="text-sm text-green-600">{balance.apy}% APY</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Deposit
              </Button>
              <Button size="sm" variant="outline">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Swap
              </Button>
              <Button size="sm" variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Optimize Yield
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest stablecoin transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                      {getTransactionTypeIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {getStablecoinIcon(transaction.stablecoin)} {transaction.stablecoin} • {formatDate(transaction.date)}
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

      {/* Stablecoin Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <Plus className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-semibold">Deposit Stablecoins</h3>
              <p className="text-sm text-muted-foreground">Add USDC, USDT</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Yield Farm</h3>
              <p className="text-sm text-muted-foreground">Maximize your APY</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <ArrowLeftRight className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold">Swap Stables</h3>
              <p className="text-sm text-muted-foreground">Best rates guaranteed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Bridge Chains</h3>
              <p className="text-sm text-muted-foreground">Cross-chain transfers</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yield Performance */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Yield Performance</CardTitle>
            <CardDescription>
              Your monthly stablecoin earnings across protocols
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">This Month's Yield</p>
                <p className="text-2xl font-bold text-emerald-600">+{formatCurrency(portfolioChange.amount)}</p>
                <p className="text-sm text-muted-foreground">+{portfolioChange.percentage}% growth</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Stablecoin Spent</p>
                <p className="text-2xl font-bold">{formatCurrency(387.42)}</p>
                <p className="text-sm text-muted-foreground">Via debit card</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <h4 className="font-semibold">Top Performing Protocols</h4>
              {yieldPositions.slice(0, 3).map((position) => (
                <div key={position.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{position.protocol}</span>
                  <span className="font-medium text-green-600">{position.apy}% APY</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Auto-Compound Goal</CardTitle>
            <CardDescription>
              Target: $100K stablecoin portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{((totalPortfolioValue / 100000) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(totalPortfolioValue / 100000) * 100}%` }}></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{formatCurrency(totalPortfolioValue)}</span>
                <span className="text-muted-foreground">{formatCurrency(100000)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                At {averageAPY.toFixed(1)}% APY, you'll reach this goal in ~{Math.ceil((100000 - totalPortfolioValue) / (totalPortfolioValue * averageAPY / 100) * 12)} months
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AuthGuard>
  )
}