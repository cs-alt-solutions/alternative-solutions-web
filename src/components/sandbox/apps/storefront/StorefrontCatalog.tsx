/* src/components/sandbox/apps/storefront/StorefrontCatalog.tsx */
import React from 'react';
import { X, Package, Info, ShoppingCart, Flame, LayoutGrid, Tag } from 'lucide-react';
import { StorefrontCard } from './StorefrontComponents';

export default function StorefrontCatalog({
  onExit, cartItemCount, cartTotal, setShowPolicies,
  activeCategory, setActiveCategory, categories, 
  filteredInventory, cart, updateCart, timeData,
  setIsCheckingOut, hasSeenBetaAlert, setShowBetaAlert
}: any) {
  const safeInventory = filteredInventory || [];
  const safeCategories = categories || [];

  return (
    <>
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

        {/* WRAPPING PILL NAVIGATION (No more horizontal scroll) */}
        <div className="max-w-6xl mx-auto w-full px-4 pb-3">
           <div className="flex flex-wrap items-center gap-2">
              {safeCategories.map((cat: string) => {
                 const isActive = activeCategory === cat;
                 
                 let icon = <Tag size={14} className={isActive ? "text-zinc-950" : "text-zinc-500"} />;
                 let activeBg = 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.3)] border-emerald-400';
                 let inactiveBg = 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100';

                 // COMBINED TAB STYLING
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

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
         {/* COMBINED CATEGORY HEADER */}
         {activeCategory === 'Featured & Deals' && (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 flex justify-between items-end">
             <div className="flex items-center gap-3">
               <div className="flex -space-x-1">
                 <span className="text-2xl leading-none z-10">⭐</span>
                 <Flame size={24} className="text-rose-400 animate-pulse" />
               </div>
               <h2 className="text-2xl font-black uppercase tracking-tight text-white">Featured & Deals</h2>
             </div>
             <button onClick={() => setShowPolicies(true)} className="text-zinc-500 flex items-center gap-1 text-[10px] font-black uppercase hover:text-emerald-400"><Info size={14}/> Rules</button>
           </div>
         )}

         {activeCategory !== 'Featured & Deals' && (
           <div className="mb-8 flex justify-between items-end">
             <h2 className="text-xl font-black uppercase tracking-tight text-zinc-100">{activeCategory}</h2>
             <button onClick={() => setShowPolicies(true)} className="text-zinc-500 flex items-center gap-1 text-[10px] font-black uppercase hover:text-emerald-400"><Info size={14}/> Rules</button>
           </div>
         )}
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {safeInventory.map((item: any) => (
              <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} />
            ))}
            
            {safeInventory.length === 0 && (
              <div className="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-zinc-800">
                 <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">No active items in this category.</p>
              </div>
            )}
         </div>
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-40 flex justify-center animate-in slide-in-from-bottom-10">
          <button 
            onClick={() => {
              if (!hasSeenBetaAlert) {
                setShowBetaAlert(true);
              } else {
                setIsCheckingOut(true);
              }
            }} 
            className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105 border border-emerald-400"
          >
            <span>Review & Checkout</span>
            <span className="bg-zinc-950 text-emerald-400 px-4 py-1.5 rounded-xl font-mono">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </>
  );
}