import { Handler } from '@netlify/functions'
import bcrypt from 'bcryptjs'

// Mock user database - replace with your actual database
const mockUsers: any[] = []

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { name, email, password } = JSON.parse(event.body || '{}')

    // Validation
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Name, email, and password are required' })
      }
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Password must be at least 6 characters' })
      }
    }

    // Check if user already exists
    const existingUser = mockUsers.find(u => u.email === email)
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User already exists with this email' })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (in a real app, save to database)
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    }

    mockUsers.push(newUser)

    console.log('New user created:', { id: newUser.id, email: newUser.email, name: newUser.name })

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email
        }
      })
    }

  } catch (error) {
    console.error('Signup error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

export { handler }