/* src/components/dashboard/storefronts/editor/capabilities/menu-card/MenuCardAddons.tsx */
'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';

interface Addon {
  name: string;
  price: string;
}

interface MenuCardAddonsProps {
  addons: Addon[];
  copy: any;
  onChange: (updated: Addon[]) => void;
}

export default function MenuCardAddons({ addons, copy, onChange }: MenuCardAddonsProps) {
  const handleAdd = () => onChange([...addons, { name: '', price: '' }]);

  const handleUpdate = (idx: number, field: keyof Addon, value: string) => {
    const next = [...addons];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  const handleRemove = (idx: number) => {
    onChange(addons.filter((_, i) => i !== idx));
  };

  return (
    <div className="pt-1.5 border-t border-zinc-800/60 space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
          {copy.OPTIONS_LABEL}
        </span>
        <button
          type="button"
          onClick={handleAdd}
          className="text-[9px] font-bold text-fuchsia-500 hover:text-fuchsia-400 flex items-center gap-1 uppercase tracking-widest transition-colors cursor-pointer"
        >
          <Plus size={10} /> {copy.ADD_OPTION_BTN}
        </button>
      </div>

      {addons.length > 0 && (
        <div className="space-y-1.5">
          {addons.map((addon, idx) => (
            <div key={idx} className="flex gap-1.5 items-center">
              <input
                placeholder={copy.OPTION_NAME_PLACEHOLDER}
                value={addon.name || ''}
                onChange={(e) => handleUpdate(idx, 'name', e.target.value)}
                className="flex-1 min-w-0 bg-black/50 border border-zinc-800 rounded px-2 py-1 text-[10px] text-white focus:border-fuchsia-500 outline-none"
              />
              <input
                placeholder={copy.OPTION_PRICE_PLACEHOLDER}
                value={addon.price || ''}
                onChange={(e) => handleUpdate(idx, 'price', e.target.value)}
                className="w-20 shrink-0 bg-black/50 border border-zinc-800 rounded px-2 py-1 text-[10px] font-mono text-fuchsia-400 focus:border-fuchsia-500 outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="text-zinc-600 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}