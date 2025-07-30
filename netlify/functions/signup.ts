import { Handler } from '@netlify/functions'
import bcrypt from 'bcryptjs'
import { query } from '../../lib/database/connection'

const handler: Handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: ''
    }
  }

  try {
    const { name, email, password } = JSON.parse(event.body || '{}')

    // Validation
    if (!name || !email || !password) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Name, email, and password are required' })
      }
    }

    if (password.length < 6) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Password must be at least 6 characters' })
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Please enter a valid email address' })
      }
    }

    // Check if user already exists
    const existingUserResult = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (existingUserResult.rows.length > 0) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'User already exists with this email' })
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Split name into first and last name
    const nameParts = name.trim().split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.slice(1).join(' ') || ''

    // Create user in database
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, is_active, email_verified, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, true, false, NOW(), NOW()) 
       RETURNING id, email, first_name, last_name, created_at`,
      [email.toLowerCase(), hashedPassword, firstName, lastName]
    )

    const newUser = result.rows[0]

    // Create user profile
    await query(
      `INSERT INTO user_profiles (user_id, created_at, updated_at)
       VALUES ($1, NOW(), NOW())`,
      [newUser.id]
    )

    console.log('New user created:', { 
      id: newUser.id, 
      email: newUser.email, 
      name: `${newUser.first_name} ${newUser.last_name}`.trim() 
    })

    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        user: {
          id: newUser.id,
          name: `${newUser.first_name} ${newUser.last_name}`.trim(),
          email: newUser.email
        }
      })
    }

  } catch (error) {
    console.error('Signup error:', error)
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Internal server error' })
    }
  }
}

export { handler }