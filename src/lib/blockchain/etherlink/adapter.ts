import { ethers } from 'ethers';
import { 
  EtherlinkConfig, 
  Token, 
  SwapParams, 
  QuoteResponse, 
  TransactionResponse 
} from './types';

export class EtherlinkAdapter {
  private readonly config: EtherlinkConfig;
  private provider: ethers.providers.JsonRpcProvider;
  private signer: ethers.Signer | null = null;

  constructor(config: Partial<EtherlinkConfig> = {}) {
    this.config = {
      rpcUrl: config.rpcUrl || 'https://node.ghostnet.etherlink.com',
      network: config.network || 'testnet',
      explorerUrl: config.explorerUrl || 'https://testnet-explorer.etherlink.com',
      chainId: config.chainId || 128123,
    };

    this.provider = new ethers.providers.JsonRpcProvider(this.config.rpcUrl);
  }

  public setSigner(signer: ethers.Signer) {
    this.signer = signer;
    return this;
  }

  public async getProvider() {
    return this.provider;
  }

  public async getSigner() {
    if (!this.signer) {
      throw new Error('Signer not set. Call setSigner() first.');
    }
    return this.signer;
  }

  public async getAccount() {
    const signer = await this.getSigner();
    return await signer.getAddress();
  }

  public async getChainId() {
    return this.config.chainId;
  }

  public async getTokenBalance(tokenAddress: string, account?: string): Promise<string> {
    const currentAccount = account || (await this.getAccount());
    
    if (tokenAddress === ethers.constants.AddressZero) {
      // Native token balance
      return (await this.provider.getBalance(currentAccount)).toString();
    }

    // ERC20 token balance
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );
    
    return (await tokenContract.balanceOf(currentAccount)).toString();
  }

  public async getTokenAllowance(tokenAddress: string, spender: string, owner?: string): Promise<string> {
    const ownerAddress = owner || (await this.getAccount());
    
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function allowance(address, address) view returns (uint256)'],
      this.provider
    );
    
    return (await tokenContract.allowance(ownerAddress, spender)).toString();
  }

  public async approveToken(
    tokenAddress: string, 
    spender: string, 
    amount: string = ethers.constants.MaxUint256
  ) {
    const signer = await this.getSigner();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      [
        'function approve(address spender, uint256 amount) returns (bool)',
        'function decimals() view returns (uint8)'
      ],
      signer
    );

    const tx = await tokenContract.approve(spender, amount);
    await tx.wait();
    return tx;
  }

  public async getQuote(params: SwapParams): Promise<QuoteResponse> {
    const { fromToken, toToken, amount, fromAddress, slippage = 0.5 } = params;
    
    // In a real implementation, this would call the 1inch Fusion API for Etherlink
    // This is a simplified version for demonstration
    const response = await fetch('https://api.1inch.io/v5.0/1/quote', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add your 1inch API key if needed
    });

    if (!response.ok) {
      throw new Error('Failed to fetch quote');
    }

    const data = await response.json();
    
    return {
      fromToken,
      toToken,
      amountIn: amount,
      amountOut: data.toTokenAmount,
      minAmountOut: (parseInt(data.toTokenAmount) * (100 - slippage) / 100).toString(),
      priceImpact: 0.5, // This would be calculated
      feeAmount: '0', // This would be calculated
      route: [], // This would contain the swap route
      estimatedGas: '250000', // Estimated gas for the transaction
    };
  }

  public async buildSwapTx(params: SwapParams): Promise<TransactionResponse> {
    const quote = await this.getQuote(params);
    const signer = await this.getSigner();
    
    // In a real implementation, this would construct the actual transaction
    // This is a simplified version
    return {
      to: '0x1111111254EEB25477B68fb85Ed929f73A960582', // 1inch router address
      data: '0x', // Transaction data would be generated here
      value: params.fromToken === ethers.constants.AddressZero ? params.amount : '0',
      gas: quote.estimatedGas,
      gasPrice: (await this.provider.getGasPrice()).toString(),
    };
  }

  public async executeSwap(params: SwapParams): Promise<ethers.providers.TransactionResponse> {
    const tx = await this.buildSwapTx(params);
    const signer = await this.getSigner();
    return signer.sendTransaction(tx);
  }

  public async getTransactionReceipt(txHash: string) {
    return this.provider.getTransactionReceipt(txHash);
  }
}
