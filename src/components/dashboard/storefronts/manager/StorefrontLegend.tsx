/* src/components/dashboard/storefronts/manager/StorefrontLegend.tsx */
import React from 'react';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

export default function StorefrontLegend() {
  const copy = STOREFRONT_MANAGER_COPY.LEGEND;

  return (
    <div className="flex flex-wrap items-center gap-4 px-3 py-3 mb-6 border border-zinc-800/50 bg-zinc-900/30 rounded-lg">
      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">{copy.TITLE}</span>
      
      {copy.ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${item.color}`}></span>
          <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{item.label}</span>
        </div>
      ))}
    </div>
  );
}