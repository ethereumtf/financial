'use client'

import { useState } from 'react'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { Shield, DollarSign, TrendingDown, CheckCircle2, Zap, Clock, Brain, Target, Plus, FileText, Activity, Settings, Eye, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, StablecoinSymbol } from '@/lib/data'

interface InsuranceProduct {
  id: string
  name: string
  type: 'defi' | 'deposit' | 'depeg' | 'cyber' | 'custody'
  coverage: number
  premium: number
  duration: number
  description: string
  features: string[]
  claims: number
  payouts: number
  aiOptimized: boolean
  riskCategory: 'low' | 'medium' | 'high'
  minCoverage: number
}

interface AIRiskAssessment {
  riskScore: number
  riskCategory: string
  recommendedCoverage: number
  recommendedPremium: number
  riskFactors: string[]
  suggestions: string[]
  confidence: number
}

interface InsurancePolicy {
  id: string
  productId: string
  productName: string
  coverage: number
  premium: number
  startDate: string
  endDate: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  claimsCount: number
  aiRiskScore: number
}

interface InsuranceClaim {
  id: string
  policyId: string
  type: string
  amount: number
  description: string
  date: string
  status: 'pending' | 'investigating' | 'approved' | 'rejected' | 'paid'
  aiConfidence: number
  documents: string[]
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
    payouts: 2500000,
    aiOptimized: true,
    riskCategory: 'medium',
    minCoverage: 1000
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
    payouts: 750000,
    aiOptimized: true,
    riskCategory: 'low',
    minCoverage: 5000
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
    payouts: 400000,
    aiOptimized: true,
    riskCategory: 'high',
    minCoverage: 500
  },
  {
    id: '4',
    name: 'AI-Powered Cyber Security',
    type: 'cyber',
    coverage: 500000,
    premium: 2.1,
    duration: 365,
    description: 'Advanced AI-driven protection against cyber attacks and wallet compromises',
    features: ['AI threat detection', 'Real-time monitoring', 'Behavioral analysis', 'Multi-sig protection'],
    claims: 5,
    payouts: 875000,
    aiOptimized: true,
    riskCategory: 'medium',
    minCoverage: 10000
  },
  {
    id: '5',
    name: 'Custody Insurance Plus',
    type: 'custody',
    coverage: 1000000,
    premium: 1.5,
    duration: 365,
    description: 'Comprehensive custody protection with AI-enhanced security monitoring',
    features: ['Cold storage coverage', 'Key management', 'AI anomaly detection', 'Institutional grade'],
    claims: 2,
    payouts: 450000,
    aiOptimized: true,
    riskCategory: 'low',
    minCoverage: 25000
  }
]

