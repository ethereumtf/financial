import { OneInchAdapter } from '../blockchain/1inch/adapter';
import config from '../config/blockchain';

export class PriceOracleService {
  private oneInch: OneInchAdapter;

  constructor(chainId: number = 1) {
    this.oneInch = new OneInchAdapter(chainId, config.oneInch.apiKey);
  }

  async getTokenPrice(
    tokenAddress: string, 
    vsToken: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' // Native token
  ): Promise<number> {
    try {
      const quote = await this.oneInch.getQuote({
        fromTokenAddress: tokenAddress,
        toTokenAddress: vsToken,
        amount: '1000000', // 1 token (assuming 6 decimals)
      });
      
      return parseFloat(quote.toTokenAmount) / 1000000;
    } catch (error) {
      console.error('Error fetching token price:', error);
      throw new Error('Failed to fetch token price');
    }
  }

  async getTokenPrices(
    tokenAddresses: string[],
    vsToken: string = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
  ): Promise<Record<string, number>> {
    const prices: Record<string, number> = {};
    
    await Promise.all(
      tokenAddresses.map(async (address) => {
        try {
          const price = await this.getTokenPrice(address, vsToken);
          prices[address] = price;
        } catch (error) {
          console.error(`Error fetching price for token ${address}:`, error);
          prices[address] = 0;
        }
      })
    );

    return prices;
  }
}
