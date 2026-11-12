/* src/components/dashboard/storefronts/manager/StorefrontLegend.tsx */
'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

export default function StorefrontLegend() {
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const copy = STOREFRONT_MANAGER_COPY.LEGEND;

  return (
    <div className="mb-5 border border-zinc-800/50 bg-zinc-900/30 rounded-lg overflow-hidden">
      {/* Mobile Toggle Header */}
      <button
        type="button"
        onClick={() => setIsOpenMobile(!isOpenMobile)}
        className="md:hidden w-full flex items-center justify-between px-3.5 py-2.5 text-left cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{copy.TITLE}</span>
          <div className="flex items-center gap-1.5 ml-1">
            {copy.ITEMS.map((item) => (
              <span key={item.label} className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
            ))}
          </div>
        </div>
        <ChevronDown size={14} className={`text-zinc-500 transition-transform duration-200 ${isOpenMobile ? 'rotate-180' : ''}`} />
      </button>

      {/* Legend Items (Always visible on md+, toggleable on mobile) */}
      <div className={`${isOpenMobile ? 'grid grid-cols-2 gap-2.5 p-3.5 pt-1 border-t border-zinc-800/40' : 'hidden'} md:flex md:flex-wrap md:items-center md:gap-4 md:px-3.5 md:py-3 md:border-none`}>
        <span className="hidden md:inline text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">{copy.TITLE}</span>
        
        {copy.ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full shrink-0 ${item.color}`}></span>
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest truncate">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}