export default function InsurancePage() {
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct>(insuranceProducts[0])
  const [coverageAmount, setCoverageAmount] = useState('')
  // const [selectedStablecoin, setSelectedStablecoin] = useState<StablecoinSymbol>('USDC')
  const [selectedTab, setSelectedTab] = useState('products')
  const [aiRiskAssessment, setAiRiskAssessment] = useState<AIRiskAssessment | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [riskProfile, setRiskProfile] = useState('')
  const [portfolioValue, setPortfolioValue] = useState('')
  const [policies, setPolicies] = useState<InsurancePolicy[]>([])
  const [claims, setClaims] = useState<InsuranceClaim[]>([])
  // const [isSubmittingClaim, setIsSubmittingClaim] = useState(false)

  const annualPremium = coverageAmount ? (parseFloat(coverageAmount) * selectedProduct.premium / 100) : 0
  // const monthlyPremium = annualPremium / 12

  const activePolicies: InsurancePolicy[] = [
    { 
      id: '1', 
      productId: '1',
      productName: 'DeFi Protection', 
      coverage: 25000, 
      premium: 625, 
      startDate: '2024-01-15',
      endDate: '2024-12-15', 
      status: 'active',
      claimsCount: 0,
      aiRiskScore: 750
    },
    { 
      id: '2', 
      productId: '2',
      productName: 'Deposit Insurance', 
      coverage: 100000, 
      premium: 1800, 
      startDate: '2023-11-20',
      endDate: '2024-11-20', 
      status: 'active',
      claimsCount: 1,
      aiRiskScore: 820
    }
  ]

  const recentClaims: InsuranceClaim[] = [
    { 
      id: '1', 
      policyId: '1',
      type: 'Smart Contract Exploit', 
      amount: 15000, 
      description: 'Exploit in DeFi protocol resulting in fund loss',
      date: '2024-01-18', 
      status: 'approved',
      aiConfidence: 95,
      documents: ['exploit_report.pdf', 'transaction_proof.json']
    },
    { 
      id: '2', 
      policyId: '2',
      type: 'Depeg Event', 
      amount: 2500, 
      description: 'USDC depegging event below threshold',
      date: '2024-01-10', 
      status: 'investigating',
      aiConfidence: 87,
      documents: ['depeg_evidence.pdf']
    }
  ]

  const performAIRiskAssessment = async () => {
    if (!coverageAmount || !portfolioValue || !riskProfile) return
    
    setIsAnalyzing(true)
    try {
      // Simulate AI risk assessment
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const riskScore = Math.floor(Math.random() * 300) + 500 // 500-800 range
      const riskCategory = riskScore > 700 ? 'Low Risk' : riskScore > 600 ? 'Medium Risk' : 'High Risk'
      const baseMultiplier = riskScore > 700 ? 0.8 : riskScore > 600 ? 1.0 : 1.3
      
      const assessment: AIRiskAssessment = {
        riskScore,
        riskCategory,
        recommendedCoverage: Math.min(parseFloat(coverageAmount), selectedProduct.coverage),
        recommendedPremium: selectedProduct.premium * baseMultiplier,
        riskFactors: [
          riskProfile === 'conservative' ? 'Low trading frequency' : 'High trading activity',
          parseFloat(portfolioValue) > 100000 ? 'Large portfolio size' : 'Moderate portfolio size',
          selectedProduct.type === 'defi' ? 'DeFi protocol exposure' : 'Traditional custody model'
        ],
        suggestions: [
          'Consider diversifying across multiple insurance products',
          'Enable 2FA and hardware wallet for better rates',
          'Regular portfolio monitoring can reduce premiums'
        ],
        confidence: Math.floor(Math.random() * 20) + 80 // 80-100%
      }
      
      setAiRiskAssessment(assessment)
    } catch (error) {
      console.error('AI Risk Assessment failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePolicyPurchase = async () => {
    if (!coverageAmount || !aiRiskAssessment) return
    
    setIsPurchasing(true)
    try {
      // Simulate policy purchase
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newPolicy: InsurancePolicy = {
        id: Date.now().toString(),
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        coverage: parseFloat(coverageAmount),
        premium: aiRiskAssessment.recommendedPremium * parseFloat(coverageAmount) / 100,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + selectedProduct.duration * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'active',
        claimsCount: 0,
        aiRiskScore: aiRiskAssessment.riskScore
      }
      
      setPolicies(prev => [...prev, newPolicy])
      alert(`Insurance policy purchased successfully! Policy ID: ${newPolicy.id}`)
      
      // Reset form
      setCoverageAmount('')
      setPortfolioValue('')
      setRiskProfile('')
      setAiRiskAssessment(null)
      setSelectedTab('manage')
    } catch (error) {
      console.error('Policy purchase failed:', error)
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleClaimSubmission = async (policyId: string, claimAmount: string, description: string) => {
    // setIsSubmittingClaim(true)
    try {
      // Simulate claim submission with AI validation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newClaim: InsuranceClaim = {
        id: Date.now().toString(),
        policyId,
        type: selectedProduct.name,
        amount: parseFloat(claimAmount),
        description,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        aiConfidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        documents: []
      }
      
      setClaims(prev => [...prev, newClaim])
      alert(`Claim submitted successfully! Claim ID: ${newClaim.id}`)
    } catch (error) {
      console.error('Claim submission failed:', error)
    } finally {
      // setIsSubmittingClaim(false)
    }
  }

  const handleQuickAction = (action: string, id?: string) => {
    switch (action) {
      case 'get-quote':
        setSelectedTab('configure')
        break
      case 'view-policy':
        alert(`Viewing policy details for ${id}`)
        break
      case 'renew-policy':
        alert(`Renewing policy ${id}`)
        break
      case 'file-claim':
        const claimAmount = prompt('Enter claim amount:')
        const description = prompt('Enter claim description:')
        if (claimAmount && description && id) {
          handleClaimSubmission(id, claimAmount, description)
        }
        break
      case 'view-claim':
        alert(`Viewing claim details for ${id}`)
        break
      default:
        break
    }
  }

  const getProductIcon = (type: string) => {
    switch (type) {
      case 'defi': return <Zap className="h-5 w-5 text-blue-600" />
      case 'deposit': return <Shield className="h-5 w-5 text-green-600" />
      case 'depeg': return <TrendingDown className="h-5 w-5 text-orange-600" />
      case 'cyber': return <Brain className="h-5 w-5 text-purple-600" />
      case 'custody': return <Settings className="h-5 w-5 text-indigo-600" />
      default: return <Shield className="h-5 w-5 text-emerald-600" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const totalCoverage = [...activePolicies, ...policies].reduce((sum, policy) => sum + policy.coverage, 0)
  const totalPremiums = [...activePolicies, ...policies].reduce((sum, policy) => sum + policy.premium, 0)

  return (
    <AuthGuard>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            AI-Powered Insurance
          </h1>
          <p className="text-muted-foreground mt-1">Protect your digital assets with intelligent, comprehensive coverage</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            onClick={() => handleQuickAction('get-quote')}
          >
            <Shield className="h-4 w-4 mr-2" />
            Get AI Quote
          </Button>
          <Button 
            variant="outline" 
            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            onClick={() => setSelectedTab('claims')}
          >
            <FileText className="h-4 w-4 mr-2" />
            File Claim
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
            <div className="text-2xl font-bold text-emerald-600">{formatCurrency(totalCoverage)}</div>
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
            <div className="text-2xl font-bold">{formatCurrency(totalPremiums)}</div>
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
                <Brain className="h-5 w-5 text-emerald-600" />
                AI-Powered Insurance Center
              </CardTitle>
              <CardDescription>
                Intelligent protection with AI risk assessment and dynamic pricing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="configure">AI Quote</TabsTrigger>
                  <TabsTrigger value="manage">My Policies</TabsTrigger>
                  <TabsTrigger value="claims">Claims</TabsTrigger>
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
                          {product.aiOptimized && (
                            <Badge className="bg-purple-100 text-purple-800 text-xs mt-1">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Enhanced
                            </Badge>
                          )}
                          <Badge className={`${getRiskColor(product.riskCategory)} text-xs mt-1`}>
                            {product.riskCategory.charAt(0).toUpperCase() + product.riskCategory.slice(1)} Risk
                          </Badge>
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
                    {/* Risk Profile Assessment */}
                    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-700 mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        AI Risk Assessment
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Portfolio Value</label>
                          <Input
                            type="number"
                            placeholder="Total portfolio value"
                            value={portfolioValue}
                            onChange={(e) => setPortfolioValue(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Risk Profile</label>
                          <select
                            className="w-full p-2 border rounded-md"
                            value={riskProfile}
                            onChange={(e) => setRiskProfile(e.target.value)}
                          >
                            <option value="">Select risk profile</option>
                            <option value="conservative">Conservative</option>
                            <option value="moderate">Moderate</option>
                            <option value="aggressive">Aggressive</option>
                          </select>
                        </div>
                      </div>
                    </div>
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
                        Minimum: {formatCurrency(selectedProduct.minCoverage)} • Maximum: {formatCurrency(selectedProduct.coverage)}
                      </div>
                    </div>

                    {/* AI Analysis Trigger */}
                    {coverageAmount && portfolioValue && riskProfile && (
                      <div className="flex justify-center">
                        <Button
                          onClick={performAIRiskAssessment}
                          disabled={isAnalyzing}
                          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
                        >
                          <Brain className="h-4 w-4 mr-2" />
                          {isAnalyzing ? 'Analyzing Risk...' : 'Get AI Assessment'}
                        </Button>
                      </div>
                    )}

                    {/* AI Assessment Results */}
                    {aiRiskAssessment && (
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          AI Risk Analysis
                        </h4>
                        <div className="grid gap-3 md:grid-cols-2 text-sm">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Risk Score:</span>
                              <span className="font-bold">{aiRiskAssessment.riskScore}/1000</span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Risk Category:</span>
                              <Badge className={getRiskColor(aiRiskAssessment.riskCategory.toLowerCase().replace(' risk', ''))}>
                                {aiRiskAssessment.riskCategory}
                              </Badge>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>AI Confidence:</span>
                              <span className="font-medium">{aiRiskAssessment.confidence}%</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between mb-1">
                              <span>Recommended Coverage:</span>
                              <span className="font-medium text-green-600">
                                {formatCurrency(aiRiskAssessment.recommendedCoverage)}
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Optimized Premium:</span>
                              <span className="font-medium text-emerald-600">
                                {aiRiskAssessment.recommendedPremium.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3">
                          <h5 className="font-medium text-blue-800 mb-2">Risk Factors:</h5>
                          <ul className="text-xs text-blue-700 space-y-1">
                            {aiRiskAssessment.riskFactors.map((factor, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {factor}
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-3">
                          <h5 className="font-medium text-blue-800 mb-2">AI Recommendations:</h5>
                          <ul className="text-xs text-blue-700 space-y-1">
                            {aiRiskAssessment.suggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <Brain className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Policy Summary */}
                    {aiRiskAssessment && (
                      <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                        <h4 className="font-semibold text-emerald-700 mb-3">AI-Optimized Policy Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Coverage amount:</span>
                            <span className="font-medium">{formatCurrency(aiRiskAssessment.recommendedCoverage)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>AI-optimized premium ({aiRiskAssessment.recommendedPremium.toFixed(2)}%):</span>
                            <span className="font-medium">{formatCurrency(aiRiskAssessment.recommendedCoverage * aiRiskAssessment.recommendedPremium / 100)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly premium:</span>
                            <span className="font-medium">{formatCurrency(aiRiskAssessment.recommendedCoverage * aiRiskAssessment.recommendedPremium / 100 / 12)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Policy duration:</span>
                            <span className="font-medium">{selectedProduct.duration} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Risk Score:</span>
                            <span className="font-medium">{aiRiskAssessment.riskScore}/1000</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t border-emerald-200">
                            <span>Total annual cost:</span>
                            <span>{formatCurrency(aiRiskAssessment.recommendedCoverage * aiRiskAssessment.recommendedPremium / 100)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      disabled={!aiRiskAssessment || isPurchasing}
                      onClick={handlePolicyPurchase}
                    >
                      <Brain className="h-4 w-4 mr-2" />
                      {isPurchasing ? 'Processing...' : 'Purchase AI-Optimized Policy'}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="manage" className="space-y-4 mt-6">
                  {[...activePolicies, ...policies].length > 0 ? (
                    <div className="space-y-4">
                      {[...activePolicies, ...policies].map((policy) => (
                        <div key={policy.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <Shield className="h-6 w-6 text-emerald-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{policy.productName}</h3>
                                <p className="text-sm text-muted-foreground">
                                  Coverage: {formatCurrency(policy.coverage)} • Premium: {formatCurrency(policy.premium)}/year
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`${
                                    policy.status === 'active' ? 'bg-green-100 text-green-800' :
                                    policy.status === 'expired' ? 'bg-red-100 text-red-800' :
                                    policy.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  } text-xs`}>
                                    {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
                                  </Badge>
                                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                                    AI Score: {policy.aiRiskScore}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    Claims: {policy.claimsCount}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground mb-2">
                                Expires: {policy.endDate}
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleQuickAction('view-policy', policy.id)}
                                >
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleQuickAction('file-claim', policy.id)}
                                >
                                  <FileText className="h-3 w-3 mr-1" />
                                  Claim
                                </Button>
                                {policy.status === 'active' && (
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => handleQuickAction('renew-policy', policy.id)}
                                  >
                                    <Activity className="h-3 w-3 mr-1" />
                                    Renew
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Insurance Policies</h3>
                      <p className="text-muted-foreground mb-4">
                        Protect your digital assets with our AI-powered insurance products.
                      </p>
                      <Button
                        onClick={() => setSelectedTab('configure')}
                        className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Get Your First Policy
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="claims" className="space-y-4 mt-6">
                  {[...recentClaims, ...claims].length > 0 ? (
                    <div className="space-y-4">
                      {[...recentClaims, ...claims].map((claim) => (
                        <div key={claim.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{claim.type}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {claim.description}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge className={`${
                                    claim.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    claim.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                                    claim.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    claim.status === 'investigating' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  } text-xs`}>
                                    {claim.status.charAt(0).toUpperCase() + claim.status.slice(1)}
                                  </Badge>
                                  <Badge className="bg-purple-100 text-purple-800 text-xs">
                                    AI Confidence: {claim.aiConfidence}%
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {claim.documents.length} Documents
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-emerald-600">
                                {formatCurrency(claim.amount)}
                              </div>
                              <div className="text-sm text-muted-foreground mb-2">
                                Filed: {claim.date}
                              </div>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleQuickAction('view-claim', claim.id)}
                              >
                                <Search className="h-3 w-3 mr-1" />
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Claims Filed</h3>
                      <p className="text-muted-foreground mb-4">
                        File a claim if you need to use your insurance coverage.
                      </p>
                      <Button
                        variant="outline"
                        disabled={[...activePolicies, ...policies].length === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        File New Claim
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* AI Insurance Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-emerald-600" />
                AI Insurance Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Target className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Smart Risk Assessment</div>
                  <div className="text-xs text-muted-foreground">AI analyzes your risk profile</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Dynamic Pricing</div>
                  <div className="text-xs text-muted-foreground">Personalized premium rates</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Search className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Fraud Detection</div>
                  <div className="text-xs text-muted-foreground">AI validates claims automatically</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Instant Processing</div>
                  <div className="text-xs text-muted-foreground">Real-time policy activation</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Insurance Benefits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Comprehensive Coverage</div>
                  <div className="text-xs text-muted-foreground">Full protection for digital assets</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">Fast Claims Settlement</div>
                  <div className="text-xs text-muted-foreground">Average 2.3 days processing</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">AI-Optimized Rates</div>
                  <div className="text-xs text-muted-foreground">Best pricing based on risk</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <div>
                  <div className="text-sm font-medium">24/7 Monitoring</div>
                  <div className="text-xs text-muted-foreground">Continuous threat detection</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Risk Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-medium text-green-800 mb-1">Portfolio Health</div>
                <div className="text-xs text-green-600">
                  {totalCoverage > 0 ? 'Well protected with comprehensive coverage' : 'Consider adding insurance protection'}
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-800 mb-1">AI Recommendations</div>
                <div className="text-xs text-blue-600">
                  Regular risk assessments help optimize your coverage and reduce premiums.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Insurance Analytics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-600" />
              AI Risk Analytics
            </CardTitle>
            <CardDescription>
              Advanced insights into your insurance portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Portfolio Risk Score</h4>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  {Math.floor([...activePolicies, ...policies].reduce((sum, p) => sum + p.aiRiskScore, 0) / Math.max([...activePolicies, ...policies].length, 1))}
                </span>
                <span className="text-sm text-blue-600">/1000</span>
              </div>
              <p className="text-xs text-blue-600 mt-1">Excellent risk management</p>
            </div>
            
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <span>Active Policies:</span>
                <span className="font-medium">{[...activePolicies, ...policies].filter(p => p.status === 'active').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Coverage Utilization:</span>
                <span className="font-medium">
                  {totalCoverage > 0 ? '85%' : '0%'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Claims Success Rate:</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Your latest insurance activities and updates
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...recentClaims, ...claims].slice(0, 3).map((claim) => (
              <div key={claim.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{claim.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatCurrency(claim.amount)} • {claim.date}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className={`inline-block w-2 h-2 rounded-full ${
                      claim.status === 'approved' || claim.status === 'paid' ? 'bg-green-500' :
                      claim.status === 'rejected' ? 'bg-red-500' :
                      claim.status === 'investigating' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`} />
                    <span className="text-xs capitalize">{claim.status}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {[...recentClaims, ...claims].length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      </div>
    </AuthGuard>
  )
}