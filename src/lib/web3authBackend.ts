import { UnifiedUser } from './unifiedAuth'

export interface Web3AuthUser {
  verifierId: string
  email: string
  name: string
  profileImage?: string
  typeOfLogin: string // 'google', 'email_passwordless', etc.
}

export async function createOrUpdateUserFromWeb3Auth(web3AuthUser: Web3AuthUser): Promise<UnifiedUser> {
  try {
    // Call our backend API to create/update user
    const response = await fetch('/.netlify/functions/web3auth-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        web3AuthId: web3AuthUser.verifierId,
        email: web3AuthUser.email,
        name: web3AuthUser.name,
        image: web3AuthUser.profileImage,
        loginMethod: web3AuthUser.typeOfLogin
      })
    })

    if (!response.ok) {
      throw new Error('Failed to create/update user')
    }

    const result = await response.json()
    
    // Convert to UnifiedUser format
    const unifiedUser: UnifiedUser = {
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      image: result.user.image,
      accountType: result.user.accountType || 'personal',
      preferences: result.user.preferences || {
        currency: 'USDC',
        notifications: true,
        twoFactorAuth: false
      }
    }

    return unifiedUser
  } catch (error) {
    console.error('Error creating/updating Web3Auth user:', error)
    
    // Fallback: create basic user object without database
    return {
      id: web3AuthUser.verifierId,
      email: web3AuthUser.email,
      name: web3AuthUser.name,
      image: web3AuthUser.profileImage,
      accountType: 'personal',
      preferences: {
        currency: 'USDC',
        notifications: true,
        twoFactorAuth: false
      }
    }
  }
}

export function validateWeb3AuthJWT(jwt: string): boolean {
  // In a real implementation, you would verify the Web3Auth JWT
  // This is a placeholder for JWT validation
  try {
    const parts = jwt.split('.')
    if (parts.length !== 3) return false
    
    const payload = JSON.parse(atob(parts[1]))
    
    // Check if token is expired
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false
    }
    
    // Check if token is from Web3Auth
    if (payload.iss && !payload.iss.includes('web3auth')) {
      return false
    }
    
    return true
  } catch (error) {
    return false
  }
}