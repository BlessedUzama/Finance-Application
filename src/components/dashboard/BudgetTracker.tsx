import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from './MetricsGrid';

export const BudgetTracker: React.FC = () => {
  const { budgetProgress, updateBudget } = useFinance();
  const [editingCategory, setEditingCategory] = useState<{ id: string; category: string; amount: number } | null>(null);
  const [newAmount, setNewAmount] = useState<string>('');

  const handleEditClick = (item: { id: string; category: string; allocatedAmount: number }) => {
    setEditingCategory({ id: item.id, category: item.category, amount: item.allocatedAmount });
    setNewAmount(item.allocatedAmount.toString());
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory && newAmount && !isNaN(Number(newAmount))) {
      updateBudget(editingCategory.id, Number(newAmount));
      setEditingCategory(null);
    }
  };

  // Helper for category icons
  const getCategoryIcon = (category: string) => {
    if (category.includes('Housing')) return '🏠';
    if (category.includes('Groceries') || category.includes('Dining')) return '🛒';
    if (category.includes('Transportation')) return '🚗';
    if (category.includes('Entertainment') || category.includes('Leisure')) return '🎬';
    if (category.includes('Health') || category.includes('Wellness')) return '🏥';
    return '💼';
  };

  const totalAllocated = budgetProgress.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgetProgress.reduce((sum, b) => sum + b.spentAmount, 0);
  const overallPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-5 shadow-xl">
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">Monthly Category Budgets</h3>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-blue-400 border border-blue-500/20">
              {overallPercentage}% Total Allocated Spent
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Track spending limits against real-time expense totals.</p>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          Total: <span className="text-white font-semibold">{formatCurrency(totalSpent)}</span> / {formatCurrency(totalAllocated)}
        </div>
      </div>

      {/* Budget Category Items List */}
      <div className="space-y-4">
        {budgetProgress.map((item) => {
          const getBarColorClass = () => {
            if (item.isOverBudget) return 'bg-gradient-to-r from-rose-500 to-red-600 shadow-sm shadow-rose-500/20';
            if (item.isWarning) return 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-sm shadow-amber-500/20';
            return 'bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-sm shadow-emerald-500/20';
          };

          const getBadgeClass = () => {
            if (item.isOverBudget) return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            if (item.isWarning) return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            return 'bg-slate-800/80 text-slate-300 border-slate-700/60';
          };

          return (
            <div key={item.id} className="group rounded-lg border border-slate-800/50 bg-slate-950/40 p-3 hover:border-slate-700/80 transition-all space-y-2.5">
              {/* Top Row: Icon, Category Name, & Spent/Allocated Text */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800 text-sm">
                    {getCategoryIcon(item.category)}
                  </span>
                  <div>
                    <span className="font-medium text-slate-200 block">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="font-semibold text-white">
                    {formatCurrency(item.spentAmount)}
                  </span>
                  <span className="text-slate-500">/ {formatCurrency(item.allocatedAmount)}</span>

                  <span className={`ml-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getBadgeClass()}`}>
                    {item.percentageUsed}%
                  </span>

                  <button
                    onClick={() => handleEditClick(item)}
                    className="ml-1 text-slate-500 hover:text-blue-400 transition-colors cursor-pointer text-xs p-1"
                    title="Edit Limit"
                  >
                    ✏️
                  </button>
                </div>
              </div>

              {/* Progress Bar Track */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800/80">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${getBarColorClass()}`}
                  style={{ width: `${Math.min(item.percentageUsed, 100)}%` }}
                />
              </div>

              {/* Status Helper Sub-row */}
              <div className="flex items-center justify-between text-[11px]">
                <span>
                  {item.isOverBudget ? (
                    <span className="text-rose-400 font-semibold flex items-center gap-1">
                      ⚠️ Over budget by {formatCurrency(Math.abs(item.remainingAmount))}
                    </span>
                  ) : item.isWarning ? (
                    <span className="text-amber-400 font-medium">
                      ⚡ 80% limit reached ({formatCurrency(item.remainingAmount)} remaining)
                    </span>
                  ) : (
                    <span className="text-slate-400">
                      {formatCurrency(item.remainingAmount)} remaining
                    </span>
                  )}
                </span>
                <span className="text-slate-500 font-mono text-[10px]">
                  Allocated: {formatCurrency(item.allocatedAmount)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Limit Modal Dialog */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-semibold text-white">Adjust Budget Allocation</h4>
              <button onClick={() => setEditingCategory(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Category: <span className="text-white font-semibold">{editingCategory.category}</span>
                </label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2 text-xs font-mono text-slate-500">$</span>
                  <input
                    type="number"
                    step="10"
                    required
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-7 pr-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Update Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
