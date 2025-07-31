'use client'

import { ChevronRight } from 'lucide-react'
import { StablecoinBalance, formatCurrency, getStablecoinIcon } from '@/lib/data'

interface AssetListProps {
  assets: StablecoinBalance[]
  onAssetClick: (asset: StablecoinBalance) => void
}

const getAssetName = (symbol: string) => {
  const names = {
    'USDC': 'USD Coin',
    'USDT': 'Tether USD'
  }
  return names[symbol as keyof typeof names] || symbol
}

export function AssetList({ assets, onAssetClick }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="px-6 mb-8">
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No Assets Yet</h3>
          <p className="text-slate-500">Start by depositing some stablecoins to your wallet</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-6 mb-8">
      <h2 className="text-lg font-semibold text-slate-900 mb-4">Your Assets</h2>
      <div className="space-y-2">
        {assets.map((asset, index) => (
          <button
            key={`${asset.symbol}-${asset.chainId}-${index}`}
            onClick={() => onAssetClick(asset)}
            className="w-full flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl">
                {getStablecoinIcon(asset.symbol)}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-slate-900">{getAssetName(asset.symbol)}</h3>
                <p className="text-sm text-slate-500">{asset.symbol}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-semibold text-slate-900">
                  {asset.amount.toLocaleString()} {asset.symbol}
                </p>
                <p className="text-sm text-slate-500">
                  {formatCurrency(asset.amount)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}