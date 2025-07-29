import { Server, TransactionBuilder, Asset, Keypair, Networks } from 'stellar-sdk';
import config from '../../../config/blockchain';

interface PaymentParams {
  source: string;
  destination: string;
  amount: string;
  assetCode: string;
  assetIssuer?: string;
  memo?: string;
}

export class StellarBridge {
  private server: Server;
  private networkPassphrase: string;

  constructor() {
    this.server = new Server(config.stellar.horizonUrl);
    this.networkPassphrase = config.stellar.network === 'testnet' 
      ? Networks.TESTNET 
      : Networks.PUBLIC;
  }

  async loadAccount(publicKey: string) {
    return this.server.loadAccount(publicKey);
  }

  async createTrustline(asset: Asset, sourceSecret: string) {
    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const sourceAccount = await this.loadAccount(sourceKeypair.publicKey());

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation(
        'changeTrust',
        {
          asset: asset,
        }
      )
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    return this.server.submitTransaction(transaction);
  }

  async submitPayment(payment: PaymentParams, sourceSecret: string) {
    const sourceKeypair = Keypair.fromSecret(sourceSecret);
    const sourceAccount = await this.loadAccount(sourceKeypair.publicKey());

    let asset;
    if (payment.assetCode === 'XLM') {
      asset = Asset.native();
    } else if (payment.assetIssuer) {
      asset = new Asset(payment.assetCode, payment.assetIssuer);
    } else {
      throw new Error('Asset issuer required for non-XLM assets');
    }

    const transaction = new TransactionBuilder(sourceAccount, {
      fee: '100',
      networkPassphrase: this.networkPassphrase,
    })
      .addOperation('payment', {
        destination: payment.destination,
        asset: asset,
        amount: payment.amount,
      })
      .setTimeout(30)
      .build();

    transaction.sign(sourceKeypair);
    return this.server.submitTransaction(transaction);
  }
}
