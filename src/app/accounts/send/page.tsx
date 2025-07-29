'use client'

import { useState } from 'react'
import { Send, ArrowRight, Users, Clock, Shield, Zap, QrCode, Copy, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, getStablecoinIcon, StablecoinSymbol } from '@/lib/data'

interface Contact {
  id: string
  name: string
  address: string
  avatar?: string
  lastUsed: string
  totalSent: number
  preferredCoin: StablecoinSymbol
}

const recentContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    address: '0x742d35Cc6634C0532925a3b8D4C7623fd0C0C9f1',
    lastUsed: '2024-01-20',
    totalSent: 2500,
    preferredCoin: 'USDC'
  },
  {
    id: '2',
    name: 'Bob Smith',
    address: '0x8A4B7C17B8F4C4D6Ea9D4A2F1E2F2E8B9D3A5C7E',
    lastUsed: '2024-01-18',
    totalSent: 800,
    preferredCoin: 'USDT'
  },
  {
    id: '3',
    name: 'Carol Williams',
    address: '0x1B2C8D5F4E3A9C2D8F7B1A3E5C9F2A8D4B7E6F1C',
    lastUsed: '2024-01-15',
    totalSent: 1200,
    preferredCoin: 'USDC'
  }
]

export default function SendMoneyPage() {
  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [stablecoin, setStablecoin] = useState<StablecoinSymbol>('USDC')
  const [message, setMessage] = useState('')
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)

  const currentBalance = stablecoin === 'USDC' ? 25431.89 : 15200.00
  const networkFee = 0.50 // Estimated network fee
  const totalAmount = amount ? parseFloat(amount) + networkFee : 0

  const selectContact = (contact: Contact) => {
    setSelectedContact(contact)
    setRecipient(contact.address)
    setStablecoin(contact.preferredCoin)
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Send Money
          </h1>
          <p className="text-muted-foreground mt-1">Transfer stablecoins to anyone, anywhere in the world</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <QrCode className="h-4 w-4 mr-2" />
            Scan QR
          </Button>
          <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <UserPlus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Send className="h-4 w-4 text-emerald-600" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(4520)}</div>
            <p className="text-sm text-muted-foreground">Total sent</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-600" />
              Recipients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Avg. Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12s</div>
            <p className="text-sm text-muted-foreground">Settlement time</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-sm text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>
      </div>

      {/* Send Form */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-emerald-600" />
                Send Stablecoins
              </CardTitle>
              <CardDescription>
                Transfer USDC or USDT to any wallet address instantly
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="manual">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                  <TabsTrigger value="contacts">From Contacts</TabsTrigger>
                </TabsList>

                <TabsContent value="manual" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Recipient Address</label>
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="0x... or ENS name"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        className="font-mono text-sm"
                      />
                      <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-600">
                        <QrCode className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="contacts" className="space-y-4 mt-6">
                  <div className="space-y-3">
                    {recentContacts.map((contact) => (
                      <div
                        key={contact.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all ${
                          selectedContact?.id === contact.id
                            ? 'border-emerald-300 bg-emerald-50'
                            : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'
                        }`}
                        onClick={() => selectContact(contact)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                              <span className="font-semibold text-emerald-700">
                                {contact.name.split(' ').map(n => n[0]).join('')}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium">{contact.name}</div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {shortenAddress(contact.address)}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {getStablecoinIcon(contact.preferredCoin)} {contact.preferredCoin}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Sent {formatCurrency(contact.totalSent)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="text-xl h-12"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Available: {formatCurrency(currentBalance)}</span>
                    <button 
                      className="text-emerald-600 hover:text-emerald-700 font-medium"
                      onClick={() => setAmount((currentBalance - networkFee).toString())}
                    >
                      Max
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Stablecoin</label>
                  <Select value={stablecoin} onValueChange={(value: StablecoinSymbol) => setStablecoin(value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">
                        <div className="flex items-center gap-2">
                          {getStablecoinIcon('USDC')} USDC
                        </div>
                      </SelectItem>
                      <SelectItem value="USDT">
                        <div className="flex items-center gap-2">
                          {getStablecoinIcon('USDT')} USDT
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="text-sm text-muted-foreground">
                    Balance: {formatCurrency(currentBalance)}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message (Optional)</label>
                <Input
                  placeholder="Add a note for the recipient"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={100}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {message.length}/100
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <h4 className="font-semibold text-emerald-700 mb-3">Transaction Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Amount to send:</span>
                    <span className="font-medium">{amount ? formatCurrency(parseFloat(amount)) : '$0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Network fee:</span>
                    <span className="font-medium">{formatCurrency(networkFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Recipient receives:</span>
                    <span className="font-medium">{amount ? formatCurrency(parseFloat(amount)) : '$0.00'} {stablecoin}</span>
                  </div>
                  <div className="flex justify-between font-semibold pt-2 border-t border-emerald-200">
                    <span>Total cost:</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600" 
                disabled={!recipient || !amount || parseFloat(amount) <= 0 || totalAmount > currentBalance}
              >
                <Send className="h-4 w-4 mr-2" />
                Send {amount ? `${amount} ${stablecoin}` : 'Stablecoins'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Contacts & Features */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                Recent Recipients
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentContacts.slice(0, 3).map((contact) => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-semibold text-emerald-700">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">{contact.lastUsed}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => selectContact(contact)}
                    className="text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  >
                    Select
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why Choose USD Financial?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Lightning Fast</div>
                  <div className="text-xs text-muted-foreground">Settlements in seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Bank-Grade Security</div>
                  <div className="text-xs text-muted-foreground">Your funds are protected</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Global Reach</div>
                  <div className="text-xs text-muted-foreground">Send anywhere in the world</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}