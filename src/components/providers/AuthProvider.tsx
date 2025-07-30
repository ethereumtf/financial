'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: string
  email: string
  name: string
  image?: string
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      // Demo credentials check
      if (email === 'demo@usdfinancial.com' && password === 'demo123') {
        const demoUser: User = {
          id: '1',
          email: 'demo@usdfinancial.com',
          name: 'Demo User'
        }
        setUser(demoUser)
        localStorage.setItem('auth_user', JSON.stringify(demoUser))
        return { success: true }
      }

      // For real authentication, call your backend
      const response = await fetch('/.netlify/functions/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        const authenticatedUser: User = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          image: data.user.image
        }
        setUser(authenticatedUser)
        localStorage.setItem('auth_user', JSON.stringify(authenticatedUser))
        return { success: true }
      } else {
        return { success: false, error: data.error || 'Invalid credentials' }
      }
    } catch (error) {
      return { success: false, error: 'Sign in failed' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      const response = await fetch('/.netlify/functions/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()

      if (response.ok && data.user) {
        // Auto sign in after successful signup
        return await signIn(email, password)
      } else {
        return { success: false, error: data.error || 'Signup failed' }
      }
    } catch (error) {
      return { success: false, error: 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // For demo purposes, create a mock Google user
    // In production, this would integrate with Google OAuth
    const googleUser: User = {
      id: 'google_' + Date.now(),
      email: 'user@gmail.com',
      name: 'Google User',
      image: 'https://via.placeholder.com/40'
    }
    
    setUser(googleUser)
    localStorage.setItem('auth_user', JSON.stringify(googleUser))
    return { success: true }
  }

  const signOut = async (): Promise<void> => {
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}