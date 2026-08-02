import React, { type ReactNode } from 'react';
import { useFinance } from '../../context/FinanceContext';

interface DashboardLayoutProps {
  metricsSlot?: ReactNode;
  budgetTrackerSlot?: ReactNode;
  analyticsChartSlot?: ReactNode;
  transactionTableSlot?: ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  metricsSlot,
  budgetTrackerSlot,
  analyticsChartSlot,
  transactionTableSlot,
}) => {
  const { selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useFinance();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-200">
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

          {/* Quick Date Range / Action Controls */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs font-medium text-slate-400">
              <button className="rounded-md bg-slate-800 px-3 py-1 text-white shadow-sm transition-all">
                This Month
              </button>
              <button className="px-3 py-1 hover:text-slate-200 transition-colors">Quarter</button>
              <button className="px-3 py-1 hover:text-slate-200 transition-colors">Year</button>
            </div>
            <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:bg-blue-500 active:scale-95 transition-all cursor-pointer">
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
              Financial Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Real-time overview of cashflow, budget allocations, and transaction history.
            </p>
          </div>

          {/* Search / Filter Quick Controls */}
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 rounded-lg border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Level 2: Financial Metrics Overview Slot */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Key Metrics</span>
          </div>
          {metricsSlot ? (
            metricsSlot
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-4 flex flex-col justify-center items-center text-slate-500 text-xs animate-pulse"
                >
                  [ Metric Card Slot #{i} ]
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Level 3: Mid Section (Budget Tracker & Analytics Chart) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Budget Tracker */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Category Budget Limits</span>
            </div>
            {budgetTrackerSlot ? (
              budgetTrackerSlot
            ) : (
              <div className="h-72 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 flex items-center justify-center text-slate-500 text-xs animate-pulse">
                [ Budget Tracker Component Slot ]
              </div>
            )}
          </div>

          {/* Right Column (5 cols): Visual Analytics */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
              <span>Cash Flow Analytics</span>
            </div>
            {analyticsChartSlot ? (
              analyticsChartSlot
            ) : (
              <div className="h-72 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 flex items-center justify-center text-slate-500 text-xs animate-pulse">
                [ Analytics Chart Slot ]
              </div>
            )}
          </div>
        </section>

        {/* Level 4: Full-Width Transaction Data Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Transaction Activity</span>
          </div>
          {transactionTableSlot ? (
            transactionTableSlot
          ) : (
            <div className="h-80 rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-6 flex items-center justify-center text-slate-500 text-xs animate-pulse">
              [ Transaction Table Component Slot ]
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
