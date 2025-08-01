import { Handler } from '@netlify/functions'
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
    const { web3AuthId, email, name, image, loginMethod } = JSON.parse(event.body || '{}')

    // Validation
    if (!web3AuthId || !email || !name) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'Web3Auth ID, email, and name are required' })
      }
    }

    // Check if user already exists by Web3Auth ID
    let result = await query(
      `SELECT id, email, first_name, last_name, profile_image, created_at
       FROM users 
       WHERE web3auth_id = $1`,
      [web3AuthId]
    )

    let user

    if (result.rows.length > 0) {
      // User exists, update their information
      user = result.rows[0]
      
      // Split name into first and last name
      const nameParts = name.trim().split(' ')
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(' ') || ''

      await query(
        `UPDATE users 
         SET email = $1, first_name = $2, last_name = $3, profile_image = $4, 
             last_login_at = NOW(), updated_at = NOW()
         WHERE web3auth_id = $5`,
        [email.toLowerCase(), firstName, lastName, image, web3AuthId]
      )

      console.log('Updated existing Web3Auth user:', { 
        id: user.id, 
        email: email,
        web3AuthId 
      })

    } else {
      // Check if user exists by email (might be migrating from traditional auth)
      const emailResult = await query(
        'SELECT id FROM users WHERE email = $1',
        [email.toLowerCase()]
      )

      if (emailResult.rows.length > 0) {
        // Link existing email account to Web3Auth
        await query(
          `UPDATE users 
           SET web3auth_id = $1, profile_image = $2, last_login_at = NOW(), updated_at = NOW()
           WHERE email = $3`,
          [web3AuthId, image, email.toLowerCase()]
        )

        // Get updated user
        result = await query(
          `SELECT id, email, first_name, last_name, profile_image, created_at
           FROM users WHERE email = $1`,
          [email.toLowerCase()]
        )
        user = result.rows[0]

        console.log('Linked existing user to Web3Auth:', { 
          id: user.id, 
          email: email,
          web3AuthId 
        })

      } else {
        // Create new user
        const nameParts = name.trim().split(' ')
        const firstName = nameParts[0]
        const lastName = nameParts.slice(1).join(' ') || ''

        result = await query(
          `INSERT INTO users (web3auth_id, email, first_name, last_name, profile_image, 
                             is_active, email_verified, created_at, updated_at, last_login_at) 
           VALUES ($1, $2, $3, $4, $5, true, true, NOW(), NOW(), NOW()) 
           RETURNING id, email, first_name, last_name, profile_image, created_at`,
          [web3AuthId, email.toLowerCase(), firstName, lastName, image]
        )

        user = result.rows[0]

        // Create user profile
        await query(
          `INSERT INTO user_profiles (user_id, created_at, updated_at)
           VALUES ($1, NOW(), NOW())`,
          [user.id]
        )

        console.log('Created new Web3Auth user:', { 
          id: user.id, 
          email: email,
          web3AuthId 
        })
      }
    }

    const userName = `${user.first_name} ${user.last_name}`.trim()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: userName,
          email: user.email || email,
          image: user.profile_image || image,
          accountType: 'personal', // Default, can be updated later
          preferences: {
            currency: 'USDC',
            notifications: true,
            twoFactorAuth: false
          }
        }
      })
    }

  } catch (error) {
    console.error('Web3Auth user creation error:', error)
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