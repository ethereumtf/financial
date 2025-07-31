'use client'

import { useState } from 'react'
import { ArrowUpRight, ArrowDownLeft, ShoppingCart, Repeat } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'

interface Transaction {
  id: string
  type: 'deposit' | 'withdrawal' | 'buy' | 'swap'
  description: string
  amount: number
  currency: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  hash?: string
}

interface ActivityHistoryProps {
  transactions: Transaction[]
  onTransactionClick?: (transaction: Transaction) => void
}

export function ActivityHistory({ transactions, onTransactionClick }: ActivityHistoryProps) {
  const [activeTab, setActiveTab] = useState('all')

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(Math.abs(amount))
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-blue-600" />
      case 'buy':
        return <ShoppingCart className="h-4 w-4 text-purple-600" />
      case 'swap':
        return <Repeat className="h-4 w-4 text-orange-600" />
      default:
        return <ArrowUpRight className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-700 text-xs">Completed</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive" className="text-xs">Failed</Badge>
      default:
        return <Badge variant="secondary" className="text-xs">{status}</Badge>
    }
  }

  const filterTransactions = (type: string) => {
    if (type === 'all') return transactions
    return transactions.filter(tx => tx.type === type)
  }

  const renderTransactionList = (filteredTransactions: Transaction[]) => {
    if (filteredTransactions.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>No transactions found</p>
        </div>
      )
    }

    return (
      <div className="space-y-3">
        {filteredTransactions.map((transaction) => (
          <div
            key={transaction.id}
            onClick={() => onTransactionClick?.(transaction)}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'deposit' ? 'text-green-600' : 
                  transaction.type === 'withdrawal' ? 'text-red-600' : 
                  'text-gray-900'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}
                  {formatCurrency(transaction.amount, transaction.currency)}
                </p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="deposit">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
            <TabsTrigger value="buy">Purchases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderTransactionList(filterTransactions('all'))}
          </TabsContent>
          
          <TabsContent value="deposit">
            {renderTransactionList(filterTransactions('deposit'))}
          </TabsContent>
          
          <TabsContent value="withdrawal">
            {renderTransactionList(filterTransactions('withdrawal'))}
          </TabsContent>
          
          <TabsContent value="buy">
            {renderTransactionList(filterTransactions('buy'))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}