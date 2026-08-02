import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import type { SavingsGoal } from '../../types/finance';

export const SavingsGoalCard: React.FC<{
  goal: SavingsGoal;
  onDeposit: (goal: SavingsGoal) => void;
}> = ({ goal, onDeposit }) => {
  const { formatCurrency } = useFinance();
  const percentage = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-900/90 space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-lg shadow-sm border border-slate-700/50"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            {goal.icon}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">{goal.name}</h4>
            <span className="text-[11px] text-slate-400">Target Date: {goal.targetDate}</span>
          </div>
        </div>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-mono font-semibold border"
          style={{
            backgroundColor: `${goal.color}15`,
            color: goal.color,
            borderColor: `${goal.color}30`,
          }}
        >
          {percentage}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-slate-300 font-bold">{formatCurrency(goal.currentAmount)}</span>
          <span className="text-slate-400">{formatCurrency(goal.targetAmount)}</span>
        </div>
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${percentage}%`,
              backgroundColor: goal.color,
            }}
          />
        </div>
      </div>

      {/* Footer & Action Button */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
        <span className="text-[11px] text-slate-400 font-mono">
          {remaining > 0 ? `${formatCurrency(remaining)} remaining` : '🎉 Goal Reached!'}
        </span>
        <button
          onClick={() => onDeposit(goal)}
          className="rounded-lg bg-blue-600/20 px-3 py-1 text-xs font-semibold text-blue-400 border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
        >
          + Deposit
        </button>
      </div>
    </div>
  );
};

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, depositSavingsGoal, formatCurrency } = useFinance();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [depositGoal, setDepositGoal] = useState<SavingsGoal | null>(null);

  // Add Form State
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [icon, setIcon] = useState('🎯');

  // Deposit Form State
  const [depositAmount, setDepositAmount] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || isNaN(Number(targetAmount))) return;

    addSavingsGoal({
      name,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount) || 0,
      targetDate: targetDate || '2027-01-01',
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
    if (depositGoal && depositAmount && !isNaN(Number(depositAmount))) {
      depositSavingsGoal(depositGoal.id, Number(depositAmount));
      setDepositAmount('');
      setDepositGoal(null);
    }
  };

  const totalSaved = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Savings Goals & Sinking Funds</h3>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-400 border border-blue-500/20">
              {savingsGoals.length} Active Targets
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dedicated savings reserves for emergency funds, vacations, and big purchases.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Total Saved: </span>
            <span className="font-bold text-emerald-400">{formatCurrency(totalSaved)}</span>
            <span className="text-slate-500"> / {formatCurrency(totalTarget)}</span>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            + Add Goal
          </button>
        </div>
      </div>

      {/* Grid of Goals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savingsGoals.map((goal) => (
          <SavingsGoalCard key={goal.id} goal={goal} onDeposit={setDepositGoal} />
        ))}
      </div>

      {/* Deposit Dialog Modal */}
      {depositGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-semibold text-white">Deposit to {depositGoal.name}</h4>
              <button onClick={() => setDepositGoal(null)} className="text-slate-400 hover:text-white text-xs p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Deposit Amount ($)
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  placeholder="e.g. 250"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm font-mono text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDepositGoal(null)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
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
        </div>
      )}

      {/* Add Goal Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-semibold text-white">Create New Savings Target</h4>
              <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-white text-xs p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Laptop Fund"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="2500"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial Saved ($)</label>
                  <input
                    type="number"
                    placeholder="500"
                    value={currentAmount}
                    onChange={(e) => setCurrentAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
