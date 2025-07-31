'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/data'

interface PortfolioHeaderProps {
  totalValue: number
  currency?: string
}

export function PortfolioHeader({ totalValue, currency = 'USD' }: PortfolioHeaderProps) {
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)

  const toggleBalanceVisibility = () => {
    setIsBalanceVisible(!isBalanceVisible)
  }

  return (
    <div className="text-center py-8">
      <p className="text-sm text-slate-500 mb-2">Total Portfolio Value</p>
      <div className="flex items-center justify-center gap-3 mb-8">
        <h1 className="text-5xl font-bold text-slate-900">
          {isBalanceVisible ? formatCurrency(totalValue) : '••••••'}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleBalanceVisibility}
          className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full w-10 h-10 p-0"
          aria-label={isBalanceVisible ? "Hide balance" : "Show balance"}
        >
          {isBalanceVisible ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  )
}