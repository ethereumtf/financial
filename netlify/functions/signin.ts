import { Handler } from '@netlify/functions'
import bcrypt from 'bcryptjs'

// Mock user database - replace with your actual database
// This should be the same as in signup.ts, but for demo purposes we'll use demo user
const mockUsers = [
  {
    id: 'demo-user-1',
    name: 'Demo User',
    email: 'demo@usdfinancial.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQTZH.T9Iy4YaQgbgSn9aGT5S', // hashed 'demo123'
    createdAt: new Date().toISOString()
  }
]

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { email, password } = JSON.parse(event.body || '{}')

    // Validation
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required' })
      }
    }

    // Find user
    const user = mockUsers.find(u => u.email === email)
    if (!user) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials' })
      }
    }

    console.log('User signed in:', { id: user.id, email: user.email, name: user.name })

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      })
    }

  } catch (error) {
    console.error('Signin error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

export { handler }