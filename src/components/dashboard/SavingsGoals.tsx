import React, { useState } from 'react';
import { formatCurrency } from './MetricsGrid';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  icon: string;
  color: string;
}

const INITIAL_GOALS: SavingsGoal[] = [
  {
    id: 'g-1',
    name: 'Emergency Reserve Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    targetDate: '2026-12-31',
    icon: '🛡️',
    color: '#10B981',
  },
  {
    id: 'g-2',
    name: 'European Summer Vacation',
    targetAmount: 3500,
    currentAmount: 2450,
    targetDate: '2027-06-15',
    icon: '✈️',
    color: '#3B82F6',
  },
  {
    id: 'g-3',
    name: 'Investment Portfolio Target',
    targetAmount: 15000,
    currentAmount: 8200,
    targetDate: '2027-10-01',
    icon: '📈',
    color: '#8B5CF6',
  },
];

export const SavingsGoals: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>(INITIAL_GOALS);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount || isNaN(Number(depositAmount))) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === selectedGoal.id
          ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + Number(depositAmount)) }
          : g
      )
    );

    setSelectedGoal(null);
    setDepositAmount('');
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Container Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Savings & Sinking Funds</h3>
          <p className="text-xs text-slate-400">Track dedicated targets and automated goal deposits.</p>
        </div>
        <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-purple-400 border border-purple-500/20">
          3 Active Targets
        </span>
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const percentage = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="group relative rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 hover:border-slate-700 transition-all space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-base">
                    {goal.icon}
                  </span>
                  <div>
                    <h4 className="text-xs font-semibold text-white truncate max-w-[130px]">{goal.name}</h4>
                    <span className="text-[10px] text-slate-500">Target: {goal.targetDate}</span>
                  </div>
                </div>
                <span className="rounded-full bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-300">
                  {percentage}%
                </span>
              </div>

              {/* Amount Details */}
              <div className="flex items-baseline justify-between font-mono tabular-nums">
                <span className="text-base font-bold text-white">{formatCurrency(goal.currentAmount)}</span>
                <span className="text-xs text-slate-500">/ {formatCurrency(goal.targetAmount)}</span>
              </div>

              {/* Progress Bar */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: goal.color }}
                />
              </div>

              {/* Footer & Action */}
              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className="text-slate-400">{formatCurrency(remaining)} remaining</span>
                <button
                  onClick={() => setSelectedGoal(goal)}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors"
                >
                  + Deposit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-sm font-semibold text-white">Contribute to {selectedGoal.name}</h4>
              <button onClick={() => setSelectedGoal(null)} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Deposit Amount ($)
                </label>
                <input
                  type="number"
                  step="10"
                  required
                  placeholder="e.g. 250.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedGoal(null)}
                  className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-medium text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
