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
import { formatCurrency } from './MetricsGrid';

const CASH_FLOW_HISTORICAL_DATA = [
  { month: 'Mar', income: 4800, expenses: 2400 },
  { month: 'Apr', income: 5100, expenses: 2650 },
  { month: 'May', income: 4900, expenses: 2100 },
  { month: 'Jun', income: 5400, expenses: 2900 },
  { month: 'Jul', income: 6050, expenses: 2701 },
];

export const CashFlowChart: React.FC = () => {
  const { metrics, budgetProgress } = useFinance();
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
            <p key={index} className="font-mono text-slate-200" style={{ color: entry.color }}>
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
      {/* Chart Header & Tab Toggles */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">Visual Analytics</h3>
          <p className="text-xs text-slate-400">Cashflow dynamics and expense allocation charts.</p>
        </div>

        <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveTab('trend')}
            className={`rounded-md px-3 py-1 transition-all cursor-pointer ${
              activeTab === 'trend'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Income vs Expense Trend
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`rounded-md px-3 py-1 transition-all cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Category Donut
          </button>
        </div>
      </div>

      {/* Chart Body Container */}
      <div className="h-64 w-full pt-2">
        {activeTab === 'trend' ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={CASH_FLOW_HISTORICAL_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" name="Income" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#incomeGrad)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#EF4444" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between h-full gap-4">
            <div className="h-56 w-full md:w-1/2">
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
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Legend */}
            <div className="w-full md:w-1/2 space-y-2 text-xs">
              {pieChartData.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-300 truncate max-w-[130px]">{item.name}</span>
                  </div>
                  <span className="font-mono text-white font-semibold">{formatCurrency(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-slate-400">Net Surplus Ratio:</span>
          <span className="font-mono text-emerald-400 font-bold">{metrics.savingsRate.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-2 justify-end">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="text-slate-400">Total Inflow:</span>
          <span className="font-mono text-white font-bold">{formatCurrency(metrics.totalIncome)}</span>
        </div>
      </div>
    </div>
  );
};
