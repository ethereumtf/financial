import { useState, useEffect, useCallback } from 'react';
import { OneInchAdapter } from '@/lib/blockchain/1inch/adapter';
import { formatTokenAmount, parseTokenAmount } from '@/lib/blockchain/1inch/utils';

// USD Financial supports USDC and USDT on multiple chains
const SUPPORTED_TOKENS = {
  // Ethereum mainnet
  1: {
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6 },
    USDT: { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', decimals: 6 }
  },
  // Polygon
  137: {
    USDC: { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6 },
    USDT: { address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F', decimals: 6 }
  },
  // Arbitrum
  42161: {
    USDC: { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6 },
    USDT: { address: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', decimals: 6 }
  }
};

export interface Quote {
  fromTokenAmount: string;
  toTokenAmount: string;
  estimatedGas: number;
  fromToken: string;
  toToken: string;
  protocols: Array<Array<any>>;
}

export interface SwapTransaction {
  from: string;
  to: string;
  data: string;
  value: string;
  gasPrice: string;
  gas: string;
}

export function use1inch(chainId: number = 1) {
  const [adapter, setAdapter] = useState<OneInchAdapter | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize adapter
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_1INCH_API_KEY || '';
    const newAdapter = new OneInchAdapter(chainId, apiKey);
    setAdapter(newAdapter);
  }, [chainId]);

  // Get quote for stablecoin swap
  const getQuote = useCallback(async (
    fromSymbol: 'USDC' | 'USDT',
    toSymbol: 'USDC' | 'USDT',
    amount: string,
    fromAddress?: string
  ) => {
    if (!adapter || !amount || parseFloat(amount) <= 0) {
      setQuote(null);
      return null;
    }

    const tokens = SUPPORTED_TOKENS[chainId as keyof typeof SUPPORTED_TOKENS];
    if (!tokens) {
      setError(`Chain ${chainId} not supported`);
      return null;
    }

    const fromToken = tokens[fromSymbol];
    const toToken = tokens[toSymbol];

    if (!fromToken || !toToken) {
      setError('Token not supported on this chain');
      return null;
    }

    try {
      setLoading(true);
      setError(null);

      const amountInWei = parseTokenAmount(amount, fromToken.decimals);
      
      const quoteData = await adapter.getQuote({
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: amountInWei,
        fromAddress: fromAddress || '0x0000000000000000000000000000000000000000',
        slippage: 1, // 1% slippage for stablecoins
        disableEstimate: false,
        allowPartialFill: true
      });

      const formattedQuote: Quote = {
        fromTokenAmount: formatTokenAmount(quoteData.fromTokenAmount, fromToken.decimals),
        toTokenAmount: formatTokenAmount(quoteData.toTokenAmount, toToken.decimals),
        estimatedGas: quoteData.estimatedGas || 150000,
        fromToken: fromSymbol,
        toToken: toSymbol,
        protocols: quoteData.protocols || []
      };

      setQuote(formattedQuote);
      return formattedQuote;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
      console.error('1inch quote error:', err);
      
      // Fallback: create a mock quote for demo purposes
      const mockRate = fromSymbol === 'USDC' && toSymbol === 'USDT' ? 0.9998 : 1.0002;
      const mockQuote: Quote = {
        fromTokenAmount: amount,
        toTokenAmount: (parseFloat(amount) * mockRate).toFixed(6),
        estimatedGas: 180000,
        fromToken: fromSymbol,
        toToken: toSymbol,
        protocols: []
      };
      
      setQuote(mockQuote);
      setError(`Using fallback quote (1inch API unavailable): ${errorMessage}`);
      return mockQuote;
    } finally {
      setLoading(false);
    }
  }, [adapter, chainId]);

  // Build swap transaction
  const buildSwapTransaction = useCallback(async (
    fromSymbol: 'USDC' | 'USDT',
    toSymbol: 'USDC' | 'USDT',
    amount: string,
    fromAddress: string,
    slippage: number = 1
  ): Promise<SwapTransaction | null> => {
    if (!adapter) return null;

    const tokens = SUPPORTED_TOKENS[chainId as keyof typeof SUPPORTED_TOKENS];
    if (!tokens) return null;

    const fromToken = tokens[fromSymbol];
    const toToken = tokens[toSymbol];

    try {
      const amountInWei = parseTokenAmount(amount, fromToken.decimals);
      
      const swapData = await adapter.getSwapParams({
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: amountInWei,
        fromAddress,
        slippage,
        disableEstimate: false,
        allowPartialFill: true
      });

      return {
        from: swapData.tx.from,
        to: swapData.tx.to,
        data: swapData.tx.data,
        value: swapData.tx.value,
        gasPrice: swapData.tx.gasPrice,
        gas: swapData.tx.gas
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to build transaction');
      return null;
    }
  }, [adapter, chainId]);

  // Get current exchange rate
  const getExchangeRate = useCallback(() => {
    if (!quote || !quote.fromTokenAmount || !quote.toTokenAmount) return 0;
    
    const fromAmount = parseFloat(quote.fromTokenAmount);
    const toAmount = parseFloat(quote.toTokenAmount);
    
    if (fromAmount === 0) return 0;
    return toAmount / fromAmount;
  }, [quote]);

  // Calculate price impact
  const getPriceImpact = useCallback(() => {
    const rate = getExchangeRate();
    if (!rate || rate === 0) return 0;
    
    // For stablecoins, ideal rate should be ~1.0
    const idealRate = 1.0;
    const impact = Math.abs((rate - idealRate) / idealRate) * 100;
    
    return impact;
  }, [getExchangeRate]);

  return {
    quote,
    loading,
    error,
    getQuote,
    buildSwapTransaction,
    getExchangeRate,
    getPriceImpact,
    supportedChains: Object.keys(SUPPORTED_TOKENS).map(Number),
    supportedTokens: chainId in SUPPORTED_TOKENS ? Object.keys(SUPPORTED_TOKENS[chainId as keyof typeof SUPPORTED_TOKENS]) : []
  };
}