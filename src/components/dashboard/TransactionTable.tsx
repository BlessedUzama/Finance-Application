import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { exportTransactions, type ExportFormat } from '../../utils/dataExport';
import { DataImportModal } from './DataImportModal';

type SortField = 'date' | 'merchant' | 'amount';
type SortOrder = 'asc' | 'desc';
type TypeFilter = 'all' | 'income' | 'expense';

export const TransactionTable: React.FC = () => {
  const {
    filteredTransactions,
    budgets,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    removeTransaction,
    setIsAddTransactionOpen,
    formatCurrency,
  } = useFinance();

  // Local Sort & Type Filter State
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('csv');
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);

  // Toggle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Compute Sorted and Type-Filtered Transactions
  const processedTransactions = useMemo(() => {
    let result = [...filteredTransactions];

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter((t) => t.type === typeFilter);
    }

    // Sort
    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (sortField === 'merchant') {
        valA = (valA || '').toLowerCase();
        valB = (valB || '').toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [filteredTransactions, typeFilter, sortField, sortOrder]);

  const handleExport = (fmt: ExportFormat) => {
    setExportFormat(fmt);
    exportTransactions(processedTransactions, fmt);
    setIsExportDropdownOpen(false);
  };

  return (
    <div id="transaction-history-table" className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Multi-Format Import Modal Dialog */}
      <DataImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} />

      {/* Header & Main Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Transaction History</h3>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-mono font-semibold text-blue-400 border border-slate-700">
              {processedTransactions.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Filter, sort, and inspect real-time transaction records.</p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Income / Expense Tabs */}
          <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setTypeFilter('all')}
              className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                typeFilter === 'all' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                typeFilter === 'income' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`rounded-md px-2.5 py-1 transition-all cursor-pointer ${
                typeFilter === 'expense' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Expenses
            </button>
          </div>

          {/* Category Dropdown Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {budgets.map((b) => (
              <option key={b.id} value={b.category}>
                {b.category}
              </option>
            ))}
            <option value="Salary">Salary</option>
            <option value="Freelance">Freelance</option>
          </select>

          {/* Table Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-32 sm:w-40 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1.5 text-xs text-slate-500 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Multi-Format Import Button */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
            title="Import CSV, JSON, TSV, or TXT File"
          >
            📥 Import
          </button>

          {/* Multi-Format Export Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
              className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1"
              title="Select Export Format"
            >
              <span>📤 Export ({exportFormat.toUpperCase()})</span>
              <span className="text-[10px]">▼</span>
            </button>

            {isExportDropdownOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 rounded-xl border border-slate-800 bg-slate-950 p-1.5 shadow-xl z-50 space-y-1 text-xs font-mono">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>PDF (.pdf)</span>
                  <span className="text-[10px] text-rose-400 font-semibold">Statement</span>
                </button>
                <button
                  onClick={() => handleExport('csv')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>CSV (.csv)</span>
                  <span className="text-[10px] text-blue-400">Excel</span>
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>JSON (.json)</span>
                  <span className="text-[10px] text-purple-400">Data</span>
                </button>
                <button
                  onClick={() => handleExport('txt')}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Text (.txt)</span>
                  <span className="text-[10px] text-emerald-400">Report</span>
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsAddTransactionOpen(true)}
            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Transaction Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/80 bg-slate-950/40">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/80 uppercase tracking-wider text-[11px] text-slate-400 font-semibold select-none">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  {sortField === 'date' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
              <th
                onClick={() => handleSort('merchant')}
                className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Merchant / Source</span>
                  {sortField === 'merchant' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Status</th>
              <th
                onClick={() => handleSort('amount')}
                className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  {sortField === 'amount' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
            {processedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 space-y-2">
                  <p className="text-sm font-medium text-slate-300">No matching transactions found</p>
                  <p className="text-xs text-slate-500">
                    {searchQuery ? `No results for "${searchQuery}"` : 'Try clearing your active filters.'}
                  </p>
                  {(searchQuery || selectedCategory !== 'all' || typeFilter !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                        setTypeFilter('all');
                      }}
                      className="mt-2 inline-flex items-center rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Clear Filters & Search
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              processedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 font-mono text-slate-400">{tx.date}</td>
                  <td className="py-3.5 px-4 font-medium text-white">
                    <div className="flex items-center gap-2.5">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                        tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tx.type === 'income' ? '⇣' : '⇡'}
                      </span>
                      <span>{tx.merchant}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        tx.status === 'completed'
                          ? 'bg-slate-800/80 text-slate-300 border border-slate-700'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono font-semibold tabular-nums ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => removeTransaction(tx.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors text-xs cursor-pointer opacity-0 group-hover:opacity-100 p-1"
                      title="Delete Entry"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
