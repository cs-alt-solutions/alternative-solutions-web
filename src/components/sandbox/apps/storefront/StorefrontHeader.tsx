import React from 'react';
import { X, Package, ShoppingCart, Flame, LayoutGrid, Tag } from 'lucide-react';

export default function StorefrontHeader({
  onExit, cartItemCount, cartTotal, activeCategory, setActiveCategory, categories, timeData
}: any) {
  const safeCategories = categories || [];

  return (
    <header className="bg-zinc-950 border-b border-zinc-800 pt-4 sticky top-0 z-40 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full px-4 mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onExit} className="text-zinc-500 hover:text-rose-500 transition-colors bg-zinc-900 p-2 rounded-full border border-zinc-800"><X size={18}/></button>
          <div className="flex items-center gap-2">
            <Package size={20} className="text-emerald-400" />
            <h1 className="font-black text-lg tracking-widest uppercase text-zinc-100 hidden sm:block">Division Market</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest font-mono hidden md:block">
              SHIFT {timeData?.shiftCode || 'A'}
           </div>
           <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-3 shadow-inner">
             <ShoppingCart size={18} className="text-emerald-400" />
             <span className="font-black text-zinc-100">{cartItemCount} Items</span>
             <span className="text-emerald-400 font-mono font-bold border-l border-zinc-800 pl-3 ml-1">${cartTotal.toFixed(2)}</span>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full px-4 pb-3">
         <div className="flex flex-wrap items-center gap-2">
            {safeCategories.map((cat: string) => {
               const isActive = activeCategory === cat;
               
               let icon = <Tag size={14} className={isActive ? "text-zinc-950" : "text-zinc-500"} />;
               let activeBg = 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] border-emerald-400';
               let inactiveBg = 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100';

               if (cat === 'Featured & Deals') {
                 icon = <Flame size={14} className={isActive ? "text-zinc-950" : "text-rose-500"} />;
                 if (isActive) activeBg = 'bg-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.3)] border-rose-400';
               } else if (cat === 'All') {
                 icon = <LayoutGrid size={14} className={isActive ? "text-zinc-950" : "text-emerald-500"} />;
               }

               return (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive ? activeBg : inactiveBg}`}
                 >
                   {icon} {cat}
                 </button>
               );
            })}
         </div>
      </div>
    </header>
  );
}