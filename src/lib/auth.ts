import { getSession, signIn, signOut } from 'next-auth/react'

export interface User {
  id: string
  email: string
  name: string
  image?: string
}

export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

// Custom auth functions for Netlify deployment
export const auth = {
  // Sign in with credentials
  signInWithCredentials: async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      
      return {
        success: !result?.error,
        error: result?.error || null
      }
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed'
      }
    }
  },

  // Sign in with Google
  signInWithGoogle: async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' })
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: 'Google authentication failed'
      }
    }
  },

  // Sign up with credentials (mock implementation)
  signUp: async (name: string, email: string, password: string) => {
    try {
      // In a real app, this would create a user in your database
      const response = await fetch('/.netlify/functions/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Signup failed'
        }
      }

      // Auto sign in after successful signup
      return await auth.signInWithCredentials(email, password)
    } catch (error) {
      return {
        success: false,
        error: 'Signup failed'
      }
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut({ callbackUrl: '/' })
      return { success: true, error: null }
    } catch (error) {
      return {
        success: false,
        error: 'Sign out failed'
      }
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const session = await getSession()
      return session
    } catch (error) {
      console.error('Failed to get session:', error)
      return null
    }
  }
}