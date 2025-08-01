'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useUnifiedAuth, UnifiedUser } from '@/contexts/UnifiedAuthContext'

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
  const { 
    user: unifiedUser, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    isWalletConnected,
    walletBalance,
    sendTransaction 
  } = useUnifiedAuth()

  // Convert UnifiedUser to User interface for backward compatibility
  const user: User | null = unifiedUser ? {
    id: unifiedUser.id,
    email: unifiedUser.email,
    name: unifiedUser.name,
    image: unifiedUser.image,
    walletAddress: unifiedUser.walletAddress,
    walletBalance: unifiedUser.walletBalance,
    accountType: unifiedUser.accountType
  } : null

  // Unified sign-in using Web3Auth (supports both email and Google)
  const signIn = async (): Promise<{ success: boolean; error?: string }> => {
    return await login()
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
    await logout()
  }

  const value: AuthContextType = {
    user,
    loading: isLoading,
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