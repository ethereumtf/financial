'use client'

import { useState } from 'react'
import { PortfolioHeader } from '@/components/wallet/PortfolioHeader'
import { PrimaryActions } from '@/components/wallet/PrimaryActions'
import { AssetList } from '@/components/wallet/AssetList'
import { ActivityHistory } from '@/components/wallet/ActivityHistory'
import { DepositModal } from '@/components/wallet/DepositModal'
import { WithdrawModal } from '@/components/wallet/WithdrawModal'
import { TransactionDetailsModal } from '@/components/wallet/TransactionDetailsModal'
import { AssetDetailModal } from '@/components/wallet/AssetDetailModal'
import { stablecoinPortfolio, mockStablecoinTransactions, StablecoinBalance, StablecoinTransaction } from '@/lib/data'

export default function MyWalletPage() {
  // Modal states
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<StablecoinTransaction | null>(null)
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<StablecoinBalance | null>(null)
  const [isAssetDetailOpen, setIsAssetDetailOpen] = useState(false)

  // Data
  const totalBalance = stablecoinPortfolio.reduce((sum, coin) => sum + coin.amount, 0)
  const recentTransactions = mockStablecoinTransactions.slice(0, 10)

  // Handlers
  const handleDeposit = () => {
    setIsDepositModalOpen(true)
  }

  const handleWithdraw = () => {
    setIsWithdrawModalOpen(true)
  }

  const handleBuy = () => {
    // In a real app, this would open a fiat on-ramp service
    console.log('Opening buy/on-ramp service...')
  }

  const handleAssetClick = (asset: StablecoinBalance) => {
    setSelectedAsset(asset)
    setIsAssetDetailOpen(true)
  }

  const handleTransactionClick = (transaction: StablecoinTransaction) => {
    setSelectedTransaction(transaction)
    setIsTransactionDetailsOpen(true)
  }

  const handleWithdrawSubmit = async (asset: string, amount: number, address: string) => {
    // In a real app, this would call the withdrawal API
    console.log('Withdrawing:', { asset, amount, address })
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Show success notification (in real app, use toast/notification system)
    alert(`Withdrawal of ${amount} initiated successfully!`)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Portfolio Header */}
        <PortfolioHeader totalValue={totalBalance} />

        {/* Primary Actions */}
        <PrimaryActions 
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onBuy={handleBuy}
        />

        {/* Asset List */}
        <AssetList 
          assets={stablecoinPortfolio}
          onAssetClick={handleAssetClick}
        />

        {/* Activity History */}
        <ActivityHistory 
          transactions={recentTransactions}
          onTransactionClick={handleTransactionClick}
        />
      </div>

      {/* Modals */}
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
      />

      <WithdrawModal 
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
        assets={stablecoinPortfolio}
        onWithdraw={handleWithdrawSubmit}
      />

      <TransactionDetailsModal 
        isOpen={isTransactionDetailsOpen}
        onClose={() => setIsTransactionDetailsOpen(false)}
        transaction={selectedTransaction}
      />

      <AssetDetailModal 
        isOpen={isAssetDetailOpen}
        onClose={() => setIsAssetDetailOpen(false)}
        asset={selectedAsset}
        transactions={recentTransactions}
        onDeposit={() => {
          setIsAssetDetailOpen(false)
          setIsDepositModalOpen(true)
        }}
        onWithdraw={() => {
          setIsAssetDetailOpen(false)
          setIsWithdrawModalOpen(true)
        }}
      />
    </div>
  )
}