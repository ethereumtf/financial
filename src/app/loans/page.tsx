'use client'

import { useState, useEffect } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { DollarSign, TrendingDown, Shield, AlertTriangle, Calculator, Plus, ArrowRight, Info, Zap, Brain, Target, Clock, CheckCircle, Activity } from 'lucide-react'
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
  aiOptimized: boolean
  riskCategory: 'low' | 'medium' | 'high'
}

interface AILoanAnalysis {
  creditScore: number
  riskAssessment: string
  recommendedAmount: number
  recommendedRate: number
  loanPurpose: string
  repaymentCapacity: number
  suggestions: string[]
}

interface LoanApplication {
  id: string
  amount: number
  collateralAsset: string
  collateralAmount: number
  interestRate: number
  duration: number
  status: 'pending' | 'approved' | 'rejected' | 'active'
  aiAnalysis: AILoanAnalysis
  createdAt: string
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
    features: ['No prepayment penalty', 'Flexible terms', 'Auto-liquidation protection'],
    aiOptimized: true,
    riskCategory: 'low'
  },
  {
    id: '2',
    name: 'USDT Express Loan',
    interestRate: 9.2,
    maxAmount: 500000,
    minAmount: 500,
    maxDuration: 180,
    stablecoin: 'USDT',
    features: ['Quick approval', 'Lower collateral requirements', 'Fixed rate'],
    aiOptimized: true,
    riskCategory: 'medium'
  },
  {
    id: '3',
    name: 'AI-Optimized Loan',
    interestRate: 7.8,
    maxAmount: 2000000,
    minAmount: 2500,
    maxDuration: 730,
    stablecoin: 'USDC',
    features: ['AI risk assessment', 'Dynamic rates', 'Smart collateral management', 'Predictive analytics'],
    aiOptimized: true,
    riskCategory: 'low'
  }
]

