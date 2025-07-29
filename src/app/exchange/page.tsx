'use client'

import { useState } from 'react'
import { TrendingUp, TrendingDown, ArrowLeftRight, RefreshCw, BarChart3, DollarSign, Timer, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, getStablecoinIcon, StablecoinSymbol } from '@/lib/data'

interface ExchangeRate {
  from: string
  to: string
  rate: number
  change24h: number
  volume24h: number
  lastUpdated: string
}

interface MarketData {
  symbol: string
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  circulatingSupply: number
}

const exchangeRates: ExchangeRate[] = [
  {
    from: 'USDC',
    to: 'USDT',
    rate: 0.9998,
    change24h: -0.02,
    volume24h: 45678000,
    lastUpdated: '2024-01-20 14:30:00'
  },
  {
    from: 'USDT',
    to: 'USDC',
    rate: 1.0002,
    change24h: 0.02,
    volume24h: 45678000,
    lastUpdated: '2024-01-20 14:30:00'
  },
  {
    from: 'USD',
    to: 'USDC',
    rate: 1.0001,
    change24h: 0.01,
    volume24h: 123456000,
    lastUpdated: '2024-01-20 14:30:00'
  },
  {
    from: 'USD',
    to: 'USDT',
    rate: 0.9999,
    change24h: -0.01,
    volume24h: 98765000,
    lastUpdated: '2024-01-20 14:30:00'
  }
]

const marketData: MarketData[] = [
  {
    symbol: 'USDC',
    price: 1.0001,
    change24h: 0.01,
    volume24h: 3456789000,
    marketCap: 24567890000,
    circulatingSupply: 24567123456
  },
  {
    symbol: 'USDT',
    price: 0.9999,
    change24h: -0.01,
    volume24h: 5678912000,
    marketCap: 95432187000,
    circulatingSupply: 95433012345
  }
]

