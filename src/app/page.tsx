'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Shield, Zap, TrendingUp, Sparkles, Star, CheckCircle, DollarSign, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WaitlistModal } from '@/components/WaitlistModal'

export default function LandingPage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false)

  const handleJoinWaitlist = () => {
    setIsWaitlistModalOpen(true)
  }

  const handleCloseWaitlistModal = () => {
    setIsWaitlistModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 overflow-hidden">
      {/* Navigation Header */}
      <nav className="relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
              <span className="text-xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-bold">USD Financial</span>
            </Link>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base"
              >
                Log In
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-sm sm:text-base"
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98130_1px,transparent_1px),linear-gradient(to_bottom,#10b98130_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-emerald-200/50 shadow-lg mb-8">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Stablecoin is All You Need</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 mb-6">
              <span className="block">Stablecoin</span>
              <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                Financial Freedom
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              The only financial platform you need. Deposit stablecoins, earn yield, spend anywhere. 
              <br />
              <span className="font-semibold text-emerald-700">Stablecoin IN, stablecoin OUT.</span> Simple, stable, secure.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  Start Earning Yield
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleJoinWaitlist}
                className="text-lg px-8 py-6 rounded-full border-2 border-emerald-200 bg-white/60 backdrop-blur-xl hover:bg-white/80 text-emerald-700 transition-all duration-300 group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Join Waitlist
              </Button>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">$2.1B+</div>
                <div className="text-sm text-slate-600">Stablecoins Under Management</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">8.2%</div>
                <div className="text-sm text-slate-600">Average APY Earned</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">99.9%</div>
                <div className="text-sm text-slate-600">Protocol Uptime</div>
              </div>
            </div>
          </div>

          {/* Stablecoin Showcase */}
          <div className="relative max-w-md mx-auto mb-20">
            <div className="relative">
              {/* Floating Card with Stablecoin Theme */}
              <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-700 ease-out">
                <Card className="overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-900 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <CardContent className="p-8 text-white relative">
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(16,185,129,0.2),transparent_70%)]" />
                    
                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="h-8 w-12 rounded bg-gradient-to-r from-emerald-400 to-green-500" />
                        <div className="text-sm font-medium opacity-80">USD Financial</div>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        <div className="h-2 w-16 bg-white/20 rounded" />
                        <div className="text-2xl font-mono tracking-widest">USDC •••• 1234</div>
                        <div className="text-sm opacity-75">Multi-Stablecoin Balance</div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-60 mb-1">BALANCE</div>
                          <div className="font-medium">$52,582.39</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-60 mb-1">EARNING</div>
                          <div className="font-medium text-emerald-300">4.8% APY</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-green-400/20 rounded-full blur-xl animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Stablecoin is All You Need
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the power of stable digital currency with maximum yield potential and zero volatility stress.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Stability */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-emerald-200/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Rock-Solid Stability</h3>
                <p className="text-slate-600 leading-relaxed">
                  No volatility, no surprises. Your $100 stays $100, while earning competitive yields through battle-tested DeFi protocols.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Yield */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-emerald-200/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Earn While You Hold</h3>
                <p className="text-slate-600 leading-relaxed">
                  Automatic yield farming across Aave, Compound, and Yearn. Your stablecoins work 24/7 generating returns up to 8% APY.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Cross-Chain */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-emerald-200/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Cross-Chain Freedom</h3>
                <p className="text-slate-600 leading-relaxed">
                  Bridge your USDC seamlessly between Ethereum, Polygon, Arbitrum, and more. Always find the best rates and lowest fees.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-24 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Stablecoin IN, Stablecoin OUT
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Three simple steps to maximize your stablecoin potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-600">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Deposit Stablecoins</h3>
              <p className="text-slate-600">
                Start with USDC or USDT - the two most trusted stablecoins. Connect your wallet and deposit in seconds.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-600">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Auto-Deploy to Highest Yield</h3>
              <p className="text-slate-600">
                Our algorithms automatically find the best yield opportunities across Aave, Compound, Yearn, and more.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-600">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Spend or Withdraw Anytime</h3>
              <p className="text-slate-600">
                Use our stablecoin debit card for everyday purchases or withdraw to any chain with minimal fees.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-emerald-400 text-emerald-400" />
              ))}
              <span className="ml-2 text-lg font-semibold text-slate-900">4.9/5</span>
            </div>
            <p className="text-lg text-slate-600 mb-8">
              Trusted by over 250,000 stablecoin holders worldwide
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-slate-700">Coindesk</div>
              <div className="text-2xl font-bold text-slate-700">DeFiPulse</div>
              <div className="text-2xl font-bold text-slate-700">Bankless</div>
              <div className="text-2xl font-bold text-slate-700">Messari</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-24 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-emerald-200/50 shadow-lg mb-8">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Ready to maximize your stablecoins?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your stablecoin journey starts here
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Join thousands of users earning consistent yields on their stablecoins. 
            <span className="font-semibold text-emerald-700"> Stablecoin is all you need.</span>
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-12 py-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
              Start Earning Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={handleCloseWaitlistModal} 
      />
    </div>
  )
}
