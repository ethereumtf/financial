import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { EtherlinkAdapter } from '../lib/blockchain/etherlink/adapter';
import { Token, SwapParams, QuoteResponse } from '../lib/blockchain/etherlink/types';

export const useEtherlink = (provider?: any) => {
  const [adapter, setAdapter] = useState<EtherlinkAdapter | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [quote, setQuote] = useState<QuoteResponse | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);

  // Initialize adapter when provider changes
  useEffect(() => {
    if (provider) {
      const etherlinkAdapter = new EtherlinkAdapter({
        network: 'testnet',
        rpcUrl: 'https://node.ghostnet.etherlink.com',
        chainId: 128123,
      });
      
      const signer = provider.getSigner();
      etherlinkAdapter.setSigner(signer);
      setAdapter(etherlinkAdapter);
      
      // Set up event listeners
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null);
      };
      
      const handleChainChanged = (newChainId: number) => {
        setChainId(Number(newChainId));
      };
      
      // Get initial account and chain ID
      signer.getAddress()
        .then((address: string) => setAccount(address))
        .catch(console.error);
      
      provider.getNetwork()
        .then((network: any) => setChainId(Number(network.chainId)))
        .catch(console.error);
      
      // Set up event listeners
      if (provider.on) {
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
      }
      
      // Cleanup
      return () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [provider]);

  // Connect wallet
  const connect = useCallback(async () => {
    if (!adapter || !window.ethereum) return;
    
    try {
      setIsConnecting(true);
      setError(null);
      
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Get the signer
      const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
      adapter.setSigner(signer);
      
      // Update account and chain ID
      const address = await signer.getAddress();
      const network = await signer.provider?.getNetwork();
      
      setAccount(address);
      if (network) {
        setChainId(Number(network.chainId));
      }
      
      return address;
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect wallet'));
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [adapter]);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setQuote(null);
  }, []);

  // Get token balance
  const getTokenBalance = useCallback(async (tokenAddress: string, accountAddress?: string) => {
    if (!adapter) throw new Error('Adapter not initialized');
    return adapter.getTokenBalance(tokenAddress, accountAddress);
  }, [adapter]);

  // Get token allowance
  const getTokenAllowance = useCallback(async (tokenAddress: string, spender: string, owner?: string) => {
    if (!adapter) throw new Error('Adapter not initialized');
    return adapter.getTokenAllowance(tokenAddress, spender, owner);
  }, [adapter]);

  // Approve token
  const approveToken = useCallback(async (tokenAddress: string, spender: string, amount?: string) => {
    if (!adapter) throw new Error('Adapter not initialized');
    if (!account) throw new Error('Not connected');
    
    try {
      setError(null);
      return await adapter.approveToken(tokenAddress, spender, amount);
    } catch (err) {
      console.error('Token approval failed:', err);
      setError(err instanceof Error ? err : new Error('Token approval failed'));
      throw err;
    }
  }, [adapter, account]);

  // Get swap quote
  const getQuote = useCallback(async (params: Omit<SwapParams, 'fromAddress'>) => {
    if (!adapter || !account) return null;
    
    try {
      setIsLoadingQuote(true);
      setError(null);
      
      const quoteParams: SwapParams = {
        ...params,
        fromAddress: account,
      };
      
      const quote = await adapter.getQuote(quoteParams);
      setQuote(quote);
      return quote;
    } catch (err) {
      console.error('Failed to get quote:', err);
      setError(err instanceof Error ? err : new Error('Failed to get quote'));
      setQuote(null);
      throw err;
    } finally {
      setIsLoadingQuote(false);
    }
  }, [adapter, account]);

  // Execute swap
  const executeSwap = useCallback(async (params: Omit<SwapParams, 'fromAddress'>) => {
    if (!adapter || !account) throw new Error('Not connected');
    
    try {
      setError(null);
      
      const swapParams: SwapParams = {
        ...params,
        fromAddress: account,
      };
      
      return await adapter.executeSwap(swapParams);
    } catch (err) {
      console.error('Swap failed:', err);
      setError(err instanceof Error ? err : new Error('Swap failed'));
      throw err;
    }
  }, [adapter, account]);

  return {
    adapter,
    account,
    chainId,
    isConnected: !!account,
    isConnecting,
    error,
    connect,
    disconnect,
    getTokenBalance,
    getTokenAllowance,
    approveToken,
    getQuote,
    quote,
    isLoadingQuote,
    executeSwap,
  };
};

export default useEtherlink;
