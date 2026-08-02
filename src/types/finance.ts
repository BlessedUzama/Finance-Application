export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending';
export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  label: string;
  rate: number;
  locale: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  tag?: string;
}

export interface Budget {
  id: string;
  category: string;
  allocatedAmount: number;
  color?: string;
  icon?: string;
}

export interface ComputedBudgetProgress extends Budget {
  spentAmount: number;
  remainingAmount: number;
  percentageUsed: number;
  isOverBudget: boolean;
  isWarning: boolean;
}

export interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  savingsRate: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  color: string;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'Monthly' | 'Yearly';
  dueDate: string;
  category: string;
  icon: string;
  status: 'paid' | 'due-soon' | 'pending';
}

export interface AssetItem {
  id: string;
  name: string;
  value: number;
  category: 'Cash & Savings' | 'Investments' | 'Real Estate' | 'Vehicles' | 'Crypto & Other';
  icon: string;
}

export interface LiabilityItem {
  id: string;
  name: string;
  amount: number;
  category: 'Credit Cards' | 'Mortgages' | 'Student Loans' | 'Auto Loans' | 'Other Debt';
  icon: string;
}

export interface FinanceContextType {
  // Raw Data
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  subscriptions: SubscriptionItem[];
  assets: AssetItem[];
  liabilities: LiabilityItem[];
  selectedCategory: string;
  searchQuery: string;
  isAddTransactionOpen: boolean;
  
  // Multi-Currency State
  currentCurrency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  availableCurrencies: CurrencyConfig[];
  setCurrentCurrency: (code: CurrencyCode) => void;
  formatCurrency: (amount: number) => string;

  // Derived / Computed Data
  metrics: FinancialMetrics;
  budgetProgress: ComputedBudgetProgress[];
  filteredTransactions: Transaction[];
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  
  // State Mutators & Filters
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  importTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  removeTransaction: (id: string) => void;
  addBudgetCategory: (category: Omit<Budget, 'id'>) => void;
  updateBudget: (categoryId: string, newAllocation: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  depositSavingsGoal: (id: string, amount: number) => void;
  addSubscription: (subscription: Omit<SubscriptionItem, 'id'>) => void;
  markSubscriptionPaid: (subscriptionId: string) => void;
  addAsset: (asset: Omit<AssetItem, 'id'>) => void;
  removeAsset: (id: string) => void;
  addLiability: (liability: Omit<LiabilityItem, 'id'>) => void;
  removeLiability: (id: string) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsAddTransactionOpen: (open: boolean) => void;
}
