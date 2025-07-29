// Blockchain configuration

export interface BlockchainConfig {
  oneInch: {
    apiKey: string;
    apiUrl: string;
  };
  stellar: {
    network: 'testnet' | 'public';
    horizonUrl: string;
    assetIssuer: string;
    assetCode: string;
  };
  near: {
    network: 'testnet' | 'mainnet';
    nodeUrl: string;
    walletUrl: string;
    helperUrl: string;
  };
  etherlink: {
    rpcUrl: string;
    network: 'testnet' | 'mainnet';
    chainId: number;
    explorerUrl: string;
  };
}

// Load configuration from environment variables
const getConfig = (): BlockchainConfig => ({
  oneInch: {
    apiKey: process.env.NEXT_PUBLIC_1INCH_API_KEY || '',
    apiUrl: process.env.NEXT_PUBLIC_1INCH_API_URL || 'https://api.1inch.io/v5.0',
  },
  stellar: {
    network: (process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'testnet' | 'public') || 'testnet',
    horizonUrl: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org',
    assetIssuer: process.env.NEXT_PUBLIC_STELLAR_ASSET_ISSUER || 'GDRWBLJURXUKM4RWDZDTP7LXFHV5RA12A3VK2CHBE7KNSWPDA6NOZ5U4',
    assetCode: process.env.NEXT_PUBLIC_STELLAR_ASSET_CODE || 'USDC',
  },
  near: {
    network: (process.env.NEXT_PUBLIC_NEAR_NETWORK as 'testnet' | 'mainnet') || 'testnet',
    nodeUrl: process.env.NEXT_PUBLIC_NEAR_NODE_URL || 'https://rpc.testnet.near.org',
    walletUrl: process.env.NEXT_PUBLIC_NEAR_WALLET_URL || 'https://wallet.testnet.near.org',
    helperUrl: process.env.NEXT_PUBLIC_NEAR_HELPER_URL || 'https://helper.testnet.near.org',
  },
  etherlink: {
    rpcUrl: process.env.NEXT_PUBLIC_ETHERLINK_RPC_URL || 'https://node.ghostnet.etherlink.com',
    network: (process.env.NEXT_PUBLIC_ETHERLINK_NETWORK as 'testnet' | 'mainnet') || 'testnet',
    chainId: parseInt(process.env.NEXT_PUBLIC_ETHERLINK_CHAIN_ID || '128123', 10),
    explorerUrl: process.env.NEXT_PUBLIC_ETHERLINK_EXPLORER_URL || 'https://testnet-explorer.etherlink.com',
  },
});

// Export config as a constant
export const blockchainConfig: BlockchainConfig = getConfig();

// Helper functions
export const get1InchApiUrl = (chainId: number): string => 
  `${blockchainConfig.oneInch.apiUrl}/${chainId}`;

export const getStellarNetworkPassphrase = (): string => 
  blockchainConfig.stellar.network === 'testnet'
    ? 'Test SDF Network ; September 2015'
    : 'Public Global Stellar Network ; September 2015';

export const getNearConfig = () => ({
  networkId: blockchainConfig.near.network,
  nodeUrl: blockchainConfig.near.nodeUrl,
  walletUrl: blockchainConfig.near.walletUrl,
  helperUrl: blockchainConfig.near.helperUrl,
  headers: {},
});

export const getEtherlinkConfig = () => ({
  rpcUrl: blockchainConfig.etherlink.rpcUrl,
  chainId: blockchainConfig.etherlink.chainId,
  network: blockchainConfig.etherlink.network,
  explorerUrl: blockchainConfig.etherlink.explorerUrl,
});

// Default export for backward compatibility
export default blockchainConfig;
