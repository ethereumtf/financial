// Mock data for the USD Financial application

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'debit' | 'credit';
  status: 'completed' | 'pending' | 'failed';
  category: string;
}

export interface SpendingData {
  category: string;
  amount: number;
  color: string;
}

export interface InvestmentOption {
  id: string;
  name: string;
  type: string;
  return: string;
  risk: 'Low' | 'Medium' | 'High';
  description: string;
}

// Mock transactions data
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Coffee Shop',
    amount: -4.50,
    date: '2024-01-15',
    type: 'debit',
    status: 'completed',
    category: 'Food & Dining'
  },
  {
    id: '2',
    description: 'Salary Deposit',
    amount: 3200.00,
    date: '2024-01-15',
    type: 'credit',
    status: 'completed',
    category: 'Income'
  },
  {
    id: '3',
    description: 'Grocery Store',
    amount: -67.89,
    date: '2024-01-14',
    type: 'debit',
    status: 'completed',
    category: 'Groceries'
  },
  {
    id: '4',
    description: 'Gas Station',
    amount: -45.20,
    date: '2024-01-14',
    type: 'debit',
    status: 'completed',
    category: 'Transportation'
  },
  {
    id: '5',
    description: 'Netflix Subscription',
    amount: -15.99,
    date: '2024-01-13',
    type: 'debit',
    status: 'completed',
    category: 'Entertainment'
  },
  {
    id: '6',
    description: 'ATM Withdrawal',
    amount: -100.00,
    date: '2024-01-13',
    type: 'debit',
    status: 'completed',
    category: 'Cash'
  },
  {
    id: '7',
    description: 'Online Transfer from John',
    amount: 50.00,
    date: '2024-01-12',
    type: 'credit',
    status: 'completed',
    category: 'Transfer'
  },
  {
    id: '8',
    description: 'Restaurant',
    amount: -89.45,
    date: '2024-01-12',
    type: 'debit',
    status: 'completed',
    category: 'Food & Dining'
  },
  {
    id: '9',
    description: 'Gym Membership',
    amount: -29.99,
    date: '2024-01-11',
    type: 'debit',
    status: 'completed',
    category: 'Health & Fitness'
  },
  {
    id: '10',
    description: 'Freelance Payment',
    amount: 750.00,
    date: '2024-01-10',
    type: 'credit',
    status: 'pending',
    category: 'Income'
  }
];

// Mock spending data for charts
export const spendingData: SpendingData[] = [
  {
    category: 'Food & Dining',
    amount: 450,
    color: 'hsl(var(--chart-1))'
  },
  {
    category: 'Transportation',
    amount: 320,
    color: 'hsl(var(--chart-2))'
  },
  {
    category: 'Entertainment',
    amount: 180,
    color: 'hsl(var(--chart-3))'
  },
  {
    category: 'Groceries',
    amount: 280,
    color: 'hsl(var(--chart-4))'
  },
  {
    category: 'Health & Fitness',
    amount: 120,
    color: 'hsl(var(--chart-5))'
  }
];

// Mock investment options
export const mockInvestments: InvestmentOption[] = [
  {
    id: '1',
    name: 'S&P 500 Index Fund',
    type: 'Index Fund',
    return: '8.2%',
    risk: 'Medium',
    description: 'Diversified exposure to 500 largest US companies'
  },
  {
    id: '2',
    name: 'High-Yield Savings',
    type: 'Savings Account',
    return: '4.5%',
    risk: 'Low',
    description: 'FDIC insured savings with competitive rates'
  },
  {
    id: '3',
    name: 'Technology ETF',
    type: 'ETF',
    return: '12.1%',
    risk: 'High',
    description: 'Growth-focused technology sector investments'
  },
  {
    id: '4',
    name: 'Bond Index Fund',
    type: 'Bond Fund',
    return: '3.8%',
    risk: 'Low',
    description: 'Stable income through government and corporate bonds'
  }
];

// Account balance
export const accountBalance = 45231.89;

// Recent balance change
export const balanceChange = {
  amount: 1234.56,
  percentage: 2.8,
  isPositive: true
};

// Mock user data
export const mockUser = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: '/api/placeholder/40/40',
  initials: 'AJ'
};

// Spending categories for the chart config
export const chartConfig = {
  'Food & Dining': {
    label: 'Food & Dining',
    color: 'hsl(var(--chart-1))'
  },
  'Transportation': {
    label: 'Transportation',
    color: 'hsl(var(--chart-2))'
  },
  'Entertainment': {
    label: 'Entertainment',
    color: 'hsl(var(--chart-3))'
  },
  'Groceries': {
    label: 'Groceries',
    color: 'hsl(var(--chart-4))'
  },
  'Health & Fitness': {
    label: 'Health & Fitness',
    color: 'hsl(var(--chart-5))'
  }
};

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

export function getTransactionIcon(category: string): string {
  const iconMap: Record<string, string> = {
    'Food & Dining': '🍴',
    'Transportation': '🚗',
    'Entertainment': '🎬',
    'Groceries': '🛒',
    'Health & Fitness': '💪',
    'Income': '💰',
    'Transfer': '↔️',
    'Cash': '💵'
  };
  return iconMap[category] || '💳';
}