'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { Web3Auth } from "@web3auth/modal"
import type { IProvider } from '@web3auth/base'
import { SimpleAAService } from '@/lib/simpleAA'

export interface AAUser {
  id: string
  email: string
  name: string
  image?: string
  // Smart Contract Wallet info
  smartWalletAddress?: string
  smartWalletBalance?: string
  // EOA wallet info (for fallback)
  eoaAddress?: string
  eoaBalance?: string
  // App-specific info
  accountType?: 'personal' | 'business' | 'premium'
  preferences?: {
    currency: 'USDC' | 'USDT'
    notifications: boolean
    twoFactorAuth: boolean
  }
}

interface AccountAbstractionContextType {
  // Core authentication
  user: AAUser | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Authentication methods
  login: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  
  // Account Abstraction capabilities
  isAAReady: boolean
  smartWalletAddress: string | null
  smartWalletBalance: string | null
  currentChain: string
  
  // Transaction methods
  sendGaslessTransaction: (to: string, amount: string) => Promise<string>
  sendRegularTransaction: (to: string, amount: string) => Promise<string>
  switchChain: (chain: string) => Promise<void>
  
  // Fallback EOA wallet
  eoaProvider: IProvider | null
  eoaAddress: string | null
  eoaBalance: string | null
}

const AccountAbstractionContext = createContext<AccountAbstractionContextType | null>(null)

interface AccountAbstractionProviderProps {
  children: ReactNode
}

