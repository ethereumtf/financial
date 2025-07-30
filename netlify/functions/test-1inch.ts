import { Handler } from '@netlify/functions'

const handler: Handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: '1inch proxy functions are working!',
      environment: process.env.NODE_ENV,
      hasApiKey: !!process.env.NEXT_PUBLIC_1INCH_API_KEY,
      timestamp: new Date().toISOString()
    }),
  }
}

export { handler }