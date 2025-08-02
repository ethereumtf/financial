'use client'

import { useState } from 'react'
import { useAuthContext } from '@/components/providers/AuthProvider'

export function useAuth() {
  const { 
    user, 
    loading, 
    signIn, 
    signUp, 
    signInWithGoogle, 
    signOut, 
    isWalletConnected, 
    isAAReady,
    walletBalance, 
    eoaBalance,
    sendTransaction,
    sendGaslessTransaction 
  } = useAuthContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  // All auth methods now use Web3Auth modal, so we can trigger it from any of these functions
  const showLogin = async () => {
    try {
      await signIn() // This will open Web3Auth modal
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const showSignup = async () => {
    try {
      await signUp() // This redirects to signIn, opens Web3Auth modal
    } catch (error) {
      console.error('Signup error:', error)
    }
  }

  const hideAuth = () => {
    // Web3Auth modal is controlled by Web3Auth, not our state
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(false)
  }

  // These methods are kept for backward compatibility but now use Web3Auth
  const switchToSignup = async () => {
    await showSignup()
  }

  const switchToLogin = async () => {
    await showLogin()
  }

  return {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    showLogin,
    showSignup,
    hideAuth,
    switchToSignup,
    switchToLogin,
    isLoginModalOpen,
    isSignupModalOpen,
    // Additional wallet capabilities
    isWalletConnected,
    isAAReady,
    walletBalance,
    eoaBalance,
    sendTransaction,
    sendGaslessTransaction
  }
}