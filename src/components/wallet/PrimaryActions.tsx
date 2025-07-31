'use client'

import { Plus, ArrowUp, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrimaryActionsProps {
  onDeposit: () => void
  onWithdraw: () => void
  onBuy: () => void
}

export function PrimaryActions({ onDeposit, onWithdraw, onBuy }: PrimaryActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 px-6 mb-8">
      {/* Primary Actions */}
      <div className="flex gap-3 flex-1">
        <Button 
          onClick={onDeposit}
          className="flex-1 h-14 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="h-5 w-5 mr-2" />
          Deposit
        </Button>
        
        <Button 
          onClick={onWithdraw}
          variant="outline"
          className="flex-1 h-14 text-base font-semibold border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200"
        >
          <ArrowUp className="h-5 w-5 mr-2" />
          Withdraw
        </Button>
      </div>

      {/* Secondary Action */}
      <Button 
        onClick={onBuy}
        variant="ghost"
        className="h-14 text-base font-medium text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all duration-200 sm:w-32"
      >
        <CreditCard className="h-5 w-5 mr-2" />
        Buy
      </Button>
    </div>
  )
}