'use client'

import Link from 'next/link'
import { useState } from 'react'
import { 
  ArrowUpRight, 
  Plus, 
  Send, 
  ArrowLeftRight, 
  TrendingUp, 
  Zap, 
  BarChart3, 
  CreditCard,
  Shield,
  Building2,
  DollarSign,
  Wallet,
  Star,
  Activity,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  Target,
  PieChart,
  Bell,
  Calendar,
  Globe,
  Banknote,
  Coins
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AuthGuard } from '@/components/auth/AuthGuard'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { findUserByEmail } from '@/lib/demoUsers'
import { 
  stablecoinPortfolio, 
  totalPortfolioValue, 
  portfolioChange, 
  formatCurrency, 
  formatDate, 
  getStablecoinIcon, 
  getTransactionTypeIcon,
  mockStablecoinTransactions,
  yieldPositions,
  calculateTotalYield,
  getWeightedAverageAPY
} from '@/lib/data'

export default function Dashboard() {
  const { user } = useAuthContext()
  const fullUserData = user ? findUserByEmail(user.email) : null
  const [showBalance, setShowBalance] = useState(true)
  const [activeInsight, setActiveInsight] = useState(0)
  
  const recentTransactions = mockStablecoinTransactions.slice(0, 5)
  const totalYield = calculateTotalYield()
  const averageAPY = getWeightedAverageAPY()

  // AI-powered insights rotation
  const aiInsights = [
    {
      title: "Portfolio Optimization",
      description: "Consider reallocating 15% to high-yield farming for +2.3% APY",
      action: "Optimize Now",
      type: "opportunity",
      icon: TrendingUp
    },
    {
      title: "Risk Assessment",
      description: "Your portfolio risk score is optimal at 75/100",
      action: "View Details",
      type: "info",
      icon: Shield
    },
    {
      title: "Market Alert",
      description: "USDC liquidity pools showing 8.5% APY - 24h high",
      action: "Stake Now",
      type: "alert",
      icon: Zap
    }
  ]

  // Quick actions for services
  const quickActions = [
    {
      title: "Send Money",
      description: "Instant stablecoin transfers",
      icon: Send,
      href: "/accounts/send",
      color: "bg-blue-500",
      stats: "Fee: $0.10"
    },
    {
      title: "Earn Yield",
      description: "Auto-invest in best rates",
      icon: TrendingUp,
      href: "/invest/auto",
      color: "bg-green-500",
      stats: "Up to 12.5% APY"
    },
    {
      title: "Get Card",
      description: "Stablecoin debit card",
      icon: CreditCard,
      href: "/cards",
      color: "bg-purple-500",
      stats: "2% Cashback"
    },
    {
      title: "Swap Assets",
      description: "Best exchange rates",
      icon: ArrowLeftRight,
      href: "/swap",
      color: "bg-orange-500",
      stats: "0.1% Fee"
    }
  ]

  // Service highlights
  const serviceHighlights = [
    {
      title: "Smart Investing",
      description: "AI-powered portfolio management with tokenized assets",
      icon: BarChart3,
      href: "/invest",
      value: "+18.7%",
      label: "Avg. Returns",
      gradient: "from-green-500 to-emerald-600"
    },
    {
      title: "Crypto Loans",
      description: "AI credit scoring with competitive rates",
      icon: DollarSign,
      href: "/loans",
      value: "5.9%",
      label: "Starting APR",
      gradient: "from-blue-500 to-cyan-600"
    },
    {
      title: "DeFi Insurance",
      description: "Comprehensive coverage with AI risk assessment",
      icon: Shield,
      href: "/insurance",
      value: "$2M+",
      label: "Protected",
      gradient: "from-purple-500 to-violet-600"
    },
    {
      title: "Business Suite",
      description: "Corporate treasury and cash management",
      icon: Building2,
      href: "/business/platform",
      value: "$17M+",
      label: "Assets",
      gradient: "from-indigo-500 to-blue-600"
    }
  ]

  return (
    <AuthGuard>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}
              </h1>
              {fullUserData?.accountType === 'premium' && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  <Star className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              {fullUserData?.accountType === 'business' && (
                <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0">
                  <Building2 className="h-3 w-3 mr-1" />
                  Business
                </Badge>
              )}
            </div>
            <p className="text-slate-600">
              Your comprehensive stablecoin financial hub • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              2 Alerts
            </Button>
            <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Funds
            </Button>
          </div>
        </div>

        {/* Portfolio Overview Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Portfolio Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-emerald-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900">Portfolio Overview</CardTitle>
                  <CardDescription className="text-slate-600">Total stablecoin assets</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-600 hover:text-slate-900"
                >
                  {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-slate-900">
                  {showBalance ? formatCurrency(fullUserData?.balance || totalPortfolioValue) : '••••••'}
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center text-sm font-medium ${portfolioChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                    +{formatCurrency(portfolioChange.amount)} ({portfolioChange.percentage}%)
                  </div>
                  <span className="text-xs text-slate-500">Last 24h</span>
                </div>
              </div>

              {/* Portfolio Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-slate-900">Asset Allocation</h4>
                <div className="space-y-2">
                  {stablecoinPortfolio.map((coin) => (
                    <div key={coin.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border">
                          {getStablecoinIcon(coin.symbol)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{coin.symbol}</p>
                          <p className="text-xs text-slate-500">{coin.chainId === 1 ? 'Ethereum' : 'Polygon'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{formatCurrency(coin.amount * 1)}</p>
                        <p className="text-xs text-green-600">+{coin.apy}% APY</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Insights & Quick Stats */}
          <div className="space-y-6">
            {/* AI Insight Card */}
            <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-violet-600" />
                  <CardTitle className="text-lg text-violet-900">AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        activeInsight === index 
                          ? 'bg-white border-violet-300 shadow-sm' 
                          : 'bg-violet-50/50 border-violet-200 hover:bg-white'
                      }`}
                      onClick={() => setActiveInsight(index)}
                    >
                      <div className="flex items-start gap-3">
                        <insight.icon className="h-4 w-4 text-violet-600 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-violet-900">{insight.title}</p>
                          <p className="text-xs text-violet-700 mt-1">{insight.description}</p>
                          {activeInsight === index && (
                            <Button size="sm" className="mt-2 bg-violet-600 hover:bg-violet-700 text-xs h-6">
                              {insight.action}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-xs font-medium text-slate-600">Yield Earned</span>
                  </div>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(totalYield)}</p>
                  <p className="text-xs text-slate-500">All time</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" />
                    <span className="text-xs font-medium text-slate-600">Avg APY</span>
                  </div>
                  <p className="text-xl font-bold text-blue-600">{averageAPY.toFixed(1)}%</p>
                  <p className="text-xs text-slate-500">Weighted</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Link href="/accounts/wallet">
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-emerald-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${action.color} bg-opacity-10`}>
                        <action.icon className={`h-5 w-5 ${action.color.replace('bg-', 'text-')}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm">{action.title}</h3>
                        <p className="text-xs text-slate-600 truncate">{action.description}</p>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-emerald-600">{action.stats}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Service Highlights */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">USD Financial Services</h2>
            <Badge variant="secondary" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceHighlights.map((service) => (
              <Link key={service.title} href={service.href}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group overflow-hidden border-0">
                  <div className={`h-1 bg-gradient-to-r ${service.gradient}`} />
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${service.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                        <service.icon className="h-6 w-6 text-white" style={{
                          filter: 'brightness(0) saturate(100%) invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%)'
                        }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{service.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mb-4 line-clamp-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-lg font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                          {service.value}
                        </p>
                        <p className="text-xs text-slate-500">{service.label}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity & Market Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    {getTransactionTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900">{transaction.description}</p>
                    <p className="text-xs text-slate-500">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${
                      transaction.type === 'deposit' || transaction.type === 'yield' 
                        ? 'text-green-600' 
                        : 'text-slate-900'
                    }`}>
                      {transaction.type === 'deposit' || transaction.type === 'yield' ? '+' : ''}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge 
                      variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Market Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stablecoin Market Data */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="flex items-center gap-3">
                    <Coins className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-sm">USDC Market Cap</p>
                      <p className="text-xs text-blue-700">Circle USD Coin</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-900">$32.8B</p>
                    <p className="text-xs text-green-600">+0.12%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center gap-3">
                    <Banknote className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-sm">USDT Market Cap</p>
                      <p className="text-xs text-green-700">Tether USD</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-900">$118.2B</p>
                    <p className="text-xs text-green-600">+0.05%</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-sm text-purple-900">Best Yield Opportunities</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-700">Compound USDC</span>
                      <span className="font-semibold text-purple-900">8.5% APY</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-purple-700">Aave USDT</span>
                      <span className="font-semibold text-purple-900">7.2% APY</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action Footer */}
        <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 border-0 text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Ready to maximize your stablecoin potential?</h3>
                <p className="text-emerald-100">
                  Explore our advanced DeFi features, AI-powered insights, and premium services designed for the modern digital economy.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="secondary" className="bg-white text-emerald-600 hover:bg-emerald-50">
                  Explore Features
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600">
                  Learn More
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}