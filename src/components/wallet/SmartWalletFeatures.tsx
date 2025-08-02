'use client'

import { useState } from 'react'
import { 
  Zap, 
  Shield, 
  Users, 
  CreditCard, 
  ArrowUpDown, 
  Lock, 
  Smartphone, 
  Globe,
  ChevronRight,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SmartWalletFeaturesProps {
  isAAReady: boolean
}

export function SmartWalletFeatures({ isAAReady }: SmartWalletFeaturesProps) {
  const [activeFeature, setActiveFeature] = useState<string | null>(null)

  const features = [
    {
      id: 'gasless',
      icon: Zap,
      title: 'Gasless Transactions',
      description: 'Send transactions without paying gas fees',
      status: isAAReady ? 'active' : 'coming-soon',
      details: 'Smart contracts handle gas payments automatically through Account Abstraction, making transactions seamless for users.',
      benefits: ['Zero gas fees', 'Instant transactions', 'No ETH required', 'Simplified UX']
    },
    {
      id: 'social-recovery',
      icon: Users,
      title: 'Social Recovery',
      description: 'Recover wallet access through trusted contacts',
      status: 'coming-soon',
      details: 'Set trusted friends or family as guardians who can help recover your wallet if you lose access.',
      benefits: ['No seed phrase needed', 'Trusted guardian network', 'Secure recovery process', 'Peace of mind']
    },
    {
      id: 'session-keys',
      icon: CreditCard,
      title: 'Session Keys',
      description: 'Temporary permissions for apps and services',
      status: 'coming-soon',
      details: 'Grant limited-time permissions to dApps without exposing your main private key.',
      benefits: ['Enhanced security', 'Granular permissions', 'Time-limited access', 'Revocable anytime']
    },
    {
      id: 'batch-transactions',
      icon: ArrowUpDown,
      title: 'Batch Operations',
      description: 'Execute multiple transactions in one go',
      status: isAAReady ? 'active' : 'coming-soon',
      details: 'Combine multiple operations into a single transaction, saving time and reducing complexity.',
      benefits: ['Atomic operations', 'Reduced complexity', 'Cost efficient', 'Better UX']
    },
    {
      id: 'enhanced-security',
      icon: Shield,
      title: 'Enhanced Security',
      description: 'Advanced smart contract security features',
      status: 'active',
      details: 'Built-in security features including spending limits, transaction delays, and fraud protection.',
      benefits: ['Spending limits', 'Fraud detection', 'Emergency pause', 'Multi-sig support']
    },
    {
      id: 'cross-platform',
      icon: Globe,
      title: 'Cross-Platform Access',
      description: 'Access your wallet from any device',
      status: 'active',
      details: 'Your smart wallet works seamlessly across web, mobile, and desktop platforms.',
      benefits: ['Universal access', 'Sync across devices', 'No downloads needed', 'Cloud backup']
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case 'coming-soon':
        return (
          <Badge className="bg-orange-100 text-orange-800">
            <Lock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
        )
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800">
            <XCircle className="w-3 h-3 mr-1" />
            Unavailable
          </Badge>
        )
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'from-emerald-50 to-emerald-100 border-emerald-200'
      case 'coming-soon':
        return 'from-orange-50 to-orange-100 border-orange-200'
      default:
        return 'from-gray-50 to-gray-100 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Smart Wallet Features</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Experience the future of digital wallets with Account Abstraction technology
        </p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Feature Overview</TabsTrigger>
          <TabsTrigger value="comparison">AA vs Traditional</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={feature.id}
                  className={`relative overflow-hidden border cursor-pointer transition-all duration-300 hover:shadow-lg bg-gradient-to-br ${getStatusColor(feature.status)}`}
                  onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <Icon className="w-6 h-6 text-gray-700" />
                      </div>
                      {getStatusBadge(feature.status)}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Learn more</span>
                      <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
                        activeFeature === feature.id ? 'rotate-90' : ''
                      }`} />
                    </div>

                    {activeFeature === feature.id && (
                      <div className="mt-4 p-4 bg-white/80 rounded-xl space-y-3 animate-fade-in">
                        <p className="text-sm text-gray-700">{feature.details}</p>
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">Benefits</p>
                          <ul className="space-y-1">
                            {feature.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-center text-xs text-gray-600">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Abstraction */}
            <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-emerald-900">Account Abstraction</CardTitle>
                    <CardDescription className="text-emerald-700">Smart Contract Wallet</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    'No gas fees for users',
                    'Social login (Google, Email)',
                    'Batch transactions',
                    'Session keys & permissions',
                    'Social recovery options',
                    'Enhanced security features',
                    'Cross-platform compatibility',
                    'Programmable wallet logic'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm text-emerald-800">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Traditional Wallet */}
            <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-500 rounded-xl flex items-center justify-center">
                    <Lock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-gray-900">Traditional Wallet</CardTitle>
                    <CardDescription className="text-gray-700">Externally Owned Account</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { text: 'Users pay gas fees', available: false },
                    { text: 'Seed phrase required', available: false },
                    { text: 'One transaction at a time', available: false },
                    { text: 'Full key management', available: true },
                    { text: 'Seed phrase recovery only', available: false },
                    { text: 'Basic security model', available: false },
                    { text: 'Platform dependent', available: false },
                    { text: 'Limited programmability', available: false }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      {feature.available ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`text-sm ${feature.available ? 'text-gray-800' : 'text-gray-500'}`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}