import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from './MetricsGrid';

export const SubscriptionsMonitor: React.FC = () => {
  const { subscriptions, addSubscription } = useFinance();

  // Add Subscription Modal State
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCost, setNewCost] = useState('');
  const [newCycle, setNewCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [newDate, setNewDate] = useState('2026-08-15');
  const [newCategory, setNewCategory] = useState('Entertainment');
  const [newIcon, setNewIcon] = useState('💳');
  const [newStatus, setNewStatus] = useState<'paid' | 'due-soon' | 'pending'>('due-soon');

  const totalMonthlyOverhead = subscriptions.reduce((sum, s) => {
    return sum + (s.billingCycle === 'Monthly' ? s.cost : s.cost / 12);
  }, 0);

  const handleAddSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCost || isNaN(Number(newCost))) return;

    addSubscription({
      name: newName,
      cost: Number(newCost),
      billingCycle: newCycle,
      dueDate: newDate,
      category: newCategory,
      icon: newIcon || '💳',
      status: newStatus,
    });

    setNewName('');
    setNewCost('');
    setIsAddSubOpen(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Subscriptions & Recurring Bills</h3>
          <p className="text-xs text-slate-400">Monitor active SaaS retainers, utilities, and due dates.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-xs text-slate-400">
            Monthly Overhead: <span className="text-emerald-400 font-bold">{formatCurrency(totalMonthlyOverhead)}</span>
          </div>
          <button
            onClick={() => setIsAddSubOpen(true)}
            className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-500 transition-all cursor-pointer shadow-md shadow-blue-600/20"
          >
            + Add Subscription
          </button>
        </div>
      </div>

      {/* Subscription Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {subscriptions.map((sub) => {
          const getStatusBadge = () => {
            if (sub.status === 'paid')
              return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            if (sub.status === 'due-soon')
              return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
            return 'bg-slate-800 text-slate-400 border-slate-700';
          };

          return (
            <div
              key={sub.id}
              className="rounded-lg border border-slate-800/80 bg-slate-950/50 p-3 hover:border-slate-700 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-800 text-xs">
                    {sub.icon}
                  </span>
                  <span className="text-xs font-medium text-white truncate max-w-[110px]">{sub.name}</span>
                </div>
                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getStatusBadge()}`}>
                  {sub.status}
                </span>
              </div>

              <div className="flex items-baseline justify-between pt-1 font-mono">
                <span className="text-sm font-bold text-white tabular-nums">{formatCurrency(sub.cost)}</span>
                <span className="text-[10px] text-slate-500">{sub.billingCycle}</span>
              </div>

              <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-1.5 flex justify-between">
                <span>Due Date:</span>
                <span className="text-slate-300 font-mono">{sub.dueDate}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      {isAddSubOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-semibold text-white">Add Recurring Subscription</h4>
              <button onClick={() => setIsAddSubOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Adobe Creative Cloud, OpenAI API"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="19.99"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Billing Cycle</label>
                  <select
                    value={newCycle}
                    onChange={(e) => setNewCycle(e.target.value as 'Monthly' | 'Yearly')}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Next Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'paid' | 'due-soon' | 'pending')}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="due-soon">Due Soon</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Software, Entertainment"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="⚡"
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubOpen(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
