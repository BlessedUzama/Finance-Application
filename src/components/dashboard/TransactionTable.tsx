import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { formatCurrency } from './MetricsGrid';

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
    addTransaction,
  } = useFinance();

  // Local Sort & Type Filter State
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  // Add Transaction Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMerchant, setNewMerchant] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState(budgets[0]?.category || 'Housing & Utilities');
  const [newType, setNewType] = useState<'income' | 'expense'>('expense');
  const [newStatus, setNewStatus] = useState<'completed' | 'pending'>('completed');

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
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [filteredTransactions, typeFilter, sortField, sortOrder]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMerchant || !newAmount || isNaN(Number(newAmount))) return;

    addTransaction({
      date: new Date().toISOString().split('T')[0],
      merchant: newMerchant,
      category: newCategory,
      amount: Number(newAmount),
      type: newType,
      status: newStatus,
    });

    setNewMerchant('');
    setNewAmount('');
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-4 shadow-xl">
      {/* Header & Main Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Transaction History</h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-mono font-semibold text-slate-300 border border-slate-700">
              {processedTransactions.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Filter, sort, and inspect real-time transaction records.</p>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
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
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none cursor-pointer"
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

          {/* Quick Search */}
          <input
            type="text"
            placeholder="Search merchant or amount..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-40 sm:w-48 rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none"
          />

          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-950/80 uppercase tracking-wider text-[11px] text-slate-400 font-semibold select-none">
            <tr>
              <th
                onClick={() => handleSort('date')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Date</span>
                  {sortField === 'date' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
              <th
                onClick={() => handleSort('merchant')}
                className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Merchant / Source</span>
                  {sortField === 'merchant' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th
                onClick={() => handleSort('amount')}
                className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Amount</span>
                  {sortField === 'amount' && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
                </div>
              </th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/30">
            {processedTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-500">
                  No matching transactions found. Try adjusting your search query or filters.
                </td>
              </tr>
            ) : (
              processedTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-slate-800/50 transition-colors group"
                >
                  <td className="py-3 px-4 font-mono text-slate-400">{tx.date}</td>
                  <td className="py-3 px-4 font-medium text-white">
                    <div className="flex items-center gap-2">
                      <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] ${
                        tx.type === 'income' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {tx.type === 'income' ? '⇣' : '⇡'}
                      </span>
                      <span>{tx.merchant}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center rounded-md bg-slate-800/80 px-2 py-0.5 text-[11px] font-medium text-slate-300 border border-slate-700/60">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
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
                    className={`py-3 px-4 text-right font-mono font-semibold tabular-nums ${
                      tx.type === 'income' ? 'text-emerald-400' : 'text-slate-100'
                    }`}
                  >
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 px-4 text-center">
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

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-base font-semibold text-white">Add New Ledger Entry</h4>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Merchant / Source</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whole Foods, Monthly Salary"
                  value={newMerchant}
                  onChange={(e) => setNewMerchant(e.target.value)}
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newAmount}
                    onChange={(e) => setNewAmount(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Entry Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as 'income' | 'expense')}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    {budgets.map((b) => (
                      <option key={b.id} value={b.category}>
                        {b.category}
                      </option>
                    ))}
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as 'completed' | 'pending')}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
