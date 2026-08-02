import React from 'react';
import { useFinance } from '../../context/FinanceContext';

export const MetricsGrid: React.FC = () => {
  const { metrics, formatCurrency } = useFinance();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Monthly Income Metric */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Monthly Income
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            ↑
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
            {formatCurrency(metrics.totalIncome)}
          </h3>
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            +12.5% vs last month
          </span>
        </div>
      </div>

      {/* 2. Monthly Expenses Metric */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Total Monthly Expenses
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">
            ↓
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
            {formatCurrency(metrics.totalExpenses)}
          </h3>
          <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
            {metrics.totalIncome > 0 ? ((metrics.totalExpenses / metrics.totalIncome) * 100).toFixed(1) : 0}% of income
          </span>
        </div>
      </div>

      {/* 3. Net Savings Metric */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Net Monthly Savings
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
            💰
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className={`text-xl sm:text-2xl font-bold tracking-tight font-mono ${
            metrics.netSavings >= 0 ? 'text-gray-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatCurrency(metrics.netSavings)}
          </h3>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
            metrics.netSavings >= 0 
              ? 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20' 
              : 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20'
          }`}>
            {metrics.netSavings >= 0 ? 'Surplus' : 'Deficit'}
          </span>
        </div>
      </div>

      {/* 4. Savings Rate Target Metric */}
      <div className="flex flex-col justify-between rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Savings Rate Target
          </span>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
            📊
          </span>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white font-mono">
            {metrics.savingsRate.toFixed(1)}%
          </h3>
          <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/20">
            Goal: 50.0%
          </span>
        </div>
      </div>
    </div>
  );
};
