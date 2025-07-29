// Stablecoin-focused data models for USD Financial

export type StablecoinSymbol = 'USDC' | 'USDT' | 'DAI' | 'FRAX' | 'TUSD' | 'BUSD';
export type ChainId = 1 | 137 | 42161 | 10 | 56; // Ethereum, Polygon, Arbitrum, Optimism, BSC

export interface StablecoinBalance {
  symbol: StablecoinSymbol;
  amount: number;
  chainId: ChainId;
  protocol?: string;
  apy?: number;
  isYieldBearing: boolean;
  contractAddress: string;
}

export interface YieldPosition {
  id: string;
  protocol: string;
  stablecoin: StablecoinSymbol;
  depositAmount: number;
  currentValue: number;
  apy: number;
  duration: number; // days
  chainId: ChainId;
  isActive: boolean;
  lastUpdated: string;
}

export interface StablecoinTransaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'deposit' | 'withdrawal' | 'yield' | 'swap' | 'bridge' | 'spend';
  status: 'completed' | 'pending' | 'failed';
  stablecoin: StablecoinSymbol;
  chainId: ChainId;
  protocol?: string;
  txHash?: string;
  fromChain?: ChainId;
  toChain?: ChainId;
}

export interface ProtocolInfo {
  id: string;
  name: string;
  type: 'lending' | 'vault' | 'liquidity' | 'yield-aggregator';
  currentApy: number;
  tvl: number; // Total Value Locked
  risk: 'Low' | 'Medium' | 'High';
  description: string;
  supportedStablecoins: StablecoinSymbol[];
  chainIds: ChainId[];
  logoUrl: string;
}

export interface CrossChainBridge {
  id: string;
  name: string;
  fromChain: ChainId;
  toChain: ChainId;
  stablecoin: StablecoinSymbol;
  estimatedTime: string;
  fees: number;
  isActive: boolean;
}

// Stablecoin portfolio data
export const stablecoinPortfolio: StablecoinBalance[] = [
  {
    symbol: 'USDC',
    amount: 25431.89,
    chainId: 1,
    protocol: 'Aave',
    apy: 4.2,
    isYieldBearing: true,
    contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  },
  {
    symbol: 'USDT',
    amount: 15200.00,
    chainId: 137,
    protocol: 'Compound',
    apy: 3.8,
    isYieldBearing: true,
    contractAddress: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F'
  },
  {
    symbol: 'DAI',
    amount: 8750.50,
    chainId: 1,
    protocol: 'Yearn',
    apy: 5.1,
    isYieldBearing: true,
    contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F'
  },
  {
    symbol: 'FRAX',
    amount: 3200.00,
    chainId: 42161,
    apy: 6.8,
    isYieldBearing: true,
    contractAddress: '0x17FC002b466eEc40DaE837Fc4bE5c67993ddBd6F'
  }
];

// Stablecoin transactions
export const mockStablecoinTransactions: StablecoinTransaction[] = [
  {
    id: '1',
    description: 'USDC Yield Earned - Aave',
    amount: 15.42,
    date: '2024-01-15',
    type: 'yield',
    status: 'completed',
    stablecoin: 'USDC',
    chainId: 1,
    protocol: 'Aave',
    txHash: '0x1234...5678'
  },
  {
    id: '2',
    description: 'USDC Deposit',
    amount: 5000.00,
    date: '2024-01-15',
    type: 'deposit',
    status: 'completed',
    stablecoin: 'USDC',
    chainId: 1,
    txHash: '0x2345...6789'
  },
  {
    id: '3',
    description: 'DAI → USDC Swap',
    amount: -500.00,
    date: '2024-01-14',
    type: 'swap',
    status: 'completed',
    stablecoin: 'DAI',
    chainId: 1,
    txHash: '0x3456...7890'
  },
  {
    id: '4',
    description: 'USDT Bridge to Polygon',
    amount: -2000.00,
    date: '2024-01-14',
    type: 'bridge',
    status: 'completed',
    stablecoin: 'USDT',
    chainId: 1,
    fromChain: 1,
    toChain: 137,
    txHash: '0x4567...8901'
  },
  {
    id: '5',
    description: 'Stablecoin Card Payment - Amazon',
    amount: -89.99,
    date: '2024-01-13',
    type: 'spend',
    status: 'completed',
    stablecoin: 'USDC',
    chainId: 1,
    txHash: '0x5678...9012'
  },
  {
    id: '6',
    description: 'FRAX Yield Earned - Convex',
    amount: 28.75,
    date: '2024-01-13',
    type: 'yield',
    status: 'completed',
    stablecoin: 'FRAX',
    chainId: 42161,
    protocol: 'Convex',
    txHash: '0x6789...0123'
  },
  {
    id: '7',
    description: 'DAI Deposit to Yearn Vault',
    amount: 3000.00,
    date: '2024-01-12',
    type: 'deposit',
    status: 'completed',
    stablecoin: 'DAI',
    chainId: 1,
    protocol: 'Yearn',
    txHash: '0x7890...1234'
  },
  {
    id: '8',
    description: 'USDC Withdrawal',
    amount: -1200.00,
    date: '2024-01-12',
    type: 'withdrawal',
    status: 'completed',
    stablecoin: 'USDC',
    chainId: 1,
    txHash: '0x8901...2345'
  },
  {
    id: '9',
    description: 'USDT Yield Earned - Compound',
    amount: 12.33,
    date: '2024-01-11',
    type: 'yield',
    status: 'completed',
    stablecoin: 'USDT',
    chainId: 137,
    protocol: 'Compound',
    txHash: '0x9012...3456'
  },
  {
    id: '10',
    description: 'USDC Bridge from Arbitrum',
    amount: 2500.00,
    date: '2024-01-10',
    type: 'bridge',
    status: 'pending',
    stablecoin: 'USDC',
    chainId: 42161,
    fromChain: 42161,
    toChain: 1,
    txHash: '0x0123...4567'
  }
];

