'use client'

import { useState } from 'react'
import { Copy, ExternalLink, Shield, Zap, Wallet, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface SmartWalletOverviewProps {
  smartWalletAddress: string | null
  eoaAddress: string | null
  smartWalletBalance: string | null
  eoaBalance: string | null
  isAAReady: boolean
  currentChain: string
}

export function SmartWalletOverview({
  smartWalletAddress,
  eoaAddress,
  smartWalletBalance,
  eoaBalance,
  isAAReady,
  currentChain
}: SmartWalletOverviewProps) {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)

  const copyToClipboard = async (address: string, type: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(type)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatBalance = (balance: string | null) => {
    if (!balance || balance === '0') return '0.0000'
    return parseFloat(balance).toFixed(4)
  }

  const getChainInfo = (chain: string) => {
    const chains = {
      sepolia: { name: 'Sepolia Testnet', icon: '🔧', color: 'bg-blue-100 text-blue-800' },
      polygon: { name: 'Polygon', icon: '🟣', color: 'bg-purple-100 text-purple-800' },
      mainnet: { name: 'Ethereum Mainnet', icon: '💎', color: 'bg-emerald-100 text-emerald-800' }
    }
    return chains[chain as keyof typeof chains] || { name: chain, icon: '⚡', color: 'bg-gray-100 text-gray-800' }
  }

  const chainInfo = getChainInfo(currentChain)

  return (
    <div className="space-y-6">
      {/* Main Smart Wallet Card */}
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -translate-y-16 translate-x-16 opacity-50" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-100 rounded-full translate-y-12 -translate-x-12 opacity-50" />
        
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900">Smart Wallet</CardTitle>
                <CardDescription className="text-gray-600">
                  {isAAReady ? 'Account Abstraction Active' : 'EOA Backup Mode'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={chainInfo.color}>
                <span className="mr-1">{chainInfo.icon}</span>
                {chainInfo.name}
              </Badge>
              <Badge className={isAAReady ? 'bg-emerald-100 text-emerald-800' : 'bg-orange-100 text-orange-800'}>
                {isAAReady ? (
                  <>
                    <Zap className="w-3 h-3 mr-1" />
                    Gasless
                  </>
                ) : (
                  <>
                    <Shield className="w-3 h-3 mr-1" />
                    Secured
                  </>
                )}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative space-y-6">
          {/* Smart Wallet Address */}
          {smartWalletAddress && (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Smart Contract Address</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {formatAddress(smartWalletAddress)}
                  </p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Balance: {formatBalance(smartWalletBalance)} ETH
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(smartWalletAddress, 'smart')}
                    className="h-9 w-9 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {copiedAddress === 'smart' && (
                <p className="text-xs text-emerald-600 mt-2 animate-fade-in">✓ Copied to clipboard</p>
              )}
            </div>
          )}

          {/* EOA Address */}
          {eoaAddress && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Backup EOA Address</p>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {formatAddress(eoaAddress)}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    Balance: {formatBalance(eoaBalance)} ETH
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(eoaAddress, 'eoa')}
                    className="h-9 w-9 p-0"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {copiedAddress === 'eoa' && (
                <p className="text-xs text-blue-600 mt-2 animate-fade-in">✓ Copied to clipboard</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-900">
                  {isAAReady ? '∞' : '0'}
                </p>
                <p className="text-sm text-emerald-700">Gasless Transactions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-900">100%</p>
                <p className="text-sm text-blue-700">Security Score</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-900">~2s</p>
                <p className="text-sm text-purple-700">Avg. Speed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}