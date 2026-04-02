import React from 'react';
import { Package, ShoppingCart, Flame, LayoutGrid, Tag, Leaf, Wind, Cookie, Droplet, Shirt } from 'lucide-react';

export default function StorefrontHeader({
  cartItemCount, cartTotal, activeCategory, setActiveCategory, categories, timeData
}: any) {
  const safeCategories = categories || [];

  return (
    <header className="bg-zinc-950 border-b border-zinc-800 pt-4 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full px-4 mb-4">
        
        <div className="flex items-center gap-3">
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
         <div className="flex flex-wrap items-center gap-2 border-b border-zinc-900 pb-2 overflow-x-auto scrollbar-hide">
            {safeCategories.map((cat: string) => {
               const isActive = activeCategory === cat;
               
               let Icon = Tag;
               let iconColor = "text-zinc-500";
               let activeBg = 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] border-emerald-400';
               let inactiveBg = 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100';

               if (cat === 'Featured & Deals') {
                 Icon = Flame;
                 iconColor = "text-rose-500";
                 if (isActive) activeBg = 'bg-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.3)] border-rose-400';
               } else if (cat === 'All') {
                 Icon = LayoutGrid;
                 iconColor = "text-emerald-500";
               } else if (cat === 'Flower & Plants') {
                 Icon = Leaf;
                 iconColor = "text-emerald-400";
               } else if (cat === 'Vapes & Pens') {
                 Icon = Wind;
                 iconColor = "text-cyan-400";
                 if (isActive) activeBg = 'bg-cyan-500 text-zinc-950 shadow-[0_0_15px_rgba(6,182,212,0.3)] border-cyan-400';
               } else if (cat === 'Edibles') {
                 Icon = Cookie;
                 iconColor = "text-amber-400";
                 if (isActive) activeBg = 'bg-amber-400 text-zinc-950 shadow-[0_0_15px_rgba(251,191,36,0.3)] border-amber-300';
               } else if (cat === 'Concentrates') {
                 Icon = Droplet;
                 iconColor = "text-orange-500";
                 if (isActive) activeBg = 'bg-orange-500 text-zinc-950 shadow-[0_0_15px_rgba(249,115,22,0.3)] border-orange-400';
               } else if (cat === 'Merch & Extras') {
                 Icon = Shirt;
                 iconColor = "text-fuchsia-400";
                 if (isActive) activeBg = 'bg-fuchsia-500 text-zinc-950 shadow-[0_0_15px_rgba(217,70,239,0.3)] border-fuchsia-400';
               }

               return (
                 <button 
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${isActive ? activeBg : inactiveBg}`}
                 >
                   <Icon size={14} className={isActive ? "text-zinc-950" : iconColor} /> {cat}
                 </button>
               );
            })}
         </div>
      </div>
    </header>
  );
}