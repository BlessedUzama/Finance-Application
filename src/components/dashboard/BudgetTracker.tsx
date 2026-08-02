import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import type { ComputedBudgetProgress } from '../../types/finance';

export const BudgetCategoryRow: React.FC<{
  budget: ComputedBudgetProgress;
  onEdit: (budget: ComputedBudgetProgress) => void;
}> = ({ budget, onEdit }) => {
  const { formatCurrency } = useFinance();

  // Color indicator based on usage ratio
  const progressColor = budget.isOverBudget
    ? 'bg-rose-500 shadow-rose-500/30'
    : budget.isWarning
    ? 'bg-amber-500 shadow-amber-500/30'
    : 'bg-blue-500 shadow-blue-500/30';

  const badgeColor = budget.isOverBudget
    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    : budget.isWarning
    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  return (
    <div className="group flex flex-col space-y-2 rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/80">
      {/* Top Header: Category Name, Status Badge, Edit Control */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span
            className="h-3 w-3 rounded-full border border-white/20"
            style={{ backgroundColor: budget.color || '#3B82F6' }}
          />
          <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
            {budget.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${badgeColor}`}>
            {budget.isOverBudget
              ? 'Exceeded'
              : budget.isWarning
              ? 'Warning (80%+)'
              : 'On Track'}
          </span>
          <button
            onClick={() => onEdit(budget)}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-xs"
            title="Edit Allocation"
          >
            ✏️
          </button>
        </div>
      </div>

      {/* Numerical Stats Row */}
      <div className="flex items-baseline justify-between text-xs font-mono">
        <div className="text-slate-400">
          Spent: <span className="font-semibold text-white">{formatCurrency(budget.spentAmount)}</span>
        </div>
        <div className="text-slate-400">
          Cap: <span className="font-semibold text-slate-200">{formatCurrency(budget.allocatedAmount)}</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out shadow-sm ${progressColor}`}
          style={{ width: `${Math.min(budget.percentageUsed, 100)}%` }}
        />
      </div>

      {/* Bottom Percentage Footer */}
      <div className="flex items-center justify-between text-[11px] text-slate-500">
        <span>{budget.percentageUsed}% of limit</span>
        <span>
          {budget.remainingAmount >= 0
            ? `${formatCurrency(budget.remainingAmount)} left`
            : `${formatCurrency(Math.abs(budget.remainingAmount))} over`}
        </span>
      </div>
    </div>
  );
};

export const BudgetTracker: React.FC = () => {
  const { budgetProgress, updateBudget, formatCurrency } = useFinance();
  const [editingBudget, setEditingBudget] = useState<ComputedBudgetProgress | null>(null);
  const [newAllocation, setNewAllocation] = useState<string>('');

  const handleOpenEdit = (b: ComputedBudgetProgress) => {
    setEditingBudget(b);
    setNewAllocation(b.allocatedAmount.toString());
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBudget && newAllocation && !isNaN(Number(newAllocation))) {
      updateBudget(editingBudget.id, Number(newAllocation));
      setEditingBudget(null);
    }
  };

  const totalAllocated = budgetProgress.reduce((sum, b) => sum + b.allocatedAmount, 0);
  const totalSpent = budgetProgress.reduce((sum, b) => sum + b.spentAmount, 0);
  const totalPercentage = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-base font-semibold text-white">Monthly Budget Limits</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Category allocation rules & live expense tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="rounded-lg bg-slate-950 px-3 py-1.5 border border-slate-800">
            <span className="text-slate-400">Total Spent: </span>
            <span className="font-bold text-white">{formatCurrency(totalSpent)}</span>
            <span className="text-slate-500"> / {formatCurrency(totalAllocated)}</span>
            <span className="ml-2 rounded-full bg-blue-500/10 px-2 py-0.5 text-blue-400 font-sans text-[10px] font-semibold border border-blue-500/20">
              {totalPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Budget Rows */}
      <div className="grid grid-cols-1 gap-3">
        {budgetProgress.map((budget) => (
          <BudgetCategoryRow key={budget.id} budget={budget} onEdit={handleOpenEdit} />
        ))}
      </div>

      {/* Edit Limit Dialog Modal */}
      {editingBudget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-semibold text-white">
                Edit {editingBudget.category} Limit
              </h4>
              <button
                onClick={() => setEditingBudget(null)}
                className="text-slate-400 hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  New Allocated Amount ($)
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  value={newAllocation}
                  onChange={(e) => setNewAllocation(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingBudget(null)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Save Limit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
