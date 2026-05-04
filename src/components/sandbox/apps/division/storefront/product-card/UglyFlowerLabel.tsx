// sandbox/apps/storefront/product-card/UglyFlowerLabel.tsx
import React from 'react';
import { Sparkles, ShoppingBag, Flame } from 'lucide-react';

export default function UglyFlowerLabel({ item, cleanItemName, isSideStacked = false }: any) {
  return (
    <div className={`flex flex-col h-full relative overflow-hidden ${isSideStacked ? 'p-4 sm:p-5 overflow-y-auto scrollbar-hide' : 'bg-zinc-900/50 rounded-2xl border border-emerald-500/30 p-3 w-full'}`}>
       
       <div className="absolute -right-6 -bottom-6 opacity-5 rotate-[-15deg] pointer-events-none">
          <Sparkles size={150} className="text-emerald-500" />
       </div>

       <div className="flex items-center gap-2 border-b border-zinc-800/80 pb-2 mb-3 z-10 shrink-0">
          <div className="bg-emerald-500 text-zinc-950 p-1.5 rounded-md shrink-0 shadow-sm">
             <Sparkles size={16} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
             <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 leading-none mb-0.5">Bakers & Makers Stash</h4>
             <span className="text-[7px] font-bold uppercase tracking-widest text-emerald-500/80 leading-none">Ugly buds. Beautiful highs.</span>
          </div>
       </div>

       <div className="mb-4 z-10 shrink-0">
          <h3 className="text-lg sm:text-xl font-black text-zinc-100 uppercase tracking-tighter leading-none wrap-break-word">
            {cleanItemName}
          </h3>
          <span className="text-[9px] font-mono font-bold text-emerald-600/70 uppercase tracking-widest mt-1 block">
             ID: {item.id || 'N/A'}
          </span>
       </div>

       <div className="flex flex-col gap-2 mb-auto z-10 shrink-0">
          
          <div className="bg-zinc-950/50 border border-zinc-800 p-2 rounded-lg flex flex-col">
             <div className="flex items-center gap-1.5 mb-1 text-zinc-500">
                <ShoppingBag size={10} />
                <span className="text-[7px] font-black uppercase tracking-widest">The Cut</span>
             </div>
             <span className="text-[10px] font-bold text-emerald-400 uppercase leading-tight">
                Popcorn / Rough Cut
             </span>
          </div>

          <div className="bg-zinc-950/50 border border-zinc-800 p-2 rounded-lg flex flex-col">
             <div className="flex items-center gap-1.5 mb-1 text-zinc-500">
                <Flame size={10} />
                <span className="text-[7px] font-black uppercase tracking-widest">Best For</span>
             </div>
             <span className="text-[10px] font-bold text-emerald-400 uppercase leading-tight">
                {item?.descUses || 'Baking, Extracting, or Rolling Heavy'}
             </span>
          </div>

       </div>

       <div className="mt-4 border-t border-zinc-800 pt-3 z-10 flex flex-col items-center shrink-0">
          <p className="text-[8px] font-bold text-zinc-500 text-center leading-tight">
            These buds won't win a beauty contest, but they pack the exact same punch. Perfect for chefs, makers, and budget-friendly sessions.
          </p>
       </div>
    </div>
  );
}