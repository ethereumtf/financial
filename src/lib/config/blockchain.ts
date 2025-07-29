const config = {
  oneInch: {
    apiKey: process.env.NEXT_PUBLIC_1INCH_API_KEY || '',
  },
  stellar: {
    network: process.env.NEXT_PUBLIC_STELLAR_NETWORK || 'testnet',
    horizonUrl: process.env.NEXT_PUBLIC_STELLAR_HORIZON_URL || 
      (process.env.NEXT_PUBLIC_STELLAR_NETWORK === 'testnet' 
        ? 'https://horizon-testnet.stellar.org' 
        : 'https://horizon.stellar.org'),
  },
  near: {
    network: process.env.NEXT_PUBLIC_NEAR_NETWORK || 'testnet',
    nodeUrl: process.env.NEXT_PUBLIC_NEAR_NODE_URL || 
      (process.env.NEXT_PUBLIC_NEAR_NETWORK === 'testnet'
        ? 'https://rpc.testnet.near.org'
        : 'https://rpc.mainnet.near.org'),
    walletUrl: process.env.NEXT_PUBLIC_NEAR_WALLET_URL || 
      (process.env.NEXT_PUBLIC_NEAR_NETWORK === 'testnet'
        ? 'https://wallet.testnet.near.org'
        : 'https://wallet.near.org'),
    helperUrl: process.env.NEXT_PUBLIC_NEAR_HELPER_URL || 
      (process.env.NEXT_PUBLIC_NEAR_NETWORK === 'testnet'
        ? 'https://helper.testnet.near.org'
        : 'https://helper.near.org'),
  },
};

export default config;
