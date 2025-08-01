'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { PortfolioHeader } from '@/components/wallet/PortfolioHeader'
import { PrimaryActions } from '@/components/wallet/PrimaryActions'
import { AssetList } from '@/components/wallet/AssetList'
import { ActivityHistory } from '@/components/wallet/ActivityHistory'
import { DepositModal } from '@/components/wallet/DepositModal'
import { WithdrawModal } from '@/components/wallet/WithdrawModal'
import { TransactionReceiptModal } from '@/components/wallet/TransactionReceiptModal'
import { useWeb3Auth } from '@/contexts/Web3AuthContext'

export default function WalletPage() {
  const { isConnected, isLoading: web3Loading, login, address, balance, user, sendTransaction } = useWeb3Auth()
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)

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

  const networks = [
    {
      id: 'ethereum',
      name: 'Ethereum Mainnet',
      displayName: 'Ethereum',
      address: address || '',
      minimumDeposit: 10,
      estimatedTime: '2-5 minutes',
      fee: 0.002,
      icon: '🔷'
    },
    {
      id: 'polygon',
      name: 'Polygon',
      displayName: 'Polygon',
      address: address || '',
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

  const totalBalance = mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0) + parseFloat(balance || '0') * 3200 // Approximate ETH to USD

  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true)
      await login()
    } catch (error) {
      console.error('Failed to create wallet:', error)
    } finally {
      setIsCreatingWallet(false)
    }
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

  const handleWithdraw = async (data: any) => {
    try {
      const txHash = await sendTransaction(data.address, data.amount.toString())
      
      // Add transaction to history
      const newTransaction = {
        id: Date.now().toString(),
        type: 'withdrawal' as const,
        description: `Sent ${data.amount} ${mockAssets.find(a => a.id === data.assetId)?.symbol}`,
        amount: -data.amount,
        currency: 'USD',
        date: 'Just now',
        status: 'pending' as const,
        hash: txHash
      }
      
      setSelectedTransaction({
        ...newTransaction,
        asset: mockAssets.find(a => a.id === data.assetId),
        network: networks.find(n => n.id === data.networkId),
        timestamp: new Date().toISOString(),
        confirmations: 0,
        requiredConfirmations: 12,
        toAddress: data.address,
        usdValue: data.amount
      })
      
      setShowReceiptModal(true)
    } catch (error) {
      console.error('Withdrawal failed:', error)
      // Handle error - could show toast notification
    }
  }

  // Wallet initialization screen
  if (!isConnected) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Smart Wallet</h1>
          <p className="text-gray-600 max-w-lg text-lg leading-relaxed">
            Create your Account Abstraction wallet powered by Web3Auth for seamless, secure transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              No gas fees
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Social login
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Enhanced security
            </div>
          </div>
        </div>
        
        {web3Loading || isCreatingWallet ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600 font-medium">
              {isCreatingWallet ? 'Creating your wallet...' : 'Initializing...'}
            </p>
          </div>
        ) : (
          <button
            onClick={handleCreateWallet}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Create Smart Wallet
          </button>
        )}
      </div>
    )
  }

  return (
    <AuthGuard>
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
        networks={networks}
        selectedAsset={mockAssets[0]}
      />

      <WithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        assets={mockAssets}
        networks={networks}
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
    </AuthGuard>
  )
}