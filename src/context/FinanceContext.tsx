import React, { createContext, useContext, useState, useMemo, type ReactNode } from 'react';
import type {
  Transaction,
  Budget,
  SavingsGoal,
  SubscriptionItem,
  AssetItem,
  LiabilityItem,
  FinancialMetrics,
  ComputedBudgetProgress,
  FinanceContextType,
  CurrencyCode,
  CurrencyConfig,
} from '../types/finance';

const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', label: 'US Dollar', rate: 1.0, locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€', label: 'Euro', rate: 0.92, locale: 'de-DE' },
  GBP: { code: 'GBP', symbol: '£', label: 'British Pound', rate: 0.79, locale: 'en-GB' },
  NGN: { code: 'NGN', symbol: '₦', label: 'Nigerian Naira', rate: 1550.0, locale: 'en-NG' },
  CAD: { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar', rate: 1.36, locale: 'en-CA' },
};

const INITIAL_BUDGETS: Budget[] = [
  { id: 'b-1', category: 'Housing & Utilities', allocatedAmount: 1800, color: '#3B82F6', icon: '🏠' },
  { id: 'b-2', category: 'Groceries & Dining', allocatedAmount: 800, color: '#10B981', icon: '🛒' },
  { id: 'b-3', category: 'Transportation', allocatedAmount: 350, color: '#F59E0B', icon: '🚗' },
  { id: 'b-4', category: 'Entertainment & Leisure', allocatedAmount: 300, color: '#8B5CF6', icon: '🎬' },
  { id: 'b-5', category: 'Healthcare & Wellness', allocatedAmount: 250, color: '#EC4899', icon: '💊' },
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 't-1', date: '2026-07-28', merchant: 'Employer Direct Deposit', category: 'Salary', amount: 5200, type: 'income', status: 'completed', tag: '#income' },
  { id: 't-2', date: '2026-07-27', merchant: 'Apex Luxury Apartments', category: 'Housing & Utilities', amount: 1450, type: 'expense', status: 'completed', tag: '#essential' },
  { id: 't-3', date: '2026-07-26', merchant: 'Whole Foods Market', category: 'Groceries & Dining', amount: 184.20, type: 'expense', status: 'completed', tag: '#personal' },
  { id: 't-4', date: '2026-07-25', merchant: 'Freelance Design Retainer', category: 'Freelance', amount: 850, type: 'income', status: 'completed', tag: '#business' },
  { id: 't-5', date: '2026-07-24', merchant: 'Trader Joe\'s', category: 'Groceries & Dining', amount: 92.50, type: 'expense', status: 'completed', tag: '#personal' },
  { id: 't-6', date: '2026-07-23', merchant: 'Electric & Power Co.', category: 'Housing & Utilities', amount: 142.00, type: 'expense', status: 'completed', tag: '#essential' },
  { id: 't-7', date: '2026-07-22', merchant: 'Uber Rideshare', category: 'Transportation', amount: 34.80, type: 'expense', status: 'completed', tag: '#reimbursable' },
  { id: 't-8', date: '2026-07-21', merchant: 'Cinema & Concert Tickets', category: 'Entertainment & Leisure', amount: 120.00, type: 'expense', status: 'pending', tag: '#leisure' },
];

const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  { id: 'g-1', name: 'Emergency Reserve Fund', targetAmount: 10000, currentAmount: 6500, targetDate: '2026-12-31', icon: '🛡️', color: '#10B981' },
  { id: 'g-2', name: 'European Summer Vacation', targetAmount: 3500, currentAmount: 2450, targetDate: '2027-06-15', icon: '✈️', color: '#3B82F6' },
  { id: 'g-3', name: 'Investment Portfolio Target', targetAmount: 15000, currentAmount: 8200, targetDate: '2027-10-01', icon: '📈', color: '#8B5CF6' },
];

const INITIAL_SUBSCRIPTIONS: SubscriptionItem[] = [
  { id: 's-1', name: 'Netflix Premium 4K', cost: 22.99, billingCycle: 'Monthly', dueDate: '2026-08-10', category: 'Entertainment & Leisure', icon: '🎬', status: 'due-soon' },
  { id: 's-2', name: 'AWS Cloud Infrastructure', cost: 145.50, billingCycle: 'Monthly', dueDate: '2026-08-15', category: 'Housing & Utilities', icon: '☁️', status: 'pending' },
  { id: 's-3', name: 'Spotify Family Plan', cost: 16.99, billingCycle: 'Monthly', dueDate: '2026-08-01', category: 'Entertainment & Leisure', icon: '🎵', status: 'paid' },
  { id: 's-4', name: 'Equinox Gym Membership', cost: 180.00, billingCycle: 'Monthly', dueDate: '2026-08-05', category: 'Healthcare & Wellness', icon: '🏋️', status: 'due-soon' },
];

const INITIAL_ASSETS: AssetItem[] = [
  { id: 'a-1', name: 'High-Yield Checking & Savings', value: 24500, category: 'Cash & Savings', icon: '🏦' },
  { id: 'a-2', name: 'S&P 500 Index Portfolio', value: 48200, category: 'Investments', icon: '📈' },
  { id: 'a-3', name: 'Primary Residence Equity', value: 185000, category: 'Real Estate', icon: '🏡' },
  { id: 'a-4', name: 'Tesla Model 3 Equity', value: 22000, category: 'Vehicles', icon: '🚗' },
];

