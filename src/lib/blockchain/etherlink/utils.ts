import { BigNumber, ethers } from 'ethers';

// Format token amount with decimals
export const formatTokenAmount = (
  amount: string | BigNumber, 
  decimals: number = 18
): string => {
  if (!amount) return '0';
  
  const amountBN = BigNumber.isBigNumber(amount) 
    ? amount 
    : BigNumber.from(amount);
    
  return ethers.utils.formatUnits(amountBN, decimals);
};

// Parse token amount to smallest unit
export const parseTokenAmount = (
  amount: string, 
  decimals: number = 18
): string => {
  return ethers.utils.parseUnits(amount, decimals).toString();
};

// Shorten address for display
export const shortenAddress = (address: string, chars = 4): string => {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
};

// Calculate price impact
export const calculatePriceImpact = (
  amountIn: string, 
  amountOut: string, 
  marketRate: string
): number => {
  if (!amountIn || !amountOut || !marketRate) return 0;
  
  const amountInNum = parseFloat(amountIn);
  const amountOutNum = parseFloat(amountOut);
  const marketRateNum = parseFloat(marketRate);
  
  if (amountInNum === 0 || marketRateNum === 0) return 0;
  
  const expectedAmountOut = amountInNum * marketRateNum;
  return ((expectedAmountOut - amountOutNum) / expectedAmountOut) * 100;
};

// Calculate minimum amount out with slippage
export const calculateMinAmountOut = (
  amountOut: string, 
  slippage: number
): string => {
  const amountOutBN = ethers.BigNumber.from(amountOut);
  const slippageBN = ethers.BigNumber.from(Math.floor(slippage * 100));
  const oneHundredPercent = ethers.BigNumber.from(10000);
  
  return amountOutBN
    .mul(oneHundredPercent.sub(slippageBN))
    .div(oneHundredPercent)
    .toString();
};

// Format gas price for display
export const formatGasPrice = (gasPrice: string): string => {
  return ethers.utils.formatUnits(gasPrice, 'gwei');
};

// Format transaction value
export const formatTransactionValue = (
  value: string, 
  decimals: number = 18
): string => {
  return ethers.utils.formatUnits(value, decimals);
};
