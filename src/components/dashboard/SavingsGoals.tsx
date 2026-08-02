import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from './MetricsGrid';
import type { SavingsGoal } from '../../types/finance';

export const SavingsGoals: React.FC = () => {
  const { savingsGoals, addSavingsGoal, depositSavingsGoal } = useFinance();
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState<string>('');

  // Add New Goal Modal State
  const [isAddGoalOpen, setIsAddGoalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('0');
  const [newDate, setNewDate] = useState('2027-12-31');
  const [newIcon, setNewIcon] = useState('🎯');

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !depositAmount || isNaN(Number(depositAmount))) return;

    depositSavingsGoal(selectedGoal.id, Number(depositAmount));
    setSelectedGoal(null);
    setDepositAmount('');
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newTarget || isNaN(Number(newTarget))) return;

    addSavingsGoal({
      name: newName,
      targetAmount: Number(newTarget),
      currentAmount: Number(newCurrent) || 0,
      targetDate: newDate,
      icon: newIcon || '🎯',
      color: '#3B82F6',
    });

    setNewName('');
    setNewTarget('');
    setNewCurrent('0');
    setIsAddGoalOpen(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Savings & Sinking Funds</h3>
          <p className="text-xs text-slate-400">Track dedicated targets and automated goal deposits.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-purple-400 border border-purple-500/20">
            {savingsGoals.length} Active Targets
          </span>
          <button
            onClick={() => setIsAddGoalOpen(true)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            + Add Goal
          </button>
        </div>
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {savingsGoals.map((goal) => {
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
                  style={{ width: `${percentage}%`, backgroundColor: goal.color || '#3B82F6' }}
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

            <form onSubmit={handleDepositSubmit} className="space-y-4">
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

      {/* Add New Goal Modal */}
      {isAddGoalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-semibold text-white">Create New Savings Target</h4>
              <button onClick={() => setIsAddGoalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. New Macbook, House Downpayment"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Amount ($)</label>
                  <input
                    type="number"
                    step="50"
                    required
                    placeholder="5000.00"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Initial Saved ($)</label>
                  <input
                    type="number"
                    step="10"
                    placeholder="0.00"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="💻"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddGoalOpen(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
