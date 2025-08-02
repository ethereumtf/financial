'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useAccountAbstraction, AAUser } from '@/contexts/AccountAbstractionContext'

// Maintain backward compatibility with existing User interface
export interface User {
  id: string
  email: string
  name: string
  image?: string
  // Extended properties from AAUser (Account Abstraction)
  walletAddress?: string // Smart wallet address
  walletBalance?: string // Smart wallet ETH balance
  walletUsdcBalance?: string // Smart wallet USDC balance
  eoaAddress?: string // EOA fallback address
  eoaBalance?: string // EOA fallback ETH balance
  eoaUsdcBalance?: string // EOA fallback USDC balance
  accountType?: 'personal' | 'business' | 'premium'
}

export interface AuthContextType {
  user: User | null
  loading: boolean
  // Account Abstraction authentication methods
  signIn: () => Promise<{ success: boolean; error?: string }>
  signUp: () => Promise<{ success: boolean; error?: string }> // Will redirect to same login
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }> // Will redirect to same login
  signOut: () => Promise<void>
  // Account Abstraction capabilities
  isWalletConnected: boolean
  isAAReady: boolean // New: indicates if gasless transactions are available
  walletBalance: string | null // Smart wallet balance
  eoaBalance: string | null // EOA balance for fallback
  sendTransaction: (to: string, amount: string) => Promise<string> // Prefers gasless when available
  sendGaslessTransaction: (to: string, amount: string) => Promise<string> // Force gasless
  sendRegularTransaction: (to: string, amount: string) => Promise<string> // Force EOA
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { 
    user: aaUser, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    isAAReady,
    smartWalletAddress,
    smartWalletBalance,
    smartWalletUsdcBalance,
    eoaAddress,
    eoaBalance,
    eoaUsdcBalance,
    sendGaslessTransaction,
    sendRegularTransaction 
  } = useAccountAbstraction()

  // Convert AAUser to User interface for backward compatibility
  const user: User | null = aaUser ? {
    id: aaUser.id,
    email: aaUser.email,
    name: aaUser.name,
    image: aaUser.image,
    walletAddress: aaUser.smartWalletAddress, // Prioritize smart wallet
    walletBalance: aaUser.smartWalletBalance,
    walletUsdcBalance: aaUser.smartWalletUsdcBalance,
    eoaAddress: aaUser.eoaAddress,
    eoaBalance: aaUser.eoaBalance,
    eoaUsdcBalance: aaUser.eoaUsdcBalance,
    accountType: aaUser.accountType
  } : null

  // Account Abstraction sign-in using Web3Auth (supports both email and Google)
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

  // Smart transaction handler - prefers gasless when available
  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (isAAReady) {
      console.log('🚀 Using gasless transaction via Account Abstraction')
      return await sendGaslessTransaction(to, amount)
    } else {
      console.log('⚠️ Falling back to regular EOA transaction')
      return await sendRegularTransaction(to, amount)
    }
  }

  const value: AuthContextType = {
    user,
    loading: isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    isWalletConnected: !!user,
    isAAReady,
    walletBalance: smartWalletBalance,
    eoaBalance,
    sendTransaction,
    sendGaslessTransaction,
    sendRegularTransaction
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