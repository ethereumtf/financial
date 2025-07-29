'use client'

import { useState } from 'react'
import { ArrowLeftRight, ArrowDown, Clock, Shield, Zap, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  stablecoinPortfolio,
  bridgeOptions,
  formatCurrency, 
  getStablecoinIcon,
  getChainName,
  StablecoinSymbol,
  ChainId
} from '@/lib/data'

// Mock bridge quotes
const mockBridgeQuotes = [
  {
    protocol: 'Stargate',
    fromChain: 1 as ChainId,
    toChain: 137 as ChainId,
    stablecoin: 'USDC' as StablecoinSymbol,
    inputAmount: '1000',
    outputAmount: '999.40',
    fees: '0.60',
    estimatedTime: '1-3 minutes',
    gasEstimate: '120000'
  },
  {
    protocol: 'Across',
    fromChain: 1 as ChainId,
    toChain: 137 as ChainId,
    stablecoin: 'USDC' as StablecoinSymbol,
    inputAmount: '1000',
    outputAmount: '997.50',
    fees: '2.50',
    estimatedTime: '2-5 minutes',
    gasEstimate: '100000'
  },
  {
    protocol: 'Celer',
    fromChain: 1 as ChainId,
    toChain: 137 as ChainId,
    stablecoin: 'USDC' as StablecoinSymbol,
    inputAmount: '1000',
    outputAmount: '999.00',
    fees: '1.00',
    estimatedTime: '5-10 minutes',
    gasEstimate: '150000'
  }
]

// Recent bridge transactions
const recentTransactions = [
  {
    id: '1',
    protocol: 'Stargate',
    stablecoin: 'USDC' as StablecoinSymbol,
    amount: 2500.00,
    fromChain: 1 as ChainId,
    toChain: 137 as ChainId,
    status: 'completed',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    protocol: 'Across',
    stablecoin: 'USDT' as StablecoinSymbol,
    amount: 1200.00,
    fromChain: 1 as ChainId,
    toChain: 42161 as ChainId,
    status: 'pending',
    timestamp: new Date('2024-01-15T09:15:00Z'),
    txHash: '0x2345...6789'
  },
  {
    id: '3',
    protocol: 'Celer',
    stablecoin: 'USDC' as StablecoinSymbol,
    amount: 800.00,
    fromChain: 137 as ChainId,
    toChain: 1 as ChainId,
    status: 'completed',
    timestamp: new Date('2024-01-14T16:45:00Z'),
    txHash: '0x3456...7890'
  }
]