export default function LoansPage() {
  const [selectedCollateral, setSelectedCollateral] = useState<CollateralAsset>(collateralAssets[0])
  const [collateralAmount, setCollateralAmount] = useState('')
  const [loanAmount, setLoanAmount] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<LoanProduct>(loanProducts[0])
  const [duration, setDuration] = useState('30')
  const [aiAnalysis, setAiAnalysis] = useState<AILoanAnalysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)
  const [loanApplications, setLoanApplications] = useState<LoanApplication[]>([])
  const [selectedTab, setSelectedTab] = useState('apply')
  const [loanPurpose, setLoanPurpose] = useState('')

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

  const performAIAnalysis = async () => {
    if (!loanAmount || !collateralAmount || !loanPurpose) return
    
    setIsAnalyzing(true)
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const analysis: AILoanAnalysis = {
        creditScore: Math.floor(Math.random() * 200) + 650,
        riskAssessment: currentLTV < 50 ? 'Low Risk' : currentLTV < 65 ? 'Medium Risk' : 'High Risk',
        recommendedAmount: Math.min(parseFloat(loanAmount), maxLoanAmount * 0.9),
        recommendedRate: selectedProduct.interestRate - (currentLTV < 50 ? 1.5 : currentLTV < 65 ? 0.5 : 0),
        loanPurpose,
        repaymentCapacity: Math.floor(Math.random() * 40) + 60,
        suggestions: [
          'Consider increasing collateral for better rates',
          'Shorter loan terms may reduce total interest',
          'Auto-payment setup available for 0.2% rate discount'
        ]
      }
      
      setAiAnalysis(analysis)
    } catch (error) {
      console.error('AI Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleLoanApplication = async () => {
    if (!loanAmount || !collateralAmount || !aiAnalysis) return
    
    setIsApplying(true)
    try {
      // Simulate loan application
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newApplication: LoanApplication = {
        id: Date.now().toString(),
        amount: parseFloat(loanAmount),
        collateralAsset: selectedCollateral.symbol,
        collateralAmount: parseFloat(collateralAmount),
        interestRate: aiAnalysis.recommendedRate,
        duration: parseInt(duration),
        status: 'pending',
        aiAnalysis,
        createdAt: new Date().toISOString()
      }
      
      setLoanApplications(prev => [...prev, newApplication])
      alert(`Loan application submitted successfully! Application ID: ${newApplication.id}`)
      
      // Reset form
      setLoanAmount('')
      setCollateralAmount('')
      setLoanPurpose('')
      setAiAnalysis(null)
      setSelectedTab('manage')
    } catch (error) {
      console.error('Loan application failed:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleQuickAction = (action: string, loanId?: string) => {
    switch (action) {
      case 'new-loan':
        setSelectedTab('apply')
        break
      case 'calculator':
        alert('Loan calculator would open here')
        break
      case 'repay':
        alert(`Processing repayment for loan ${loanId}`)
        break
      case 'adjust-collateral':
        alert(`Adjusting collateral for loan ${loanId}`)
        break
      default:
        break
    }
  }

  const risk = getRiskLevel(currentLTV)

  return (
    <AuthGuard>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Crypto Loans
          </h1>
          <p className="text-muted-foreground mt-1">Get instant stablecoin loans using your crypto as collateral</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            onClick={() => handleQuickAction('new-loan')}
          >
            <Plus className="h-4 w-4 mr-2" />
            New Loan
          </Button>
          <Button 
            variant="outline" 
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            onClick={() => handleQuickAction('calculator')}
          >
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
                <Brain className="h-5 w-5 text-emerald-600" />
                AI-Powered Loan Center
              </CardTitle>
              <CardDescription>
                Apply for loans with AI analysis and get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="apply">Apply for Loan</TabsTrigger>
                  <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
                  <TabsTrigger value="manage">Manage Loans</TabsTrigger>
                </TabsList>

                <TabsContent value="apply" className="space-y-6 mt-6">
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
                              {product.aiOptimized && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">
                                  <Brain className="h-3 w-3 mr-1" />
                                  AI Optimized
                                </Badge>
                              )}
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

                  {/* Loan Purpose */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Loan Purpose</label>
                    <Input
                      type="text"
                      placeholder="e.g., Business expansion, investment, personal use"
                      value={loanPurpose}
                      onChange={(e) => setLoanPurpose(e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground">
                      This helps our AI provide better loan recommendations
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
                  
                  {/* AI Analysis Trigger */}
                  {loanAmount && collateralAmount && loanPurpose && (
                    <div className="flex justify-center">
                      <Button
                        onClick={performAIAnalysis}
                        disabled={isAnalyzing}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {isAnalyzing ? 'Analyzing...' : 'Get AI Analysis'}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6 mt-6">
                  {aiAnalysis ? (
                    <div className="space-y-6">
                      <div className="p-6 border rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          AI Loan Analysis
                        </h3>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Credit Score:</span>
                              <span className="font-bold text-lg">{aiAnalysis.creditScore}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Risk Assessment:</span>
                              <Badge className={getRiskLevel(currentLTV).color}>
                                {aiAnalysis.riskAssessment}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Recommended Amount:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(aiAnalysis.recommendedAmount)}
                              </span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Recommended Rate:</span>
                              <span className="font-medium text-emerald-600">
                                {aiAnalysis.recommendedRate.toFixed(2)}% APR
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Repayment Capacity:</span>
                              <span className="font-medium">{aiAnalysis.repaymentCapacity}%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm font-medium">Loan Purpose:</span>
                              <span className="font-medium">{aiAnalysis.loanPurpose}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          AI Recommendations
                        </h4>
                        <ul className="space-y-1">
                          {aiAnalysis.suggestions.map((suggestion, index) => (
                            <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                              <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button
                        onClick={() => setSelectedTab('apply')}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Proceed with Application
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Brain className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">AI Analysis Required</h3>
                      <p className="text-muted-foreground mb-4">
                        Complete the loan application form and click "Get AI Analysis" to see personalized recommendations.
                      </p>
                      <Button
                        onClick={() => setSelectedTab('apply')}
                        variant="outline"
                      >
                        Go to Application
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="manage" className="space-y-6 mt-6">
                  {loanApplications.length > 0 ? (
                    <div className="space-y-4">
                      {loanApplications.map((application) => (
                        <div key={application.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {formatCurrency(application.amount)} {selectedProduct.stablecoin} Loan
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  Collateral: {application.collateralAmount} {application.collateralAsset}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`${
                                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    application.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                    'bg-red-100 text-red-800'
                                  } text-xs`}>
                                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  </Badge>
                                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                                    AI Score: {application.aiAnalysis.creditScore}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-600">
                                {application.interestRate.toFixed(2)}% APR
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {application.duration} days
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Activity className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {application.status === 'active' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleQuickAction('repay', application.id)}
                                >
                                  <DollarSign className="h-4 w-4 mr-1" />
                                  Make Payment
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleQuickAction('adjust-collateral', application.id)}
                                >
                                  <Shield className="h-4 w-4 mr-1" />
                                  Adjust Collateral
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <DollarSign className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Loan Applications</h3>
                      <p className="text-muted-foreground mb-4">
                        You haven't applied for any loans yet. Start by creating your first loan application.
                      </p>
                      <Button
                        onClick={() => setSelectedTab('apply')}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Apply for Loan
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              {/* Final Application Button */}
              {selectedTab === 'apply' && aiAnalysis && (
                <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                  <h4 className="font-semibold text-emerald-700 mb-3">Ready to Apply</h4>
                  <div className="grid gap-2 md:grid-cols-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span>AI Recommended Amount:</span>
                      <span className="font-medium">{formatCurrency(aiAnalysis.recommendedAmount)} {selectedProduct.stablecoin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Optimized Rate:</span>
                      <span className="font-medium">{aiAnalysis.recommendedRate.toFixed(2)}% APR</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleLoanApplication}
                    disabled={isApplying}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    {isApplying ? 'Submitting Application...' : 'Submit AI-Optimized Loan Application'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Collateral & AI Sidebar */}
        <div className="space-y-4">
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-600" />
                AI Loan Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Smart Risk Assessment</div>
                  <div className="text-xs text-muted-foreground">AI-powered credit scoring</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Dynamic Rate Optimization</div>
                  <div className="text-xs text-muted-foreground">Personalized interest rates</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Real-time Analysis</div>
                  <div className="text-xs text-muted-foreground">Instant loan recommendations</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Predictive Monitoring</div>
                  <div className="text-xs text-muted-foreground">Early risk detection</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Loan Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Instant AI Approval</div>
                  <div className="text-xs text-muted-foreground">Get funds in minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">No Traditional Credit Check</div>
                  <div className="text-xs text-muted-foreground">Crypto-backed loans only</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">AI-Optimized Rates</div>
                  <div className="text-xs text-muted-foreground">Starting from 7.8% APR</div>
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
                    <div className="text-sm text-muted-foreground mb-2">
                      Next payment: {loan.nextPayment}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('repay', loan.id)}
                      >
                        <DollarSign className="h-3 w-3 mr-1" />
                        Pay
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleQuickAction('adjust-collateral', loan.id)}
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Adjust
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      </div>
    </AuthGuard>
  )
}