export function AccountAbstractionProvider({ children }: AccountAbstractionProviderProps) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null)
  const [eoaProvider, setEOAProvider] = useState<IProvider | null>(null)
  const [user, setUser] = useState<AAUser | null>(null)
  const [eoaAddress, setEOAAddress] = useState<string | null>(null)
  const [eoaBalance, setEOABalance] = useState<string | null>(null)
  const [smartWalletAddress, setSmartWalletAddress] = useState<string | null>(null)
  const [smartWalletBalance, setSmartWalletBalance] = useState<string | null>(null)
  const [currentChain, setCurrentChain] = useState<string>('sepolia')
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isAAReady, setIsAAReady] = useState(false)
  
  // AA Service instance
  const [aaService] = useState(() => new SimpleAAService())

  // First useEffect - just to mark component as mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Second useEffect - Initialize Web3Auth and AA only after mounting
  useEffect(() => {
    if (!isMounted) return

    const initAccountAbstraction = async () => {
      // Triple check for browser environment
      if (typeof window === 'undefined' || typeof document === 'undefined' || !window.document) {
        console.log('Not in browser environment, skipping AA initialization')
        setIsLoading(false)
        return
      }

      try {
        console.log('🚀 Initializing Account Abstraction...')
        
        // Dynamic import to prevent SSR issues
        const { Web3Auth } = await import("@web3auth/modal")
        const { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } = await import("@web3auth/base")
        
        const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID || "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4GjjGKm6bKJ_fJukNQjc9aYAM"
        const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0xaa36a7", // Sepolia for AA support
            rpcTarget: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
            displayName: "Ethereum Sepolia",
            blockExplorerUrl: "https://sepolia.etherscan.io",
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
        await web3authInstance.init()
        console.log('✅ Web3Auth initialized successfully')
        setIsInitialized(true)

        // Check if user was previously authenticated
        if (web3authInstance.connected && web3authInstance.provider) {
          setEOAProvider(web3authInstance.provider)
          await syncUserData(web3authInstance)
        }

        // Check localStorage for persisted session
        const storedUser = localStorage.getItem('aa_auth_user')
        if (storedUser && !user) {
          try {
            const parsedUser = JSON.parse(storedUser)
            setUser(parsedUser)
          } catch (error) {
            localStorage.removeItem('aa_auth_user')
          }
        }
      } catch (error) {
        console.error('❌ Account Abstraction initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAccountAbstraction()
  }, [isMounted])

  const syncUserData = async (web3authInstance: Web3Auth) => {
    try {
      if (!web3authInstance.connected) return

      // Get user info from Web3Auth
      const userInfo = await web3authInstance.getUserInfo()
      
      // Get EOA wallet info
      if (web3authInstance.provider) {
        const eoaAddr = await getEOAAddress(web3authInstance.provider)
        const eoabal = await getEOABalance(web3authInstance.provider, eoaAddr)
        
        setEOAAddress(eoaAddr)
        setEOABalance(eoabal)

        // Initialize Simple Account Abstraction
        try {
          const isAAInitialized = await aaService.initialize(eoaAddr)
          
          if (isAAInitialized && aaService.isReady()) {
            const smartAddr = aaService.getSmartWalletAddress()
            const smartBal = await aaService.getBalance()
            
            setSmartWalletAddress(smartAddr)
            setSmartWalletBalance(smartBal)
            setIsAAReady(true)
            
            console.log(`🎯 Smart Wallet Ready: ${smartAddr}`)
          } else {
            console.log('⚠️ AA not available, using EOA mode')
            setIsAAReady(false)
          }
        } catch (aaError) {
          console.warn('⚠️ AA initialization failed, falling back to EOA:', aaError)
          setIsAAReady(false)
        }
      }
      
      // Create unified user object
      const aaUser: AAUser = {
        id: userInfo.verifierId || `web3auth_${Date.now()}`,
        email: userInfo.email || '',
        name: userInfo.name || userInfo.email || 'Anonymous User',
        image: userInfo.profileImage,
        smartWalletAddress: smartWalletAddress,
        smartWalletBalance: smartWalletBalance,
        eoaAddress: eoaAddress,
        eoaBalance: eoaBalance,
        accountType: 'personal',
        preferences: {
          currency: 'USDC',
          notifications: true,
          twoFactorAuth: false
        }
      }

      setUser(aaUser)
      localStorage.setItem('aa_auth_user', JSON.stringify(aaUser))
    } catch (error) {
      console.error('❌ Sync user data error:', error)
    }
  }

  const getEOAAddress = async (provider: IProvider): Promise<string | null> => {
    try {
      const { ethers } = await import('ethers')
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      return await signer.getAddress()
    } catch (error) {
      console.error('Get EOA address error:', error)
      return null
    }
  }

  const getEOABalance = async (provider: IProvider, address: string | null): Promise<string> => {
    if (!address) return '0'
    
    try {
      const { ethers } = await import('ethers')
      const ethersProvider = new ethers.BrowserProvider(provider)
      const balance = await ethersProvider.getBalance(address)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error('Get EOA balance error:', error)
      return '0'
    }
  }

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    if (!isMounted || !web3auth || !isInitialized) {
      return { success: false, error: 'Account Abstraction not initialized' }
    }

    try {
      setIsLoading(true)
      const web3authProvider = await web3auth.connect()
      
      if (web3authProvider) {
        setEOAProvider(web3authProvider)
        await syncUserData(web3auth)
        return { success: true }
      } else {
        return { success: false, error: 'Authentication failed' }
      }
    } catch (error) {
      console.error('❌ Login error:', error)
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
      
      // Disconnect AA service
      aaService.disconnect()
      
      // Clear all state
      setEOAProvider(null)
      setUser(null)
      setEOAAddress(null)
      setEOABalance(null)
      setSmartWalletAddress(null)
      setSmartWalletBalance(null)
      setIsAAReady(false)
      
      // Clear persisted session
      localStorage.removeItem('aa_auth_user')
    } catch (error) {
      console.error('❌ Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendGaslessTransaction = async (to: string, amount: string): Promise<string> => {
    if (!aaService.isReady()) {
      throw new Error('Account Abstraction not ready. Using fallback EOA transaction.')
    }
    
    try {
      // Send gasless transaction via Simple AA
      const txHash = await aaService.sendGaslessTransaction(to, amount)
      
      // Refresh smart wallet balance
      const newBalance = await aaService.getBalance()
      setSmartWalletBalance(newBalance)
      
      return txHash
    } catch (error) {
      console.error('❌ Gasless transaction failed:', error)
      throw error
    }
  }

  const sendRegularTransaction = async (to: string, amount: string): Promise<string> => {
    if (!eoaProvider) throw new Error('EOA wallet not connected')
    
    try {
      const { ethers } = await import('ethers')
      const ethersProvider = new ethers.BrowserProvider(eoaProvider)
      const signer = await ethersProvider.getSigner()
      
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount),
      })
      
      // Refresh EOA balance
      if (eoaAddress) {
        const newBalance = await getEOABalance(eoaProvider, eoaAddress)
        setEOABalance(newBalance)
      }
      
      return tx.hash
    } catch (error) {
      console.error('❌ Regular transaction failed:', error)
      throw error
    }
  }

  const switchChain = async (chain: string): Promise<void> => {
    try {
      setCurrentChain(chain)
      console.log(`🔄 Switching to chain: ${chain}`)
      
      // Update smart wallet info for new chain
      if (aaService.isReady()) {
        const smartAddr = aaService.getSmartWalletAddress()
        const smartBal = await aaService.getBalance()
        setSmartWalletAddress(smartAddr)
        setSmartWalletBalance(smartBal)
      }
    } catch (error) {
      console.error('❌ Chain switch failed:', error)
      throw error
    }
  }

  const value: AccountAbstractionContextType = {
    user,
    isAuthenticated: !!user && !!web3auth?.connected,
    isLoading: isLoading || !isInitialized || !isMounted,
    login,
    logout,
    isAAReady,
    smartWalletAddress,
    smartWalletBalance,
    currentChain,
    sendGaslessTransaction,
    sendRegularTransaction,
    switchChain,
    eoaProvider,
    eoaAddress,
    eoaBalance,
  }

  // Don't render anything until we're mounted (client-side)
  if (!isMounted) {
    return (
      <AccountAbstractionContext.Provider value={{
        user: null,
        isAuthenticated: false,
        isLoading: true,
        login: async () => ({ success: false, error: 'Initializing...' }),
        logout: async () => {},
        isAAReady: false,
        smartWalletAddress: null,
        smartWalletBalance: null,
        currentChain: 'sepolia',
        sendGaslessTransaction: async () => { throw new Error('Not initialized') },
        sendRegularTransaction: async () => { throw new Error('Not initialized') },
        switchChain: async () => { throw new Error('Not initialized') },
        eoaProvider: null,
        eoaAddress: null,
        eoaBalance: null,
      }}>
        {children}
      </AccountAbstractionContext.Provider>
    )
  }

  return (
    <AccountAbstractionContext.Provider value={value}>
      {children}
    </AccountAbstractionContext.Provider>
  )
}

export function useAccountAbstraction() {
  const context = useContext(AccountAbstractionContext)
  if (!context) {
    throw new Error('useAccountAbstraction must be used within a AccountAbstractionProvider')
  }
  return context
}