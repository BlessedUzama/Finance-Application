import React from 'react';
import { useFinance } from '../../context/FinanceContext';

export const MetricsGrid: React.FC = () => {
  const { metrics, formatCurrency } = useFinance();

  const cards = [
    {
      title: 'Total Monthly Income',
      value: formatCurrency(metrics.totalIncome),
      badge: '+12.5% vs last month',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
    },
    {
      title: 'Total Monthly Expenses',
      value: formatCurrency(metrics.totalExpenses),
      badge: '42.8% of income',
      badgeColor: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      iconBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
    },
    {
      title: 'Net Monthly Savings',
      value: formatCurrency(metrics.netSavings),
      badge: metrics.netSavings >= 0 ? 'Surplus' : 'Deficit',
      badgeColor: metrics.netSavings >= 0
        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
        : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      iconBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Savings Rate Target',
      value: `${metrics.savingsRate.toFixed(1)}%`,
      badge: 'Goal: 50.0%',
      badgeColor: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      iconBg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <div
          key={index}
          className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 shadow-sm dark:shadow-xl backdrop-blur-md transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {card.title}
            </span>
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.iconBg}`}>
              {card.icon}
            </div>
          </div>

          <div className="mt-4 flex items-baseline justify-between gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {card.value}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${card.badgeColor}`}>
              {card.badge}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
