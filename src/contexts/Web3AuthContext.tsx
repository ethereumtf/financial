'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { IProvider } from '@web3auth/base'
import { web3auth } from '@/lib/web3auth'
import { ethers } from 'ethers'

interface Web3AuthContextType {
  provider: IProvider | null
  user: any
  address: string | null
  balance: string | null
  isLoading: boolean
  isConnected: boolean
  login: () => Promise<void>
  logout: () => Promise<void>
  getUserInfo: () => Promise<any>
  getBalance: () => Promise<string>
  sendTransaction: (to: string, amount: string) => Promise<string>
}

const Web3AuthContext = createContext<Web3AuthContextType | null>(null)

interface Web3AuthProviderProps {
  children: ReactNode
}

export function Web3AuthProvider({ children }: Web3AuthProviderProps) {
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [user, setUser] = useState<any>(null)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal()
        if (web3auth.connected) {
          setProvider(web3auth.provider)
          setIsConnected(true)
          await getUserInfo()
          await getAddress()
          await getBalance()
        }
      } catch (error) {
        console.error('Web3Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [])

  const login = async () => {
    try {
      setIsLoading(true)
      const web3authProvider = await web3auth.connect()
      setProvider(web3authProvider)
      setIsConnected(true)
      await getUserInfo()
      await getAddress()
      await getBalance()
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await web3auth.logout()
      setProvider(null)
      setUser(null)
      setAddress(null)
      setBalance(null)
      setIsConnected(false)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const getUserInfo = async () => {
    if (!web3auth.connected) return null
    try {
      const userInfo = await web3auth.getUserInfo()
      setUser(userInfo)
      return userInfo
    } catch (error) {
      console.error('Get user info error:', error)
      return null
    }
  }

  const getAddress = async () => {
    if (!provider) return null
    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      const userAddress = await signer.getAddress()
      setAddress(userAddress)
      return userAddress
    } catch (error) {
      console.error('Get address error:', error)
      return null
    }
  }

  const getBalance = async () => {
    if (!provider || !address) return '0'
    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      const balance = await ethersProvider.getBalance(address)
      const balanceInEth = ethers.formatEther(balance)
      setBalance(balanceInEth)
      return balanceInEth
    } catch (error) {
      console.error('Get balance error:', error)
      return '0'
    }
  }

  const sendTransaction = async (to: string, amount: string) => {
    if (!provider) throw new Error('Provider not connected')
    try {
      const ethersProvider = new ethers.BrowserProvider(provider)
      const signer = await ethersProvider.getSigner()
      
      const tx = await signer.sendTransaction({
        to: to,
        value: ethers.parseEther(amount),
      })
      
      return tx.hash
    } catch (error) {
      console.error('Send transaction error:', error)
      throw error
    }
  }

  const value = {
    provider,
    user,
    address,
    balance,
    isLoading,
    isConnected,
    login,
    logout,
    getUserInfo,
    getBalance,
    sendTransaction,
  }

  return (
    <Web3AuthContext.Provider value={value}>
      {children}
    </Web3AuthContext.Provider>
  )
}

export function useWeb3Auth() {
  const context = useContext(Web3AuthContext)
  if (!context) {
    throw new Error('useWeb3Auth must be used within a Web3AuthProvider')
  }
  return context
}