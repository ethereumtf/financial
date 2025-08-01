'use client'

import { useState } from 'react'
import { CreditCard, Plus, Eye, EyeOff, Copy, Trash2, Settings, Globe, Shield, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, StablecoinSymbol } from '@/lib/data'

interface VirtualCard {
  id: string
  name: string
  cardNumber: string
  expiryDate: string
  cvv: string
  status: 'active' | 'locked' | 'expired'
  balance: number
  currency: StablecoinSymbol
  limits: {
    single: number
    daily: number
    monthly: number
  }
  merchant?: string
  merchantCategory?: string
  isTemporary: boolean
  createdDate: string
  lastUsed?: string
  totalSpent: number
}

const virtualCards: VirtualCard[] = [
  {
    id: '1',
    name: 'Online Shopping',
    cardNumber: '4532 1234 5678 9012',
    expiryDate: '12/27',
    cvv: '123',
    status: 'active',
    balance: 500.00,
    currency: 'USDC',
    limits: { single: 1000, daily: 2000, monthly: 5000 },
    isTemporary: false,
    createdDate: '2024-01-15',
    lastUsed: '2024-01-20',
    totalSpent: 234.50
  },
  {
    id: '2',
    name: 'Netflix Subscription',
    cardNumber: '4532 9876 5432 1098',
    expiryDate: '06/26',
    cvv: '456',
    status: 'active',
    balance: 50.00,
    currency: 'USDT',
    limits: { single: 20, daily: 20, monthly: 20 },
    merchant: 'Netflix',
    merchantCategory: 'Entertainment',
    isTemporary: false,
    createdDate: '2024-01-10',
    lastUsed: '2024-01-18',
    totalSpent: 15.99
  },
  {
    id: '3',
    name: 'Amazon Purchase',
    cardNumber: '4532 5555 4444 3333',
    expiryDate: '03/25',
    cvv: '789',
    status: 'locked',
    balance: 100.00,
    currency: 'USDC',
    limits: { single: 150, daily: 150, monthly: 150 },
    merchant: 'Amazon',
    merchantCategory: 'E-commerce',
    isTemporary: true,
    createdDate: '2024-01-20',
    totalSpent: 89.99
  }
]

