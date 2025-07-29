export type ChainId = 1 | 56 | 137 | 10 | 42161; // Mainnet, BSC, Polygon, Optimism, Arbitrum

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

export interface QuoteParams {
  fromTokenAddress: string;
  toTokenAddress: string;
  amount: string;
  fromAddress?: string;
  slippage?: number;
  disableEstimate?: boolean;
  allowPartialFill?: boolean;
}

export interface SwapParams extends QuoteParams {
  fromAddress: string;
  slippage: number;
}

export interface Transaction {
  from: string;
  to: string;
  data: string;
  value: string;
  gasPrice: string;
  gas: number;
}
