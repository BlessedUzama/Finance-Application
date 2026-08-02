import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useFinance } from '../../context/FinanceContext';

export const SubscriptionsMonitor: React.FC = () => {
  const { subscriptions, addSubscription, removeSubscription, formatCurrency } = useFinance();
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [name, setName] = useState('');
  const [cost, setCost] = useState('');
  const [billingCycle, setBillingCycle] = useState<'Monthly' | 'Yearly'>('Monthly');
  const [dueDate, setDueDate] = useState('');
  const [category] = useState('Entertainment & Leisure');
  const [icon, setIcon] = useState('🎬');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !cost || isNaN(Number(cost))) return;

    addSubscription({
      name,
      cost: Number(cost),
      billingCycle,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      category,
      icon,
      status: 'pending',
    });

    setName('');
    setCost('');
    setIsAddOpen(false);
  };

  const monthlyOverhead = subscriptions.reduce((sum, s) => {
    return sum + (s.billingCycle === 'Monthly' ? s.cost : s.cost / 12);
  }, 0);

  const yearlyOverhead = monthlyOverhead * 12;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-sm dark:shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Subscriptions & Recurring Overhead</h3>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-purple-600 dark:text-purple-400 border border-purple-500/20">
              {subscriptions.length} Recurring Bills
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Monitor recurring software, streaming services, and membership payments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono bg-slate-100 dark:bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400">Monthly Overhead: </span>
            <span className="font-bold text-purple-600 dark:text-purple-400">{formatCurrency(monthlyOverhead)}</span>
            <span className="text-slate-400 dark:text-slate-500 text-[10px]"> ({formatCurrency(yearlyOverhead)}/yr)</span>
          </div>
          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            + Add Sub
          </button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {subscriptions.map((sub) => (
          <div
            key={sub.id}
            className="group flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40 p-3.5 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/80 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-200 dark:bg-slate-800 text-base">
                {sub.icon}
              </div>
              <div>
                <h4 className="text-xs font-semibold text-slate-900 dark:text-white truncate max-w-[110px]">{sub.name}</h4>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-mono">Due: {sub.dueDate}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="text-right font-mono">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">{formatCurrency(sub.cost)}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-500 block">{sub.billingCycle}</span>
              </div>
              <button
                onClick={() => removeSubscription(sub.id)}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-xs cursor-pointer"
                title="Remove Subscription"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Subscription Modal - Portal to document.body */}
      {isAddOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                    +
                  </span>
                  <h4 className="text-base font-semibold text-slate-900 dark:text-white">Add Recurring Subscription</h4>
                </div>
                <button onClick={() => setIsAddOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm p-1 cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Service Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Spotify, AWS, Gym"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Cost ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="14.99"
                      value={cost}
                      onChange={(e) => setCost(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Billing Cycle</label>
                    <select
                      value={billingCycle}
                      onChange={(e) => setBillingCycle(e.target.value as 'Monthly' | 'Yearly')}
                      className="w-full rounded-lg border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Next Due Date</label>
                    <input
                      type="date"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
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

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="rounded-lg border border-slate-200 dark:border-slate-800 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
                  >
                    Add Subscription
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
