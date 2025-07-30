import { Handler } from '@netlify/functions'

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Test that we can import the database connection
    const { getDatabase } = await import('../../lib/database/connection')
    
    // Test basic database functionality (only if DATABASE_URL is available)
    if (process.env.DATABASE_URL) {
      const db = getDatabase()
      const result = await db.healthCheck()
      
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          status: 'success',
          message: 'Database connection test successful',
          health: result
        })
      }
    } else {
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          status: 'success',
          message: 'Database module loaded successfully (no DATABASE_URL for connection test)'
        })
      }
    }
  } catch (error) {
    console.error('Database test error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Database test failed',
        message: error.message 
      })
    }
  }
}

export { handler }