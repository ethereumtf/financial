import { ArrowUpDown, TrendingUp, Clock, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function SwapPage() {
  const exchangeRates = [
    { from: 'USD', to: 'EUR', rate: 0.85, change: '+0.12%', trend: 'up' },
    { from: 'USD', to: 'GBP', rate: 0.73, change: '-0.08%', trend: 'down' },
    { from: 'USD', to: 'JPY', rate: 110.25, change: '+0.45%', trend: 'up' },
    { from: 'USD', to: 'CAD', rate: 1.25, change: '+0.23%', trend: 'up' },
    { from: 'USD', to: 'AUD', rate: 1.35, change: '-0.15%', trend: 'down' },
    { from: 'USD', to: 'CHF', rate: 0.92, change: '+0.09%', trend: 'up' },
  ]

  const recentSwaps = [
    { from: 'USD', to: 'EUR', amount: 1000, converted: 850, date: '2024-01-15', rate: 0.85 },
    { from: 'EUR', to: 'USD', amount: 500, converted: 588.24, date: '2024-01-12', rate: 1.18 },
    { from: 'USD', to: 'GBP', amount: 750, converted: 547.50, date: '2024-01-10', rate: 0.73 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Exchange</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Clock className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>
      </div>

      {/* Exchange Form */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Exchange</CardTitle>
          <CardDescription>
            Exchange currencies at competitive rates with real-time updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 border rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">USD</span>
                    <span className="text-sm text-muted-foreground">United States Dollar</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 text-2xl font-bold border rounded-lg bg-background"
                  defaultValue="1000"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  USD
                </div>
              </div>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 p-3 border rounded-lg bg-background">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">EUR</span>
                    <span className="text-sm text-muted-foreground">Euro</span>
                  </div>
                </div>
                <Button size="icon" variant="outline">
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full p-3 text-2xl font-bold border rounded-lg bg-muted"
                  value="850.00"
                  readOnly
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                  EUR
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">1 USD = 0.85 EUR</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Fee</span>
              <span className="font-medium">$2.50 (0.25%)</span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm font-medium">You'll receive</span>
              <span className="font-bold">€850.00</span>
            </div>
          </div>

          <Button className="w-full mt-6" size="lg">
            Exchange Now
          </Button>
        </CardContent>
      </Card>

      {/* Live Exchange Rates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Live Exchange Rates
          </CardTitle>
          <CardDescription>
            Real-time currency rates updated every minute
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exchangeRates.map((rate, index) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{rate.from}/{rate.to}</div>
                  <Badge variant={rate.trend === 'up' ? 'default' : 'secondary'}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${rate.trend === 'down' ? 'rotate-180' : ''}`} />
                    {rate.change}
                  </Badge>
                </div>
                <div className="text-xl font-bold">{rate.rate}</div>
                <div className="text-sm text-muted-foreground">
                  1 {rate.from} = {rate.rate} {rate.to}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Exchanges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Exchanges</CardTitle>
          <CardDescription>
            Your recent currency exchange transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSwaps.map((swap, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowUpDown className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {swap.from} → {swap.to}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rate: 1 {swap.from} = {swap.rate} {swap.to}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {swap.amount} {swap.from} → {swap.converted} {swap.to}
                  </div>
                  <div className="text-sm text-muted-foreground">{swap.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}