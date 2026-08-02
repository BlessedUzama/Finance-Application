import React from 'react';
import { FinanceProvider } from './context/FinanceContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { MetricsGrid } from './components/dashboard/MetricsGrid';
import { BudgetTracker } from './components/dashboard/BudgetTracker';
import { CashFlowChart } from './components/dashboard/CashFlowChart';
import { SavingsGoals } from './components/dashboard/SavingsGoals';
import { SubscriptionsMonitor } from './components/dashboard/SubscriptionsMonitor';
import { BillCalendar } from './components/dashboard/BillCalendar';
import { TransactionTable } from './components/dashboard/TransactionTable';

export const App: React.FC = () => {
  return (
    <FinanceProvider>
      <DashboardLayout
        metricsSlot={<MetricsGrid />}
        budgetTrackerSlot={<BudgetTracker />}
        analyticsChartSlot={<CashFlowChart />}
        savingsGoalsSlot={<SavingsGoals />}
        subscriptionsSlot={<SubscriptionsMonitor />}
        billCalendarSlot={<BillCalendar />}
        transactionTableSlot={<TransactionTable />}
      />
    </FinanceProvider>
  );
};

export default App;
