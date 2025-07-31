'use client'

import { useState, useEffect } from 'react'
import { PortfolioHeader } from '@/components/wallet/PortfolioHeader'
import { PrimaryActions } from '@/components/wallet/PrimaryActions'
import { AssetList } from '@/components/wallet/AssetList'
import { ActivityHistory } from '@/components/wallet/ActivityHistory'
import { DepositModal } from '@/components/wallet/DepositModal'
import { WithdrawModal } from '@/components/wallet/WithdrawModal'
import { TransactionReceiptModal } from '@/components/wallet/TransactionReceiptModal'

export default function WalletPage() {
  const [isWalletCreated, setIsWalletCreated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)

  // Mock data for the AA wallet
  const mockAssets = [
    {
      id: 'usdc',
      name: 'USD Coin',
      symbol: 'USDC',
      balance: 1250.50,
      usdValue: 1250.50,
      icon: '💵',
      change24h: 0.01,
      minimumWithdraw: 1
    },
    {
      id: 'usdt',
      name: 'Tether',
      symbol: 'USDT',
      balance: 750.25,
      usdValue: 750.25,
      icon: '💶',
      change24h: -0.02,
      minimumWithdraw: 1
    }
  ]

  const mockNetworks = [
    {
      id: 'ethereum',
      name: 'Ethereum Mainnet',
      displayName: 'Ethereum',
      address: '0x742d35Cc6634C0532925a3b8D4C7623fd0C0C9f2',
      minimumDeposit: 10,
      estimatedTime: '2-5 minutes',
      fee: 0.002,
      icon: '🔷'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      displayName: 'Polygon',
      address: '0x742d35Cc6634C0532925a3b8D4C7623fd0C0C9f2',
      minimumDeposit: 1,
      estimatedTime: '1-2 minutes',
      fee: 0.001,
      icon: '🟣'
    }
  ]

  const mockTransactions = [
    {
      id: '1',
      type: 'deposit' as const,
      description: 'Added money via bank transfer',
      amount: 500,
      currency: 'USD',
      date: '2 hours ago',
      status: 'completed' as const,
      hash: '0x123...abc'
    },
    {
      id: '2',
      type: 'withdrawal' as const,
      description: 'Sent to wallet',
      amount: -150,
      currency: 'USD',
      date: '1 day ago',
      status: 'completed' as const,
      hash: '0x456...def'
    }
  ]

  const totalBalance = mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0)

  useEffect(() => {
    // Simulate wallet initialization
    const timer = setTimeout(() => {
      setIsWalletCreated(true)
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateWallet = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsWalletCreated(true)
      setIsLoading(false)
    }, 2000)
  }

  const handleAssetClick = (asset: any) => {
    console.log('Asset clicked:', asset)
  }

  const handleTransactionClick = (transaction: any) => {
    setSelectedTransaction({
      ...transaction,
      asset: mockAssets[0],
      network: mockNetworks[0],
      timestamp: new Date().toISOString(),
      confirmations: 12,
      requiredConfirmations: 12
    })
    setShowReceiptModal(true)
  }

  const handleWithdraw = (data: any) => {
    console.log('Withdraw data:', data)
  }

  // Wallet initialization screen
  if (!isWalletCreated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-3xl">💳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to Your Smart Wallet</h1>
          <p className="text-gray-600 max-w-md">
            Create your Account Abstraction wallet for seamless transactions without gas fees.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600">Creating your wallet...</p>
          </div>
        ) : (
          <button
            onClick={handleCreateWallet}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Create Smart Wallet
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8 bg-gray-50 min-h-screen -m-6 p-6">
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600 text-lg">Manage your stablecoins with zero fees</p>
        </div>
      </div>

      <PortfolioHeader 
        totalValue={totalBalance} 
        isLoading={isLoading}
      />

      <PrimaryActions
        onDeposit={() => setShowDepositModal(true)}
        onWithdraw={() => setShowWithdrawModal(true)}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Your Stablecoins</h2>
          <div className="text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full font-medium">
            💰 {mockAssets.length} Assets
          </div>
        </div>
        <AssetList 
          assets={mockAssets}
          onAssetClick={handleAssetClick}
        />
      </div>

      <ActivityHistory 
        transactions={mockTransactions}
        onTransactionClick={handleTransactionClick}
      />

      <DepositModal
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
        networks={mockNetworks}
        selectedAsset={mockAssets[0]}
      />

      <WithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        assets={mockAssets}
        networks={mockNetworks}
        onConfirmWithdraw={handleWithdraw}
      />

      {selectedTransaction && (
        <TransactionReceiptModal
          open={showReceiptModal}
          onOpenChange={setShowReceiptModal}
          transaction={selectedTransaction}
        />
      )}
    </div>
  )
}