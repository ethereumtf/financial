'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { unifiedAuth, UnifiedUser } from '@/lib/unifiedAuth'

// Maintain backward compatibility with existing User interface
export interface User {
  id: string
  email: string
  name: string
  image?: string
  // Extended properties from UnifiedUser
  walletAddress?: string
  walletBalance?: string
  accountType?: 'personal' | 'business' | 'premium'
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  // Unified authentication methods - now using Web3Auth
  signIn: () => Promise<{ success: boolean; error?: string }>
  signUp: () => Promise<{ success: boolean; error?: string }> // Will redirect to same login
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }> // Will redirect to same login
  signOut: () => Promise<void>
  // Additional wallet capabilities
  isWalletConnected: boolean
  walletBalance: string | null
  sendTransaction: (to: string, amount: string) => Promise<string>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState<string | null>(null)

  // Initialize auth state from unifiedAuth
  useEffect(() => {
    const updateAuthState = () => {
      const authUser = unifiedAuth.getUser()
      const isLoading = unifiedAuth.getIsLoading()
      const walletConnected = unifiedAuth.getIsWalletConnected()
      const balance = unifiedAuth.getWalletBalanceSync()

      // Convert UnifiedUser to User interface for backward compatibility
      if (authUser) {
        const compatibleUser: User = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name,
          image: authUser.image,
          walletAddress: authUser.walletAddress,
          walletBalance: authUser.walletBalance,
          accountType: authUser.accountType
        }
        setUser(compatibleUser)
      } else {
        setUser(null)
      }

      setLoading(isLoading)
      setIsWalletConnected(walletConnected)
      setWalletBalance(balance)
    }

    // Initial state update
    updateAuthState()

    // Subscribe to auth state changes
    const unsubscribe = unifiedAuth.subscribe(updateAuthState)

    return unsubscribe
  }, [])

  // Unified sign-in using Web3Auth (supports both email and Google)
  const signIn = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      return await unifiedAuth.login()
    } catch (error) {
      console.error('Sign in error:', error)
      return { success: false, error: 'Authentication failed' }
    }
  }

  // Sign-up redirects to same Web3Auth login (no separate signup needed)
  const signUp = async (): Promise<{ success: boolean; error?: string }> => {
    // Web3Auth handles both new user creation and existing user login
    return await signIn()
  }

  // Google sign-in redirects to same Web3Auth login (Google is an option)
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    return await signIn()
  }

  const signOut = async (): Promise<void> => {
    await unifiedAuth.logout()
  }

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    return await unifiedAuth.sendTransaction(to, amount)
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isWalletConnected,
    walletBalance,
    sendTransaction
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