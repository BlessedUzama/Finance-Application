import type { Transaction } from '../types/finance';

export type ExportFormat = 'csv' | 'json' | 'txt';

export const exportTransactions = (
  transactions: Transaction[],
  format: ExportFormat = 'csv',
  fileNamePrefix = 'ApexFinance_Ledger'
) => {
  if (!transactions || transactions.length === 0) return;

  const timestamp = new Date().toISOString().split('T')[0];
  let fileContent = '';
  let mimeType = '';
  let extension = format;

  if (format === 'csv') {
    mimeType = 'text/csv;charset=utf-8;';
    const headers = ['Date', 'Merchant', 'Category', 'Type', 'Status', 'Amount ($)'];
    const rows = transactions.map((t) => [
      `"${t.date}"`,
      `"${(t.merchant || '').replace(/"/g, '""')}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${t.type}"`,
      `"${t.status}"`,
      t.amount.toFixed(2),
    ]);
    fileContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  } else if (format === 'json') {
    mimeType = 'application/json;charset=utf-8;';
    const exportData = transactions.map(({ id, date, merchant, category, amount, type, status }) => ({
      id,
      date,
      merchant,
      category,
      amount,
      type,
      status,
    }));
    fileContent = JSON.stringify(exportData, null, 2);
  } else if (format === 'txt') {
    mimeType = 'text/plain;charset=utf-8;';
    const lines = [
      '======================================================',
      '               APEXFINANCE PRO LEDGER EXPORT           ',
      `               Generated: ${new Date().toLocaleString()}`,
      '======================================================',
      '',
      ...transactions.map(
        (t) =>
          `[${t.date}] ${t.merchant.padEnd(25)} | ${t.category.padEnd(20)} | ${t.type.toUpperCase().padEnd(7)} | ${t.status.padEnd(9)} | $${t.amount.toFixed(2)}`
      ),
      '',
      '======================================================',
      `TOTAL RECORDS: ${transactions.length}`,
      '======================================================',
    ];
    fileContent = lines.join('\n');
  }

  const blob = new Blob([fileContent], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileNamePrefix}_${timestamp}.${extension}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
