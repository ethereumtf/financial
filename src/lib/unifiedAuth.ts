'use client'

import { IProvider } from '@web3auth/base'
import { web3auth } from '@/lib/web3auth'
import { ethers } from 'ethers'

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

export interface UnifiedAuthService {
  // Core authentication
  user: UnifiedUser | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // Authentication methods
  login: () => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  getUserInfo: () => Promise<UnifiedUser | null>
  
  // Wallet capabilities
  isWalletConnected: boolean
  provider: IProvider | null
  walletAddress: string | null
  walletBalance: string | null
  getWalletBalance: () => Promise<string>
  sendTransaction: (to: string, amount: string) => Promise<string>
}

class UnifiedAuthManager {
  private user: UnifiedUser | null = null
  private provider: IProvider | null = null
  private walletAddress: string | null = null
  private walletBalance: string | null = null
  private isLoading: boolean = true
  private listeners: Set<() => void> = new Set()

  constructor() {
    // Only initialize on client side
    if (typeof window !== 'undefined') {
      this.initialize()
    } else {
      this.isLoading = false
    }
  }

  private async initialize() {
    try {
      await web3auth.initModal()
      
      // Check if user was previously authenticated
      if (web3auth.connected && web3auth.provider) {
        this.provider = web3auth.provider
        await this.syncUserData()
      }
      
      // Check localStorage for persisted session
      const storedUser = localStorage.getItem('unified_auth_user')
      if (storedUser && !this.user) {
        try {
          this.user = JSON.parse(storedUser)
        } catch (error) {
          localStorage.removeItem('unified_auth_user')
        }
      }
    } catch (error) {
      console.error('UnifiedAuth initialization error:', error)
    } finally {
      this.isLoading = false
      this.notifyListeners()
    }
  }

  async login(): Promise<{ success: boolean; error?: string }> {
    try {
      this.isLoading = true
      this.notifyListeners()

      const web3authProvider = await web3auth.connect()
      
      if (web3authProvider) {
        this.provider = web3authProvider
        await this.syncUserData()
        
        // Persist user session
        if (this.user) {
          localStorage.setItem('unified_auth_user', JSON.stringify(this.user))
        }
        
        return { success: true }
      } else {
        return { success: false, error: 'Authentication failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Authentication failed' }
    } finally {
      this.isLoading = false
      this.notifyListeners()
    }
  }

  async logout(): Promise<void> {
    try {
      this.isLoading = true
      this.notifyListeners()

      await web3auth.logout()
      
      // Clear all state
      this.provider = null
      this.user = null
      this.walletAddress = null
      this.walletBalance = null
      
      // Clear persisted session
      localStorage.removeItem('unified_auth_user')
      
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      this.isLoading = false
      this.notifyListeners()
    }
  }

  async getUserInfo(): Promise<UnifiedUser | null> {
    if (!web3auth.connected) return this.user

    try {
      const userInfo = await web3auth.getUserInfo()
      
      // Create unified user object
      const unifiedUser: UnifiedUser = {
        id: userInfo.verifierId || `web3auth_${Date.now()}`,
        email: userInfo.email || '',
        name: userInfo.name || userInfo.email || 'Anonymous User',
        image: userInfo.profileImage,
        walletAddress: this.walletAddress,
        walletBalance: this.walletBalance,
        accountType: 'personal', // Default, can be updated later
        preferences: {
          currency: 'USDC',
          notifications: true,
          twoFactorAuth: false
        }
      }

      this.user = unifiedUser
      return unifiedUser
    } catch (error) {
      console.error('Get user info error:', error)
      return this.user
    }
  }

  private async syncUserData() {
    try {
      // Get user info from Web3Auth
      await this.getUserInfo()
      
      // Get wallet address and balance
      await this.getWalletAddress()
      await this.getWalletBalance()
      
      // Update user object with wallet info
      if (this.user) {
        this.user.walletAddress = this.walletAddress
        this.user.walletBalance = this.walletBalance
      }
    } catch (error) {
      console.error('Sync user data error:', error)
    }
  }

  private async getWalletAddress(): Promise<string | null> {
    if (!this.provider) {
      this.walletAddress = null
      return null
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const signer = await ethersProvider.getSigner()
      const address = await signer.getAddress()
      this.walletAddress = address
      return address
    } catch (error) {
      console.error('Get wallet address error:', error)
      this.walletAddress = null
      return null
    }
  }

  async getWalletBalance(): Promise<string> {
    if (!this.provider || !this.walletAddress) {
      this.walletBalance = '0'
      return '0'
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const balance = await ethersProvider.getBalance(this.walletAddress)
      const balanceInEth = ethers.formatEther(balance)
      this.walletBalance = balanceInEth
      return balanceInEth
    } catch (error) {
      console.error('Get wallet balance error:', error)
      this.walletBalance = '0'
      return '0'
    }
  }

  async sendTransaction(to: string, amount: string): Promise<string> {
    if (!this.provider) throw new Error('Wallet not connected')
    
    try {
      const ethersProvider = new ethers.BrowserProvider(this.provider)
      const signer = await ethersProvider.getSigner()
      
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount),
      })
      
      // Refresh balance after transaction
      await this.getWalletBalance()
      this.notifyListeners()
      
      return tx.hash
    } catch (error) {
      console.error('Send transaction error:', error)
      throw error
    }
  }

  // State getters
  getUser(): UnifiedUser | null {
    return this.user
  }

  getIsAuthenticated(): boolean {
    return !!this.user && web3auth.connected
  }

  getIsLoading(): boolean {
    return this.isLoading
  }

  getIsWalletConnected(): boolean {
    return !!this.provider && !!this.walletAddress
  }

  getProvider(): IProvider | null {
    return this.provider
  }

  getWalletAddress(): string | null {
    return this.walletAddress
  }

  getWalletBalanceSync(): string | null {
    return this.walletBalance
  }

  // Event system for state updates
  subscribe(listener: () => void) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener())
  }
}

// Singleton instance
export const unifiedAuth = new UnifiedAuthManager()