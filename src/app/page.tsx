'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Shield, Zap, TrendingUp, Sparkles, Star, CheckCircle, DollarSign, BarChart3, LogOut, ChevronDown, CreditCard, Send, Repeat, ShieldCheck, Globe, KeyRound, Lock, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { WaitlistModal } from '@/components/WaitlistModal'
import { useAuth } from '@/hooks/useAuth'

export default function LandingPage() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const {
    user,
    loading,
    signOut,
    showLogin,
    showSignup,
    isWalletConnected,
    walletBalance
  } = useAuth()

  const handleJoinWaitlist = () => {
    setIsWaitlistModalOpen(true)
  }

  const handleCloseWaitlistModal = () => {
    setIsWaitlistModalOpen(false)
  }

  const handleLogout = async () => {
    await signOut()
    setIsUserMenuOpen(false)
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
              {user ? (
                <div className="relative">
                  {/* User Menu Button */}
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-emerald-50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-semibold text-sm">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </span>
                    </div>
                    <span className="text-slate-600 font-medium hidden sm:block">
                      {user.name || user.email}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-medium text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                      <Link 
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <DollarSign className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  )}

                  {/* Backdrop to close menu */}
                  {isUserMenuOpen && (
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                  )}
                </div>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={showLogin}
                    disabled={loading}
                    className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 font-medium px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 text-sm sm:text-base"
                  >
                    Log In
                  </Button>
                  <Button 
                    size="sm"
                    onClick={showSignup}
                    disabled={loading}
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-medium px-4 sm:px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 border-0 text-sm sm:text-base"
                  >
                    Sign Up
                  </Button>
                </>
              )}
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
              <span className="text-sm font-medium text-emerald-700">The Future of Stablecoin Financial Services</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-slate-900 mb-6">
              <span className="block">Stablecoin</span>
              <span className="block bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent">
                is all you need
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Your complete financial solution, reimagined. Deposit stablecoins and unlock a suite of powerful financial services. 
              <br />
              <span className="font-semibold text-emerald-700">Stablecoin IN, stablecoin OUT.</span> Simple, stable, secure.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  Discover Our Services
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
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">$230B+</div>
                <div className="text-sm text-slate-600">Global Stablecoin Market Cap</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">$1.48T+</div>
                <div className="text-sm text-slate-600">Worldwide Trading Volume</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">180+</div>
                <div className="text-sm text-slate-600">Countries with Access</div>
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
              Experience the power of stablecoin, designed for comprehensive financial solutions and peace of mind.
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
                  Stablecoins offer remarkable price stability, providing a reliable base for your digital assets. Your funds remain robust, allowing you to focus on your financial goals within our secure ecosystem.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 - Yield */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-emerald-200/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Unlock Diverse Financial Services</h3>
                <p className="text-slate-600 leading-relaxed">
                  Beyond simple holding, your stablecoins open doors to a full suite of financial tools. Access seamless transactions, lending, and other comprehensive services, all built on the efficiency and transparency of blockchain. Your assets are active, enabling a wide range of possibilities.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 - Cross-Chain */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-emerald-200/50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-slate-900">Unrestricted Flow & Efficiency</h3>
                <p className="text-slate-600 leading-relaxed">
                  Move your stablecoins effortlessly across major blockchains like Ethereum, Polygon, Arbitrum, and more. Benefit from the inherent speed and low fees of the stablecoin ecosystem, giving you unparalleled control and flexibility over your funds.
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
              Three simple steps to unlock your stablecoin's full financial potential
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
                Start with widely recognized stablecoins like USDC or USDT. Connect your wallet and deposit efficiently, usually within minutes, ready for activation.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-600">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Access Integrated Financial Services</h3>
              <p className="text-slate-600">
                Our platform provides access to a range of comprehensive financial services, designed to put your stablecoins to work. We aim to connect you with opportunities that enhance your digital assets within our secure ecosystem.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center text-2xl font-bold text-teal-600">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4 text-slate-900">Spend or Transfer with Ease</h3>
              <p className="text-slate-600">
                Utilize our stablecoin debit card for everyday purchases, or transfer your funds to various supported blockchains with minimal fees. Experience flexibility and control over your digital finances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Our Services Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">A Universe of Financial Services</h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">Go beyond traditional banking with a suite of tools designed for the digital economy.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8 border-2 border-transparent hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Spend & Use</h3>
                <p className="text-slate-600">Use your stablecoins for daily purchases with the USD Financial Card. Accepted globally, online and in-store.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-2 border-transparent hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Send className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Transfer & Remit</h3>
                <p className="text-slate-600">Move funds across the globe in minutes, not days. Low fees and near-instant settlement.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-2 border-transparent hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Repeat className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Swap & Bridge</h3>
                <p className="text-slate-600">Seamlessly exchange digital assets and move them across different blockchain networks with ease.</p>
              </CardContent>
            </Card>
            <Card className="text-center p-8 border-2 border-transparent hover:border-emerald-200 hover:shadow-xl transition-all duration-300">
              <CardContent>
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-900">Access DeFi</h3>
                <p className="text-slate-600">Explore opportunities in the decentralized finance ecosystem. Put your stablecoins to work in a secure environment.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* The Stablecoin Advantage Section */}
      <div className="py-24 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Why Stablecoins? The Future of Money is Here.</h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">Discover the power of digital dollars and how they create a more accessible and efficient financial world.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <ShieldCheck className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Stability in a Digital World</h3>
              <p className="text-slate-600">Enjoy the benefits of digital assets without the volatility. Our platform is built on fully-backed stablecoins, pegged 1:1 to the US Dollar.</p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Global, Borderless Access</h3>
              <p className="text-slate-600">Financial services for everyone, everywhere. No bank account needed. Your digital wallet is your passport to the global economy.</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 mx-auto mb-4 text-emerald-600" />
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Unmatched Efficiency</h3>
              <p className="text-slate-600">Experience transactions that are faster, cheaper, and more transparent than traditional banking systems. Welcome to the new speed of money.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security You Can Trust Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Your Security is Our Foundation</h2>
            <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto">We are committed to the highest standards of security to protect your assets and your data.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <ul className="space-y-8">
              <li className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <KeyRound className="w-7 h-7 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">You're in Control</h4>
                  <p className="text-slate-600 mt-1">With our non-custodial architecture, you always have control over your funds. Not your keys, not your crypto? We agree.</p>
                </div>
              </li>
              <li className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <Lock className="w-7 h-7 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Bank-Grade Security</h4>
                  <p className="text-slate-600 mt-1">We employ multi-layered security measures, including encryption and secure protocols, to safeguard your account.</p>
                </div>
              </li>
              <li className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <BadgeCheck className="w-7 h-7 text-teal-600" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-slate-800">Audited & Verified</h4>
                  <p className="text-slate-600 mt-1">We build on and integrate with audited smart contracts and battle-tested protocols to ensure the integrity of our ecosystem.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* No stars or user count */}

            <p className="text-lg text-slate-600 mb-8">
              Building the future of finance, with insights aligned with industry leaders.
            </p>

            <p className="text-base text-slate-500 mb-4">In Conversation With / Respected By / Informed By</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-slate-700">Ethereum</div>
              <div className="text-2xl font-bold text-slate-700">Circle</div>
              <div className="text-2xl font-bold text-slate-700">Tether</div>
              <div className="text-2xl font-bold text-slate-700">1inch</div>
              <div className="text-2xl font-bold text-slate-700">Etherlink</div>
              <div className="text-2xl font-bold text-slate-700">Stellar</div>
              <div className="text-2xl font-bold text-slate-700">Near</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-24 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-emerald-200/50 shadow-lg mb-8">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Ready to experience the future of finance?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Your stablecoin journey starts here
          </h2>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
            Discover how stablecoins can empower your financial life.
            <span className="font-semibold text-emerald-700"> Your stablecoin. Your financial world.</span>
          </p>
          
          <Button 
            size="lg" 
            onClick={handleJoinWaitlist}
            className="text-lg px-12 py-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group"
          >
            Join the Waitlist Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal 
        isOpen={isWaitlistModalOpen} 
        onClose={handleCloseWaitlistModal} 
      />

      {/* Web3Auth handles authentication modals automatically */}
    </div>
  )
}
