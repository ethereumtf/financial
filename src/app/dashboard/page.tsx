'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
  Coins,
  Smartphone,
  Lock,
  Users,
  Repeat,
  CheckCircle,
  Clock,
  MapPin,
  Briefcase
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
  mockStablecoinTransactions
} from '@/lib/data'

export default function Dashboard() {
  const { user } = useAuthContext()
  const fullUserData = user ? findUserByEmail(user.email) : null
  const [showBalance, setShowBalance] = useState(true)
  const [activeInsight, setActiveInsight] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  
  const recentTransactions = mockStablecoinTransactions.slice(0, 5)

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Enhanced AI-powered insights without yield focus
  const aiInsights = [
    {
      title: "Portfolio Balance",
      description: "Your stablecoin allocation is well-distributed across USDC and USDT",
      action: "View Details",
      type: "info",
      icon: PieChart,
      color: "from-emerald-500 to-teal-500"
    },
    {
      title: "Security Status",
      description: "All security features active. Your account is fully protected",
      action: "Security Center",
      type: "security", 
      icon: Shield,
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Market Update",
      description: "Stablecoin markets remain stable with excellent liquidity",
      action: "View Markets",
      type: "market",
      icon: Globe,
      color: "from-purple-500 to-violet-500"
    }
  ]

  // Enhanced quick actions focusing on core stablecoin services
  const quickActions = [
    {
      title: "Send Money",
      description: "Instant global transfers",
      icon: Send,
      href: "/accounts/send",
      gradient: "from-blue-500 to-cyan-500",
      stats: "Fee: $0.10",
      highlight: "Instant"
    },
    {
      title: "Receive Funds",
      description: "Get paid in stablecoins",
      icon: Wallet,
      href: "/accounts/wallet",
      gradient: "from-green-500 to-emerald-500",
      stats: "Any Amount",
      highlight: "Secure"
    },
    {
      title: "Get Card",
      description: "Spend stablecoins anywhere",
      icon: CreditCard,
      href: "/cards",
      gradient: "from-purple-500 to-violet-500",
      stats: "2% Cashback",
      highlight: "Worldwide"
    },
    {
      title: "Exchange",
      description: "Swap between stablecoins",
      icon: ArrowLeftRight,
      href: "/swap",
      gradient: "from-orange-500 to-red-500",
      stats: "Best Rates",
      highlight: "0.1% Fee"
    }
  ]

  // Enhanced service highlights without yield focus
  const serviceHighlights = [
    {
      title: "Smart Investing",
      description: "Professional portfolio management with tokenized real-world assets",
      icon: BarChart3,
      href: "/invest",
      value: "100+",
      label: "Assets Available",
      gradient: "from-green-500 to-emerald-600",
      features: ["Tokenized Assets", "Auto-Rebalancing", "Global Markets"]
    },
    {
      title: "Secure Loans",
      description: "AI-powered credit assessment with competitive stablecoin lending",
      icon: DollarSign,
      href: "/loans",
      value: "$1M+",
      label: "Loans Processed",
      gradient: "from-blue-500 to-cyan-600",
      features: ["Instant Approval", "No Hidden Fees", "Flexible Terms"]
    },
    {
      title: "DeFi Insurance",
      description: "Comprehensive protection with AI risk assessment and instant claims",
      icon: Shield,
      href: "/insurance",
      value: "$5M+",
      label: "Coverage Available",
      gradient: "from-purple-500 to-violet-600",
      features: ["Smart Contracts", "Instant Claims", "Full Coverage"]
    },
    {
      title: "Business Hub",
      description: "Corporate treasury, payroll, and financial management solutions",
      icon: Building2,
      href: "/business/platform",
      value: "500+",
      label: "Companies",
      gradient: "from-indigo-500 to-blue-600",
      features: ["Treasury Mgmt", "Payroll", "Compliance"]
    }
  ]

  // Market stats without yield focus
  const marketStats = [
    {
      title: "Total Value Locked",
      value: "$2.8B",
      change: "+12.3%",
      icon: Lock,
      color: "text-emerald-600"
    },
    {
      title: "Active Users",
      value: "45K+",
      change: "+23%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Transactions Today",
      value: "12,847",
      change: "+8.2%",
      icon: Activity,
      color: "text-purple-600"
    }
  ]

  return (
    <AuthGuard>
      <div className="space-y-8 pb-8">
        {/* Enhanced Welcome Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98130_1px,transparent_1px),linear-gradient(to_bottom,#10b98130_1px,transparent_1px)] bg-[size:24px_24px]" />
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        Welcome back, {user?.name?.split(' ')[0] || 'User'}
                      </h1>
                      <p className="text-slate-600 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Your stablecoin financial command center
                      </p>
                    </div>
                  </div>
                  {fullUserData?.accountType === 'premium' && (
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 px-3 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Premium Member
                    </Badge>
                  )}
                  {fullUserData?.accountType === 'business' && (
                    <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 px-3 py-1">
                      <Building2 className="h-3 w-3 mr-1" />
                      Business Account
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{currentTime.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{currentTime.toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                  <Bell className="h-4 w-4 mr-2" />
                  2 Updates
                </Button>
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Portfolio Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Portfolio Card */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-50 via-white to-emerald-50 border-2 border-emerald-100 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-emerald-600" />
                    Portfolio Overview
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Total stablecoin balance across all accounts
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                >
                  {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="text-5xl font-bold text-slate-900 tracking-tight">
                  {showBalance ? formatCurrency(fullUserData?.balance || totalPortfolioValue) : '••••••••'}
                </div>
                <div className="flex items-center gap-6">
                  <div className={`flex items-center text-lg font-semibold ${portfolioChange.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    <ArrowUpRight className="h-5 w-5 mr-2" />
                    +{formatCurrency(portfolioChange.amount)}
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Last 24 hours
                  </Badge>
                </div>
              </div>

              {/* Enhanced Asset Breakdown */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-900 text-lg">Asset Distribution</h4>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/accounts/wallet">
                      View Details <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stablecoinPortfolio.map((coin) => (
                    <div key={coin.symbol} className="p-4 rounded-xl bg-gradient-to-r from-white to-slate-50 border border-slate-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center border-2 border-slate-200 shadow-sm">
                            {getStablecoinIcon(coin.symbol)}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{coin.symbol}</p>
                            <p className="text-sm text-slate-500">{coin.chainId === 1 ? 'Ethereum' : 'Polygon'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">{formatCurrency(coin.amount * 1)}</p>
                          <Badge variant="secondary" className="text-xs">
                            Stable
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced AI Insights & Market Stats */}
          <div className="space-y-8">
            {/* AI Insights Card */}
            <Card className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 border-2 border-violet-200 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-violet-500 to-purple-500">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-lg text-violet-900">AI Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <div 
                      key={index}
                      className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                        activeInsight === index 
                          ? 'bg-white border-violet-300 shadow-lg scale-105' 
                          : 'bg-white/50 border-violet-200 hover:bg-white hover:shadow-md'
                      }`}
                      onClick={() => setActiveInsight(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${insight.color}`}>
                          <insight.icon className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-violet-900">{insight.title}</p>
                          <p className="text-sm text-violet-700 mt-1">{insight.description}</p>
                          {activeInsight === index && (
                            <Button size="sm" className="mt-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:from-violet-600 hover:to-purple-600">
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

            {/* Market Stats */}
            <div className="grid grid-cols-1 gap-4">
              {marketStats.map((stat, index) => (
                <Card key={index} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                        <div>
                          <p className="text-sm font-medium text-slate-600">{stat.title}</p>
                          <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-600">
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
              <p className="text-slate-600">Fast access to your most-used features</p>
            </div>
            <Link href="/accounts/wallet">
              <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                View All Services <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-emerald-200 overflow-hidden">
                  <div className={`h-1 bg-gradient-to-r ${action.gradient}`} />
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                          <action.icon className="h-6 w-6 text-slate-700" />
                        </div>
                        <Badge className={`bg-gradient-to-r ${action.gradient} text-white border-0`}>
                          {action.highlight}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg">{action.title}</h3>
                        <p className="text-slate-600 text-sm mt-1">{action.description}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-600">{action.stats}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Service Highlights */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">USD Financial Services</h2>
              <p className="text-slate-600">Comprehensive stablecoin financial solutions</p>
            </div>
            <Badge variant="outline" className="text-violet-600 border-violet-300 bg-violet-50">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Enhanced
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {serviceHighlights.map((service) => (
              <Link key={service.title} href={service.href}>
                <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer group overflow-hidden border-0 bg-gradient-to-br from-white to-slate-50">
                  <div className={`h-2 bg-gradient-to-r ${service.gradient}`} />
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className={`p-4 rounded-2xl bg-gradient-to-r ${service.gradient} bg-opacity-10 group-hover:bg-opacity-20 transition-all`}>
                          <service.icon className="h-8 w-8 text-slate-700" />
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}>
                            {service.value}
                          </p>
                          <p className="text-sm text-slate-500">{service.label}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xl mb-2">{service.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                      </div>
                      <div className="space-y-2">
                        {service.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-sm text-slate-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                          Learn More
                        </Button>
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-2 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Enhanced Activity & Market Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-3">
                  <Activity className="h-6 w-6 text-emerald-600" />
                  Recent Activity
                </CardTitle>
                <Link href="/transactions">
                  <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50">
                    View All <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all hover:shadow-md">
                  <div className="p-3 rounded-xl bg-emerald-50">
                    {getTransactionTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{transaction.description}</p>
                    <p className="text-sm text-slate-500">{formatDate(transaction.date)}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className={`font-bold ${
                      transaction.type === 'deposit' 
                        ? 'text-green-600' 
                        : 'text-slate-900'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : ''}
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
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="h-6 w-6 text-blue-600" />
                Market Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stablecoin Market Data */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Coins className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-900">USDC Market Cap</p>
                        <p className="text-sm text-blue-700">Circle USD Coin</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-900">$32.8B</p>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        +0.12%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Banknote className="h-6 w-6 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">USDT Market Cap</p>
                        <p className="text-sm text-green-700">Tether USD</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-900">$118.2B</p>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        +0.05%
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Target className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-900">Network Status</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">Ethereum Network</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">Optimal</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-700">Polygon Network</span>
                      <Badge className="bg-green-100 text-green-800 text-xs">Fast</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Call to Action Footer */}
        <Card className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 border-0 text-white shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:24px_24px]" />
          <CardContent className="relative p-12">
            <div className="flex items-center justify-between">
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-3xl font-bold">Ready to transform your financial future?</h3>
                <p className="text-xl text-emerald-100 leading-relaxed">
                  Experience the next generation of stablecoin financial services. From instant global transfers to AI-powered insights, we're building the future of digital finance.
                </p>
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-200" />
                    <span className="text-emerald-100">Zero hidden fees</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-200" />
                    <span className="text-emerald-100">Bank-grade security</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-200" />
                    <span className="text-emerald-100">24/7 support</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 shadow-lg font-semibold px-8 py-4 text-lg">
                  <Sparkles className="h-5 w-5 mr-2" />
                  Explore All Features
                </Button>
                <Button variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white hover:text-emerald-600 font-semibold px-8 py-4">
                  <Briefcase className="h-5 w-5 mr-2" />
                  For Business
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}