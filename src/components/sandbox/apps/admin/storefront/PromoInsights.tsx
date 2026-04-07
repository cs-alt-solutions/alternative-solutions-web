'use client';

import React from 'react';
import { TrendingDown, ChevronRight } from 'lucide-react';

export default function PromoInsights({ overstockCandidates, openEditor }: any) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-[2.5rem] p-6 shadow-xl flex flex-col h-full">
      <div className="flex items-center justify-between mb-6 shrink-0">
         <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
           <TrendingDown size={16} className="text-cyan-400"/> Promo Candidates
         </h3>
         <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">High Stock Alerts</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 pb-2">
        {overstockCandidates && overstockCandidates.length > 0 ? overstockCandidates.map((item: any) => {
          const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
          
          return (
            <div key={item.id} className="flex flex-col bg-zinc-950 border border-zinc-800 p-4 rounded-2xl transition-colors hover:border-zinc-700">
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col pr-2">
                  <span className="text-xs font-black text-zinc-200 truncate">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                  <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{item.mainCategory}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-[8px] font-black uppercase tracking-widest text-cyan-500 mb-0.5">Vault Stock</span>
                  <span className="text-sm font-mono font-black text-zinc-300">{totalStock}</span>
                </div>
              </div>
              <button 
                onClick={() => openEditor(item)} 
                className="w-full bg-zinc-900 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-400 border border-cyan-900/50 transition-colors py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 flex justify-center items-center gap-2"
              >
                Review Inventory <ChevronRight size={12}/>
              </button>
            </div>
          );
        }) : (
          <div className="h-full flex items-center justify-center text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest p-4 border border-dashed border-zinc-800 rounded-3xl">
            Inventory is highly optimized. No overstock detected.
          </div>
        )}
      </div>
    </div>
  );
}