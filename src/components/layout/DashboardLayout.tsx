import React, { useState, type ReactNode } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AddTransactionModal } from '../dashboard/AddTransactionModal';
import type { CurrencyCode } from '../../types/finance';

interface DashboardLayoutProps {
  metricsSlot?: ReactNode;
  budgetTrackerSlot?: ReactNode;
  netWorthSlot?: ReactNode;
  savingsGoalsSlot?: ReactNode;
  subscriptionsSlot?: ReactNode;
  billCalendarSlot?: ReactNode;
  transactionTableSlot?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  metricsSlot,
  budgetTrackerSlot,
  netWorthSlot,
  savingsGoalsSlot,
  subscriptionsSlot,
  billCalendarSlot,
  transactionTableSlot,
}) => {
  const {
    searchQuery,
    setSearchQuery,
    setIsAddTransactionOpen,
    filteredTransactions,
    currentCurrency,
    availableCurrencies,
    setCurrentCurrency,
    themeMode,
    setThemeMode,
    formatCurrency,
  } = useFinance();

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleResultClick = () => {
    setIsSearchFocused(false);
    const element = document.getElementById('transaction-history');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const isDarkMode = themeMode === 'dark' || (themeMode === 'system' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setThemeMode(isDarkMode ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans antialiased transition-colors">
      {/* Root Fixed Add Transaction Modal Overlay */}
      <AddTransactionModal />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex flex-wrap h-auto min-h-[4rem] max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 py-2 gap-2">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm">
              <svg className="h-4 w-4 sm:h-5 sm:w-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold tracking-tight text-gray-900 dark:text-white">
                ApexFinance
              </span>
              <span className="ml-1 rounded-full bg-blue-500/10 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
          </div>

          {/* Theme Toggle & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer shadow-sm active:scale-95 transition-all"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg className="h-4 w-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" />
                </svg>
              ) : (
                <svg className="h-4 w-4 text-gray-700 fill-current" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* Currency Selector */}
            <div className="flex items-center gap-1 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2 py-1 text-xs font-medium text-gray-800 dark:text-gray-300">
              <span className="text-[11px]">💱</span>
              <select
                value={currentCurrency}
                onChange={(e) => setCurrentCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-gray-900 dark:text-white font-mono font-semibold focus:outline-none cursor-pointer text-xs"
              >
                {availableCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                    {c.symbol} {c.code}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Transaction Button */}
            <button
              onClick={() => setIsAddTransactionOpen(true)}
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
            >
              <span>+ Entry</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-6 space-y-6 sm:space-y-8">
        {/* Welcome & Section Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              Financial Dashboard
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Category budgets, savings goals, net worth, bill calendar, and multi-currency ledger.
            </p>
          </div>

          {/* Search Quick Controls with Instant Results Dropdown */}
          <div className="w-full md:w-80 relative">
            <div className="relative w-full">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search transactions, merchants, tags..."
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 pl-9 pr-8 py-2 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                  title="Clear Search"
                >
                  ✕
                </button>
              )}

              {/* Instant Search Results Dropdown Popover */}
              {searchQuery && isSearchFocused && (
                <div className="absolute right-0 top-full mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 shadow-2xl z-50 space-y-2">
                  <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    <span>Instant Results ({filteredTransactions.length})</span>
                    <button
                      onClick={() => setIsSearchFocused(false)}
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-[10px] cursor-pointer"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 text-xs">
                    {filteredTransactions.length === 0 ? (
                      <p className="py-4 text-center text-gray-400 text-xs">No transactions match "{searchQuery}"</p>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={handleResultClick}
                          className="flex items-center justify-between py-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800/60 rounded-md cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-gray-900 dark:text-white block">{tx.merchant}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">
                              {tx.date} • {tx.category}
                            </span>
                          </div>
                          <span
                            className={`font-mono font-semibold text-xs ${
                              tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-200'
                            }`}
                          >
                            {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Search Banner */}
        {searchQuery && (
          <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-600 dark:text-blue-300">
            <span>
              Filtering transactions matching: <strong className="text-gray-900 dark:text-white">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-600 dark:text-blue-400 hover:text-gray-900 dark:hover:text-white font-medium cursor-pointer"
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Section 1: Financial Metrics Grid */}
        <section>{metricsSlot}</section>

        {/* Section 2: Budget Tracker Section */}
        {budgetTrackerSlot && <section>{budgetTrackerSlot}</section>}

        {/* Section 3: Net Worth Tracker Section */}
        {netWorthSlot && <section>{netWorthSlot}</section>}

        {/* Section 4: Savings Goals Tracker */}
        {savingsGoalsSlot && <section>{savingsGoalsSlot}</section>}

        {/* Section 5: Subscriptions Monitor */}
        {subscriptionsSlot && <section>{subscriptionsSlot}</section>}

        {/* Section 6: Bill Calendar Section */}
        {billCalendarSlot && <section>{billCalendarSlot}</section>}

        {/* Section 7: Full-Width Transaction Data Table */}
        <section id="transaction-history">{transactionTableSlot}</section>
      </main>
    </div>
  );
};
