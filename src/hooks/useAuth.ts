'use client'

import { useState } from 'react'
import { useAuthContext } from '@/components/providers/AuthProvider'

export function useAuth() {
  const { user, loading, signIn, signUp, signInWithGoogle, signOut } = useAuthContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

  const showLogin = () => {
    setIsSignupModalOpen(false)
    setIsLoginModalOpen(true)
  }

  const showSignup = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(true)
  }

  const hideAuth = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(false)
  }

  const switchToSignup = () => {
    setIsLoginModalOpen(false)
    setIsSignupModalOpen(true)
  }

  const switchToLogin = () => {
    setIsSignupModalOpen(false)
    setIsLoginModalOpen(true)
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
    isSignupModalOpen
  }
}