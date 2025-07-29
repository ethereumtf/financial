'use client'

import { useState } from 'react'
import { DollarSign, TrendingDown, Shield, AlertTriangle, Calculator, Plus, ArrowRight, Info, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, StablecoinSymbol } from '@/lib/data'

interface CollateralAsset {
  symbol: string
  name: string
  price: number
  maxLTV: number // Maximum Loan-to-Value ratio
  liquidationThreshold: number
  balance: number
  icon: string
}

interface LoanProduct {
  id: string
  name: string
  interestRate: number
  maxAmount: number
  minAmount: number
  maxDuration: number // in days
  stablecoin: StablecoinSymbol
  features: string[]
}

const collateralAssets: CollateralAsset[] = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: 42150.00,
    maxLTV: 70,
    liquidationThreshold: 75,
    balance: 0.5,
    icon: '₿'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: 2580.00,
    maxLTV: 75,
    liquidationThreshold: 80,
    balance: 8.2,
    icon: 'Ξ'
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    price: 98.50,
    maxLTV: 65,
    liquidationThreshold: 70,
    balance: 120.0,
    icon: '◎'
  }
]

const loanProducts: LoanProduct[] = [
  {
    id: '1',
    name: 'USDC Standard Loan',
    interestRate: 8.5,
    maxAmount: 1000000,
    minAmount: 1000,
    maxDuration: 365,
    stablecoin: 'USDC',
    features: ['No prepayment penalty', 'Flexible terms', 'Auto-liquidation protection']
  },
  {
    id: '2',
    name: 'USDT Express Loan',
    interestRate: 9.2,
    maxAmount: 500000,
    minAmount: 500,
    maxDuration: 180,
    stablecoin: 'USDT',
    features: ['Quick approval', 'Lower collateral requirements', 'Fixed rate']
  }
]

