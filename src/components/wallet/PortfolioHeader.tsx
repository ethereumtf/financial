'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PortfolioHeaderProps {
  totalValue: number
  currency?: string
  isLoading?: boolean
}

export function PortfolioHeader({ totalValue, currency = 'USD', isLoading = false }: PortfolioHeaderProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium text-gray-600">Total Balance</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBalanceVisibility}
          className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
        >
          {isBalanceVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="flex items-baseline gap-2">
        {isLoading ? (
          <div className="h-12 w-48 bg-gray-200 animate-pulse rounded-lg" />
        ) : (
          <h1 className="text-4xl font-bold text-gray-900">
            {isBalanceVisible ? formatCurrency(totalValue) : '••••••'}
          </h1>
        )}
      </div>
      
      <p className="text-sm text-gray-500 mt-1">
        Available to spend
      </p>
    </div>
  )
}