'use client'

import { ChevronRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Asset {
  id: string
  name: string
  symbol: string
  balance: number
  usdValue: number
  icon: string
  change24h?: number
}

interface AssetListProps {
  assets: Asset[]
  onAssetClick?: (asset: Asset) => void
}

export function AssetList({ assets, onAssetClick }: AssetListProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatBalance = (balance: number, symbol: string) => {
    return `${balance.toLocaleString()} ${symbol}`
  }

  const formatChange = (change: number) => {
    const isPositive = change > 0
    return (
      <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{change.toFixed(2)}%
      </span>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {assets.map((asset) => (
            <div
              key={asset.id}
              onClick={() => onAssetClick?.(asset)}
              className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                  {asset.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{asset.name}</h3>
                  <p className="text-sm text-gray-500">{formatBalance(asset.balance, asset.symbol)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(asset.usdValue)}</p>
                  {asset.change24h !== undefined && formatChange(asset.change24h)}
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}