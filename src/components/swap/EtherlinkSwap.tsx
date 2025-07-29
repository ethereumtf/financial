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
    address: ethers.ZeroAddress, // Native token
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
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState('');
  const [txHash, setTxHash] = useState('');
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [balance, setBalance] = useState('0');
  
  const { 
    connect, 
    account, 
    chainId, 
    isConnected, 
    getTokenBalance, 
    getTokenAllowance,
    approveToken,
    swap
  } = useEtherlink();

  // Fetch balance when account or token changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !fromToken) return;
      
      try {
        const bal = await getTokenBalance(fromToken.address, account);
        setBalance(bal);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to fetch balance');
      }
    };

    fetchBalance();
  }, [account, fromToken, getTokenBalance]);

  // Check token approval status
  useEffect(() => {
    const checkApproval = async () => {
      if (!account || !fromToken || fromToken.address === ethers.ZeroAddress) {
        setIsApproved(true);
        return;
      }

      try {
        // In a real app, you'd check against the actual router address
        const routerAddress = '0x1111111254fb6c44bAC0beD2854e76F90643097d'; // 1inch router
        const allowance = await getTokenAllowance(fromToken.address, routerAddress, account);
        
        // If allowance is greater than or equal to the amount we want to swap
        const amountWei = parseTokenAmount(fromAmount || '0', fromToken.decimals);
        setIsApproved(BigInt(allowance) >= BigInt(amountWei));
      } catch (err) {
        console.error('Error checking approval:', err);
        setError('Failed to check token approval');
      }
    };

    checkApproval();
  }, [account, fromToken, fromAmount, getTokenAllowance]);

  const handleConnect = useCallback(async () => {
    try {
      setError('');
      await connect();
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet');
    }
  }, [connect]);

  const handleApprove = useCallback(async () => {
    if (!account || !fromToken) return;
    
    try {
      setIsApproving(true);
      setError('');
      
      // In a real app, you'd use the actual router address
      const routerAddress = '0x1111111254fb6c44bAC0beD2854e76F90643097d'; // 1inch router
      const tx = await approveToken(fromToken.address, routerAddress);
      await tx.wait();
      
      setIsApproved(true);
    } catch (err) {
      console.error('Error approving token:', err);
      setError('Failed to approve token');
    } finally {
      setIsApproving(false);
    }
  }, [account, fromToken, approveToken]);

  const handleSwap = useCallback(async () => {
    if (!account || !fromToken || !toToken || !fromAmount) return;
    
    try {
      setIsSwapping(true);
      setError('');
      setTxHash('');
      
      // In a real app, you'd calculate the minimum amount out based on slippage
      const amountInWei = parseTokenAmount(fromAmount, fromToken.decimals);
      const minAmountOut = '0'; // Calculate based on price impact and slippage
      
      const tx = await swap({
        fromToken: fromToken.address,
        toToken: toToken.address,
        amount: amountInWei,
        fromAddress: account,
        slippage: parseFloat(slippage) || 0.5,
        recipient: account,
      });
      
      setTxHash(tx.hash);
      
      // Wait for the transaction to be mined
      await tx.wait();
      
      // Reset form
      setFromAmount('');
      setToAmount('');
      
    } catch (err) {
      console.error('Error swapping tokens:', err);
      setError('Failed to swap tokens');
    } finally {
      setIsSwapping(false);
    }
  }, [account, fromToken, toToken, fromAmount, slippage, swap]);

  const handleMaxClick = useCallback(() => {
    if (!balance) return;
    
    // For native tokens, leave some for gas
    const maxAmount = fromToken?.address === ethers.ZeroAddress 
      ? ethers.formatUnits(BigInt(balance) * BigInt(95) / BigInt(100), fromToken?.decimals || 18)
      : formatTokenAmount(balance, fromToken?.decimals || 18);
    
    setFromAmount(maxAmount);
  }, [balance, fromToken]);

  // Format balance for display
  const formattedBalance = useCallback(() => {
    if (!balance) return '0';
    return formatTokenAmount(balance, fromToken?.decimals || 18);
  }, [balance, fromToken]);

  if (!isConnected) {
    return (
      <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>
        <p className="mb-4">Connect your wallet to start swapping tokens</p>
        <Button onClick={handleConnect} className="w-full">
          Connect Wallet
        </Button>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Swap Tokens</h2>
      
      {/* From Token */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">From</label>
          <span className="text-xs text-gray-500">
            Balance: {formattedBalance()} {fromToken?.symbol}
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1"
          />
          <Button 
            type="button" 
            variant="outline"
            size="sm"
            onClick={handleMaxClick}
            className="whitespace-nowrap"
          >
            MAX
          </Button>
          <Select
            value={fromToken?.address}
            onValueChange={(value) => {
              const token = DEFAULT_TOKENS.find(t => t.address === value);
              if (token) setFromToken(token);
            }}
          >
            <SelectTrigger className="w-[120px]">
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

      {/* To Token */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <label className="text-sm font-medium">To</label>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            value={toAmount}
            readOnly
            placeholder="0.0"
            className="flex-1"
          />
          <Select
            value={toToken?.address}
            onValueChange={(value) => {
              const token = DEFAULT_TOKENS.find(t => t.address === value);
              if (token) setToToken(token);
            }}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_TOKENS
                .filter(token => token.address !== fromToken?.address)
                .map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    {token.symbol}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Slippage Tolerence */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Slippage Tolerance</label>
        <div className="flex gap-2">
          <Button 
            type="button" 
            variant={slippage === '0.5' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSlippage('0.5')}
          >
            0.5%
          </Button>
          <Button 
            type="button" 
            variant={slippage === '1' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSlippage('1')}
          >
            1%
          </Button>
          <div className="relative flex-1">
            <Input
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              className="pl-12"
            />
            <span className="absolute left-3 top-2 text-sm text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {!isApproved && fromToken?.address !== ethers.ZeroAddress ? (
        <Button 
          onClick={handleApprove}
          disabled={isApproving}
          className="w-full"
        >
          {isApproving ? 'Approving...' : `Approve ${fromToken?.symbol}`}
        </Button>
      ) : (
        <Button 
          onClick={handleSwap}
          disabled={isSwapping || !fromAmount || parseFloat(fromAmount) <= 0}
          className="w-full"
        >
          {isSwapping ? 'Swapping...' : 'Swap'}
        </Button>
      )}

      {/* Status */}
      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      {txHash && (
        <div className="mt-2 text-sm text-green-600">
          Transaction sent!{' '}
          <a 
            href={`https://testnet.etherlink.com/tx/${txHash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline"
          >
            View on Etherscan
          </a>
        </div>
      )}

      {/* Network Info */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-xs text-gray-500">
        <p>Connected: {account}</p>
        <p>Network ID: {chainId}</p>
      </div>
    </div>
  );
}
