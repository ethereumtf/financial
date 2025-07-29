import { ChainId, QuoteParams, SwapParams, Transaction } from './types';

const CHAIN_TO_API: Record<number, string> = {
  1: 'https://api.1inch.io/v5.0/1/',
  56: 'https://api.1inch.io/v5.0/56/',
  137: 'https://api.1inch.io/v5.0/137/',
  10: 'https://api.1inch.io/v5.0/10/',
  42161: 'https://api.1inch.io/v5.0/42161/',
};

export class OneInchAdapter {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor(chainId: ChainId = 1, apiKey: string = '') {
    this.apiUrl = CHAIN_TO_API[chainId] || CHAIN_TO_API[1];
    this.apiKey = apiKey;
  }

  private async fetchFromApi(endpoint: string, params: Record<string, any> = {}) {
    const queryParams = new URLSearchParams({
      ...params,
      ...(this.apiKey ? { key: this.apiKey } : {}),
    }).toString();

    const response = await fetch(`${this.apiUrl}${endpoint}?${queryParams}`);
    if (!response.ok) {
      throw new Error(`1inch API error: ${response.statusText}`);
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
    return this.fetchFromApi('tokens');
  }

  public async getSpender() {
    const { address } = await this.fetchFromApi('approve/spender');
    return address;
  }

  public async getAllowance(tokenAddress: string, walletAddress: string) {
    return this.fetchFromApi('approve/allowance', {
      tokenAddress,
      walletAddress,
    });
  }

  public async buildApproveTx(tokenAddress: string, amount?: string) {
    return this.fetchFromApi('approve/transaction', {
      tokenAddress,
      ...(amount && { amount }),
    });
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
