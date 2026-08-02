import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useFinance } from '../../context/FinanceContext';
import type { SubscriptionItem } from '../../types/finance';

export const BillCalendar: React.FC = () => {
  const { subscriptions, markSubscriptionPaid, removeSubscription, formatCurrency } = useFinance();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Calendar Days (August 2026: 31 Days, starting on Saturday)
  const totalDays = 31;
  const startDayOffset = 6; // Saturday = 6th column (0-indexed: Sun=0)

  // Map subscriptions to day numbers
  const subByDay = useMemoMap(subscriptions);

  const activeDayBills = selectedDay !== null ? subByDay[selectedDay] || [] : [];

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
            Visual payment schedule. Click anywhere on any date to inspect, mark as paid, or remove bills.
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
          <div key={`empty-${i}`} className="h-20 rounded-lg bg-slate-950/20 border border-slate-900/40 opacity-40 cursor-default" />
        ))}

        {/* Day Cells (1-31) */}
        {Array.from({ length: totalDays }).map((_, i) => {
          const dayNum = i + 1;
          const dayBills = subByDay[dayNum] || [];
          const isToday = dayNum === 2;

          return (
            <div
              key={dayNum}
              onClick={() => setSelectedDay(dayNum)}
              className={`h-20 rounded-lg p-1.5 border flex flex-col justify-between transition-all cursor-pointer select-none group ${
                isToday
                  ? 'border-blue-500/80 bg-blue-950/30 shadow-md shadow-blue-500/10 hover:border-blue-400'
                  : dayBills.length > 0
                  ? 'border-slate-700 bg-slate-900/90 hover:border-slate-500 hover:bg-slate-800/80'
                  : 'border-slate-800/60 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/40'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className={isToday ? 'font-bold text-blue-400' : 'text-slate-400 group-hover:text-white'}>
                  {dayNum}
                </span>
                {isToday && <span className="text-[9px] bg-blue-500/20 text-blue-300 px-1 rounded">Today</span>}
                {dayBills.length > 1 && (
                  <span className="text-[9px] bg-slate-800 text-slate-300 px-1 rounded font-sans">
                    {dayBills.length} bills
                  </span>
                )}
              </div>

              {/* Bill Event Chips */}
              <div className="space-y-1 overflow-hidden max-h-12">
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
                      className={`flex items-center justify-between px-1.5 py-0.5 rounded border text-[10px] font-sans truncate ${chipColor}`}
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

      {/* Date Inspection & Multi-Bill Action Modal Popover - Portal to document.body */}
      {selectedDay !== null &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-2xl space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h4 className="text-sm font-semibold text-white">August {selectedDay}, 2026 Schedule</h4>
                  <p className="text-[11px] text-slate-400">
                    {activeDayBills.length === 0
                      ? 'No bills or subscriptions scheduled on this date.'
                      : `${activeDayBills.length} item(s) due on this date.`}
                  </p>
                </div>
                <button onClick={() => setSelectedDay(null)} className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer">
                  ✕
                </button>
              </div>

              {/* List of Bills Due on Selected Date */}
              {activeDayBills.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  <p>✨ No recurring payments due on August {selectedDay}.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {activeDayBills.map((sub) => (
                    <div
                      key={sub.id}
                      className="flex flex-col space-y-2 rounded-xl border border-slate-800 bg-slate-950 p-3.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{sub.icon}</span>
                          <div>
                            <h5 className="text-xs font-semibold text-white">{sub.name}</h5>
                            <span className="text-[10px] text-slate-400">{sub.category} • {sub.billingCycle}</span>
                          </div>
                        </div>

                        <div className="text-right font-mono">
                          <span className="text-xs font-bold text-white block">{formatCurrency(sub.cost)}</span>
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-sans font-semibold capitalize ${
                              sub.status === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : sub.status === 'due-soon'
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </div>
                      </div>

                      {/* Action buttons per bill */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          type="button"
                          onClick={() => removeSubscription(sub.id)}
                          className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                        >
                          ✕ Remove Bill
                        </button>

                        {sub.status !== 'paid' && (
                          <button
                            type="button"
                            onClick={() => markSubscriptionPaid(sub.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                          >
                            ✓ Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="rounded-lg border border-slate-800 px-4 py-1.5 text-xs text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
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
