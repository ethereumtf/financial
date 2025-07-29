import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import useEtherlink from '../../hooks/useEtherlink';
import { Token } from '../../lib/blockchain/etherlink/types';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { formatTokenAmount, parseTokenAmount } from '../../lib/blockchain/etherlink/utils';

// Sample token list - in a real app, fetch this from an API
const DEFAULT_TOKENS: Token[] = [
  {
    address: ethers.constants.AddressZero, // Native token
    symbol: 'XTEZ',
    decimals: 18,
  },
  {
    address: '0x1234567890123456789012345678901234567890', // Example token address
    symbol: 'USDT',
    decimals: 6,
  },
  {
    address: '0x0987654321098765432109876543210987654321', // Example token address
    symbol: 'USDC',
    decimals: 6,
  },
];

export function EtherlinkSwap() {
  const [fromToken, setFromToken] = useState<Token>(DEFAULT_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(DEFAULT_TOKENS[1]);
  const [amount, setAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);
  
  const {
    account,
    isConnected,
    isConnecting,
    connect,
    quote,
    isLoadingQuote,
    getQuote,
    executeSwap,
    approveToken,
    getTokenAllowance,
    error,
  } = useEtherlink();

  // Fetch quote when input changes
  useEffect(() => {
    const fetchQuote = async () => {
      if (!isConnected || !amount || parseFloat(amount) <= 0) return;
      
      try {
        await getQuote({
          fromToken: fromToken.address,
          toToken: toToken.address,
          amount: parseTokenAmount(amount, fromToken.decimals),
          slippage: parseFloat(slippage) || 0.5,
        });
      } catch (err) {
        console.error('Error fetching quote:', err);
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [amount, fromToken, toToken, slippage, isConnected, getQuote]);

  // Handle token swap
  const handleSwap = async () => {
    if (!isConnected || !amount || !quote) return;
    
    try {
      setIsSwapping(true);
      
      // Check if approval is needed (for non-native tokens)
      if (fromToken.address !== ethers.constants.AddressZero) {
        const spender = '0x1111111254EEB25477B68fb85Ed929f73A960582'; // 1inch router
        const allowance = await getTokenAllowance(fromToken.address, spender);
        const amountInWei = parseTokenAmount(amount, fromToken.decimals);
        
        if (BigInt(allowance) < BigInt(amountInWei)) {
          await approveToken(fromToken.address, spender);
        }
      }
      
      // Execute the swap
      const tx = await executeSwap({
        fromToken: fromToken.address,
        toToken: toToken.address,
        amount: parseTokenAmount(amount, fromToken.decimals),
        slippage: parseFloat(slippage) || 0.5,
      });
      
      console.log('Swap transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Swap completed:', receipt.transactionHash);
      
      // Reset form
      setAmount('');
      
    } catch (err) {
      console.error('Swap failed:', err);
    } finally {
      setIsSwapping(false);
    }
  };

  // Switch tokens
  const switchTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    if (quote) {
      setAmount(formatTokenAmount(quote.amountOut, toToken.decimals));
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Etherlink Swap</h2>
      
      {!isConnected ? (
        <Button 
          onClick={connect} 
          disabled={isConnecting}
          className="w-full"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      ) : (
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
                disabled={!isConnected}
              />
              <Select
                value={fromToken.address}
                onValueChange={(value) => {
                  const token = DEFAULT_TOKENS.find(t => t.address === value);
                  if (token) setFromToken(token);
                }}
                disabled={!isConnected}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_TOKENS.map((token) => (
                    <SelectItem 
                      key={token.address} 
                      value={token.address}
                      disabled={token.address === toToken.address}
                    >
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-right text-gray-500">
              Balance: {isConnected ? 'Loading...' : '-'}
            </div>
          </div>

          <div className="flex justify-center">
            <button 
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={switchTokens}
              disabled={!isConnected}
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
                value={quote ? formatTokenAmount(quote.amountOut, toToken.decimals) : ''}
                readOnly
                className="flex-1"
              />
              <Select
                value={toToken.address}
                onValueChange={(value) => {
                  const token = DEFAULT_TOKENS.find(t => t.address === value);
                  if (token) setToToken(token);
                }}
                disabled={!isConnected}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {DEFAULT_TOKENS.map((token) => (
                    <SelectItem 
                      key={token.address} 
                      value={token.address}
                      disabled={token.address === fromToken.address}
                    >
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="pt-2">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Slippage Tolerance</span>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-20 h-8 text-right"
                  min="0.1"
                  max="5"
                  step="0.1"
                />
                <span>%</span>
              </div>
            </div>

            {quote && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Price Impact</span>
                  <span>{quote.priceImpact}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Minimum Received</span>
                  <span>
                    {formatTokenAmount(quote.minAmountOut, toToken.decimals)} {toToken.symbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estimated Gas</span>
                  <span>{ethers.utils.formatUnits(quote.estimatedGas, 'gwei')} GWEI</span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error.message}
              </div>
            )}

            <Button
              className="w-full mt-6"
              onClick={handleSwap}
              disabled={!isConnected || !amount || !quote || isSwapping || isLoadingQuote}
            >
              {isSwapping 
                ? 'Swapping...' 
                : isLoadingQuote 
                  ? 'Fetching quote...' 
                  : 'Swap'}
            </Button>

            {isConnected && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Connected: {`${account.substring(0, 6)}...${account.substring(38)}`}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
