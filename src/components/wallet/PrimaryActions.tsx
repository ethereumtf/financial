'use client'

import { Plus, ArrowUpRight, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PrimaryActionsProps {
  onDeposit?: () => void
  onWithdraw?: () => void
  onBuy?: () => void
}

export function PrimaryActions({ onDeposit, onWithdraw, onBuy }: PrimaryActionsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Button 
        onClick={onDeposit}
        className="flex-1 h-14 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Money
      </Button>
      
      <Button 
        onClick={onWithdraw}
        variant="outline"
        className="flex-1 h-14 text-base font-semibold border-2 border-gray-200 hover:border-gray-300 rounded-xl"
      >
        <ArrowUpRight className="h-5 w-5 mr-2" />
        Send
      </Button>
      
      <Button 
        onClick={onBuy}
        variant="outline"
        className="flex-1 h-14 text-base font-semibold border-2 border-gray-200 hover:border-gray-300 rounded-xl"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Buy
      </Button>
    </div>
  )
}