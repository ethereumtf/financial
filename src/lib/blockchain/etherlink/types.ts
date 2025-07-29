export interface EtherlinkConfig {
  rpcUrl: string;
  network: 'mainnet' | 'testnet';
  explorerUrl: string;
  chainId: number;
}

export interface Token {
  address: string;
  symbol: string;
  decimals: number;
  icon?: string;
}

export interface SwapParams {
  fromToken: string;
  toToken: string;
  amount: string;
  fromAddress: string;
  slippage?: number;
  recipient?: string;
}

export interface QuoteResponse {
  fromToken: string;
  toToken: string;
  amountIn: string;
  amountOut: string;
  minAmountOut: string;
  priceImpact: number;
  feeAmount: string;
  route: any[];
  estimatedGas: string;
}

export interface TransactionResponse {
  to: string;
  data: string;
  value: string;
  gas: string;
  gasPrice: string;
}
