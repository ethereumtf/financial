'use client'

import Link from 'next/link'
import { ArrowRight, Shield, Smartphone, TrendingUp, Sparkles, Star, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Main Hero Section */}
      <div className="relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Introducing USD Financial</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-primary mb-6">
              <span className="block">Banking</span>
              <span className="block bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              A new kind of financial experience crafted with the same precision and innovation
              as the products you love. Elegant, intelligent, and designed for your life.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20">
              <Link href="/dashboard">
                <Button size="lg" className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-full border-2 bg-white/60 backdrop-blur-xl hover:bg-white/80 transition-all duration-300">
                Learn More
              </Button>
            </div>
          </div>

          {/* Virtual Card Showcase */}
          <div className="relative max-w-md mx-auto mb-20">
            <div className="relative">
              {/* Floating Card with Glass Effect */}
              <div className="relative transform -rotate-6 hover:rotate-0 transition-transform duration-700 ease-out">
                <Card className="overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-0 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <CardContent className="p-8 text-white relative">
                    {/* Card Background Pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.1),transparent_70%)]" />
                    
                    {/* Card Content */}
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="h-8 w-12 rounded bg-gradient-to-r from-amber-400 to-orange-500" />
                        <div className="text-sm font-medium opacity-80">USD Financial</div>
                      </div>
                      
                      <div className="space-y-4 mb-8">
                        <div className="h-2 w-16 bg-white/20 rounded" />
                        <div className="text-2xl font-mono tracking-widest">•••• •••• •••• 1234</div>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-60 mb-1">CARDHOLDER</div>
                          <div className="font-medium">Alex Johnson</div>
                        </div>
                        <div>
                          <div className="text-xs opacity-60 mb-1">EXPIRES</div>
                          <div className="font-medium">12/28</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Crafted for Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Every detail designed to elevate your financial experience with innovation and elegance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Bank-Grade Security</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced encryption and biometric protection keep your financial data secure with enterprise-level security protocols.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Intuitive Design</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Clean interface and thoughtful interactions make managing your finances effortless and enjoyable.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-xl border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Smart Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  AI-powered analytics provide personalized recommendations to help you make better financial decisions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="relative py-16 bg-white/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-2 text-lg font-semibold">4.9/5</span>
            </div>
            <p className="text-lg text-muted-foreground mb-8">
              Trusted by over 100,000 users worldwide
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-6 opacity-60">
              <div className="text-2xl font-bold">TechCrunch</div>
              <div className="text-2xl font-bold">Forbes</div>
              <div className="text-2xl font-bold">Wired</div>
              <div className="text-2xl font-bold">Bloomberg</div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-xl border border-white/20 shadow-lg mb-8">
            <CheckCircle className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary">Ready to get started?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-6">
            Your financial future starts here
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their financial lives with USD Financial.
          </p>
          
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-12 py-6 rounded-full bg-primary hover:bg-primary/90 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              Enter USD Financial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
