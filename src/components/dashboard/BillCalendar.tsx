import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import type { SubscriptionItem } from '../../types/finance';

export const BillCalendar: React.FC = () => {
  const { subscriptions, markSubscriptionPaid, formatCurrency } = useFinance();
  const [selectedSub, setSelectedSub] = useState<SubscriptionItem | null>(null);

  // Calendar Days (August 2026: 31 Days, starting on Saturday)
  const totalDays = 31;
  const startDayOffset = 6; // Saturday = 6th column (0-indexed: Sun=0)

  // Map subscriptions to day numbers
  const subByDay = useMemoMap(subscriptions);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Interactive Bill & Subscription Calendar</h3>
            <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-mono font-semibold text-purple-400 border border-purple-500/20">
              August 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visual payment schedule. Click any upcoming bill to mark as paid.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3 text-xs font-medium">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400" /> Paid
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Due Soon
          </span>
          <span className="flex items-center gap-1 text-purple-400">
            <span className="h-2 w-2 rounded-full bg-purple-400" /> Pending
          </span>
        </div>
      </div>

      {/* Calendar Month Grid */}
      <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
        {/* Day Name Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-1.5 font-semibold text-slate-500 text-[11px] uppercase tracking-wider">
            {day}
          </div>
        ))}

        {/* Empty Offset Cells */}
        {Array.from({ length: startDayOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="h-20 rounded-lg bg-slate-950/20 border border-slate-900/40" />
        ))}

        {/* Day Cells (1-31) */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const dayBills = subByDay[dayNum] || [];
          const isToday = dayNum === 2; // Current simulated date

          return (
            <div
              key={dayNum}
              className={`h-20 rounded-lg p-1.5 border flex flex-col justify-between transition-all ${
                isToday
                  ? 'border-blue-500/60 bg-blue-950/20 shadow-sm shadow-blue-500/10'
                  : 'border-slate-800/60 bg-slate-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={isToday ? 'font-bold text-blue-400' : 'text-slate-500'}>
                  {dayNum}
                </span>
                {isToday && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 rounded">Today</span>}
              </div>

              {/* Bill Event Chips */}
              <div className="space-y-1 overflow-y-auto max-h-12">
                {dayBills.map((sub) => {
                  const isPaid = sub.status === 'paid';
                  const chipColor = isPaid
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : sub.status === 'due-soon'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/30';

                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSub(sub)}
                      className={`flex items-center justify-between px-1.5 py-0.5 rounded border text-[10px] cursor-pointer font-sans transition-all hover:scale-105 ${chipColor}`}
                      title={`${sub.name}: ${formatCurrency(sub.cost)} (${sub.status})`}
                    >
                      <span className="truncate max-w-[55px] font-medium">{sub.name}</span>
                      <span className="font-mono font-semibold">{formatCurrency(sub.cost)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bill Action Modal Popover */}
      {selectedSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{selectedSub.icon}</span>
                <h4 className="text-sm font-semibold text-white">{selectedSub.name}</h4>
              </div>
              <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-white text-xs p-1">
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Billing Amount:</span>
                <span className="font-bold text-white">{formatCurrency(selectedSub.cost)}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Due Date:</span>
                <span className="text-slate-200">{selectedSub.dueDate}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400 font-sans">Category:</span>
                <span className="text-slate-200">{selectedSub.category}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-sans">Status:</span>
                <span
                  className={`font-semibold capitalize ${
                    selectedSub.status === 'paid'
                      ? 'text-emerald-400'
                      : selectedSub.status === 'due-soon'
                      ? 'text-amber-400'
                      : 'text-purple-400'
                  }`}
                >
                  {selectedSub.status}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
              {selectedSub.status !== 'paid' && (
                <button
                  type="button"
                  onClick={() => {
                    markSubscriptionPaid(selectedSub.id);
                    setSelectedSub(null);
                  }}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20"
                >
                  ✓ Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function useMemoMap(subscriptions: SubscriptionItem[]) {
  const map: Record<number, SubscriptionItem[]> = {};
  subscriptions.forEach((sub) => {
    if (sub.dueDate) {
      const parts = sub.dueDate.split('-');
      const day = parseInt(parts[2], 10);
      if (!isNaN(day)) {
        if (!map[day]) map[day] = [];
        map[day].push(sub);
      }
    }
  });
  return map;
}
