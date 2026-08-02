import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

const CASH_FLOW_HISTORICAL_DATA = [
  { month: 'Mar', income: 4800, expenses: 2400 },
  { month: 'Apr', income: 5100, expenses: 2650 },
  { month: 'May', income: 4900, expenses: 2100 },
  { month: 'Jun', income: 5400, expenses: 2900 },
  { month: 'Jul', income: 6050, expenses: 2701 },
];

export const CashFlowChart: React.FC = () => {
  const { metrics, budgetProgress, formatCurrency } = useFinance();
  const [activeTab, setActiveTab] = useState<'trend' | 'breakdown'>('trend');

  // Prepare Category Donut Chart Data
  const pieChartData = budgetProgress.map((item) => ({
    name: item.category,
    value: item.spentAmount,
    color: item.color || '#3B82F6',
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 shadow-xl text-xs space-y-1 font-sans">
          <p className="font-semibold text-slate-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-mono font-medium">
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Header & Toggle Controls */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-white">Visual Analytics</h3>
          <p className="text-xs text-slate-400">Cashflow trajectory & expense category distribution.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('trend')}
            className={`rounded-md px-3 py-1 transition-all cursor-pointer ${
              activeTab === 'trend'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cashflow Trend
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`rounded-md px-3 py-1 transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Breakdown
          </button>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="h-64 w-full pt-2">
        {activeTab === 'trend' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CASH_FLOW_HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="income"
                name="Income"
                stroke="#10B981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#incomeGrad)"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                name="Expenses"
                stroke="#F43F5E"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#expenseGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#090d16" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Category Donut Legend */}
            <div className="flex flex-col gap-1.5 pl-4 text-xs font-medium">
              {pieChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 truncate max-w-[100px]">{item.name}</span>
                  <span className="font-mono text-slate-400">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 text-xs text-slate-400">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Avg Income: {formatCurrency(5250)}/mo</span>
        </span>
        <span>Net Balance Ratio: {metrics.savingsRate.toFixed(1)}%</span>
      </div>
    </div>
  );
};
