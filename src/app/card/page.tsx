'use client'

import { useState, useEffect } from 'react'
import { Settings, Lock, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VirtualCard } from '@/components/card/VirtualCard'
import { SpendingChart } from '@/components/card/SpendingChart'
import { TransactionHistory } from '@/components/shared/TransactionHistory'
import { formatCurrency, spendingData } from '@/lib/data'
import { summarizeSpending } from '@/lib/ai-client'

export default function CardPage() {
  const [aiSummary, setAiSummary] = useState<string>('Loading AI insights...')
  const [isLoadingAI, setIsLoadingAI] = useState(true)

  useEffect(() => {
    const generateAISummary = async () => {
      try {
        const result = await summarizeSpending({ 
          spendingData: JSON.stringify(spendingData) 
        })
        setAiSummary(result.summary)
      } catch (error) {
        setAiSummary('AI analysis temporarily unavailable. Your spending data shows healthy financial habits with room for optimization.')
      } finally {
        setIsLoadingAI(false)
      }
    }

    generateAISummary()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Card</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Virtual Card */}
        <div className="lg:col-span-1">
          <VirtualCard className="group hover:scale-105 transition-transform duration-300" />
          
          {/* Card Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Lock className="h-4 w-4 mr-2" />
              Freeze Card
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Show PIN
            </Button>
          </div>
        </div>

        {/* Card Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI-Powered Spending Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AI</span>
                </div>
                Spending Summary
              </CardTitle>
              <CardDescription>
                AI-powered insights into your spending patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold">{formatCurrency(1247.53)}</div>
                <div className={`text-sm text-muted-foreground leading-relaxed ${isLoadingAI ? 'animate-pulse' : ''}`}>
                  {aiSummary}
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    12% less than last month
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    On track for monthly budget
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card Limits */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Daily Limit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(1000)}</div>
                <p className="text-sm text-muted-foreground">Remaining today</p>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Monthly Limit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(3752)}</div>
                <p className="text-sm text-muted-foreground">Remaining this month</p>
                <div className="mt-2 w-full bg-secondary rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Spending Analytics */}
      <SpendingChart />

      {/* Transaction History */}
      <TransactionHistory />
    </div>
  )
}