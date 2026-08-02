import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { BudgetTracker } from './components/dashboard/BudgetTracker';
import { CashFlowChart } from './components/dashboard/CashFlowChart';
import { TransactionTable } from './components/dashboard/TransactionTable';

export default function App() {
  return (
    <FinanceProvider>
      <DashboardLayout
        metricsSlot={<MetricsGrid />}
        budgetTrackerSlot={<BudgetTracker />}
        analyticsChartSlot={<CashFlowChart />}
        transactionTableSlot={<TransactionTable />}
      />
    </FinanceProvider>
  );
}