const INITIAL_LIABILITIES: LiabilityItem[] = [
  { id: 'l-1', name: 'Primary Home Mortgage Balance', amount: 115000, category: 'Mortgages', icon: '📜' },
  { id: 'l-2', name: 'Apex Rewards Platinum Card', amount: 2450, category: 'Credit Cards', icon: '💳' },
  { id: 'l-3', name: 'Student Loan Balance', amount: 8500, category: 'Student Loans', icon: '🎓' },
];

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Primary State
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(INITIAL_SAVINGS_GOALS);
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(INITIAL_SUBSCRIPTIONS);
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [liabilities, setLiabilities] = useState<LiabilityItem[]>(INITIAL_LIABILITIES);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState<boolean>(false);
  const [currentCurrency, setCurrentCurrency] = useState<CurrencyCode>('USD');

  const currencyConfig = CURRENCY_CONFIGS[currentCurrency];
  const availableCurrencies = Object.values(CURRENCY_CONFIGS);

  // Multi-currency formatter method
  const formatCurrency = (amountInUsd: number): string => {
    const converted = amountInUsd * currencyConfig.rate;
    return new Intl.NumberFormat(currencyConfig.locale, {
      style: 'currency',
      currency: currencyConfig.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  };

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
      
      if (!query) return matchesCategory;

      const matchesMerchant = t.merchant ? t.merchant.toLowerCase().includes(query) : false;
      const matchesCategoryName = t.category ? t.category.toLowerCase().includes(query) : false;
      const matchesAmount = t.amount !== undefined ? t.amount.toString().includes(query) : false;
      const matchesDate = t.date ? t.date.toLowerCase().includes(query) : false;
      const matchesTag = t.tag ? t.tag.toLowerCase().includes(query) : false;

      return matchesCategory && (matchesMerchant || matchesCategoryName || matchesAmount || matchesDate || matchesTag);
    });
  }, [transactions, selectedCategory, searchQuery]);

  // 4. Derive Net Worth totals
  const totalAssets = useMemo(() => assets.reduce((sum, a) => sum + a.value, 0), [assets]);
  const totalLiabilities = useMemo(() => liabilities.reduce((sum, l) => sum + l.amount, 0), [liabilities]);
  const netWorth = totalAssets - totalLiabilities;

  // Mutators
  const addTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...newTxData,
      id: `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setTransactions((prev) => [newTransaction, ...prev]);
  };

  const importTransactions = (txList: Omit<Transaction, 'id'>[]) => {
    const newItems: Transaction[] = txList.map((txData, index) => ({
      ...txData,
      id: `t-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 6)}`,
    }));
    setTransactions((prev) => [...newItems, ...prev]);
  };

  const removeTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const addBudgetCategory = (catData: Omit<Budget, 'id'>) => {
    const newCat: Budget = {
      ...catData,
      id: `b-${Date.now()}`,
    };
    setBudgets((prev) => [...prev, newCat]);
  };

  const updateBudget = (categoryId: string, newAllocation: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === categoryId ? { ...b, allocatedAmount: newAllocation } : b))
    );
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `g-${Date.now()}`,
    };
    setSavingsGoals((prev) => [...prev, newGoal]);
  };

  const depositSavingsGoal = (id: string, amount: number) => {
    setSavingsGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
          : g
      )
    );
  };

  const addSubscription = (subData: Omit<SubscriptionItem, 'id'>) => {
    const newSub: SubscriptionItem = {
      ...subData,
      id: `s-${Date.now()}`,
    };
    setSubscriptions((prev) => [...prev, newSub]);
  };

  const removeSubscription = (id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.id !== id));
  };

  const markSubscriptionPaid = (subscriptionId: string) => {
    const targetSub = subscriptions.find((s) => s.id === subscriptionId);
    if (!targetSub) return;

    setSubscriptions((prev) =>
      prev.map((s) => (s.id === subscriptionId ? { ...s, status: 'paid' } : s))
    );

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      merchant: targetSub.name,
      category: targetSub.category || 'Entertainment & Leisure',
      amount: targetSub.cost,
      type: 'expense',
      status: 'completed',
    });
  };

  const addAsset = (assetData: Omit<AssetItem, 'id'>) => {
    const newAsset: AssetItem = {
      ...assetData,
      id: `a-${Date.now()}`,
    };
    setAssets((prev) => [...prev, newAsset]);
  };

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const addLiability = (liabilityData: Omit<LiabilityItem, 'id'>) => {
    const newLiability: LiabilityItem = {
      ...liabilityData,
      id: `l-${Date.now()}`,
    };
    setLiabilities((prev) => [...prev, newLiability]);
  };

  const removeLiability = (id: string) => {
    setLiabilities((prev) => prev.filter((l) => l.id !== id));
  };

  const value: FinanceContextType = {
    transactions,
    budgets,
    savingsGoals,
    subscriptions,
    assets,
    liabilities,
    selectedCategory,
    searchQuery,
    isAddTransactionOpen,
    currentCurrency,
    currencyConfig,
    availableCurrencies,
    setCurrentCurrency,
    formatCurrency,
    metrics,
    budgetProgress,
    filteredTransactions,
    totalAssets,
    totalLiabilities,
    netWorth,
    addTransaction,
    importTransactions,
    removeTransaction,
    addBudgetCategory,
    updateBudget,
    addSavingsGoal,
    depositSavingsGoal,
    addSubscription,
    removeSubscription,
    markSubscriptionPaid,
    addAsset,
    removeAsset,
    addLiability,
    removeLiability,
    setSelectedCategory,
    setSearchQuery,
    setIsAddTransactionOpen,
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
