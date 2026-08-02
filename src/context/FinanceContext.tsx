import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type {
  Transaction,
  Budget,
  FinancialMetrics,
  ComputedBudgetProgress,
  FinanceContextType,
} from '../types/finance';

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Housing & Utilities', allocatedAmount: 1800, color: '#3B82F6' },
  { id: 'b-2', category: 'Groceries & Dining', allocatedAmount: 800, color: '#10B981' },
  { id: 'b-3', category: 'Transportation', allocatedAmount: 350, color: '#F59E0B' },
  { id: 'b-4', category: 'Entertainment & Leisure', allocatedAmount: 300, color: '#8B5CF6' },
  { id: 'b-5', category: 'Healthcare & Wellness', allocatedAmount: 250, color: '#EC4899' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't-1', date: '2026-07-28', merchant: 'Employer Direct Deposit', category: 'Salary', amount: 5200, type: 'income', status: 'completed' },
  { id: 't-2', date: '2026-07-27', merchant: 'Apex Luxury Apartments', category: 'Housing & Utilities', amount: 1450, type: 'expense', status: 'completed' },
  { id: 't-3', date: '2026-07-26', merchant: 'Whole Foods Market', category: 'Groceries & Dining', amount: 184.20, type: 'expense', status: 'completed' },
  { id: 't-4', date: '2026-07-25', merchant: 'Freelance Design Retainer', category: 'Freelance', amount: 850, type: 'income', status: 'completed' },
  { id: 't-5', date: '2026-07-24', merchant: 'Trader Joe\'s', category: 'Groceries & Dining', amount: 92.50, type: 'expense', status: 'completed' },
  { id: 't-6', date: '2026-07-23', merchant: 'Electric & Power Co.', category: 'Housing & Utilities', amount: 142.00, type: 'expense', status: 'completed' },
  { id: 't-7', date: '2026-07-22', merchant: 'Uber Rideshare', category: 'Transportation', amount: 34.80, type: 'expense', status: 'completed' },
  { id: 't-8', date: '2026-07-21', merchant: 'Cinema & Concert Tickets', category: 'Entertainment & Leisure', amount: 120.00, type: 'expense', status: 'pending' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Primary Ground-Truth State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Derive Overall Financial Overview Metrics
  const metrics = useMemo<FinancialMetrics>(() => {
    const totalIncome = transactions
      .filter((t) => t.type === 'income' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0);

    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
    };
  }, [transactions]);

  // 2. Derive Per-Category Budget Progress
  const budgetProgress = useMemo<ComputedBudgetProgress[]>(() => {
    return budgets.map((b) => {
      const spentAmount = transactions
        .filter((t) => t.category === b.category && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const remainingAmount = b.allocatedAmount - spentAmount;
      const percentageUsed = b.allocatedAmount > 0 
        ? Math.round((spentAmount / b.allocatedAmount) * 100) 
        : 0;

      return {
        ...b,
        spentAmount,
        remainingAmount,
        percentageUsed,
        isWarning: percentageUsed >= 80 && percentageUsed < 100,
        isOverBudget: percentageUsed >= 100,
      };
    });
  }, [budgets, transactions]);

  // 3. Derive Filtered Transactions for Table View
  const filteredTransactions = useMemo<Transaction[]>(() => {
    return transactions.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        t.merchant.toLowerCase().includes(query) ||
        t.category.toLowerCase().includes(query) ||
        t.amount.toString().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [transactions, selectedCategory, searchQuery]);

  // Mutators
  const addTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...newTxData,
      id: `t-${Date.now()}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudget = (categoryId: string, newAllocation: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === categoryId ? { ...b, allocatedAmount: newAllocation } : b))
    );
  };

  const value: FinanceContextType = {
    transactions,
    budgets,
    selectedCategory,
    searchQuery,
    metrics,
    budgetProgress,
    filteredTransactions,
    addTransaction,
    removeTransaction,
    updateBudget,
    setSelectedCategory,
    setSearchQuery,
  };

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = (): FinanceContextType => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
