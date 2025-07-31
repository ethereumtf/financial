'use client'

import { useState } from 'react'
import { ArrowLeft, TrendingUp, ExternalLink, Copy } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StablecoinBalance, StablecoinTransaction, formatCurrency, getStablecoinIcon } from '@/lib/data'

interface AssetDetailModalProps {
  isOpen: boolean
  onClose: () => void
  asset: StablecoinBalance | null
  transactions: StablecoinTransaction[]
  onDeposit: () => void
  onWithdraw: () => void
}

const getAssetName = (symbol: string) => {
  const names = {
    'USDC': 'USD Coin',
    'USDT': 'Tether USD'
  }
  return names[symbol as keyof typeof names] || symbol
}

const getChainName = (chainId: number) => {
  const chains = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
    56: 'BSC'
  }
  return chains[chainId as keyof typeof chains] || `Chain ${chainId}`
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function AssetDetailModal({ 
  isOpen, 
  onClose, 
  asset, 
  transactions, 
  onDeposit, 
  onWithdraw 
}: AssetDetailModalProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!asset) return null

  // Filter transactions for this specific asset
  const assetTransactions = transactions.filter(tx => 
    tx.stablecoin === asset.symbol && tx.chainId === asset.chainId
  )

  const copyContractAddress = async () => {
    try {
      await navigator.clipboard.writeText(asset.contractAddress)
    } catch (err) {
      console.error('Failed to copy contract address:', err)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="rounded-full w-8 h-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                {getStablecoinIcon(asset.symbol)}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{getAssetName(asset.symbol)}</h2>
                <p className="text-sm text-slate-500">{asset.symbol} • {getChainName(asset.chainId)}</p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">History</TabsTrigger>
            </TabsList>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* Balance Section */}
                <div className="text-center py-6 bg-slate-50 rounded-xl">
                  <p className="text-sm text-slate-500 mb-2">Your Balance</p>
                  <h3 className="text-3xl font-bold text-slate-900 mb-1">
                    {asset.amount.toLocaleString()} {asset.symbol}
                  </h3>
                  <p className="text-lg text-slate-600">
                    {formatCurrency(asset.amount)}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button onClick={onDeposit} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    Deposit
                  </Button>
                  <Button onClick={onWithdraw} variant="outline" className="flex-1">
                    Withdraw
                  </Button>
                </div>

                {/* Asset Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-slate-900">Asset Details</h4>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Network</span>
                      <span className="font-medium">{getChainName(asset.chainId)}</span>
                    </div>
                    
                    {asset.protocol && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Protocol</span>
                        <span className="font-medium">{asset.protocol}</span>
                      </div>
                    )}
                    
                    {asset.apy && asset.isYieldBearing && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Current APY</span>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-emerald-600">{asset.apy}%</span>
                          <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Earning
                          </Badge>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start">
                      <span className="text-sm text-slate-600">Contract</span>
                      <div className="flex items-center gap-2 max-w-48">
                        <code className="text-xs font-mono text-slate-800 break-all">
                          {asset.contractAddress.slice(0, 8)}...{asset.contractAddress.slice(-6)}
                        </code>
                        <Button
                          onClick={copyContractAddress}
                          variant="ghost"
                          size="sm"
                          className="p-1 h-auto"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="mt-0">
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900 mb-4">
                    Transaction History ({assetTransactions.length})
                  </h4>
                  
                  {assetTransactions.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-4xl mb-3">📝</div>
                      <h4 className="font-semibold text-slate-700 mb-1">No transactions yet</h4>
                      <p className="text-sm text-slate-500">
                        Transactions for this asset will appear here
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {assetTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <div>
                            <p className="font-medium text-sm capitalize">
                              {transaction.type}
                            </p>
                            <p className="text-xs text-slate-500">
                              {formatDate(transaction.date)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-medium text-sm ${
                              transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                            </p>
                            <p className="text-xs text-slate-500 capitalize">
                              {transaction.status}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}