'use client'

import { ExternalLink, Copy, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StablecoinTransaction, formatCurrency } from '@/lib/data'

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: StablecoinTransaction | null
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-5 w-5 text-emerald-600" />
    case 'pending':
      return <Clock className="h-5 w-5 text-amber-600" />
    case 'failed':
      return <XCircle className="h-5 w-5 text-red-600" />
    default:
      return <Clock className="h-5 w-5 text-slate-600" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'pending':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'failed':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const generateTransactionId = (id: string) => {
  // Generate a human-readable transaction ID
  return `TXN-${id.toUpperCase().padStart(8, '0')}`
}

export function TransactionDetailsModal({ isOpen, onClose, transaction }: TransactionDetailsModalProps) {
  if (!transaction) return null

  const copyTransactionId = async () => {
    try {
      await navigator.clipboard.writeText(generateTransactionId(transaction.id))
    } catch (err) {
      console.error('Failed to copy transaction ID:', err)
    }
  }

  const openBlockExplorer = () => {
    if (transaction.txHash) {
      // In a real app, you'd construct the proper explorer URL based on the chain
      const explorerUrl = `https://etherscan.io/tx/${transaction.txHash}`
      window.open(explorerUrl, '_blank')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Transaction Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Header */}
          <div className="text-center">
            <div className="flex justify-center mb-3">
              {getStatusIcon(transaction.status)}
            </div>
            <Badge className={`${getStatusColor(transaction.status)} px-3 py-1 text-sm font-medium capitalize border`}>
              {transaction.status}
            </Badge>
          </div>

          {/* Amount */}
          <div className="text-center">
            <p className="text-3xl font-bold text-slate-900 mb-1">
              {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
            </p>
            <p className="text-sm text-slate-500">{transaction.stablecoin}</p>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Type</span>
              <span className="font-medium capitalize">{transaction.type}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Date & Time</span>
              <span className="font-medium">{formatDate(transaction.date)}</span>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-slate-600">Transaction ID</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm">{generateTransactionId(transaction.id)}</span>
                <Button
                  onClick={copyTransactionId}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-auto"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {transaction.protocol && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Service</span>
                <span className="font-medium">{transaction.protocol}</span>
              </div>
            )}

            {transaction.type === 'bridge' && transaction.fromChain && transaction.toChain && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-slate-600">Networks</span>
                <span className="font-medium">Chain {transaction.fromChain} → Chain {transaction.toChain}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">Description</h4>
              <p className="text-sm text-slate-600">{transaction.description}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            {transaction.txHash && (
              <Button 
                onClick={openBlockExplorer}
                variant="ghost"
                className="flex-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View on Explorer
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}