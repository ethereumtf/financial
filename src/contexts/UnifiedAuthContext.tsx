'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Web3Auth } from "@web3auth/modal"
import type { IProvider } from '@web3auth/base'

export interface UnifiedUser {
  id: string
  email: string
  name: string
  image?: string
  // Web3 wallet info
  walletAddress?: string
  walletBalance?: string
  // App-specific info
  accountType?: 'personal' | 'business' | 'premium'
  preferences?: {
    currency: 'USDC' | 'USDT'
    notifications: boolean
    twoFactorAuth: boolean
  }
}

interface UnifiedAuthContextType {
  // Core authentication
  user: UnifiedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Authentication methods
  login: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  
  // Wallet capabilities
  isWalletConnected: boolean
  provider: IProvider | null
  walletAddress: string | null
  walletBalance: string | null
  sendTransaction: (to: string, amount: string) => Promise<string>
}

const UnifiedAuthContext = createContext<UnifiedAuthContextType | null>(null)

interface UnifiedAuthProviderProps {
  children: ReactNode
}

export function UnifiedAuthProvider({ children }: UnifiedAuthProviderProps) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [user, setUser] = useState<UnifiedUser | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // First useEffect - just to mark component as mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Second useEffect - Initialize Web3Auth only after mounting
  useEffect(() => {
    if (!isMounted) return

    const initWeb3Auth = async () => {
      // Triple check for browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined' || !window.document) {
        console.log('Not in browser environment, skipping Web3Auth initialization')
        setIsLoading(false)
        return
      }

      try {
        console.log('Initializing Web3Auth...')
        
        // Dynamic import to prevent SSR issues
        const { Web3Auth } = await import("@web3auth/modal")
        const { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } = await import("@web3auth/base")
        
        const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4GjjGKm6bKJ_fJukNQjc9aYAM"

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
            rpcTarget: "https://rpc.ankr.com/eth",
            displayName: "Ethereum Mainnet",
            blockExplorerUrl: "https://etherscan.io",
            ticker: "ETH",
            tickerName: "Ethereum",
          },
          uiConfig: {
            appName: "USD Financial",
            appUrl: "https://usdfinancial.co",
            logoLight: "https://usdfinancial.co/logo.png",
            logoDark: "https://usdfinancial.co/logo.png",
            defaultLanguage: "en",
            mode: "light",
            theme: {
              primary: "#10b981",
            },
            useLogoLoader: true,
            modalConfig: {
              "openlogin": {
                label: "openlogin",
                loginMethods: {
                  email_passwordless: {
                    name: "email_passwordless",
                    showOnModal: true,
                  },
                  google: {
                    name: "google", 
                    showOnModal: true,
                  },
                  facebook: {
                    name: "facebook",
                    showOnModal: false,
                  },
                  twitter: {
                    name: "twitter",
                    showOnModal: false,
                  },
                  github: {
                    name: "github",
                    showOnModal: false,
                  },
                  discord: {
                    name: "discord",
                    showOnModal: false,
                  },
                },
              },
            },
          },
        })

        setWeb3auth(web3authInstance)
        await web3authInstance.initModal()
        console.log('Web3Auth initialized successfully')
        setIsInitialized(true)

        // Check if user was previously authenticated
        if (web3authInstance.connected && web3authInstance.provider) {
          setProvider(web3authInstance.provider)
          await syncUserData(web3authInstance)
        }

        // Check localStorage for persisted session
        const storedUser = localStorage.getItem('unified_auth_user')
        if (storedUser && !user) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (error) {
            localStorage.removeItem('unified_auth_user')
          }
        }
      } catch (error) {
        console.error('Web3Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initWeb3Auth()
  }, [isMounted]) // Depend on isMounted to ensure we're in browser

  const syncUserData = async (web3authInstance: Web3Auth) => {
    try {
      if (!web3authInstance.connected) return

      // Get user info from Web3Auth
      const userInfo = await web3authInstance.getUserInfo()
      
      // Create unified user object
      const unifiedUser: UnifiedUser = {
        id: userInfo.verifierId || `web3auth_${Date.now()}`,
        email: userInfo.email || '',
        name: userInfo.name || userInfo.email || 'Anonymous User',
        image: userInfo.profileImage,
        accountType: 'personal',
        preferences: {
          currency: 'USDC',
          notifications: true,
          twoFactorAuth: false
        }
      }

      // Get wallet info
      if (web3authInstance.provider) {
        const address = await getWalletAddress(web3authInstance.provider)
        const balance = await getWalletBalance(web3authInstance.provider, address)
        
        unifiedUser.walletAddress = address
        unifiedUser.walletBalance = balance
        setWalletAddress(address)
        setWalletBalance(balance)
      }

      setUser(unifiedUser)
      localStorage.setItem('unified_auth_user', JSON.stringify(unifiedUser))
    } catch (error) {
      console.error('Sync user data error:', error)
    }
  }

  const getWalletAddress = async (provider: IProvider): Promise<string | null> => {
    try {
      const { ethers } = await import('ethers')
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      return await signer.getAddress()
    } catch (error) {
      console.error('Get wallet address error:', error)
      return null
    }
  }

  const getWalletBalance = async (provider: IProvider, address: string | null): Promise<string> => {
    if (!address) return '0'
    
    try {
      const { ethers } = await import('ethers')
      const ethersProvider = new ethers.BrowserProvider(provider)
      const balance = await ethersProvider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Get wallet balance error:', error)
      return '0'
    }
  }

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isMounted || !web3auth || !isInitialized) {
      return { success: false, error: 'Web3Auth not initialized' }
    }

    try {
      setIsLoading(true)
      const web3authProvider = await web3auth.connect()
      
      if (web3authProvider) {
        setProvider(web3authProvider)
        await syncUserData(web3auth)
        return { success: true }
      } else {
        return { success: false, error: 'Authentication failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Authentication failed' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    if (!isMounted || !web3auth) return

    try {
      setIsLoading(true)
      await web3auth.logout()
      
      // Clear all state
      setProvider(null)
      setUser(null)
      setWalletAddress(null)
      setWalletBalance(null)
      
      // Clear persisted session
      localStorage.removeItem('unified_auth_user')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTransaction = async (to: string, amount: string): Promise<string> => {
    if (!provider) throw new Error('Wallet not connected')
    
    try {
      const { ethers } = await import('ethers')
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount),
      })
      
      // Refresh balance after transaction
      if (walletAddress) {
        const newBalance = await getWalletBalance(provider, walletAddress)
        setWalletBalance(newBalance)
      }
      
      return tx.hash
    } catch (error) {
      console.error('Send transaction error:', error)
      throw error
    }
  }

  const value: UnifiedAuthContextType = {
    user,
    isAuthenticated: !!user && !!web3auth?.connected,
    isLoading: isLoading || !isInitialized || !isMounted,
    login,
    logout,
    isWalletConnected: !!provider && !!walletAddress,
    provider,
    walletAddress,
    walletBalance,
    sendTransaction,
  }

  // Don't render anything until we're mounted (client-side)
  if (!isMounted) {
    return (
      <UnifiedAuthContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: async () => ({ success: false, error: 'Initializing...' }),
        logout: async () => {},
        isWalletConnected: false,
        provider: null,
        walletAddress: null,
        walletBalance: null,
        sendTransaction: async () => { throw new Error('Not initialized') },
      }}>
        {children}
      </UnifiedAuthContext.Provider>
    )
  }

  return (
    <UnifiedAuthContext.Provider value={value}>
      {children}
    </UnifiedAuthContext.Provider>
  )
}

export function useUnifiedAuth() {
  const context = useContext(UnifiedAuthContext)
  if (!context) {
    throw new Error('useUnifiedAuth must be used within a UnifiedAuthProvider')
  }
  return context
}