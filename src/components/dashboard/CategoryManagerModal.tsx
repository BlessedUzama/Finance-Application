import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose }) => {
  const { addBudgetCategory } = useFinance();
  const [categoryName, setCategoryName] = useState('');
  const [allocatedAmount, setAllocatedAmount] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('🏷️');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName || !allocatedAmount || isNaN(Number(allocatedAmount))) return;

    addBudgetCategory({
      category: categoryName,
      allocatedAmount: Number(allocatedAmount),
      color,
      icon,
    });

    setCategoryName('');
    setAllocatedAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
              🏷️
            </span>
            <h4 className="text-base font-semibold text-white">Create Custom Category</h4>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-sm p-1">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Category Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Travel, Investments, Subscriptions"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Monthly Cap ($)</label>
              <input
                type="number"
                step="50"
                required
                placeholder="500"
                value={allocatedAmount}
                onChange={(e) => setAllocatedAmount(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Category Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="h-8 w-12 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs font-mono text-slate-300 uppercase">{color}</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Icon Emoji</label>
            <input
              type="text"
              required
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-800 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
            >
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