export default function LoansPage() {
  const [selectedCollateral, setSelectedCollateral] = useState<CollateralAsset>(collateralAssets[0])
  const [collateralAmount, setCollateralAmount] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct>(loanProducts[0])
  const [duration, setDuration] = useState('30')

  const collateralValue = collateralAmount ? parseFloat(collateralAmount) * selectedCollateral.price : 0
  const maxLoanAmount = collateralValue * (selectedCollateral.maxLTV / 100)
  const currentLTV = loanAmount && collateralValue ? (parseFloat(loanAmount) / collateralValue) * 100 : 0
  const liquidationPrice = loanAmount && collateralAmount ? 
    (parseFloat(loanAmount) / (parseFloat(collateralAmount) * (selectedCollateral.liquidationThreshold / 100))) : 0
  
  const monthlyPayment = loanAmount && duration ? 
    (parseFloat(loanAmount) * (selectedProduct.interestRate / 100) / 12) + (parseFloat(loanAmount) / parseInt(duration)) : 0

  const existingLoans = [
    { id: '1', amount: 15000, collateral: 'ETH', collateralAmount: 8.2, ltv: 65, status: 'active', nextPayment: '2024-02-01' },
    { id: '2', amount: 8500, collateral: 'BTC', collateralAmount: 0.25, ltv: 58, status: 'active', nextPayment: '2024-02-05' }
  ]

  const getRiskLevel = (ltv: number) => {
    if (ltv < 50) return { level: 'Low', color: 'bg-green-100 text-green-800 border-green-200' }
    if (ltv < 65) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' }
    return { level: 'High', color: 'bg-red-100 text-red-800 border-red-200' }
  }

  const risk = getRiskLevel(currentLTV)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Crypto Loans
          </h1>
          <p className="text-muted-foreground mt-1">Get instant stablecoin loans using your crypto as collateral</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
          <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </Button>
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              Total Borrowed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(23500)}</div>
            <p className="text-sm text-muted-foreground">Active loans</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-emerald-600" />
              Collateral Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(42350)}</div>
            <p className="text-sm text-muted-foreground">Total locked</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="h-4 w-4 text-yellow-600" />
              Avg. LTV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">61.5%</div>
            <p className="text-sm text-muted-foreground">Loan-to-value</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-emerald-600" />
              Health Factor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1.28</div>
            <p className="text-sm text-muted-foreground">Safe</p>
          </CardContent>
        </Card>
      </div>

      {/* Loan Application */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-emerald-600" />
                Apply for Loan
              </CardTitle>
              <CardDescription>
                Use your crypto assets as collateral for instant stablecoin loans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="configure">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="configure">Configure Loan</TabsTrigger>
                  <TabsTrigger value="review">Review & Apply</TabsTrigger>
                </TabsList>

                <TabsContent value="configure" className="space-y-6 mt-6">
                  {/* Loan Product Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Loan Product</label>
                    <div className="grid gap-3">
                      {loanProducts.map((product) => (
                        <div
                          key={product.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            selectedProduct.id === product.id
                              ? 'border-emerald-300 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-200'
                          }`}
                          onClick={() => setSelectedProduct(product)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Min: {formatCurrency(product.minAmount)} • Max: {formatCurrency(product.maxAmount)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-emerald-600">{product.interestRate}%</div>
                              <div className="text-sm text-muted-foreground">APR</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Collateral Selection */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Collateral Asset</label>
                      <Select value={selectedCollateral.symbol} onValueChange={(symbol) => 
                        setSelectedCollateral(collateralAssets.find(a => a.symbol === symbol) || collateralAssets[0])
                      }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {collateralAssets.map((asset) => (
                            <SelectItem key={asset.symbol} value={asset.symbol}>
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{asset.icon}</span>
                                <span>{asset.name} ({asset.symbol})</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="text-sm text-muted-foreground">
                        Available: {selectedCollateral.balance} {selectedCollateral.symbol}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Collateral Amount</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={collateralAmount}
                        onChange={(e) => setCollateralAmount(e.target.value)}
                        step="0.001"
                      />
                      <div className="text-sm text-muted-foreground">
                        Value: {formatCurrency(collateralValue)}
                      </div>
                    </div>
                  </div>

                  {/* Loan Amount */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Loan Amount ({selectedProduct.stablecoin})</label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        step="0.01"
                      />
                      <div className="text-sm text-muted-foreground">
                        Max available: {formatCurrency(maxLoanAmount)}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Duration (days)</label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">365 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Risk Metrics */}
                  {loanAmount && collateralAmount && (
                    <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                      <h4 className="font-semibold text-emerald-700 mb-3">Loan Metrics</h4>
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Loan-to-Value (LTV):</span>
                            <span className="font-medium">{currentLTV.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Liquidation price:</span>
                            <span className="font-medium">{formatCurrency(liquidationPrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Risk level:</span>
                            <Badge className={`${risk.color} text-xs`}>
                              {risk.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Monthly payment:</span>
                            <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total interest:</span>
                            <span className="font-medium">{formatCurrency(monthlyPayment * parseInt(duration) / 30 - parseFloat(loanAmount || '0'))}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>APR:</span>
                            <span className="font-medium">{selectedProduct.interestRate}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="review" className="space-y-6 mt-6">
                  <div className="p-6 border rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                    <h3 className="font-semibold text-lg mb-4">Loan Summary</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Loan Amount:</span>
                          <span className="font-medium">{formatCurrency(parseFloat(loanAmount || '0'))} {selectedProduct.stablecoin}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Collateral:</span>
                          <span className="font-medium">{collateralAmount} {selectedCollateral.symbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Duration:</span>
                          <span className="font-medium">{duration} days</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Interest Rate:</span>
                          <span className="font-medium">{selectedProduct.interestRate}% APR</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">LTV Ratio:</span>
                          <span className="font-medium">{currentLTV.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Monthly Payment:</span>
                          <span className="font-medium">{formatCurrency(monthlyPayment)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                    disabled={!loanAmount || !collateralAmount || currentLTV > selectedCollateral.maxLTV}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Apply for Loan
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Collateral Assets */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                Available Collateral
              </CardTitle>
              <CardDescription>
                Your crypto assets available for loans
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {collateralAssets.map((asset) => (
                <div key={asset.symbol} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{asset.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{asset.name}</div>
                        <div className="text-xs text-muted-foreground">{formatCurrency(asset.price)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{asset.balance}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(asset.balance * asset.price)}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Max LTV: {asset.maxLTV}% • Liquidation: {asset.liquidationThreshold}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-base">Loan Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Instant Approval</div>
                  <div className="text-xs text-muted-foreground">Get funds in minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">No Credit Check</div>
                  <div className="text-xs text-muted-foreground">Crypto-backed loans only</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Competitive Rates</div>
                  <div className="text-xs text-muted-foreground">Starting from 8.5% APR</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Existing Loans */}
      {existingLoans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Active Loans</CardTitle>
            <CardDescription>
              Manage your existing crypto-backed loans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-emerald-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium">{formatCurrency(loan.amount)} USDC Loan</div>
                      <div className="text-sm text-muted-foreground">
                        Collateral: {loan.collateralAmount} {loan.collateral} • LTV: {loan.ltv}%
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getRiskLevel(loan.ltv).color} mb-1`}>
                      {getRiskLevel(loan.ltv).level} Risk
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      Next payment: {loan.nextPayment}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}