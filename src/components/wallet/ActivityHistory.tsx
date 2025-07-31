'use client'

import { useState } from 'react'
import { ArrowDownLeft, ArrowUpRight, TrendingUp, ArrowLeftRight, Zap, DollarSign, ChevronRight } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StablecoinTransaction, formatCurrency } from '@/lib/data'

interface ActivityHistoryProps {
  transactions: StablecoinTransaction[]
  onTransactionClick: (transaction: StablecoinTransaction) => void
}

const getTransactionIcon = (type: string) => {
  const icons = {
    'deposit': <ArrowDownLeft className="h-4 w-4" />,
    'withdrawal': <ArrowUpRight className="h-4 w-4" />,
    'yield': <TrendingUp className="h-4 w-4" />,
    'swap': <ArrowLeftRight className="h-4 w-4" />,
    'bridge': <Zap className="h-4 w-4" />,
    'spend': <DollarSign className="h-4 w-4" />
  }
  return icons[type as keyof typeof icons] || <DollarSign className="h-4 w-4" />
}

const getTransactionTitle = (transaction: StablecoinTransaction) => {
  const titles = {
    'deposit': 'Deposit Received',
    'withdrawal': 'Withdrawal Sent',
    'yield': 'Rewards Earned',
    'swap': 'Token Swap',
    'bridge': 'Cross-Chain Transfer',
    'spend': 'Payment Sent'
  }
  return titles[transaction.type] || transaction.description
}

const getStatusColor = (status: string) => {
  const colors = {
    'completed': 'text-emerald-600',
    'pending': 'text-amber-600',
    'failed': 'text-red-600'
  }
  return colors[status as keyof typeof colors] || 'text-slate-600'
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export function ActivityHistory({ transactions, onTransactionClick }: ActivityHistoryProps) {
  const [activeTab, setActiveTab] = useState('all')

  const filterTransactions = (type: string) => {
    if (type === 'all') return transactions
    if (type === 'deposits') return transactions.filter(tx => tx.type === 'deposit')
    if (type === 'withdrawals') return transactions.filter(tx => tx.type === 'withdrawal')
    return transactions.filter(tx => !['deposit', 'withdrawal'].includes(tx.type))
  }

  const renderTransactionList = (filteredTransactions: StablecoinTransaction[]) => {
    if (filteredTransactions.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">📝</div>
          <h4 className="font-semibold text-slate-700 mb-1">No transactions yet</h4>
          <p className="text-sm text-slate-500">Your transaction history will appear here</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {filteredTransactions.map((transaction) => (
          <button
            key={transaction.id}
            onClick={() => onTransactionClick(transaction)}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                transaction.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' :
                transaction.type === 'withdrawal' ? 'bg-slate-100 text-slate-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div className="text-left">
                <h4 className="font-semibold text-slate-900">
                  {getTransactionTitle(transaction)}
                </h4>
                <p className="text-sm text-slate-500">
                  {formatDate(transaction.date)}
                  {transaction.protocol && ` • ${transaction.protocol}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.amount > 0 ? 'text-emerald-600' : 'text-slate-900'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                </p>
                <p className={`text-sm capitalize ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="px-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-100 p-1">
          <TabsTrigger value="all" className="text-sm">All</TabsTrigger>
          <TabsTrigger value="deposits" className="text-sm">Deposits</TabsTrigger>
          <TabsTrigger value="withdrawals" className="text-sm">Withdrawals</TabsTrigger>
          <TabsTrigger value="others" className="text-sm">Others</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {renderTransactionList(filterTransactions('all'))}
        </TabsContent>
        
        <TabsContent value="deposits" className="mt-0">
          {renderTransactionList(filterTransactions('deposits'))}
        </TabsContent>
        
        <TabsContent value="withdrawals" className="mt-0">
          {renderTransactionList(filterTransactions('withdrawals'))}
        </TabsContent>
        
        <TabsContent value="others" className="mt-0">
          {renderTransactionList(filterTransactions('others'))}
        </TabsContent>
      </Tabs>
    </div>
  )
}