import { Handler, HandlerEvent, HandlerContext } from '@netlify/functions'

const CHAIN_TO_API: Record<string, string> = {
  '1': 'https://api.1inch.io/v5.0/1/',
  '56': 'https://api.1inch.io/v5.0/56/',
  '137': 'https://api.1inch.io/v5.0/137/',
  '10': 'https://api.1inch.io/v5.0/10/',
  '42161': 'https://api.1inch.io/v5.0/42161/',
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
    if (!fromTokenAddress || !toTokenAddress || !amount || !fromAddress) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          error: 'Missing required parameters: fromTokenAddress, toTokenAddress, amount, fromAddress'
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
    const queryParams = new URLSearchParams({
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage,
      disableEstimate,
      allowPartialFill,
      ...(apiKey && { key: apiKey })
    })

    const oneInchUrl = `${apiUrl}swap?${queryParams.toString()}`

    // Make request to 1inch API
    const response = await fetch(oneInchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'USD-Financial/1.0'
      }
    })

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
    console.error('1inch swap proxy error:', error)
    
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