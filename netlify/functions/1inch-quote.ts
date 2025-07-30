import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

const CHAIN_TO_API: Record<string, string> = {
  '1': 'https://api.1inch.dev/swap/v5.2/1',
  '56': 'https://api.1inch.dev/swap/v5.2/56',
  '137': 'https://api.1inch.dev/swap/v5.2/137',
  '10': 'https://api.1inch.dev/swap/v5.2/10',
  '42161': 'https://api.1inch.dev/swap/v5.2/42161',
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    }
  }

  try {
    const params = event.queryStringParameters || {}
    const {
      chainId = '1',
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage = '1',
      disableEstimate = 'false',
      allowPartialFill = 'true'
    } = params

    // Validation
    if (!fromTokenAddress || !toTokenAddress || !amount) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Missing required parameters: fromTokenAddress, toTokenAddress, amount'
        }),
      }
    }

    const apiUrl = CHAIN_TO_API[chainId]
    if (!apiUrl) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: `Unsupported chain ID: ${chainId}`
        }),
      }
    }

    // Build 1inch API URL
    const apiKey = process.env.NEXT_PUBLIC_1INCH_API_KEY || ''
    console.log('Environment check:', {
      hasApiKey: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 8) + '...' : 'none',
      chainId,
      apiUrl
    })

    const queryParams = new URLSearchParams({
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage,
      disableEstimate,
      allowPartialFill,
      ...(fromAddress && { fromAddress })
    })

    const oneInchUrl = `${apiUrl}/quote?${queryParams.toString()}`
    console.log('Calling 1inch API:', oneInchUrl)

    // Set up headers with API key for v6.0
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'User-Agent': 'USD-Financial/1.0'
    }

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`
    }

    // Make request to 1inch API
    const response = await fetch(oneInchUrl, {
      method: 'GET',
      headers
    })

    console.log('1inch API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('1inch API error:', response.status, errorText)
      
      return {
        statusCode: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: '1inch API error',
          details: response.statusText,
          status: response.status
        }),
      }
    }

    const data = await response.json()
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
    
  } catch (error) {
    console.error('1inch quote proxy error:', error)
    
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
    }
  }
}

export { handler }