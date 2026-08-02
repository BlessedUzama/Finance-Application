import type { Transaction } from '../types/finance';

export const exportTransactionsToCsv = (transactions: Transaction[], fileName = 'ApexFinance_Ledger_Export.csv') => {
  if (!transactions || transactions.length === 0) return;

  const headers = ['Date', 'Merchant', 'Category', 'Type', 'Status', 'Amount ($)'];

  const rows = transactions.map((t) => [
    `"${t.date}"`,
    `"${t.merchant.replace(/"/g, '""')}"`,
    `"${t.category.replace(/"/g, '""')}"`,
    `"${t.type}"`,
    `"${t.status}"`,
    t.amount.toFixed(2),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
