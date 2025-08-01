'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { validateUserCredentials, findUserByEmail, demoUsers } from '@/lib/demoUsers'

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
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const demoUser = validateUserCredentials(email, password)
      
      if (demoUser) {
        const authenticatedUser: User = {
          id: demoUser.id,
          email: demoUser.email,
          name: demoUser.name,
          image: demoUser.image
        }
        setUser(authenticatedUser)
        localStorage.setItem('auth_user', JSON.stringify(authenticatedUser))
        return { success: true }
      } else {
        return { success: false, error: 'Invalid email or password' }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Sign in failed' }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      // Simulate network delay for realistic UX
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check if user already exists
      const existingUser = findUserByEmail(email)
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' }
      }
      
      // Create new demo user
      const newUser: User = {
        id: 'demo-new-' + Date.now(),
        email: email.toLowerCase(),
        name,
        image: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face`
      }
      
      // Auto sign in after successful signup
      setUser(newUser)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
      return { success: true }
    } catch (error) {
      console.error('Sign up error:', error)
      return { success: false, error: 'Signup failed' }
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setLoading(true)
    try {
      // Simulate Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo purposes, create a realistic Google user
      const googleUser: User = {
        id: 'google_' + Date.now(),
        email: 'demo.google.user@gmail.com',
        name: 'Google Demo User',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      }
      
      setUser(googleUser)
      localStorage.setItem('auth_user', JSON.stringify(googleUser))
      return { success: true }
    } catch (error) {
      console.error('Google sign in error:', error)
      return { success: false, error: 'Google sign-in failed' }
    } finally {
      setLoading(false)
    }
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