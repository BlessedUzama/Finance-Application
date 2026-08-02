import React, { useState } from 'react';
import { formatCurrency } from './MetricsGrid';

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  billingCycle: 'Monthly' | 'Yearly';
  dueDate: string;
  category: string;
  icon: string;
  status: 'paid' | 'due-soon' | 'pending';
}

const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 's-1',
    name: 'Netflix Premium 4K',
    cost: 22.99,
    billingCycle: 'Monthly',
    dueDate: '2026-08-10',
    category: 'Entertainment',
    icon: '🎬',
    status: 'due-soon',
  },
  {
    id: 's-2',
    name: 'AWS Cloud Infrastructure',
    cost: 145.50,
    billingCycle: 'Monthly',
    dueDate: '2026-08-15',
    category: 'Hosting & Tech',
    icon: '☁️',
    status: 'pending',
  },
  {
    id: 's-3',
    name: 'Spotify Family Plan',
    cost: 16.99,
    billingCycle: 'Monthly',
    dueDate: '2026-08-01',
    category: 'Entertainment',
    icon: '🎵',
    status: 'paid',
  },
  {
    id: 's-4',
    name: 'Equinox Gym Membership',
    cost: 180.00,
    billingCycle: 'Monthly',
    dueDate: '2026-08-05',
    category: 'Health',
    icon: '🏋️',
    status: 'due-soon',
  },
];

export const SubscriptionsMonitor: React.FC = () => {
  const [subscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);

  const totalMonthlyOverhead = subscriptions.reduce((sum, s) => {
    return sum + (s.billingCycle === 'Monthly' ? s.cost : s.cost / 12);
  }, 0);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Container Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Subscriptions & Recurring Bills</h3>
          <p className="text-xs text-slate-400">Monitor active SaaS retainers, utilities, and due dates.</p>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          Monthly Overhead: <span className="text-emerald-400 font-bold">{formatCurrency(totalMonthlyOverhead)}</span>
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
    </div>
  );
};
