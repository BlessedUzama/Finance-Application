export type TransactionType = 'income' | 'expense';
export type TransactionStatus = 'completed' | 'pending';

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
}

export interface Budget {
  id: string;
  category: string;
  allocatedAmount: number;
  color?: string;
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

export interface FinanceContextType {
  // Raw Data
  transactions: Transaction[];
  budgets: Budget[];
  selectedCategory: string;
  searchQuery: string;
  
  // Derived / Computed Data
  metrics: FinancialMetrics;
  budgetProgress: ComputedBudgetProgress[];
  filteredTransactions: Transaction[];
  
  // State Mutators & Filters
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  removeTransaction: (id: string) => void;
  updateBudget: (categoryId: string, newAllocation: number) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
}
