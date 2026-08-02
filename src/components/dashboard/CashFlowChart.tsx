import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from './MetricsGrid';

export const CashFlowChart: React.FC = () => {
  const { metrics, budgetProgress } = useFinance();

  const incomePct = 100;
  const expensePct = metrics.totalIncome > 0 
    ? Math.min((metrics.totalExpenses / metrics.totalIncome) * 100, 100) 
    : 0;
  const savingsPct = metrics.totalIncome > 0 
    ? Math.max(0, ((metrics.totalIncome - metrics.totalExpenses) / metrics.totalIncome) * 100) 
    : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Cash Flow Breakdown</h3>
          <p className="text-xs text-slate-400">Income utilization vs expense absorption.</p>
        </div>
        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
          Positive Cashflow
        </span>
      </div>

      {/* Visual Proportion Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Income Breakdown Distribution</span>
          <span className="font-mono text-white">{expensePct.toFixed(1)}% Spent</span>
        </div>

        <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-800 p-0.5">
          {/* Expenses Portion */}
          <div
            className="h-full rounded-l-full bg-rose-500 transition-all duration-500"
            style={{ width: `${expensePct}%` }}
            title={`Expenses: ${expensePct.toFixed(1)}%`}
          />
          {/* Savings Portion */}
          <div
            className="h-full rounded-r-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${savingsPct}%` }}
            title={`Savings: ${savingsPct.toFixed(1)}%`}
          />
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-slate-400">Expenses ({formatCurrency(metrics.totalExpenses)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-slate-400">Savings ({formatCurrency(metrics.netSavings)})</span>
          </div>
        </div>
      </div>

      {/* Financial Health Indicators */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Net Surplus Ratio
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">
            {metrics.savingsRate.toFixed(1)}%
          </span>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            Active Categories
          </span>
          <span className="text-lg font-bold font-mono text-blue-400 mt-1 block">
            {budgetProgress.length} Tracks
          </span>
        </div>
      </div>
    </div>
  );
};
