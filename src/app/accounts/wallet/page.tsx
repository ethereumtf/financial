'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { SmartWalletOverview } from '@/components/wallet/SmartWalletOverview'
import { SmartWalletFeatures } from '@/components/wallet/SmartWalletFeatures'
import { SmartWalletTransactions } from '@/components/wallet/SmartWalletTransactions'
import { GaslessTransactionDemo } from '@/components/wallet/GaslessTransactionDemo'
import { PortfolioHeader } from '@/components/wallet/PortfolioHeader'
import { PrimaryActions } from '@/components/wallet/PrimaryActions'
import { AssetList } from '@/components/wallet/AssetList'
import { ActivityHistory } from '@/components/wallet/ActivityHistory'
import { EnhancedDepositModal } from '@/components/wallet/EnhancedDepositModal'
import { EnhancedWithdrawModal } from '@/components/wallet/EnhancedWithdrawModal'
import { TransactionReceiptModal } from '@/components/wallet/TransactionReceiptModal'
import { useAuth } from '@/hooks/useAuth'
import { useTransactionHistory } from '@/lib/transactionHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function WalletPage() {
  const { user, loading, isWalletConnected, isAAReady, walletBalance, eoaBalance, sendTransaction, sendGaslessTransaction, signIn } = useAuth()
  const { addTransaction } = useTransactionHistory()
  
  // Debug: Log user object to see wallet addresses
  console.log('🔍 Debug - User object:', user)
  console.log('🔍 Debug - Smart wallet address:', user?.walletAddress)
  console.log('🔍 Debug - EOA address:', user?.eoaAddress)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [isCreatingWallet, setIsCreatingWallet] = useState(false)

  // Real wallet assets based on actual balances
  const realAssets = [
    {
      id: 'eth',
      name: 'Ethereum',
      symbol: 'ETH',
      balance: parseFloat(walletBalance || '0'),
      usdValue: parseFloat(walletBalance || '0') * 3200, // Current ETH price approximation
      icon: '💎',
      change24h: 0.05,
      minimumWithdraw: 0.001,
      isNative: true
    },
    {
      id: 'eth-eoa',
      name: 'Ethereum (Backup)',
      symbol: 'ETH',
      balance: parseFloat(eoaBalance || '0'),
      usdValue: parseFloat(eoaBalance || '0') * 3200,
      icon: '🔒',
      change24h: 0.05,
      minimumWithdraw: 0.001,
      isNative: true,
      isBackup: true
    }
  ].filter(asset => asset.balance > 0) // Only show assets with balance

  const networks = [
    {
      id: 'sepolia',
      name: 'Ethereum Sepolia',
      displayName: 'Sepolia Testnet',
      smartWalletAddress: user?.walletAddress || '',
      eoaAddress: user?.eoaAddress || '',
      minimumDeposit: 0.001,
      estimatedTime: '30 seconds',
      fee: 0,
      icon: '🔧',
      isTestnet: true
    },
    {
      id: 'ethereum',
      name: 'Ethereum Mainnet',
      displayName: 'Ethereum',
      smartWalletAddress: user?.walletAddress || '',
      eoaAddress: user?.eoaAddress || '',
      minimumDeposit: 0.01,
      estimatedTime: '2-5 minutes',
      fee: 0.002,
      icon: '💎'
    }
  ]
  
  // Debug: Log networks being passed to modal
  console.log('🔍 Debug - Networks array:', networks)


  const totalBalance = realAssets.reduce((sum, asset) => sum + asset.usdValue, 0)

  const handleCreateWallet = async () => {
    try {
      setIsCreatingWallet(true)
      await signIn()
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
      asset: realAssets[0],
      network: networks[0],
      timestamp: new Date().toISOString(),
      confirmations: 12,
      requiredConfirmations: 12
    })
    setShowReceiptModal(true)
  }

  const handleWithdraw = async (data: any) => {
    try {
      let txHash: string
      
      // Use gasless or regular transaction based on user choice
      if (data.useGasless && isAAReady) {
        txHash = await sendGaslessTransaction(data.address, data.amount.toString())
      } else {
        txHash = await sendTransaction(data.address, data.amount.toString())
      }
      
      // Add transaction to real history
      const asset = realAssets.find(a => a.id === data.assetId)
      const newTransaction = addTransaction({
        type: 'send',
        description: `Sent ${data.amount} ${asset?.symbol || 'ETH'} to ${data.address.slice(0, 6)}...${data.address.slice(-4)}`,
        amount: -data.amount,
        currency: asset?.symbol || 'ETH',
        status: 'pending',
        hash: txHash,
        gasUsed: data.useGasless ? 0 : 21000,
        gasPrice: data.useGasless ? 0 : 20,
        isGasless: data.useGasless && isAAReady,
        walletType: data.useGasless && isAAReady ? 'smart' : 'eoa',
        to: data.address
      })
      
      setSelectedTransaction({
        ...newTransaction,
        asset: asset,
        network: networks.find(n => n.id === data.networkId),
        timestamp: new Date().toISOString(),
        confirmations: 0,
        requiredConfirmations: 12,
        toAddress: data.address,
        usdValue: data.amount
      })
      
      setShowReceiptModal(true)
      
      // Simulate confirmation after 3 seconds
      setTimeout(() => {
        // Update transaction status to completed in real service
        // transactionHistoryService.updateTransactionStatus(newTransaction.id, 'completed', 12)
      }, 3000)
      
    } catch (error) {
      console.error('Withdrawal failed:', error)
      // Handle error - could show toast notification
    }
  }

  // Wallet initialization screen
  if (!isWalletConnected) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-6">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Your Smart Wallet</h1>
          <p className="text-gray-600 max-w-lg text-lg leading-relaxed">
            Create your Account Abstraction wallet powered by Alchemy + Web3Auth for truly gasless transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 text-sm text-gray-500 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              Gasless transactions
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Google & Email login
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              Smart contract wallet
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
              EOA backup
            </div>
          </div>
        </div>
        
        {loading || isCreatingWallet ? (
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
            <h1 className="text-3xl font-bold text-gray-900">Smart Wallet</h1>
            <p className="text-gray-600 text-lg">
              {isAAReady ? 'Account Abstraction • Gasless Transactions' : 'Smart Contract Wallet • EOA Backup'}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="demo">Try Demo</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <SmartWalletOverview
              smartWalletAddress={user?.walletAddress || null}
              eoaAddress={user?.eoaAddress || null}
              smartWalletBalance={walletBalance}
              eoaBalance={eoaBalance}
              isAAReady={isAAReady}
              currentChain="sepolia"
            />

            <PortfolioHeader 
              totalValue={totalBalance} 
              isLoading={loading}
              isAAReady={isAAReady}
            />

            <PrimaryActions
              onDeposit={() => setShowDepositModal(true)}
              onWithdraw={() => setShowWithdrawModal(true)}
            />

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Your Assets</h2>
                <div className="text-sm text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full font-medium">
                  💰 {realAssets.length} Asset{realAssets.length !== 1 ? 's' : ''}
                </div>
              </div>
              <AssetList 
                assets={realAssets}
                onAssetClick={handleAssetClick}
              />
            </div>
          </TabsContent>

          <TabsContent value="features">
            <SmartWalletFeatures isAAReady={isAAReady} />
          </TabsContent>

          <TabsContent value="transactions">
            <SmartWalletTransactions 
              isAAReady={isAAReady}
              smartWalletAddress={user?.walletAddress || null}
              eoaAddress={user?.eoaAddress || null}
            />
          </TabsContent>

          <TabsContent value="demo">
            <GaslessTransactionDemo 
              isAAReady={isAAReady}
              smartWalletAddress={user?.walletAddress || null}
            />
          </TabsContent>
        </Tabs>

      <EnhancedDepositModal
        open={showDepositModal}
        onOpenChange={setShowDepositModal}
        networks={networks}
        currentBalance={walletBalance || '0'}
        isAAReady={isAAReady}
      />

      <EnhancedWithdrawModal
        open={showWithdrawModal}
        onOpenChange={setShowWithdrawModal}
        assets={realAssets}
        networks={networks}
        onConfirmWithdraw={handleWithdraw}
        isAAReady={isAAReady}
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