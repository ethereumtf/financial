'use client'

import { useState } from 'react'
import { ArrowUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StablecoinBalance, formatCurrency } from '@/lib/data'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
  assets: StablecoinBalance[]
  onWithdraw: (asset: string, amount: number, address: string) => Promise<void>
}

export function WithdrawModal({ isOpen, onClose, assets, onWithdraw }: WithdrawModalProps) {
  const [selectedAsset, setSelectedAsset] = useState('')
  const [amount, setAmount] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    asset?: string
    amount?: string
    address?: string
  }>({})

  const selectedAssetData = assets.find(asset => `${asset.symbol}-${asset.chainId}` === selectedAsset)

  const validateForm = () => {
    const newErrors: typeof errors = {}

    if (!selectedAsset) {
      newErrors.asset = 'Please select an asset'
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount'
    } else if (selectedAssetData && parseFloat(amount) > selectedAssetData.amount) {
      newErrors.amount = 'Insufficient balance'
    }

    if (!recipientAddress) {
      newErrors.address = 'Please enter a recipient address'
    } else if (!recipientAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
      newErrors.address = 'Please enter a valid address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleMaxClick = () => {
    if (selectedAssetData) {
      setAmount(selectedAssetData.amount.toString())
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await onWithdraw(selectedAsset, parseFloat(amount), recipientAddress)
      onClose()
      // Reset form
      setSelectedAsset('')
      setAmount('')
      setRecipientAddress('')
      setErrors({})
    } catch (error) {
      console.error('Withdrawal error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setSelectedAsset('')
    setAmount('')
    setRecipientAddress('')
    setErrors({})
  }

  const handleClose = () => {
    if (!isLoading) {
      resetForm()
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Withdraw Funds
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Select Asset
            </label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Choose an asset to withdraw" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem 
                    key={`${asset.symbol}-${asset.chainId}`} 
                    value={`${asset.symbol}-${asset.chainId}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{asset.symbol}</span>
                      <span className="text-sm text-slate-500 ml-2">
                        {asset.amount.toLocaleString()} available
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.asset && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {errors.asset}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Amount
              </label>
              {selectedAssetData && (
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Max: {selectedAssetData.amount.toLocaleString()}
                </button>
              )}
            </div>
            <div className="relative">
              <Input
                type="number"
                step="0.000001"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="h-12 text-lg pr-16"
                disabled={isLoading}
              />
              {selectedAssetData && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  {selectedAssetData.symbol}
                </div>
              )}
            </div>
            {selectedAssetData && amount && (
              <p className="text-sm text-slate-600">
                ≈ {formatCurrency(parseFloat(amount) || 0)}
              </p>
            )}
            {errors.amount && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Recipient Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Recipient Address
            </label>
            <Input
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="h-12 font-mono text-sm"
              disabled={isLoading}
            />
            {errors.address && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {errors.address}
              </p>
            )}
          </div>

          {/* Transaction Summary */}
          {selectedAsset && amount && recipientAddress && !Object.keys(errors).length && (
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h4 className="font-semibold text-emerald-800">Transaction Summary</h4>
                  <p className="text-sm text-emerald-700">
                    You are sending: <span className="font-semibold">{amount} {selectedAssetData?.symbol}</span>
                  </p>
                  <p className="text-sm text-emerald-700">
                    To: <span className="font-mono text-xs">{recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Important</h4>
                <p className="text-sm text-amber-700">
                  Double-check the recipient address. Transactions cannot be reversed once confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button 
              type="button"
              onClick={handleClose} 
              variant="outline" 
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading || Object.keys(errors).length > 0}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Confirm Withdrawal
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}