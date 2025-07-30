'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function OneInchDebug() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      // Test the Netlify function
      const response = await fetch('/.netlify/functions/test-1inch')
      const data = await response.json()
      setTestResult({ success: true, data, status: response.status })
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const testQuote = async () => {
    setLoading(true)
    try {
      // Test the quote function with sample data
      const response = await fetch('/.netlify/functions/1inch-quote?' + new URLSearchParams({
        chainId: '1',
        fromTokenAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
        toTokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
        amount: '1000000', // 1 USDC (6 decimals)
        slippage: '1'
      }))
      const data = await response.json()
      setTestResult({ success: response.ok, data, status: response.status })
    } catch (error) {
      setTestResult({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          1inch API Debug Panel
          <Badge variant="secondary">Dev Tool</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={testConnection} disabled={loading}>
            Test Netlify Function
          </Button>
          <Button onClick={testQuote} disabled={loading} variant="outline">
            Test Quote API
          </Button>
        </div>

        {loading && (
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">Testing...</p>
          </div>
        )}

        {testResult && (
          <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={testResult.success ? 'default' : 'destructive'}>
                Status: {testResult.status || 'Unknown'}
              </Badge>
              <Badge variant={testResult.success ? 'default' : 'destructive'}>
                {testResult.success ? 'Success' : 'Failed'}
              </Badge>
            </div>
            
            {testResult.error && (
              <p className="text-red-700 mb-2">Error: {testResult.error}</p>
            )}
            
            {testResult.data && (
              <pre className="text-xs bg-white p-2 rounded border overflow-auto max-h-64">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            )}
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-4">
          <p>• Test Netlify Function: Checks if serverless functions are working</p>
          <p>• Test Quote API: Tests actual 1inch API integration</p>
          <p>• This debug panel helps troubleshoot integration issues</p>
        </div>
      </CardContent>
    </Card>
  )
}