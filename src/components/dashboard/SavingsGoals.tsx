import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useFinance } from '../../context/FinanceContext';
import type { SavingsGoal } from '../../types/finance';

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, depositSavingsGoal, formatCurrency } = useFinance();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('🎯');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || isNaN(Number(targetAmount))) return;

    addSavingsGoal({
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      targetDate: targetDate || '2026-12-31',
      icon,
      color: '#3B82F6',
    });

    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setIsAddOpen(false);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGoal && depositAmount && !isNaN(Number(depositAmount))) {
      depositSavingsGoal(selectedGoal.id, Number(depositAmount));
      setSelectedGoal(null);
      setDepositAmount('');
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-sm dark:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Savings & Investment Goals</h3>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {savingsGoals.length} Active Targets
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track visual goal progress and deposit capital towards milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          + New Goal
        </button>
      </div>

      {/* Responsive Goals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savingsGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 p-4 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{goal.icon}</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{goal.name}</h4>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">Target Date: {goal.targetDate}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedGoal(goal)}
                  className="rounded-lg bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                >
                  + Deposit
                </button>
              </div>

              {/* Numerical stats */}
              <div className="flex items-baseline justify-between text-xs font-mono">
                <span className="text-slate-900 dark:text-white font-bold">{formatCurrency(goal.currentAmount)}</span>
                <span className="text-slate-500 dark:text-slate-400">/ {formatCurrency(goal.targetAmount)}</span>
              </div>

              {/* Progress bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span>{pct}% completed</span>
                <span>{formatCurrency(remaining)} remaining</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isAddOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Create Savings Goal</h4>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs p-1 cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. New Car, House Downpayment"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Target Amount ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="5000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Initial Deposit ($)</label>
                    <input
                      type="number"
                      placeholder="500"
                      value={currentAmount}
                      onChange={(e) => setCurrentAmount(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Target Date</label>
                    <input
                      type="date"
                      required
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Icon Emoji</label>
                    <input
                      type="text"
                      required
                      value={icon}
                      onChange={(e) => setIcon(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 px-3.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                  >
                    Save Goal
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Deposit Capital Modal */}
      {selectedGoal &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Deposit to {selectedGoal.name}</h4>
                <button onClick={() => setSelectedGoal(null)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs p-1 cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleDepositSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Deposit Amount ($)</label>
                  <input
                    type="number"
                    step="10"
                    required
                    placeholder="250"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-sm font-mono text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedGoal(null)}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                  >
                    Confirm Deposit
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
