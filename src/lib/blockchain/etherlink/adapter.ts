import { 
  ethers,
  type JsonRpcProvider,
  type TransactionResponse as EthersTransactionResponse,
  type Signer as EthersSigner,
  type TransactionRequest as EthersTransactionRequest,
  ZeroAddress,
  MaxUint256,
  formatEther,
  parseEther,
  parseUnits,
  JsonRpcApiProvider,
  BrowserProvider,
  JsonRpcSigner,
  Contract
} from 'ethers';
import { 
  type EtherlinkConfig, 
  type Token, 
  type SwapParams,
  type TransactionRequest,
  type QuoteResponse,
  type TransactionReceipt
} from './types';

export class EtherlinkAdapter {
  private readonly config: EtherlinkConfig;
  private provider: JsonRpcApiProvider;
  private signer: JsonRpcSigner | null = null;

  constructor(config: Partial<EtherlinkConfig> = {}) {
    this.config = {
      rpcUrl: config.rpcUrl || process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL || 'https://node.ghostnet.etherlink.com',
      network: config.network || 'testnet',
      explorerUrl: config.explorerUrl || 'https://testnet-explorer.etherlink.com',
      chainId: config.chainId || 128123
    };
    
    this.provider = new ethers.JsonRpcProvider(this.config.rpcUrl);
  }

  public getProvider(): JsonRpcApiProvider {
    return this.provider;
  }

  public async connect(): Promise<{ address: string; chainId: bigint }> {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Ethereum provider not found');
    }

    this.provider = new BrowserProvider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    this.signer = await this.provider.getSigner();

    const address = await this.signer.getAddress();
    const network = await this.provider.getNetwork();

    return { address, chainId: network.chainId };
  }

  public async getSigner(): Promise<JsonRpcSigner> {
    if (!this.signer) {
      throw new Error('Signer not set. Call connect() first.');
    }
    return this.signer;
  }

  public async getAccount(): Promise<string> {
    const signer = await this.getSigner();
    return signer.getAddress();
  }

  public async getChainId(): Promise<bigint> {
    const network = await this.provider.getNetwork();
    return network.chainId;
  }

  public async getTokenBalance(tokenAddress: string, address: string): Promise<string> {
    if (tokenAddress === ZeroAddress) {
      const balance = await this.provider.getBalance(address);
      return balance.toString();
    }

    const token = new Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );

    const balance = await token.balanceOf(address);
    return balance.toString();
  }

  public async getTokenAllowance(tokenAddress: string, spender: string, owner?: string): Promise<string> {
    const ownerAddress = owner || (await this.getAccount());
    
    if (tokenAddress === ZeroAddress) {
      return MaxUint256.toString();
    }

    const token = new Contract(
      tokenAddress,
      ['function allowance(address, address) view returns (uint256)'],
      this.provider
    );

    const allowance = await token.allowance(ownerAddress, spender);
    return allowance.toString();
  }

  public async getQuote(params: SwapParams): Promise<QuoteResponse> {
    // Implementation would call 1inch API or other DEX aggregator
    // This is a simplified version
    return {
      fromToken: params.fromToken,
      toToken: params.toToken,
      amountIn: params.amount,
      amountOut: params.amount, // In a real implementation, this would be calculated
      minAmountOut: params.amount, // In a real implementation, this would be calculated with slippage
      priceImpact: 0.5, // Example value
      feeAmount: '0', // Example value
      route: [], // Example value
      estimatedGas: '21000' // Example value
    };
  }

  public async approveToken(
    tokenAddress: string, 
    spender: string, 
    amount: string = MaxUint256.toString()
  ): Promise<EthersTransactionResponse> {
    const signer = await this.getSigner();
    const token = new Contract(
      tokenAddress,
      ['function approve(address, uint256) returns (bool)'],
      signer
    );

    return token.approve(spender, amount);
  }

  public async sendTransaction(transaction: TransactionRequest): Promise<TransactionRequest> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }
    
    const tx = await this.signer.sendTransaction({
      to: transaction.to,
      data: transaction.data,
      value: transaction.value ? BigInt(transaction.value) : 0n,
      gasLimit: transaction.gas ? BigInt(transaction.gas) : undefined,
      gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined
    });
    
    // Convert to our custom TransactionRequest type
    const response: TransactionRequest = {
      to: tx.to || '',
      data: tx.data.toString(),
      value: tx.value.toString(),
      gas: tx.gasLimit?.toString() || '0',
      gasPrice: tx.gasPrice?.toString() || '0',
      hash: tx.hash,
      confirmations: 0,
      from: tx.from,
      nonce: tx.nonce,
      chainId: tx.chainId,
      wait: tx.wait.bind(tx)
    };
    
    return response;
  }

  public async buildSwapTx(params: SwapParams): Promise<TransactionRequest> {
    const quote = await this.getQuote(params);
    const signer = await this.getSigner();
    
    // In a real implementation, this would build the actual transaction
    // using the quote data from the DEX aggregator
    const tx: TransactionRequest = {
      to: '0xExchangeRouterAddress', // Would come from the quote
      data: '0x', // Would be the actual calldata
      value: params.fromToken === ZeroAddress ? params.amount : '0',
      gas: quote.estimatedGas,
      gasPrice: (await this.provider.getFeeData()).gasPrice?.toString() || '0'
    };
    
    return tx;
  }

  public async swap(params: SwapParams): Promise<TransactionRequest> {
    // Check if approval is needed
    if (params.fromToken !== ZeroAddress) {
      // In a real implementation, we'd check the allowance and approve if needed
      await this.approveToken(params.fromToken, '0xExchangeRouterAddress');
    }
    
    // Build and send the swap transaction
    const tx = await this.buildSwapTx(params);
    return this.sendTransaction(tx);
  }

  public async getTransaction(transactionHash: string): Promise<EthersTransactionResponse | null> {
    return this.provider.getTransaction(transactionHash);
  }

  public async getTransactionReceipt(txHash: string): Promise<TransactionReceipt | null> {
    return this.provider.getTransactionReceipt(txHash);
  }

  public async getGasPrice(): Promise<string> {
    const feeData = await this.provider.getFeeData();
    return feeData.gasPrice?.toString() || '0';
  }
}
