'use client'

import { useState } from 'react'
import { Copy, QrCode, CheckCircle, AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DepositModalProps {
  isOpen: boolean
  onClose: () => void
}

// Mock wallet addresses for different networks
const walletAddresses = {
  ethereum: '0x742d35Cc6634C0532925a3b8D4C7623fd0C0C9f1',
  polygon: '0x8A4B7C17B8F4C4D6Ea9D4A2F1E2F2E8B9D3A5C7E',
  arbitrum: '0x1B2C8D5F4E3A9C2D8F7B1A3E5C9F2A8D4B7E6F1C'
}

const networkInfo = {
  ethereum: { name: 'Ethereum', color: 'bg-blue-500', supported: ['USDC', 'USDT'] },
  polygon: { name: 'Polygon', color: 'bg-purple-500', supported: ['USDC', 'USDT'] },
  arbitrum: { name: 'Arbitrum', color: 'bg-indigo-500', supported: ['USDC', 'USDT'] }
}

export function DepositModal({ isOpen, onClose }: DepositModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState<keyof typeof walletAddresses>('ethereum')
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddresses[selectedNetwork])
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const generateQRCode = (address: string) => {
    // In a real app, you'd use a QR code library like qrcode.js
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center mb-4">
            Deposit to Your Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Network Selection */}
          <Tabs value={selectedNetwork} onValueChange={(value) => setSelectedNetwork(value as keyof typeof walletAddresses)}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              {Object.entries(networkInfo).map(([key, info]) => (
                <TabsTrigger key={key} value={key} className="text-sm">
                  {info.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(walletAddresses).map(([network, address]) => (
              <TabsContent key={network} value={network} className="space-y-6">
                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="p-4 bg-white rounded-xl border-2 border-slate-200">
                    <img
                      src={generateQRCode(address)}
                      alt="Wallet Address QR Code"
                      className="w-48 h-48"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-slate-700">
                    Your {networkInfo[network as keyof typeof networkInfo].name} Address
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-3 bg-slate-100 rounded-lg text-sm font-mono text-slate-800 break-all">
                      {address}
                    </code>
                    <Button
                      onClick={copyAddress}
                      variant="outline"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Supported Assets */}
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-emerald-800 mb-1">Supported Assets</h4>
                      <p className="text-sm text-emerald-700">
                        {networkInfo[network as keyof typeof networkInfo].supported.join(', ')} on {networkInfo[network as keyof typeof networkInfo].name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Important Warning */}
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-amber-800 mb-1">Important</h4>
                      <p className="text-sm text-amber-700">
                        Only send {networkInfo[network as keyof typeof networkInfo].name} assets to this address. 
                        Sending assets from other networks may result in permanent loss.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1">
              Close
            </Button>
            <Button onClick={copyAddress} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              <Copy className="h-4 w-4 mr-2" />
              Copy Address
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}