export default function BridgePage() {
  const [selectedStablecoin, setSelectedStablecoin] = useState<StablecoinSymbol>('USDC')
  const [fromChain, setFromChain] = useState<ChainId>(1)
  const [toChain, setToChain] = useState<ChainId>(137)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')

  const availableBalance = stablecoinPortfolio.find(
    b => b.symbol === selectedStablecoin && b.chainId === fromChain
  )?.amount || 0

  const chainOptions = [
    { id: 1 as ChainId, name: 'Ethereum', icon: '🔷' },
    { id: 137 as ChainId, name: 'Polygon', icon: '🟣' },
    { id: 42161 as ChainId, name: 'Arbitrum', icon: '🔵' },
    { id: 10 as ChainId, name: 'Optimism', icon: '🔴' },
    { id: 56 as ChainId, name: 'BSC', icon: '🟡' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getProtocolIcon = (protocol: string) => {
    const icons: Record<string, string> = {
      'Stargate': '⭐',
      'Across': '🌉',
      'Celer': '⚡'
    }
    return icons[protocol] || '🔗'
  }

  const swapChains = () => {
    const temp = fromChain
    setFromChain(toChain)
    setToChain(temp)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cross-Chain Bridge</h1>
          <p className="text-muted-foreground">Transfer stablecoins seamlessly across different blockchains</p>
        </div>
      </div>

      {/* Bridge Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bridged</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(4500)}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Supported pairs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Bridge Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2min</div>
            <p className="text-xs text-muted-foreground">
              Across all protocols
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.8%</div>
            <p className="text-xs text-muted-foreground">
              Transaction success
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="bridge" className="space-y-4">
        <TabsList>
          <TabsTrigger value="bridge">Bridge Tokens</TabsTrigger>
          <TabsTrigger value="history">Transaction History</TabsTrigger>
        </TabsList>

        {/* Bridge Tab */}
        <TabsContent value="bridge" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Bridge Form */}
            <Card>
              <CardHeader>
                <CardTitle>Bridge Stablecoins</CardTitle>
                <CardDescription>
                  Transfer your stablecoins across different blockchains
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Stablecoin Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Stablecoin</label>
                  <Select value={selectedStablecoin} onValueChange={(value) => setSelectedStablecoin(value as StablecoinSymbol)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['USDC', 'USDT'].map((coin) => (
                        <SelectItem key={coin} value={coin}>
                          <div className="flex items-center space-x-2">
                            <span>{getStablecoinIcon(coin as StablecoinSymbol)}</span>
                            <span>{coin}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* From Chain */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Chain</label>
                  <Select value={fromChain.toString()} onValueChange={(value) => setFromChain(parseInt(value) as ChainId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chainOptions.map((chain) => (
                        <SelectItem key={chain.id} value={chain.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span>{chain.icon}</span>
                            <span>{chain.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Swap Button */}
                <div className="flex justify-center">
                  <Button variant="outline" size="icon" onClick={swapChains}>
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>

                {/* To Chain */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Chain</label>
                  <Select value={toChain.toString()} onValueChange={(value) => setToChain(parseInt(value) as ChainId)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {chainOptions.filter(c => c.id !== fromChain).map((chain) => (
                        <SelectItem key={chain.id} value={chain.id.toString()}>
                          <div className="flex items-center space-x-2">
                            <span>{chain.icon}</span>
                            <span>{chain.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pr-16"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-xs"
                      onClick={() => setAmount(availableBalance.toString())}
                    >
                      MAX
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available: {formatCurrency(availableBalance)} {selectedStablecoin} on {getChainName(fromChain)}
                  </p>
                </div>

                {/* Recipient */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Address (Optional)</label>
                  <Input
                    placeholder="0x... (leave empty to use your address)"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                </div>

                <Button className="w-full" disabled={!amount || parseFloat(amount) > availableBalance}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Get Bridge Quotes
                </Button>
              </CardContent>
            </Card>

            {/* Bridge Quotes */}
            <Card>
              <CardHeader>
                <CardTitle>Bridge Quotes</CardTitle>
                <CardDescription>
                  Compare rates across different bridge protocols
                </CardDescription>
              </CardHeader>
              <CardContent>
                {amount && parseFloat(amount) > 0 ? (
                  <div className="space-y-3">
                    {mockBridgeQuotes.map((quote, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{getProtocolIcon(quote.protocol)}</span>
                            <span className="font-medium">{quote.protocol}</span>
                            {index === 0 && (
                              <Badge className="bg-green-100 text-green-800 text-xs">
                                Best Rate
                              </Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatCurrency(parseFloat(quote.outputAmount) * parseFloat(amount) / 1000)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Fee: {formatCurrency(parseFloat(quote.fees) * parseFloat(amount) / 1000)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{quote.estimatedTime}</span>
                          </div>
                          <div>Gas: ~{parseInt(quote.gasEstimate).toLocaleString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Enter an amount to see bridge quotes
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Bridge Transactions</CardTitle>
              <CardDescription>
                Your cross-chain transaction history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="text-xl">
                        {getProtocolIcon(tx.protocol)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{tx.protocol}</span>
                          <Badge className={getStatusColor(tx.status)}>
                            {tx.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getStablecoinIcon(tx.stablecoin)} {formatCurrency(tx.amount)} {tx.stablecoin}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {getChainName(tx.fromChain)} → {getChainName(tx.toChain)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {tx.timestamp.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {tx.txHash.slice(0, 6)}...{tx.txHash.slice(-4)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}