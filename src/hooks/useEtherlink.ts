import { useState, useEffect, useCallback } from 'react';
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { EtherlinkAdapter } from '../lib/blockchain/etherlink/adapter';
import { Token, SwapParams, QuoteResponse, TransactionRequest } from '../lib/blockchain/etherlink/types';

interface UseEtherlinkReturn {
  // Connection
  connect: () => Promise<void>;
  disconnect: () => void;
  isConnected: boolean;
  isConnecting: boolean;
  account: string | null;
  chainId: bigint | null;
  error: Error | null;
  
  // Token operations
  getTokenBalance: (tokenAddress: string, address: string) => Promise<string>;
  getTokenAllowance: (tokenAddress: string, spender: string, owner?: string) => Promise<string>;
  approveToken: (tokenAddress: string, spender: string, amount?: string) => Promise<TransactionRequest>;
  
  // Swap operations
  getQuote: (params: SwapParams) => Promise<QuoteResponse>;
  swap: (params: SwapParams) => Promise<TransactionRequest>;
  quote: QuoteResponse | null;
  isLoadingQuote: boolean;
  
  // Transaction operations
  sendTransaction: (transaction: TransactionRequest) => Promise<TransactionRequest>;
  getTransaction: (txHash: string) => Promise<ethers.TransactionResponse | null>;
  getTransactionReceipt: (txHash: string) => Promise<ethers.TransactionReceipt | null>;
  
  // Adapter
  adapter: EtherlinkAdapter | null;
}

export const useEtherlink = (provider?: BrowserProvider): UseEtherlinkReturn => {
  const [adapter, setAdapter] = useState<EtherlinkAdapter | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<bigint | null>(null);
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
        explorerUrl: 'https://testnet-explorer.etherlink.com'
      });
      
      setAdapter(etherlinkAdapter);
      
      // Set up event listeners
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null);
      };
      
      const handleChainChanged = (newChainId: string) => {
        // Convert hex chainId to number
        setChainId(BigInt(parseInt(newChainId, 16)));
      };
      
      // Check if we have a provider with event listeners (like MetaMask)
      if (provider && typeof window !== 'undefined' && (window as any).ethereum) {
        (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.on('chainChanged', handleChainChanged);
        
        // Initial account check
        (window as any).ethereum.request({ method: 'eth_accounts' })
          .then((accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            }
          });
          
        // Initial chain ID check
        (window as any).ethereum.request({ method: 'eth_chainId' })
          .then((hexChainId: string) => {
            setChainId(BigInt(parseInt(hexChainId, 16)));
          });
      }
      
      return () => {
        // Clean up event listeners
        if (typeof window !== 'undefined' && (window as any).ethereum) {
          (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
          (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
        }
      };
    }
  }, [provider]);

  // Connect to wallet
  const connect = useCallback(async () => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      setIsConnecting(true);
      setError(null);
      
      const { address, chainId } = await adapter.connect();
      setAccount(address);
      setChainId(chainId);
      
      return { address, chainId };
    } catch (err) {
      console.error('Error connecting to wallet:', err);
      setError(err instanceof Error ? err : new Error('Failed to connect to wallet'));
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
  const getTokenBalance = useCallback(async (tokenAddress: string, address: string): Promise<string> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.getTokenBalance(tokenAddress, address);
    } catch (err) {
      console.error('Error getting token balance:', err);
      throw err;
    }
  }, [adapter]);

  // Get token allowance
  const getTokenAllowance = useCallback(async (
    tokenAddress: string, 
    spender: string, 
    owner?: string
  ): Promise<string> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.getTokenAllowance(tokenAddress, spender, owner);
    } catch (err) {
      console.error('Error getting token allowance:', err);
      throw err;
    }
  }, [adapter]);

  // Approve token spending
  const approveToken = useCallback(async (
    tokenAddress: string, 
    spender: string, 
    amount: string = ethers.MaxUint256.toString()
  ): Promise<TransactionRequest> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.approveToken(tokenAddress, spender, amount);
    } catch (err) {
      console.error('Error approving token:', err);
      throw err;
    }
  }, [adapter]);

  // Get swap quote
  const getQuote = useCallback(async (params: SwapParams): Promise<QuoteResponse> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      setIsLoadingQuote(true);
      const quote = await adapter.getQuote(params);
      setQuote(quote);
      return quote;
    } catch (err) {
      console.error('Error getting quote:', err);
      throw err;
    } finally {
      setIsLoadingQuote(false);
    }
  }, [adapter]);

  // Execute swap
  const swap = useCallback(async (params: SwapParams): Promise<TransactionRequest> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.swap(params);
    } catch (err) {
      console.error('Error executing swap:', err);
      throw err;
    }
  }, [adapter]);

  // Send transaction
  const sendTransaction = useCallback(async (
    transaction: TransactionRequest
  ): Promise<TransactionRequest> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.sendTransaction(transaction);
    } catch (err) {
      console.error('Error sending transaction:', err);
      throw err;
    }
  }, [adapter]);

  // Get transaction by hash
  const getTransaction = useCallback(async (
    txHash: string
  ): Promise<ethers.TransactionResponse | null> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.getTransaction(txHash);
    } catch (err) {
      console.error('Error getting transaction:', err);
      throw err;
    }
  }, [adapter]);

  // Get transaction receipt
  const getTransactionReceipt = useCallback(async (
    txHash: string
  ): Promise<ethers.TransactionReceipt | null> => {
    if (!adapter) {
      throw new Error('Etherlink adapter not initialized');
    }
    
    try {
      return await adapter.getTransactionReceipt(txHash);
    } catch (err) {
      console.error('Error getting transaction receipt:', err);
      throw err;
    }
  }, [adapter]);

  return {
    // Connection
    connect,
    disconnect,
    isConnected: !!account,
    isConnecting,
    account,
    chainId,
    error,
    
    // Token operations
    getTokenBalance,
    getTokenAllowance,
    approveToken,
    
    // Swap operations
    getQuote,
    swap,
    quote,
    isLoadingQuote,
    
    // Transaction operations
    sendTransaction,
    getTransaction,
    getTransactionReceipt,
    
    // Adapter
    adapter,
  };
};

export default useEtherlink;
