import React, { useEffect } from 'react';
import { Info, Flame, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, LayoutGrid, Tag } from 'lucide-react';
import { StorefrontCard } from './StorefrontComponents';
import StorefrontHeader from './StorefrontHeader';

export default function StorefrontCatalog({
  onExit, cartItemCount, cartTotal, setShowPolicies,
  activeCategory, setActiveCategory, categories, 
  activeSubCategory, setActiveSubCategory, availableSubCategories,
  filteredInventory, cart, updateCart, timeData,
  setIsCheckingOut
}: any) {
  const safeInventory = filteredInventory || [];

  // AUTO-SCROLL TO TOP ON CATEGORY SWITCH
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  // DYNAMIC HEADER STYLING ENGINE
  let HeaderIcon = Tag;
  let iconColorClass = "text-emerald-400";
  let bgBoxClass = "bg-emerald-500/10 border-emerald-500/20";
  let textGradientClass = "from-emerald-400 via-cyan-400 to-blue-500";

  if (activeCategory === 'All') {
    HeaderIcon = LayoutGrid;
  } else if (activeCategory === 'Flower & Plants') {
    HeaderIcon = Leaf;
  } else if (activeCategory === 'Vapes & Pens') {
    HeaderIcon = Wind;
    iconColorClass = "text-cyan-400";
    bgBoxClass = "bg-cyan-500/10 border-cyan-500/20";
    textGradientClass = "from-cyan-400 via-blue-400 to-indigo-500";
  } else if (activeCategory === 'Edibles') {
    HeaderIcon = Cookie;
    iconColorClass = "text-amber-400";
    bgBoxClass = "bg-amber-500/10 border-amber-500/20";
    textGradientClass = "from-amber-400 via-orange-400 to-rose-500";
  } else if (activeCategory === 'Concentrates') {
    HeaderIcon = Droplet;
    iconColorClass = "text-orange-500";
    bgBoxClass = "bg-orange-500/10 border-orange-500/20";
    textGradientClass = "from-orange-500 via-red-400 to-rose-600";
  } else if (activeCategory === 'Merch & Extras') {
    HeaderIcon = Shirt;
    iconColorClass = "text-fuchsia-400";
    bgBoxClass = "bg-fuchsia-500/10 border-fuchsia-500/20";
    textGradientClass = "from-fuchsia-400 via-pink-400 to-rose-500";
  }

  return (
    <>
      <StorefrontHeader 
        onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        categories={categories} timeData={timeData}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
         
         {activeCategory === 'Featured & Deals' && (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div className="flex items-center gap-3">
               <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl">
                 <Flame size={24} className="text-rose-400 animate-pulse" />
               </div>
               <div>
                 <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-amber-400 via-rose-500 to-fuchsia-500">Featured & Deals</h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400 mt-1">Limited Drops & Promos</p>
               </div>
             </div>
             <button onClick={() => setShowPolicies(true)} className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Info size={14}/> Read Policies</button>
           </div>
         )}

         {activeCategory !== 'Featured & Deals' && (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
               <div className="flex items-center gap-3">
                 
                 <div className={`p-2.5 border rounded-2xl ${bgBoxClass}`}>
                   <HeaderIcon size={24} className={iconColorClass} />
                 </div>
                 
                 <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r ${textGradientClass}`}>
                   {activeCategory}
                 </h2>

               </div>
               <button onClick={() => setShowPolicies(true)} className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Info size={14}/> Read Policies</button>
             </div>

             {activeCategory !== 'All' && availableSubCategories?.length > 0 && (
               <div className="w-full overflow-x-auto scrollbar-hide pb-2">
                 <div className="inline-flex p-1.5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl backdrop-blur-xl">
                   <button 
                     onClick={() => setActiveSubCategory('All')} 
                     className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubCategory === 'All' ? 'bg-zinc-800 text-emerald-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                   >
                     All
                   </button>
                   {availableSubCategories.map((sub: string) => (
                     <button 
                       key={sub} 
                       onClick={() => setActiveSubCategory(sub)} 
                       className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubCategory === sub ? 'bg-zinc-800 text-emerald-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}
                     >
                       {sub}
                     </button>
                   ))}
                 </div>
               </div>
             )}
           </div>
         )}
         
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            {safeInventory.map((item: any) => (
              <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} />
            ))}
            
            {safeInventory.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50">
                 <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mb-4">
                   <Info size={24} className="text-zinc-600" />
                 </div>
                 <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Active Stock</p>
                 <p className="text-zinc-600 text-xs mt-2">Check back later for restocks in this category.</p>
              </div>
            )}
         </div>
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-60 flex justify-center animate-in slide-in-from-bottom-10">
          <button 
            onClick={() => setIsCheckingOut(true)} 
            className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105 border border-emerald-400"
          >
            <span className="flex items-center gap-2"><ShoppingCart size={20}/> Review Cart</span>
            <span className="bg-zinc-950 text-emerald-400 px-4 py-1.5 rounded-xl font-mono">${cartTotal.toFixed(2)}</span>
          </button>
        </div>
      )}
    </>
  );
}