// Yield positions data
export const yieldPositions: YieldPosition[] = [
  {
    id: '1',
    protocol: 'Aave',
    stablecoin: 'USDC',
    depositAmount: 25000.00,
    currentValue: 25431.89,
    apy: 4.2,
    duration: 45,
    chainId: 1,
    isActive: true,
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    protocol: 'Compound',
    stablecoin: 'USDT',
    depositAmount: 15000.00,
    currentValue: 15200.00,
    apy: 3.8,
    duration: 32,
    chainId: 137,
    isActive: true,
    lastUpdated: '2024-01-15'
  },
  {
    id: '3',
    protocol: 'Yearn',
    stablecoin: 'DAI',
    depositAmount: 8500.00,
    currentValue: 8750.50,
    apy: 5.1,
    duration: 28,
    chainId: 1,
    isActive: true,
    lastUpdated: '2024-01-15'
  },
  {
    id: '4',
    protocol: 'Convex',
    stablecoin: 'FRAX',
    depositAmount: 3000.00,
    currentValue: 3200.00,
    apy: 6.8,
    duration: 18,
    chainId: 42161,
    isActive: true,
    lastUpdated: '2024-01-15'
  }
];

// DeFi protocols supporting stablecoins
export const protocolsData: ProtocolInfo[] = [
  {
    id: 'aave',
    name: 'Aave',
    type: 'lending',
    currentApy: 4.2,
    tvl: 8500000000,
    risk: 'Low',
    description: 'Leading decentralized lending protocol with battle-tested security',
    supportedStablecoins: ['USDC', 'USDT', 'DAI'],
    chainIds: [1, 137, 42161],
    logoUrl: '/logos/aave.svg'
  },
  {
    id: 'compound',
    name: 'Compound',
    type: 'lending',
    currentApy: 3.8,
    tvl: 2800000000,
    risk: 'Low',
    description: 'Autonomous interest rate protocol for crypto assets',
    supportedStablecoins: ['USDC', 'USDT', 'DAI'],
    chainIds: [1, 137],
    logoUrl: '/logos/compound.svg'
  },
  {
    id: 'yearn',
    name: 'Yearn Finance',
    type: 'yield-aggregator',
    currentApy: 5.1,
    tvl: 1200000000,
    risk: 'Medium',
    description: 'Automated yield farming strategies for maximum returns',
    supportedStablecoins: ['USDC', 'DAI', 'USDT'],
    chainIds: [1, 42161],
    logoUrl: '/logos/yearn.svg'
  },
  {
    id: 'convex',
    name: 'Convex Finance',
    type: 'yield-aggregator',
    currentApy: 6.8,
    tvl: 3200000000,
    risk: 'Medium',
    description: 'Boosted Curve yields with simplified staking',
    supportedStablecoins: ['USDC', 'DAI', 'FRAX'],
    chainIds: [1, 42161],
    logoUrl: '/logos/convex.svg'
  },
  {
    id: 'curve',
    name: 'Curve Finance',
    type: 'liquidity',
    currentApy: 4.5,
    tvl: 4100000000,
    risk: 'Low',
    description: 'Efficient stablecoin trading with minimal slippage',
    supportedStablecoins: ['USDC', 'USDT', 'DAI', 'FRAX'],
    chainIds: [1, 137, 42161],
    logoUrl: '/logos/curve.svg'
  }
];

