import React, { useState, type ReactNode } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { AddTransactionModal } from '../dashboard/AddTransactionModal';
import type { CurrencyCode } from '../../types/finance';

interface DashboardLayoutProps {
  metricsSlot?: ReactNode;
  budgetTrackerSlot?: ReactNode;
  analyticsChartSlot?: ReactNode;
  savingsGoalsSlot?: ReactNode;
  subscriptionsSlot?: ReactNode;
  billCalendarSlot?: ReactNode;
  transactionTableSlot?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  metricsSlot,
  budgetTrackerSlot,
  analyticsChartSlot,
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
      {/* Root Fixed Add Transaction Modal Overlay */}
      <AddTransactionModal />

      {/* Top Fixed / Sticky Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/25">
              🎯
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white">ApexFinance</span>
              <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 border border-blue-500/20">
                PRO
              </span>
            </div>
          </div>

          {/* Currency Switcher & Action Controls */}
          <div className="flex items-center gap-3">
            {/* Multi-Currency Switcher Dropdown */}
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300">
              <span className="text-slate-500">💱</span>
              <select
                value={currentCurrency}
                onChange={(e) => setCurrentCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-white font-mono font-semibold focus:outline-none cursor-pointer"
              >
                {availableCurrencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-slate-900 text-white">
                    {c.symbol} {c.code} ({c.label})
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden sm:flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs font-medium text-slate-400">
              <button className="rounded-md bg-slate-800 px-3 py-1 text-white shadow-sm transition-all">
                This Month
              </button>
              <button className="px-3 py-1 hover:text-slate-200 transition-colors">Quarter</button>
              <button className="px-3 py-1 hover:text-slate-200 transition-colors">Year</button>
            </div>

            <button
              onClick={() => setIsAddTransactionOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer"
            >
              <span>+ Add Transaction</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome & Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Financial Operations Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time cashflow analytics, category budgets, savings goals, and multi-currency ledger.
            </p>
          </div>

          {/* Search Quick Controls with Instant Results Dropdown */}
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-80">
              <span className="absolute left-3 top-2.5 text-xs text-slate-500">🔍</span>
              <input
                type="text"
                placeholder="Search transactions, merchants, amounts..."
                value={searchQuery}
                onFocus={handleSearchFocus}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-8 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-white transition-colors"
                  title="Clear Search"
                >
                  ✕
                </button>
              )}

              {/* Instant Search Results Dropdown Popover */}
              {searchQuery && isSearchFocused && (
                <div className="absolute right-0 top-full mt-2 w-full sm:w-96 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50 space-y-2">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs font-semibold text-slate-400">
                    <span>Instant Results ({filteredTransactions.length})</span>
                    <button
                      onClick={() => setIsSearchFocused(false)}
                      className="text-slate-500 hover:text-white text-[10px]"
                    >
                      Close ✕
                    </button>
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/60 text-xs">
                    {filteredTransactions.length === 0 ? (
                      <p className="py-4 text-center text-slate-500 text-xs">No transactions match "{searchQuery}"</p>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <div
                          key={tx.id}
                          onClick={handleResultClick}
                          className="flex items-center justify-between py-2 px-2 hover:bg-slate-800/60 rounded-md cursor-pointer transition-colors"
                        >
                          <div>
                            <span className="font-semibold text-white block">{tx.merchant}</span>
                            <span className="text-[10px] text-slate-400">
                              {tx.date} • {tx.category}
                            </span>
                          </div>
                          <span
                            className={`font-mono font-semibold text-xs ${
                              tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
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
          <div className="flex items-center justify-between rounded-lg border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs text-blue-300">
            <span>
              Filtering transactions matching: <strong className="text-white">"{searchQuery}"</strong>
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-blue-400 hover:text-white font-medium transition-colors"
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Level 2: Financial Metrics Overview Slot */}
        <section>{metricsSlot}</section>

        {/* Level 3: Mid Section (Budget Tracker & Analytics Chart) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">{budgetTrackerSlot}</div>
          <div className="lg:col-span-5">{analyticsChartSlot}</div>
        </section>

        {/* Level 4: Savings Goals Tracker */}
        {savingsGoalsSlot && <section>{savingsGoalsSlot}</section>}

        {/* Level 5: Subscriptions Monitor */}
        {subscriptionsSlot && <section>{subscriptionsSlot}</section>}

        {/* Level 6: Bill Calendar Section */}
        {billCalendarSlot && <section>{billCalendarSlot}</section>}

        {/* Level 7: Full-Width Transaction Data Table */}
        <section id="transaction-history">{transactionTableSlot}</section>
      </main>
    </div>
  );
};
