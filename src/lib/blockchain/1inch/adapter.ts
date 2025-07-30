import { ChainId, QuoteParams, SwapParams, Transaction } from './types';

export class OneInchAdapter {
  private readonly chainId: ChainId;

  constructor(chainId: ChainId = 1, apiKey: string = '') {
    this.chainId = chainId;
  }

  private async fetchFromApi(endpoint: string, params: Record<string, any> = {}) {
    // Use Netlify functions to avoid CORS issues
    const queryParams = new URLSearchParams({
      ...params,
      chainId: this.chainId.toString()
    }).toString();

    const response = await fetch(`/.netlify/functions/1inch-${endpoint}?${queryParams}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `1inch API error: ${response.statusText}`);
    }
    return response.json();
  }

  public async getQuote(params: QuoteParams) {
    const {
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage = 1,
      disableEstimate = false,
      allowPartialFill = true,
    } = params;

    return this.fetchFromApi('quote', {
      fromTokenAddress,
      toTokenAddress,
      amount,
      ...(fromAddress && { fromAddress }),
      slippage,
      disableEstimate,
      allowPartialFill,
    });
  }

  public async getSwapParams(params: SwapParams) {
    const {
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage = 1,
      disableEstimate = false,
      allowPartialFill = true,
    } = params;

    return this.fetchFromApi('swap', {
      fromTokenAddress,
      toTokenAddress,
      amount,
      fromAddress,
      slippage,
      disableEstimate,
      allowPartialFill,
    });
  }

  public async getTokens() {
    // For now, return static token list since we only support USDC/USDT
    return {
      tokens: {
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
          symbol: 'USDC',
          name: 'USD Coin',
          decimals: 6,
          address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
        },
        '0xdAC17F958D2ee523a2206206994597C13D831ec7': {
          symbol: 'USDT',
          name: 'Tether USD',
          decimals: 6,
          address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
        }
      }
    };
  }

  public async getSpender() {
    // Return the standard 1inch router address
    return '0x1111111254fb6c44bAC0beD2854e76F90643097d';
  }

  public async getAllowance(tokenAddress: string, walletAddress: string) {
    // This would require a separate API route for approvals
    // For now, return 0 allowance
    return { allowance: '0' };
  }

  public async buildApproveTx(tokenAddress: string, amount?: string) {
    // This would require a separate API route for approvals
    // For now, return a basic approval transaction structure
    return {
      to: tokenAddress,
      data: '0x',
      value: '0',
      gasPrice: '0',
      gas: '100000'
    };
  }

  public async buildSwapTx(params: SwapParams): Promise<Transaction> {
    const swapData = await this.getSwapParams(params);
    return {
      from: swapData.tx.from,
      to: swapData.tx.to,
      data: swapData.tx.data,
      value: swapData.tx.value,
      gasPrice: swapData.tx.gasPrice,
      gas: swapData.tx.gas,
    };
  }
}