export default function ExchangePage() {
  const [fromCurrency, setFromCurrency] = useState<string>('USDC')
  const [toCurrency, setToCurrency] = useState<string>('USDT')
  const [fromAmount, setFromAmount] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  const currentRate = exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency)?.rate || 1
  const toAmount = fromAmount ? (parseFloat(fromAmount) * currentRate).toFixed(6) : ''

  const formatLargeNumber = (num: number) => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toString()
  }

  const refreshRates = async () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000)
  }

  const swapCurrencies = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Exchange
          </h1>
          <p className="text-muted-foreground mt-1">Real-time exchange rates and stablecoin market data</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            onClick={refreshRates}
            disabled={refreshing}
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Rates
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              USDC Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${marketData[0].price.toFixed(4)}</div>
            <div className={`text-sm flex items-center gap-1 ${marketData[0].change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marketData[0].change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(marketData[0].change24h).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              USDT Price
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${marketData[1].price.toFixed(4)}</div>
            <div className={`text-sm flex items-center gap-1 ${marketData[1].change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {marketData[1].change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(marketData[1].change24h).toFixed(2)}%
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" />
              24h Volume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatLargeNumber(marketData.reduce((sum, coin) => sum + coin.volume24h, 0))}</div>
            <p className="text-sm text-muted-foreground">Combined volume</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600" />
              Market Cap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${formatLargeNumber(marketData.reduce((sum, coin) => sum + coin.marketCap, 0))}</div>
            <p className="text-sm text-muted-foreground">Total market cap</p>
          </CardContent>
        </Card>
      </div>

      {/* Exchange Interface */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowLeftRight className="h-5 w-5 text-emerald-600" />
                Exchange Calculator
              </CardTitle>
              <CardDescription>
                Get real-time exchange rates for stablecoins and fiat currencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="calculator">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="calculator">Rate Calculator</TabsTrigger>
                  <TabsTrigger value="markets">Market Data</TabsTrigger>
                </TabsList>

                <TabsContent value="calculator" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">From</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            placeholder="0.00"
                            value={fromAmount}
                            onChange={(e) => setFromAmount(e.target.value)}
                            className="flex-1"
                          />
                          <Select value={fromCurrency} onValueChange={setFromCurrency}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USDC">
                                <div className="flex items-center gap-2">
                                  {getStablecoinIcon('USDC')} USDC
                                </div>
                              </SelectItem>
                              <SelectItem value="USDT">
                                <div className="flex items-center gap-2">
                                  {getStablecoinIcon('USDT')} USDT
                                </div>
                              </SelectItem>
                              <SelectItem value="USD">
                                <div className="flex items-center gap-2">
                                  💵 USD
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">To</label>
                        <div className="flex gap-2">
                          <Input
                            type="text"
                            value={toAmount}
                            readOnly
                            className="flex-1 bg-muted"
                          />
                          <Select value={toCurrency} onValueChange={setToCurrency}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USDC">
                                <div className="flex items-center gap-2">
                                  {getStablecoinIcon('USDC')} USDC
                                </div>
                              </SelectItem>
                              <SelectItem value="USDT">
                                <div className="flex items-center gap-2">
                                  {getStablecoinIcon('USDT')} USDT
                                </div>
                              </SelectItem>
                              <SelectItem value="USD">
                                <div className="flex items-center gap-2">
                                  💵 USD
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={swapCurrencies}
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {currentRate && (
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                        <h4 className="font-semibold text-emerald-700 mb-3">Exchange Rate</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>1 {fromCurrency} =</span>
                            <span className="font-medium">{currentRate.toFixed(6)} {toCurrency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>24h Change:</span>
                            <span className={`font-medium ${currentRate ? (exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency)?.change24h || 0) >= 0 ? 'text-green-600' : 'text-red-600' : ''}`}>
                              {currentRate ? `${(exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency)?.change24h || 0) > 0 ? '+' : ''}${(exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency)?.change24h || 0).toFixed(3)}%` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>24h Volume:</span>
                            <span className="font-medium">
                              {currentRate ? `$${formatLargeNumber(exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency)?.volume24h || 0)}` : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-emerald-200">
                            <span>Last updated:</span>
                            <span>{currentRate ? exchangeRates.find(r => r.from === fromCurrency && r.to === toCurrency)?.lastUpdated : 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {fromAmount && toAmount && (
                      <Button className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
                        <ArrowLeftRight className="h-4 w-4 mr-2" />
                        Exchange {fromAmount} {fromCurrency} for {toAmount} {toCurrency}
                      </Button>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="markets" className="mt-6">
                  <div className="space-y-4">
                    {marketData.map((coin) => (
                      <div key={coin.symbol} className="p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl">{getStablecoinIcon(coin.symbol as StablecoinSymbol)}</div>
                            <div>
                              <h3 className="font-semibold">{coin.symbol}</h3>
                              <p className="text-sm text-muted-foreground">
                                Market Cap: ${formatLargeNumber(coin.marketCap)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-bold">${coin.price.toFixed(4)}</div>
                            <div className={`text-sm flex items-center gap-1 ${coin.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {coin.change24h >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                              {Math.abs(coin.change24h).toFixed(2)}%
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">24h Volume:</span>
                            <div className="font-medium">${formatLargeNumber(coin.volume24h)}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Circulating Supply:</span>
                            <div className="font-medium">{formatLargeNumber(coin.circulatingSupply)} {coin.symbol}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Exchange Rates Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Timer className="h-4 w-4 text-emerald-600" />
                Live Exchange Rates
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {exchangeRates.map((rate, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{rate.from}/{rate.to}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{rate.rate.toFixed(6)}</div>
                    <div className={`text-xs ${rate.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {rate.change24h > 0 ? '+' : ''}{rate.change24h.toFixed(3)}%
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Exchange Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Timer className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Real-time Rates</div>
                  <div className="text-xs text-muted-foreground">Updated every second</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">No Hidden Fees</div>
                  <div className="text-xs text-muted-foreground">Transparent pricing</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Global Markets</div>
                  <div className="text-xs text-muted-foreground">24/7 availability</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Exchange</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm">
                USDC → USDT
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                USDT → USDC
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                USD → USDC
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm">
                USD → USDT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}