import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Transaction } from '../types/finance';

export type ExportFormat = 'csv' | 'json' | 'txt' | 'pdf';

export const exportTransactions = (
  transactions: Transaction[],
  format: ExportFormat = 'csv',
  fileNamePrefix = 'ApexFinance_Ledger'
) => {
  if (!transactions || transactions.length === 0) return;

  const timestamp = new Date().toISOString().split('T')[0];

  // 1. PDF Export Format
  if (format === 'pdf') {
    const doc = new jsPDF();

    // Document Branding Header
    doc.setFillColor(15, 23, 42); // #0f172a slate
    doc.rect(0, 0, 210, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('ApexFinance PRO', 14, 14);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(`Official Transaction Ledger Statement • Generated: ${new Date().toLocaleString()}`, 14, 21);

    // Summary Statistics
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Records: ${transactions.length} | Inflow: +$${totalIncome.toFixed(2)} | Outflow: -$${totalExpenses.toFixed(2)}`, 14, 35);

    // Table Columns & Rows
    const tableColumns = ['Date', 'Merchant / Source', 'Category', 'Type', 'Status', 'Amount ($)'];
    const tableRows = transactions.map((t) => [
      t.date,
      t.merchant,
      t.category,
      t.type.toUpperCase(),
      t.status.toUpperCase(),
      `${t.type === 'income' ? '+' : '-'} $${t.amount.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 40,
      head: [tableColumns],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59], // slate-800
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [51, 65, 85],
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252],
      },
    });

    doc.save(`${fileNamePrefix}_${timestamp}.pdf`);
    return;
  }

  // 2. CSV, JSON, and TXT Formats
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