// Total stablecoin portfolio value
export const totalPortfolioValue = stablecoinPortfolio.reduce((sum, balance) => sum + balance.amount, 0);

// Portfolio balance change (yield earnings)
export const portfolioChange = {
  amount: 856.39, // Total yield earned this month
  percentage: 1.8,
  isPositive: true
};

// User data
export const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@usdfinancial.com',
  avatar: '/api/placeholder/40/40',
  initials: 'AJ',
  totalYieldEarned: 2847.52,
  accountCreated: '2023-08-15'
};

// Stablecoin allocation chart config
export const stablecoinChartConfig = {
  'USDC': {
    label: 'USDC',
    color: 'hsl(220, 70%, 50%)', // Blue
  },
  'USDT': {
    label: 'USDT',
    color: 'hsl(142, 70%, 45%)', // Green
  },
  'DAI': {
    label: 'DAI',
    color: 'hsl(45, 85%, 55%)', // Gold
  },
  'FRAX': {
    label: 'FRAX',
    color: 'hsl(270, 60%, 60%)', // Purple
  },
  'TUSD': {
    label: 'TUSD',
    color: 'hsl(200, 70%, 55%)', // Light Blue
  },
  'BUSD': {
    label: 'BUSD',
    color: 'hsl(45, 100%, 50%)', // Yellow
  }
};

// Cross-chain bridge options
export const bridgeOptions: CrossChainBridge[] = [
  {
    id: 'usdc-eth-polygon',
    name: 'USDC: Ethereum → Polygon',
    fromChain: 1,
    toChain: 137,
    stablecoin: 'USDC',
    estimatedTime: '5-10 minutes',
    fees: 2.50,
    isActive: true
  },
  {
    id: 'usdt-eth-arbitrum',
    name: 'USDT: Ethereum → Arbitrum',
    fromChain: 1,
    toChain: 42161,
    stablecoin: 'USDT',
    estimatedTime: '2-5 minutes',
    fees: 1.80,
    isActive: true
  },
  {
    id: 'dai-eth-optimism',
    name: 'DAI: Ethereum → Optimism',
    fromChain: 1,
    toChain: 10,
    stablecoin: 'DAI',
    estimatedTime: '1-3 minutes',
    fees: 1.20,
    isActive: true
  }
];

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getStablecoinIcon(symbol: StablecoinSymbol): string {
  const iconMap: Record<StablecoinSymbol, string> = {
    'USDC': '🔵', // Blue circle for USDC
    'USDT': '🟢', // Green circle for USDT  
    'DAI': '🟡', // Yellow circle for DAI
    'FRAX': '🟣', // Purple circle for FRAX
    'TUSD': '🔷', // Blue diamond for TUSD
    'BUSD': '🟨'  // Yellow square for BUSD
  };
  return iconMap[symbol] || '💰';
}

export function getTransactionTypeIcon(type: StablecoinTransaction['type']): string {
  const iconMap: Record<StablecoinTransaction['type'], string> = {
    'deposit': '⬇️',
    'withdrawal': '⬆️', 
    'yield': '📈',
    'swap': '🔄',
    'bridge': '🌉',
    'spend': '💳'
  };
  return iconMap[type] || '💰';
}

export function getChainName(chainId: ChainId): string {
  const chainNames: Record<ChainId, string> = {
    1: 'Ethereum',
    137: 'Polygon',
    42161: 'Arbitrum',
    10: 'Optimism',
    56: 'BSC'
  };
  return chainNames[chainId] || 'Unknown';
}

export function calculateTotalYield(): number {
  return yieldPositions.reduce((total, position) => {
    return total + (position.currentValue - position.depositAmount);
  }, 0);
}

export function getWeightedAverageAPY(): number {
  const totalValue = yieldPositions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const weightedSum = yieldPositions.reduce((sum, pos) => {
    return sum + (pos.apy * pos.currentValue);
  }, 0);
  return totalValue > 0 ? weightedSum / totalValue : 0;
}

// Backward compatibility exports
export const mockTransactions = mockStablecoinTransactions;
export const accountBalance = totalPortfolioValue;
export const balanceChange = portfolioChange;