export default function VirtualCardsPage() {
  const [showCardDetails, setShowCardDetails] = useState<Record<string, boolean>>({})
  const [cards, setCards] = useState<VirtualCard[]>(virtualCards)
  const [newCardName, setNewCardName] = useState('')
  const [newCardBalance, setNewCardBalance] = useState('')
  const [newCardCurrency, setNewCardCurrency] = useState<StablecoinSymbol>('USDC')
  const [newCardLimits, setNewCardLimits] = useState({
    single: 1000,
    daily: 2000,
    monthly: 5000
  })
  const [isCreating, setIsCreating] = useState(false)

  const toggleCardDetails = (cardId: string) => {
    setShowCardDetails(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
    }
  }

  const handleCreateCard = async () => {
    if (!newCardName || !newCardBalance) return
    
    setIsCreating(true)
    try {
      const newCard: VirtualCard = {
        id: (cards.length + 1).toString(),
        name: newCardName,
        cardNumber: `4532 ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)} ${Math.random().toString().slice(2, 6)}`,
        expiryDate: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' }),
        cvv: Math.floor(Math.random() * 900 + 100).toString(),
        status: 'active',
        balance: parseFloat(newCardBalance),
        currency: newCardCurrency,
        limits: newCardLimits,
        isTemporary: false,
        createdDate: new Date().toISOString().split('T')[0],
        totalSpent: 0
      }
      
      setCards(prev => [...prev, newCard])
      
      // Reset form
      setNewCardName('')
      setNewCardBalance('')
      setNewCardCurrency('USDC')
      setNewCardLimits({ single: 1000, daily: 2000, monthly: 5000 })
      
    } catch (error) {
      console.error('Failed to create card:', error)
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteCard = (cardId: string) => {
    setCards(prev => prev.filter(card => card.id !== cardId))
  }

  const handleLockCard = (cardId: string) => {
    setCards(prev => prev.map(card => 
      card.id === cardId 
        ? { ...card, status: card.status === 'active' ? 'locked' : 'active' }
        : card
    ))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'locked': return 'bg-red-100 text-red-800 border-red-200'
      case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatCardNumber = (number: string, masked: boolean = true) => {
    if (masked) {
      return number.replace(/(\d{4})\s(\d{4})\s(\d{4})\s(\d{4})/, '**** **** **** $4')
    }
    return number
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Virtual Cards
          </h1>
          <p className="text-muted-foreground mt-1">Create instant virtual cards for secure online payments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            onClick={() => document.getElementById('create-tab')?.click()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Virtual Card
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-600" />
              Total Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{cards.length}</div>
            <p className="text-sm text-muted-foreground">Active virtual cards</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-emerald-600" />
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cards.reduce((sum, card) => sum + card.balance, 0))}</div>
            <p className="text-sm text-muted-foreground">Across all cards</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600" />
              Monthly Spend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(cards.reduce((sum, card) => sum + card.totalSpent, 0))}</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Security Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98%</div>
            <p className="text-sm text-muted-foreground">Protection level</p>
          </CardContent>
        </Card>
      </div>

      {/* Virtual Cards Management */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-600" />
                Your Virtual Cards
              </CardTitle>
              <CardDescription>
                Manage your instant virtual cards for online purchases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="cards">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cards">Active Cards</TabsTrigger>
                  <TabsTrigger value="create" id="create-tab">Create New</TabsTrigger>
                </TabsList>

                <TabsContent value="cards" className="space-y-4 mt-6">
                  {cards.map((card) => (
                    <div key={card.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{card.name}</div>
                            <div className="text-sm text-muted-foreground font-mono">
                              {formatCardNumber(card.cardNumber, !showCardDetails[card.id])}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(card.status)}>
                            {card.status}
                          </Badge>
                          {card.isTemporary && (
                            <Badge variant="outline" className="text-xs">
                              Temporary
                            </Badge>
                          )}
                        </div>
                      </div>

                      {showCardDetails[card.id] && (
                        <div className="mb-3 p-3 bg-muted rounded-lg">
                          <div className="grid gap-2 text-sm">
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Card Number:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{card.cardNumber}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => copyToClipboard(card.cardNumber.replace(/\s/g, ''))}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">Expiry Date:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{card.expiryDate}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => copyToClipboard(card.expiryDate)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">CVV:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{card.cvv}</span>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => copyToClipboard(card.cvv)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="text-lg font-semibold">{formatCurrency(card.balance)} {card.currency}</div>
                            <div className="text-sm text-muted-foreground">
                              Spent: {formatCurrency(card.totalSpent)} this month
                            </div>
                          </div>
                          {card.merchant && (
                            <div>
                              <div className="text-sm font-medium">{card.merchant}</div>
                              <div className="text-xs text-muted-foreground">{card.merchantCategory}</div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleCardDetails(card.id)}
                          >
                            {showCardDetails[card.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleLockCard(card.id)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteCard(card.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Daily limit: {formatCurrency(card.limits.daily)}</span>
                          <span>Created: {card.createdDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="create" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Card Name</label>
                      <Input
                        placeholder="e.g., Amazon Shopping, Netflix Subscription"
                        value={newCardName}
                        onChange={(e) => setNewCardName(e.target.value)}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Initial Balance</label>
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newCardBalance}
                          onChange={(e) => setNewCardBalance(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Currency</label>
                        <Select value={newCardCurrency} onValueChange={(value: StablecoinSymbol) => setNewCardCurrency(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="USDC">USDC</SelectItem>
                            <SelectItem value="USDT">USDT</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium">Spending Limits</label>
                      <div className="grid gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Single transaction:</span>
                          <Input
                            type="number"
                            className="w-24 h-8 text-xs"
                            value={newCardLimits.single}
                            onChange={(e) => setNewCardLimits({...newCardLimits, single: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Daily limit:</span>
                          <Input
                            type="number"
                            className="w-24 h-8 text-xs"
                            value={newCardLimits.daily}
                            onChange={(e) => setNewCardLimits({...newCardLimits, daily: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Monthly limit:</span>
                          <Input
                            type="number"
                            className="w-24 h-8 text-xs"
                            value={newCardLimits.monthly}
                            onChange={(e) => setNewCardLimits({...newCardLimits, monthly: parseInt(e.target.value) || 0})}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-emerald-700 mb-2">Card Preview</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Name:</span>
                          <span className="font-medium">{newCardName || 'Untitled Card'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Balance:</span>
                          <span className="font-medium">{formatCurrency(parseFloat(newCardBalance) || 0)} {newCardCurrency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily limit:</span>
                          <span className="font-medium">{formatCurrency(newCardLimits.daily)}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      disabled={!newCardName || !newCardBalance || isCreating}
                      onClick={handleCreateCard}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {isCreating ? 'Creating...' : 'Create Virtual Card'}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Virtual Card Benefits */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Virtual Card Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Instant Creation</div>
                  <div className="text-xs text-muted-foreground">Ready in seconds</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Enhanced Security</div>
                  <div className="text-xs text-muted-foreground">Unique card per merchant</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Settings className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Full Control</div>
                  <div className="text-xs text-muted-foreground">Set limits and freeze instantly</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Temporary Cards</div>
                  <div className="text-xs text-muted-foreground">Auto-expire after use</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => {
                  setNewCardName('Temporary Card')
                  document.getElementById('create-tab')?.click()
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Temporary Card
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => window.location.href = '/cards/controls'}
              >
                <Settings className="h-4 w-4 mr-2" />
                Bulk Card Management
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => window.location.href = '/cards'}
              >
                <Globe className="h-4 w-4 mr-2" />
                View Transaction History
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}