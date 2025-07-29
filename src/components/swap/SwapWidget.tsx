import { useState, useEffect, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { OneInchAdapter } from '../../lib/blockchain/1inch/adapter';
import { Token, formatTokenAmount, parseTokenAmount } from '../../lib/blockchain/1inch/utils';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

// Sample stablecoin token list - USD Financial supports USDC and USDT only
const DEFAULT_TOKENS: Token[] = [
  {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    symbol: 'USDC',
    decimals: 6,
  },
  {
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    symbol: 'USDT',
    decimals: 6,
  },
];

export function SwapWidget() {
  const { account, library, chainId } = useWeb3React();
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(DEFAULT_TOKENS[1]);
  const [amount, setAmount] = useState('');
  const [quote, setQuote] = useState<{ toTokenAmount: string; estimatedGas: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuote = useCallback(async () => {
    if (!amount || !fromToken || !toToken || !account || !chainId) {
      setQuote(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const oneInch = new OneInchAdapter(chainId);
      const amountInWei = parseTokenAmount(amount, fromToken.decimals);
      
      const quoteData = await oneInch.getQuote({
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: amountInWei,
        fromAddress: account,
        slippage: 1,
      });

      setQuote({
        toTokenAmount: formatTokenAmount(quoteData.toTokenAmount, toToken.decimals),
        estimatedGas: quoteData.estimatedGas,
      });
    } catch (err) {
      console.error('Error fetching quote:', err);
      setError('Failed to fetch quote. Please try again.');
      setQuote(null);
    } finally {
      setLoading(false);
    }
  }, [amount, fromToken, toToken, account, chainId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (amount) {
        fetchQuote();
      } else {
        setQuote(null);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [amount, fetchQuote]);

  const handleSwap = async () => {
    if (!account || !fromToken || !toToken || !amount || !quote || !chainId) return;

    try {
      setLoading(true);
      setError(null);
      
      const oneInch = new OneInchAdapter(chainId);
      const amountInWei = parseTokenAmount(amount, fromToken.decimals);
      
      const tx = await oneInch.buildSwapTx({
        fromTokenAddress: fromToken.address,
        toTokenAddress: toToken.address,
        amount: amountInWei,
        fromAddress: account,
        slippage: 1,
      });

      // Send transaction using Web3 provider
      const receipt = await library.getSigner().sendTransaction(tx);
      await receipt.wait();
      
      // Transaction successful
      setAmount('');
      setQuote(null);
      // Optionally: Show success toast/message
    } catch (err) {
      console.error('Swap failed:', err);
      setError('Transaction failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">From</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              disabled={!account}
            />
            <Select
              value={fromToken.address}
              onValueChange={(value) => {
                const token = DEFAULT_TOKENS.find(t => t.address === value);
                if (token) setFromToken(token);
              }}
              disabled={!account}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_TOKENS.map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center">
          <button 
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => {
              // Swap from and to tokens
              setFromToken(toToken);
              setToToken(fromToken);
              setAmount(quote?.toTokenAmount || '');
            }}
            disabled={!account}
          >
            ↓↑
          </button>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">To</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="0.0"
              value={quote?.toTokenAmount || ''}
              readOnly
              className="flex-1"
              disabled
            />
            <Select
              value={toToken.address}
              onValueChange={(value) => {
                const token = DEFAULT_TOKENS.find(t => t.address === value);
                if (token) setToToken(token);
              }}
              disabled={!account}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {DEFAULT_TOKENS
                  .filter(token => token.address !== fromToken.address)
                  .map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {quote && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Estimated Gas:</span>
              <span>{quote.estimatedGas}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
            {error}
          </div>
        )}

        <Button
          className="w-full mt-6"
          onClick={handleSwap}
          disabled={!account || !amount || !quote || loading}
        >
          {!account ? 'Connect Wallet' : loading ? 'Processing...' : 'Swap'}
        </Button>
      </div>
    </div>
  );
}
