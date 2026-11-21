/* src/components/dashboard/storefronts/editor/logistics/PolicyRuleRates.tsx */
'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Fee } from './logisticsConfig';

interface PolicyRuleRatesProps {
  fees: Fee[];
  label: string;
  addBtnLabel: string;
  namePlaceholder: string;
  pricePlaceholder: string;
  removeTitle: string;
  onChange: (updated: Fee[]) => void;
}

export default function PolicyRuleRates({
  fees,
  label,
  addBtnLabel,
  namePlaceholder,
  pricePlaceholder,
  removeTitle,
  onChange,
}: PolicyRuleRatesProps) {
  const handleAdd = () => onChange([...fees, { name: '', price: '' }]);

  const handleUpdate = (idx: number, field: keyof Fee, value: string) => {
    const next = [...fees];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    onChange(fees.filter((_, i) => i !== idx));
  };

  return (
    <div className="pt-2 border-t border-zinc-800/60 space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{label}</label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
        >
          <Plus size={10} /> {addBtnLabel}
        </button>
      </div>

      {fees.length > 0 && (
        <div className="space-y-1.5">
          {fees.map((fee, fIdx) => (
            <div key={fIdx} className="flex items-center gap-1.5">
              <input
                value={fee.name}
                onChange={(e) => handleUpdate(fIdx, 'name', e.target.value)}
                placeholder={namePlaceholder}
                className="flex-1 min-w-0 bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white text-xs focus:border-indigo-500 outline-none"
              />
              <input
                value={fee.price}
                onChange={(e) => handleUpdate(fIdx, 'price', e.target.value)}
                placeholder={pricePlaceholder}
                className="w-24 shrink-0 bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-indigo-400 font-mono font-bold text-xs focus:border-indigo-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemove(fIdx)}
                className="p-1 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                title={removeTitle}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}