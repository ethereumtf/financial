import { TransactionRequest, TransactionResponse, TransactionReceipt } from 'ethers';

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
  name?: string;
  chainId?: number;
  logoURI?: string;
}

export interface SwapParams {
  fromToken: string;        // Token address or zero address for native token
  toToken: string;          // Token address or zero address for native token
  amount: string;           // Amount in wei/smallest unit
  fromAddress: string;      // Address of the sender
  slippage?: number;        // Slippage tolerance in percentage (e.g., 0.5 for 0.5%)
  recipient?: string;       // Optional recipient address (defaults to fromAddress)
  referrer?: string;        // Optional referrer address for fee sharing
  fee?: number;             // Optional protocol fee in basis points (e.g., 30 for 0.3%)
}

export interface QuoteResponse {
  fromToken: string;        // Token address or zero address for native token
  toToken: string;          // Token address or zero address for native token
  amountIn: string;         // Input amount in wei/smallest unit
  amountOut: string;        // Expected output amount in wei/smallest unit
  minAmountOut: string;     // Minimum output amount after slippage
  priceImpact: number;      // Price impact percentage (e.g., 0.5 for 0.5%)
  feeAmount: string;        // Fee amount in wei/smallest unit
  route: RouteStep[];       // Swap route details
  estimatedGas: string;     // Estimated gas cost in wei
  gasPrice: string;         // Current gas price in wei
  value: string;            // Value to send in wei (for native token swaps)
  to: string;               // Contract address to send transaction to
  data: string;             // Transaction data
  allowanceTarget?: string; // Address to approve for token spending
}

export interface RouteStep {
  exchange: string;         // Exchange or protocol name (e.g., '1inch', 'Uniswap')
  fromToken: string;        // Input token address
  toToken: string;         // Output token address
  fromTokenAmount: string;  // Input amount in wei
  toTokenAmount: string;    // Output amount in wei
  protocolFee: string;      // Protocol fee in wei
  part: number;            // Part of the total amount (0-100)
  direction: string;       // Direction of the swap
}

// Extended transaction request with additional metadata
export interface EnhancedTransactionRequest extends TransactionRequest {
  gas?: string | number;    // Gas limit
  gasPrice?: string;        // Gas price in wei
  value?: string;           // Value in wei (for native token transfers)
  chainId?: number;         // Chain ID
  nonce?: number;           // Transaction nonce
  data?: string;            // Transaction data
  to?: string;              // Recipient address
  from?: string;            // Sender address
  maxFeePerGas?: string;    // EIP-1559 max fee per gas
  maxPriorityFeePerGas?: string; // EIP-1559 max priority fee per gas
  type?: number;            // Transaction type (0 for legacy, 2 for EIP-1559)
}

// Extended transaction response with additional metadata
export interface EnhancedTransactionResponse extends Omit<TransactionResponse, 'wait'> {
  timestamp?: number;       // Transaction timestamp
  blockNumber?: number;     // Block number
  status?: number;          // Transaction status (0 for failed, 1 for success)
  confirmations?: number;   // Number of confirmations
  fee?: string;             // Total fee in wei (gasUsed * gasPrice)
  receipt?: TransactionReceipt; // Transaction receipt
}

// Token approval status
export interface TokenApproval {
  token: string;           // Token address
  spender: string;         // Spender address
  amount: string;          // Approved amount in wei
  allowance: string;       // Current allowance in wei
  needsApproval: boolean;  // Whether approval is needed
}

// Token balance information
export interface TokenBalance {
  token: Token;           // Token information
  balance: string;        // Balance in wei
  formatted: string;      // Formatted balance (human-readable)
  price?: string;         // Optional token price in USD
  value?: string;         // Optional value in USD
}

// Network information
export interface NetworkInfo {
  chainId: number;        // Chain ID
  name: string;           // Network name
  rpcUrl: string;         // RPC endpoint URL
  explorerUrl: string;    // Block explorer URL
  nativeCurrency: {
    name: string;         // Native currency name (e.g., 'Ether')
    symbol: string;       // Native currency symbol (e.g., 'ETH')
    decimals: number;     // Native currency decimals (e.g., 18)
  };
  testnet: boolean;       // Whether this is a testnet
}
