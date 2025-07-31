'use client'

import { useState } from 'react'
import { Wallet, Plus, Send, ArrowUpRight, ArrowDownLeft, Zap, DollarSign, TrendingUp, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { stablecoinPortfolio, formatCurrency, getStablecoinIcon, mockStablecoinTransactions } from '@/lib/data'

export default function WalletPage() {
  const [selectedAddress, setSelectedAddress] = useState<'ethereum' | 'polygon' | 'arbitrum'>('ethereum')
  
  const walletAddresses = {
    ethereum: '0x742d35Cc6634C0532925a3b8D4C7623fd0C0C9f1',
    polygon: '0x8A4B7C17B8F4C4D6Ea9D4A2F1E2F2E8B9D3A5C7E',
    arbitrum: '0x1B2C8D5F4E3A9C2D8F7B1A3E5C9F2A8D4B7E6F1C'
  }

  const chainNames = {
    ethereum: 'Ethereum',
    polygon: 'Polygon',
    arbitrum: 'Arbitrum'
  }

  const totalBalance = stablecoinPortfolio.reduce((sum, coin) => sum + coin.amount, 0)
  const recentTransactions = mockStablecoinTransactions.slice(0, 6)

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Stablecoin Wallet
          </h1>
          <p className="text-muted-foreground mt-1">Manage your USDC and USDT across multiple chains</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Funds
          </Button>
          <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-600" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{formatCurrency(totalBalance)}</div>
            <p className="text-sm text-muted-foreground mt-1">Across all chains</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              Monthly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">+{formatCurrency(234.50)}</div>
            <p className="text-sm text-muted-foreground mt-1">From yield farming</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Active Chains
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3</div>
            <p className="text-sm text-muted-foreground mt-1">Ethereum, Polygon, Arbitrum</p>
          </CardContent>
        </Card>
      </div>

      {/* Wallet Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-emerald-600" />
            Wallet Addresses
          </CardTitle>
          <CardDescription>
            Your stablecoin addresses across different blockchain networks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedAddress} onValueChange={(value) => setSelectedAddress(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
              <TabsTrigger value="polygon">Polygon</TabsTrigger>
              <TabsTrigger value="arbitrum">Arbitrum</TabsTrigger>
            </TabsList>
            
            {Object.entries(walletAddresses).map(([chain, address]) => (
              <TabsContent key={chain} value={chain} className="space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-emerald-700">{chainNames[chain as keyof typeof chainNames]} Address</h3>
                      <p className="text-sm text-emerald-600 font-mono">{address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => copyAddress(address)}
                        className="border-emerald-300 text-emerald-600 hover:bg-emerald-100"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-600 hover:bg-emerald-100">
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Explorer
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Stablecoin Holdings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Stablecoin Holdings
          </CardTitle>
          <CardDescription>
            Your USDC and USDT balances across all supported chains
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stablecoinPortfolio.map((coin, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{getStablecoinIcon(coin.symbol)}</div>
                  <div>
                    <h3 className="font-semibold">{coin.symbol}</h3>
                    <p className="text-sm text-muted-foreground">
                      {coin.protocol && `${coin.protocol} • `}
                      {coin.apy && `${coin.apy}% APY`}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold">{formatCurrency(coin.amount)}</div>
                  {coin.isYieldBearing && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Earning
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest transactions and activities in your wallet
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-emerald-50 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                    {tx.type === 'deposit' && <ArrowDownLeft className="h-4 w-4 text-emerald-600" />}
                    {tx.type === 'withdrawal' && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                    {tx.type === 'yield' && <TrendingUp className="h-4 w-4 text-emerald-600" />}
                    {tx.type === 'swap' && <ArrowUpRight className="h-4 w-4 text-emerald-600" />}
                  </div>
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-muted-foreground">{tx.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-foreground'}`}>
                    {tx.amount > 0 ? '+' : ''}{formatCurrency(tx.amount)}
                  </p>
                  <Badge variant={tx.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}