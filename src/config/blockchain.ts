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
  };
}

// Load configuration from environment variables
const getConfig = (): BlockchainConfig => {
  return {
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
    },
  };
};

export const blockchainConfig = getConfig();

// Helper to get 1inch API URL with chain ID
export const get1InchApiUrl = (chainId: number): string => {
  return `${blockchainConfig.oneInch.apiUrl}/${chainId}`;
};

// Helper to get Stellar network passphrase
export const getStellarNetworkPassphrase = (): string => {
  return blockchainConfig.stellar.network === 'testnet'
    ? 'Test SDF Network ; September 2015'
    : 'Public Global Stellar Network ; September 2015';
};

// Helper to get NEAR config
export const getNearConfig = () => ({
  networkId: blockchainConfig.near.network,
  nodeUrl: blockchainConfig.near.nodeUrl,
  walletUrl: blockchainConfig.near.walletUrl,
  helperUrl: blockchainConfig.near.helperUrl,
  headers: {},
});

// Helper to get Etherlink config
export const getEtherlinkConfig = () => ({
  rpcUrl: blockchainConfig.etherlink.rpcUrl,
  chainId: blockchainConfig.etherlink.chainId,
  network: blockchainConfig.etherlink.network,
});

// Default export for backward compatibility
export default blockchainConfig;
