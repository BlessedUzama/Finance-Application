import React from 'react';
import { useFinance } from '../../context/FinanceContext';

// Helper function to format numbers as USD currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trendText?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  variant?: 'hero' | 'standard';
  badgeText?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trendText,
  trendType = 'positive',
  icon,
  variant = 'standard',
  badgeText,
}) => {
  const isHero = variant === 'hero';

  const trendColorClasses = {
    positive: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    negative: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700',
  }[trendType];

  return (
    <div
      className={`relative overflow-hidden rounded-xl border p-5 transition-all duration-300 hover:translate-y-[-2px] ${
        isHero
          ? 'border-blue-500/30 bg-gradient-to-br from-blue-950/40 via-slate-900/80 to-slate-900/90 shadow-lg shadow-blue-500/5 hover:border-blue-500/50'
          : 'border-slate-800 bg-slate-900/70 hover:border-slate-700 hover:bg-slate-900/90'
      }`}
    >
      {/* Background Subtle Accent Glow for Hero */}
      {isHero && (
        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
      )}

      {/* Card Header: Label & Icon */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            isHero
              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800/80 text-slate-300 border border-slate-700/50'
          }`}
        >
          {icon}
        </div>
      </div>

      {/* Main Monetary Value */}
      <div className="mt-3">
        <div className="text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
          {value}
        </div>
      </div>

      {/* Card Footer: Trend Badge & Subtitle */}
      <div className="mt-4 flex items-center justify-between gap-2">
        {trendText && (
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${trendColorClasses}`}
          >
            {trendType === 'positive' && '↑'}
            {trendType === 'negative' && '↓'}
            {trendText}
          </span>
        )}

        {badgeText && !trendText && (
          <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-800/60 px-2 py-0.5 text-xs font-medium text-slate-300">
            {badgeText}
          </span>
        )}

        {subtitle && (
          <span className="text-xs text-slate-500 truncate">{subtitle}</span>
        )}
      </div>
    </div>
  );
};

export const MetricsGrid: React.FC = () => {
  const { metrics } = useFinance();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Net Savings / Total Balance (Hero Card) */}
      <MetricCard
        title="Net Surplus / Savings"
        value={formatCurrency(metrics.netSavings)}
        subtitle="vs previous month"
        trendText="+8.2%"
        trendType={metrics.netSavings >= 0 ? 'positive' : 'negative'}
        variant="hero"
        icon={
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />

      {/* 2. Total Monthly Income */}
      <MetricCard
        title="Total Income"
        value={formatCurrency(metrics.totalIncome)}
        subtitle="2 sources active"
        trendText="+12.4%"
        trendType="positive"
        icon={
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />

      {/* 3. Total Monthly Expenses */}
      <MetricCard
        title="Total Expenses"
        value={formatCurrency(metrics.totalExpenses)}
        subtitle="6 categories active"
        trendText="-4.1%"
        trendType="positive" // Lower expenses is positive
        icon={
          <svg className="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
          </svg>
        }
      />

      {/* 4. Savings Target & Rate */}
      <MetricCard
        title="Savings Rate"
        value={`${metrics.savingsRate.toFixed(1)}%`}
        subtitle="Target: 30.0%"
        badgeText={metrics.savingsRate >= 30 ? 'Target Met' : 'On Track'}
        icon={
          <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
    </div>
  );
};
