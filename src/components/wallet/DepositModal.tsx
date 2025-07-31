'use client'

import { useState } from 'react'
import { Copy, QrCode, AlertCircle, ExternalLink } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Network {
  id: string
  name: string
  displayName: string
  address: string
  minimumDeposit: number
  estimatedTime: string
  fee: string
  icon: string
}

interface DepositModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  networks: Network[]
  selectedAsset?: {
    name: string
    symbol: string
    icon: string
  }
}

export function DepositModal({ open, onOpenChange, networks, selectedAsset }: DepositModalProps) {
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]?.id || '')
  const [showQR, setShowQR] = useState(false)

  const currentNetwork = networks.find(n => n.id === selectedNetwork)

  const copyAddress = () => {
    if (currentNetwork) {
      navigator.clipboard.writeText(currentNetwork.address)
    }
  }

  const generateQRCode = (address: string) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${address}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedAsset?.icon && <span className="text-2xl">{selectedAsset.icon}</span>}
            Deposit {selectedAsset?.symbol || 'Assets'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Tabs value={selectedNetwork} onValueChange={setSelectedNetwork}>
            <TabsList className="grid w-full grid-cols-2">
              {networks.slice(0, 2).map((network) => (
                <TabsTrigger key={network.id} value={network.id}>
                  <span className="mr-2">{network.icon}</span>
                  {network.displayName}
                </TabsTrigger>
              ))}
            </TabsList>

            {networks.map((network) => (
              <TabsContent key={network.id} value={network.id} className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Only send {selectedAsset?.symbol || 'supported assets'} on {network.name} network. 
                    Minimum deposit: ${network.minimumDeposit}
                  </AlertDescription>
                </Alert>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">Deposit Address</h3>
                        <p className="text-sm text-gray-500">{network.name}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowQR(!showQR)}
                      >
                        <QrCode className="h-4 w-4 mr-2" />
                        QR
                      </Button>
                    </div>

                    {showQR && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={generateQRCode(network.address)}
                          alt="QR Code"
                          className="w-48 h-48 border rounded-lg"
                        />
                      </div>
                    )}

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="font-mono text-sm break-all">{network.address}</p>
                    </div>

                    <Button
                      onClick={copyAddress}
                      className="w-full mb-4"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Address
                    </Button>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Estimated Time</p>
                        <p className="font-medium">{network.estimatedTime}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Network Fee</p>
                        <p className="font-medium">{network.fee}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    No gas fees with Account Abstraction
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    Explorer
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}