'use client'

import { useState } from 'react'
import { Shield, AlertTriangle, DollarSign, TrendingDown, CheckCircle2, Info, Zap, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, StablecoinSymbol } from '@/lib/data'

interface InsuranceProduct {
  id: string
  name: string
  type: 'defi' | 'deposit' | 'depeg'
  coverage: number
  premium: number
  duration: number
  description: string
  features: string[]
  claims: number
  payouts: number
}

const insuranceProducts: InsuranceProduct[] = [
  {
    id: '1',
    name: 'DeFi Smart Contract Protection',
    type: 'defi',
    coverage: 100000,
    premium: 2.5,
    duration: 365,
    description: 'Protection against smart contract bugs and exploits in DeFi protocols',
    features: ['Smart contract coverage', 'Exploit protection', '24/7 monitoring', 'Instant claims'],
    claims: 12,
    payouts: 2500000
  },
  {
    id: '2',
    name: 'Stablecoin Deposit Insurance',
    type: 'deposit',
    coverage: 250000,
    premium: 1.8,
    duration: 365,
    description: 'Protect your stablecoin deposits against platform hacks and insolvency',
    features: ['Platform coverage', 'Custody protection', 'Regulatory compliance', 'FDIC-style coverage'],
    claims: 3,
    payouts: 750000
  },
  {
    id: '3',
    name: 'Stablecoin Depeg Protection',
    type: 'depeg',
    coverage: 50000,
    premium: 3.2,
    duration: 180,
    description: 'Coverage against stablecoin depegging events beyond normal thresholds',
    features: ['Depeg coverage', 'Threshold protection', 'Automatic claims', 'Fast settlement'],
    claims: 8,
    payouts: 400000
  }
]

export default function InsurancePage() {
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct>(insuranceProducts[0])
  const [coverageAmount, setCoverageAmount] = useState('')
  const [selectedStablecoin, setSelectedStablecoin] = useState<StablecoinSymbol>('USDC')

  const annualPremium = coverageAmount ? (parseFloat(coverageAmount) * selectedProduct.premium / 100) : 0
  const monthlyPremium = annualPremium / 12

  const activePolicies = [
    { id: '1', type: 'DeFi Protection', coverage: 25000, premium: 625, expires: '2024-12-15', status: 'active' },
    { id: '2', type: 'Deposit Insurance', coverage: 100000, premium: 1800, expires: '2024-11-20', status: 'active' }
  ]

  const recentClaims = [
    { id: '1', type: 'Smart Contract Exploit', amount: 15000, date: '2024-01-18', status: 'approved' },
    { id: '2', type: 'Depeg Event', amount: 2500, date: '2024-01-10', status: 'processing' }
  ]

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'defi': return <Zap className="h-5 w-5 text-blue-600" />
      case 'deposit': return <Shield className="h-5 w-5 text-green-600" />
      case 'depeg': return <TrendingDown className="h-5 w-5 text-orange-600" />
      default: return <Shield className="h-5 w-5 text-emerald-600" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            DeFi Insurance
          </h1>
          <p className="text-muted-foreground mt-1">Protect your stablecoin investments with comprehensive coverage</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
            <Shield className="h-4 w-4 mr-2" />
            Get Quote
          </Button>
        </div>
      </div>

      {/* Coverage Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Total Coverage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(125000)}</div>
            <p className="text-sm text-muted-foreground">Active policies</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Annual Premium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2425)}</div>
            <p className="text-sm text-muted-foreground">Total cost</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              Claims Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(17500)}</div>
            <p className="text-sm text-muted-foreground">Lifetime</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-600" />
              Avg. Settlement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3</div>
            <p className="text-sm text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Insurance Products */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600" />
                Insurance Products
              </CardTitle>
              <CardDescription>
                Comprehensive protection for your DeFi and stablecoin investments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="products">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="products">Coverage Options</TabsTrigger>
                  <TabsTrigger value="configure">Configure Policy</TabsTrigger>
                </TabsList>

                <TabsContent value="products" className="space-y-4 mt-6">
                  {insuranceProducts.map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedProduct.id === product.id
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-200 hover:border-emerald-200'
                      }`}
                      onClick={() => setSelectedProduct(product)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {getProductIcon(product.type)}
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>Max Coverage: {formatCurrency(product.coverage)}</span>
                              <span>Premium: {product.premium}%</span>
                              <span>Claims: {product.claims}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-600">{product.premium}%</div>
                          <div className="text-sm text-muted-foreground">Annual</div>
                        </div>
                      </div>
                      
                      <div className="mt-3 flex flex-wrap gap-1">
                        {product.features.map((feature, index) => (
                          <span key={index} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="configure" className="space-y-6 mt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Coverage Amount</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={coverageAmount}
                        onChange={(e) => setCoverageAmount(e.target.value)}
                        className="text-lg h-12"
                      />
                      <div className="text-sm text-muted-foreground">
                        Maximum: {formatCurrency(selectedProduct.coverage)}
                      </div>
                    </div>

                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-emerald-700 mb-3">Policy Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Coverage amount:</span>
                          <span className="font-medium">{formatCurrency(parseFloat(coverageAmount || '0'))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual premium ({selectedProduct.premium}%):</span>
                          <span className="font-medium">{formatCurrency(annualPremium)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Monthly premium:</span>
                          <span className="font-medium">{formatCurrency(monthlyPremium)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Policy duration:</span>
                          <span className="font-medium">{selectedProduct.duration} days</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-2 border-t border-emerald-200">
                          <span>Total cost:</span>
                          <span>{formatCurrency(annualPremium)}</span>
                        </div>
                      </div>
                    </div>

                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      disabled={!coverageAmount || parseFloat(coverageAmount) <= 0}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Purchase Policy
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Policy Status */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Active Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activePolicies.map((policy) => (
                <div key={policy.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">{policy.type}</div>
                    <Badge className="bg-green-100 text-green-700 text-xs">Active</Badge>
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Coverage:</span>
                      <span>{formatCurrency(policy.coverage)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Premium:</span>
                      <span>{formatCurrency(policy.premium)}/year</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expires:</span>
                      <span>{policy.expires}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Why Get Insured?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Peace of Mind</div>
                  <div className="text-xs text-muted-foreground">Sleep well knowing you're covered</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Fast Claims</div>
                  <div className="text-xs text-muted-foreground">Quick settlement process</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Competitive Rates</div>
                  <div className="text-xs text-muted-foreground">Industry-leading premiums</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Claims */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Claims</CardTitle>
          <CardDescription>
            Your insurance claim history and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentClaims.map((claim) => (
              <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="font-medium">{claim.type}</div>
                    <div className="text-sm text-muted-foreground">Claim date: {claim.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{formatCurrency(claim.amount)}</div>
                  <Badge 
                    variant={claim.status === 'approved' ? 'default' : 'secondary'}
                    className={claim.status === 'approved' ? 'bg-green-100 text-green-700' : ''}
                  >
                    {claim.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}