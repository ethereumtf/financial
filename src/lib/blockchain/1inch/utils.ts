import { OneInchAdapter } from './adapter';

// Format token amount considering decimals
export const formatTokenAmount = (amount: string, decimals: number): string => {
  return (parseInt(amount) / 10 ** decimals).toString();
};

// Parse token amount to wei/smallest unit
export const parseTokenAmount = (amount: string, decimals: number): string => {
  return (parseFloat(amount) * 10 ** decimals).toFixed(0);
};

// Get 1inch adapter instance for a specific chain
export const get1inchAdapter = (chainId: number, apiKey?: string): OneInchAdapter => {
  return new OneInchAdapter(chainId, apiKey);
};
