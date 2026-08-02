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

export interface FinanceContextType {
  // Raw Data
  transactions: Transaction[];
  budgets: Budget[];
  savingsGoals: SavingsGoal[];
  subscriptions: SubscriptionItem[];
  selectedCategory: string;
  searchQuery: string;
  isAddTransactionOpen: boolean;
  
  // Derived / Computed Data
  metrics: FinancialMetrics;
  budgetProgress: ComputedBudgetProgress[];
  filteredTransactions: Transaction[];
  
  // State Mutators & Filters
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  importTransactions: (transactions: Omit<Transaction, 'id'>[]) => void;
  removeTransaction: (id: string) => void;
  updateBudget: (categoryId: string, newAllocation: number) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  depositSavingsGoal: (id: string, amount: number) => void;
  addSubscription: (subscription: Omit<SubscriptionItem, 'id'>) => void;
  setSelectedCategory: (category: string) => void;
  setSearchQuery: (query: string) => void;
  setIsAddTransactionOpen: (open: boolean) => void;
}
