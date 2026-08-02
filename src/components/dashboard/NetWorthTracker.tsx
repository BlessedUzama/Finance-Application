import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useFinance } from '../../context/FinanceContext';

export const NetWorthTracker: React.FC = () => {
  const {
    assets,
    liabilities,
    totalAssets,
    totalLiabilities,
    netWorth,
    addAsset,
    removeAsset,
    addLiability,
    removeLiability,
    formatCurrency,
  } = useFinance();

  // Modals state
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [isAddLiabilityOpen, setIsAddLiabilityOpen] = useState(false);

  // Asset Form State
  const [assetName, setAssetName] = useState('');
  const [assetValue, setAssetValue] = useState('');
  const [assetCategory, setAssetCategory] = useState<'Cash & Savings' | 'Investments' | 'Real Estate' | 'Vehicles' | 'Crypto & Other'>('Investments');
  const [assetIcon, setAssetIcon] = useState('📈');

  // Liability Form State
  const [liabilityName, setLiabilityName] = useState('');
  const [liabilityAmount, setLiabilityAmount] = useState('');
  const [liabilityCategory, setLiabilityCategory] = useState<'Credit Cards' | 'Mortgages' | 'Student Loans' | 'Auto Loans' | 'Other Debt'>('Credit Cards');
  const [liabilityIcon, setLiabilityIcon] = useState('💳');

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName || !assetValue || isNaN(Number(assetValue))) return;

    addAsset({
      name: assetName,
      value: Number(assetValue),
      category: assetCategory,
      icon: assetIcon,
    });

    setAssetName('');
    setAssetValue('');
    setIsAddAssetOpen(false);
  };

  const handleLiabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liabilityName || !liabilityAmount || isNaN(Number(liabilityAmount))) return;

    addLiability({
      name: liabilityName,
      amount: Number(liabilityAmount),
      category: liabilityCategory,
      icon: liabilityIcon,
    });

    setLiabilityName('');
    setLiabilityAmount('');
    setIsAddLiabilityOpen(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 backdrop-blur-md space-y-3.5 shadow-xl">
      {/* Top Header & Net Worth Gauge Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white">Net Worth & Portfolio Balance Sheet</h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-emerald-400 border border-emerald-500/20">
              Live Balance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Total Assets (Owned) minus Total Liabilities (Owed).
          </p>
        </div>

        {/* Compact Net Worth Summary Bar */}
        <div className="flex items-center gap-3 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 font-mono text-xs">
          <div>
            <span className="text-slate-500 text-[9px] block">ASSETS (+)</span>
            <span className="text-emerald-400 font-bold">{formatCurrency(totalAssets)}</span>
          </div>

          <div className="h-5 w-px bg-slate-800" />

          <div>
            <span className="text-slate-500 text-[9px] block">LIABILITIES (-)</span>
            <span className="text-rose-400 font-bold">{formatCurrency(totalLiabilities)}</span>
          </div>

          <div className="h-5 w-px bg-slate-800" />

          <div className="bg-blue-600/20 px-2.5 py-0.5 rounded border border-blue-500/30">
            <span className="text-blue-300 text-[9px] block font-sans font-semibold">NET WORTH</span>
            <span className="text-white font-bold text-xs">{formatCurrency(netWorth)}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Split with 2-Column Subgrids for Compact Height */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Assets Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💎</span>
              <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Assets ({assets.length})
              </h4>
            </div>
            <button
              onClick={() => setIsAddAssetOpen(true)}
              className="rounded-lg bg-emerald-600/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer"
            >
              + Add Asset
            </button>
          </div>

          {/* Subgrid of Asset Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="group flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 px-2.5 py-2 hover:border-slate-700 hover:bg-slate-900/60 transition-all"
              >
                <div className="flex items-center gap-2 truncate max-w-[120px]">
                  <span className="text-sm">{asset.icon}</span>
                  <div className="truncate">
                    <h5 className="text-[11px] font-semibold text-white truncate">{asset.name}</h5>
                    <span className="text-[9px] text-slate-400 block truncate">{asset.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[11px] text-emerald-400">
                    +{formatCurrency(asset.value)}
                  </span>
                  <button
                    onClick={() => removeAsset(asset.id)}
                    className="text-slate-500 hover:text-rose-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    title="Delete Asset"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Liabilities Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs">💳</span>
              <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider">
                Liabilities ({liabilities.length})
              </h4>
            </div>
            <button
              onClick={() => setIsAddLiabilityOpen(true)}
              className="rounded-lg bg-rose-600/20 px-2 py-0.5 text-[11px] font-semibold text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
            >
              + Add Liability
            </button>
          </div>

          {/* Subgrid of Liability Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {liabilities.map((item) => (
              <div
                key={item.id}
                className="group flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 px-2.5 py-2 hover:border-slate-700 hover:bg-slate-900/60 transition-all"
              >
                <div className="flex items-center gap-2 truncate max-w-[120px]">
                  <span className="text-sm">{item.icon}</span>
                  <div className="truncate">
                    <h5 className="text-[11px] font-semibold text-white truncate">{item.name}</h5>
                    <span className="text-[9px] text-slate-400 block truncate">{item.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[11px] text-rose-400">
                    -{formatCurrency(item.amount)}
                  </span>
                  <button
                    onClick={() => removeLiability(item.id)}
                    className="text-slate-500 hover:text-rose-400 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                    title="Delete Liability"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Asset Modal - React Portal */}
      {isAddAssetOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-semibold text-white">Add Asset Item</h4>
                <button onClick={() => setIsAddAssetOpen(false)} className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleAssetSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Asset Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Robinhood Portfolio, Savings Account"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Estimated Value ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="15000"
                      value={assetValue}
                      onChange={(e) => setAssetValue(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                    <select
                      value={assetCategory}
                      onChange={(e) => setAssetCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Cash & Savings">Cash & Savings</option>
                      <option value="Investments">Investments</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Crypto & Other">Crypto & Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    required
                    value={assetIcon}
                    onChange={(e) => setAssetIcon(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddAssetOpen(false)}
                    className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    Save Asset
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Add Liability Modal - React Portal */}
      {isAddLiabilityOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="text-sm font-semibold text-white">Add Liability / Debt Item</h4>
                <button onClick={() => setIsAddLiabilityOpen(false)} className="text-slate-400 hover:text-white text-xs p-1 cursor-pointer">
                  ✕
                </button>
              </div>

              <form onSubmit={handleLiabilitySubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Liability Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chase Sapphire Reserve, Car Loan"
                    value={liabilityName}
                    onChange={(e) => setLiabilityName(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Owed Amount ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="3500"
                      value={liabilityAmount}
                      onChange={(e) => setLiabilityAmount(e.target.value)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                    <select
                      value={liabilityCategory}
                      onChange={(e) => setLiabilityCategory(e.target.value as any)}
                      className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none cursor-pointer"
                    >
                      <option value="Credit Cards">Credit Cards</option>
                      <option value="Mortgages">Mortgages</option>
                      <option value="Student Loans">Student Loans</option>
                      <option value="Auto Loans">Auto Loans</option>
                      <option value="Other Debt">Other Debt</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    required
                    value={liabilityIcon}
                    onChange={(e) => setLiabilityIcon(e.target.value)}
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsAddLiabilityOpen(false)}
                    className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 shadow-md shadow-rose-600/20 transition-all cursor-pointer"
                  >
                    Save Liability
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
