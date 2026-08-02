import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import type { Transaction, TransactionType, TransactionStatus } from '../../types/finance';
import { formatCurrency } from './MetricsGrid';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({ isOpen, onClose }) => {
  const { importTransactions, budgets } = useFinance();
  const [parsedRows, setParsedRows] = useState<Omit<Transaction, 'id'>[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [detectedFormat, setDetectedFormat] = useState<string>('');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');
    setParsedRows([]);

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = (event.target?.result as string) || '';
        if (!text.trim()) {
          setErrorMsg('File is empty or contains no data.');
          return;
        }

        let parsed: Omit<Transaction, 'id'>[] = [];

        // 1. JSON Format Parser
        if (fileExt === 'json' || text.trim().startsWith('[') || text.trim().startsWith('{')) {
          setDetectedFormat('JSON');
          const json = JSON.parse(text);
          const list = Array.isArray(json) ? json : json.transactions || [json];

          parsed = list.map((item: any) => ({
            date: item.date || new Date().toISOString().split('T')[0],
            merchant: item.merchant || item.name || item.payee || 'Imported Entry',
            category: item.category || budgets[0]?.category || 'General',
            amount: Math.abs(parseFloat(item.amount || item.value || 0)) || 0,
            type: (item.type || 'expense').toLowerCase().includes('income') ? 'income' : 'expense',
            status: (item.status || 'completed').toLowerCase().includes('pending') ? 'pending' : 'completed',
          }));
        } 
        // 2. CSV / TSV / Delimited Text Parser
        else {
          const isTsv = fileExt === 'tsv' || text.includes('\t');
          const delimiter = isTsv ? '\t' : ',';
          setDetectedFormat(isTsv ? 'TSV' : 'CSV/TXT');

          const lines = text.split(/\r\n|\n/).map((l) => l.trim()).filter((l) => l.length > 0);
          if (lines.length === 0) {
            setErrorMsg('No valid data lines found in file.');
            return;
          }

          // Header detection
          const firstLine = lines[0].toLowerCase();
          const hasHeaders = firstLine.includes('date') || firstLine.includes('merchant') || firstLine.includes('amount');
          const startIndex = hasHeaders ? 1 : 0;

          const headers = hasHeaders ? firstLine.split(delimiter).map((h) => h.replace(/["']/g, '').trim()) : [];
          
          const dateIdx = headers.findIndex((h) => h.includes('date'));
          const merchantIdx = headers.findIndex((h) => h.includes('merchant') || h.includes('payee') || h.includes('description') || h.includes('name'));
          const categoryIdx = headers.findIndex((h) => h.includes('category'));
          const amountIdx = headers.findIndex((h) => h.includes('amount') || h.includes('value') || h.includes('price'));
          const typeIdx = headers.findIndex((h) => h.includes('type'));
          const statusIdx = headers.findIndex((h) => h.includes('status'));

          for (let i = startIndex; i < lines.length; i++) {
            const cols = lines[i].split(delimiter).map((c) => c.replace(/["']/g, '').trim());
            if (cols.length < 2) continue;

            const merchant = merchantIdx !== -1 ? cols[merchantIdx] : cols[1] || cols[0] || 'Imported Entry';
            const amountRaw = amountIdx !== -1 ? cols[amountIdx] : cols[cols.length - 1] || '0';
            const numAmount = Math.abs(parseFloat(amountRaw.replace(/[^0-9.-]+/g, '')) || 0);

            let rawType: TransactionType = 'expense';
            if (typeIdx !== -1 && cols[typeIdx]) {
              rawType = cols[typeIdx].toLowerCase().includes('income') ? 'income' : 'expense';
            }

            let rawStatus: TransactionStatus = 'completed';
            if (statusIdx !== -1 && cols[statusIdx]) {
              rawStatus = cols[statusIdx].toLowerCase().includes('pending') ? 'pending' : 'completed';
            }

            const category = categoryIdx !== -1 && cols[categoryIdx] ? cols[categoryIdx] : (budgets[0]?.category || 'General');
            const date = dateIdx !== -1 && cols[dateIdx] ? cols[dateIdx] : (cols[0]?.match(/^\d{4}-\d{2}-\d{2}$/) ? cols[0] : new Date().toISOString().split('T')[0]);

            if (numAmount > 0 || merchant) {
              parsed.push({
                date,
                merchant,
                category,
                amount: numAmount,
                type: rawType,
                status: rawStatus,
              });
            }
          }
        }

        if (parsed.length === 0) {
          setErrorMsg('No valid transactions could be parsed from the file format.');
        } else {
          setParsedRows(parsed);
        }
      } catch (err) {
        setErrorMsg('Failed to process file. Supported formats are CSV, JSON, TSV, and TXT.');
      }
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (parsedRows.length > 0) {
      importTransactions(parsedRows);
      setParsedRows([]);
      setFileName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              📥
            </span>
            <h4 className="text-base font-semibold text-white">Import Statement / Ledger Data</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-sm p-1">
            ✕
          </button>
        </div>

        {/* Accepted Formats Pill List */}
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
          <span>Accepted formats:</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-blue-400 font-semibold border border-slate-700">.CSV</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-purple-400 font-semibold border border-slate-700">.JSON</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-emerald-400 font-semibold border border-slate-700">.TSV</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-amber-400 font-semibold border border-slate-700">.TXT</span>
        </div>

        {/* File Dropzone */}
        <div className="border-2 border-dashed border-slate-800 rounded-xl bg-slate-950/60 p-6 text-center hover:border-slate-700 transition-colors">
          <input
            type="file"
            accept=".csv,.json,.tsv,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="multi-format-file-input"
          />
          <label htmlFor="multi-format-file-input" className="cursor-pointer space-y-2 block">
            <span className="text-2xl block">📁</span>
            <span className="text-xs font-semibold text-blue-400 hover:text-blue-300 block">
              {fileName ? `Selected (${detectedFormat}): ${fileName}` : 'Click to select or drag & drop file'}
            </span>
            <span className="text-[10px] text-slate-500 block">
              Auto-detects CSV, JSON arrays, TSV, or tab-delimited text statements
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-400">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Parsed Rows Preview */}
        {parsedRows.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Parsed Transactions Preview ({parsedRows.length} Rows)</span>
              <span className="text-[10px] text-emerald-400 font-mono">Format: {detectedFormat}</span>
            </div>
            <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-800 bg-slate-950 p-2 divide-y divide-slate-800/60 text-xs font-mono">
              {parsedRows.map((row, index) => (
                <div key={index} className="flex items-center justify-between py-1.5 px-2">
                  <div className="truncate max-w-[220px]">
                    <span className="text-white block font-sans font-medium">{row.merchant}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{row.date} • {row.category}</span>
                  </div>
                  <span className={row.type === 'income' ? 'text-emerald-400 font-semibold' : 'text-slate-200'}>
                    {row.type === 'income' ? '+' : '-'} {formatCurrency(row.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={parsedRows.length === 0}
            onClick={handleConfirmImport}
            className={`rounded-lg px-4 py-2 text-xs font-semibold text-white shadow-md transition-all ${
              parsedRows.length > 0
                ? 'bg-blue-600 hover:bg-blue-500 cursor-pointer shadow-blue-600/20'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Import {parsedRows.length > 0 ? `${parsedRows.length} Transactions` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
