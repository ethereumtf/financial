import { connect, WalletConnection, keyStores } from 'near-api-js';
import { blockchainConfig as config } from '../../config/blockchain';

interface SolverParams {
  contractId: string;
  methodName: string;
  args: Record<string, any>;
  gas?: string;
  deposit?: string;
}

export class NearShadeAgent {
  private wallet: WalletConnection | null = null;
  private near: any = null;

  async initialize() {
    const keyStore = new keyStores.BrowserLocalStorageKeyStore();
    
    this.near = await connect({
      networkId: config.near.network,
      keyStore,
      nodeUrl: config.near.nodeUrl,
      walletUrl: config.near.walletUrl,
      helperUrl: config.near.helperUrl,
      headers: {},
    });

    this.wallet = new WalletConnection(this.near, 'usd-financial');
    return this.wallet;
  }

  async signIn() {
    if (!this.wallet) await this.initialize();
    this.wallet?.requestSignIn({
      successUrl: window.location.origin,
      failureUrl: window.location.origin,
    });
  }

  signOut() {
    this.wallet?.signOut();
  }

  isSignedIn() {
    return this.wallet?.isSignedIn() || false;
  }

  async createSolver(params: SolverParams) {
    if (!this.wallet) throw new Error('Wallet not initialized');
    
    const account = this.wallet.account();
    return account.functionCall({
      contractId: params.contractId,
      methodName: params.methodName,
      args: params.args,
      gas: params.gas || '30000000000000',
      attachedDeposit: params.deposit || '0',
    });
  }
}
