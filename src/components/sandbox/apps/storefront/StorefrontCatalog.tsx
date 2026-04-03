import React, { useEffect } from 'react';
import { Info, Flame, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, LayoutGrid, Tag, Award, Sparkles, CalendarDays } from 'lucide-react';
import { StorefrontCard } from './StorefrontComponents';
import StorefrontHeader from './StorefrontHeader';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sunday', short: 'SUN' },
  { id: 1, label: 'Monday', short: 'MON' },
  { id: 2, label: 'Tuesday', short: 'TUE' },
  { id: 3, label: 'Wednesday', short: 'WED' },
  { id: 4, label: 'Thursday', short: 'THU' },
  { id: 5, label: 'Friday', short: 'FRI' },
  { id: 6, label: 'Saturday', short: 'SAT' }
];

export default function StorefrontCatalog({
  onExit, cartItemCount, cartTotal, setShowPolicies,
  activeCategory, setActiveCategory, categories, 
  activeSubCategory, setActiveSubCategory, availableSubCategories,
  filteredInventory, cart, updateCart, timeData,
  setIsCheckingOut
}: any) {
  
  // PREMIUM SORTING ENGINE
  const safeInventory = [...(filteredInventory || [])].sort((a: any, b: any) => {
    const aScore = (a.isTopShelf || a.featured ? 3 : 0) + (a.dailyDeal ? 1 : 0);
    const bScore = (b.isTopShelf || b.featured ? 3 : 0) + (b.dailyDeal ? 1 : 0);
    
    if (aScore > bScore) return -1;
    if (aScore < bScore) return 1;
    return 0; 
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

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

  const isFeaturedTab = activeCategory === 'Featured & Deals';

  const allDeals = safeInventory.filter((i: any) => i.isConfiguredDeal);
  const todaysDeals = safeInventory.filter((i: any) => i.dailyDeal);
  const premiumBucket = safeInventory.filter((i: any) => (i.featured || i.isTopShelf) && !i.isConfiguredDeal);

  return (
    <>
      <StorefrontHeader 
        onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        categories={categories} timeData={timeData}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
         
         {/* --- THE DROP ZONE (FEATURED & DEALS TAB) --- */}
         {isFeaturedTab && (
           <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
             
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-inner">
                   <Sparkles size={28} className="text-zinc-100" />
                 </div>
                 <div>
                   <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-100">The Drop Zone</h2>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mt-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Promos & Premium Vault
                   </div>
                 </div>
               </div>
               <button onClick={() => setShowPolicies(true)} className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Info size={14}/> Read Policies</button>
             </div>

             {/* THE WEEKLY CIRCULAR: Responsive Grid Calendar */}
             {allDeals.length > 0 && (
               <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-4xl p-5 md:p-8 relative overflow-hidden shadow-2xl before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-linear-to-r before:from-transparent before:via-emerald-500 before:to-transparent">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
                 
                 <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner">
                      <CalendarDays size={24} className="text-zinc-100" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-100">The Weekly Circular</h3>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Plan your stash. Deals unlock automatically.</p>
                    </div>
                 </div>

                 {/* CALENDAR GRID */}
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 relative z-10">
                    {DAYS_OF_WEEK.map(day => {
                       const isToday = day.id === timeData.dayOfWeek;
                       const dayDeals = allDeals.filter((d: any) => d.dealType === 'Daily Deal' || (d.dealDays && d.dealDays.includes(day.id)));

                       return (
                         <div key={day.id} className={`rounded-2xl p-3 border transition-all flex flex-col ${isToday ? 'bg-pink-500/10 border-pink-500/50 shadow-[0_0_20px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/30 lg:-translate-y-2' : 'bg-zinc-950/50 border-zinc-800 opacity-70 hover:opacity-100'}`}>
                            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-800/50">
                              <h4 className={`text-xs font-black uppercase tracking-widest ${isToday ? 'text-pink-400' : 'text-zinc-500'}`}>
                                {isToday ? '🔥 Today' : day.short}
                              </h4>
                              {!isToday && <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-widest bg-zinc-900 px-1.5 py-0.5 rounded-md">Preview</span>}
                            </div>
                            <div className="space-y-2 flex-1">
                               {dayDeals.length > 0 ? dayDeals.map((d: any) => (
                                  <div key={d.id} className="flex flex-col">
                                     <span className="text-[10px] font-black text-zinc-200 leading-tight mb-0.5">{d.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                                     <span className={`text-[8px] font-bold uppercase tracking-widest ${isToday ? 'text-pink-400' : 'text-emerald-500/70'}`}>{d.dealText}</span>
                                  </div>
                               )) : (
                                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">No drops</span>
                               )}
                            </div>
                         </div>
                       )
                    })}
                 </div>

                 {/* LIVE TODAY BUCKET */}
                 {todaysDeals.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-zinc-800/50 relative z-10 animate-in fade-in">
                       <div className="flex items-center gap-3 mb-6">
                         <div className="p-2 bg-pink-500/20 rounded-xl border border-pink-500/30">
                           <Flame size={16} className="text-pink-400 animate-pulse" />
                         </div>
                         <h3 className="text-lg font-black uppercase tracking-tighter text-pink-400">Live Right Now</h3>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                         {todaysDeals.map((item: any, idx: number) => (
                           <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} isHero={idx === 0} />
                         ))}
                       </div>
                    </div>
                 )}
               </div>
             )}

             {/* PREMIUM VAULT BUCKET */}
             {premiumBucket.length > 0 && (
               <div className="bg-zinc-900/40 backdrop-blur-xl border border-zinc-800 rounded-4xl p-5 md:p-8 relative overflow-hidden shadow-2xl before:absolute before:top-0 before:left-0 before:right-0 before:h-1 before:bg-linear-to-r before:from-transparent before:via-amber-500 before:to-transparent">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                 
                 <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="p-3 bg-zinc-950 rounded-2xl border border-zinc-800 shadow-inner">
                      <Award size={24} className="text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter text-zinc-100">Premium Vault</h3>
                      <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mt-0.5">Top Shelf & Featured Selections</p>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                   {premiumBucket.map((item: any) => (
                     <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} />
                   ))}
                 </div>
               </div>
             )}

             {allDeals.length === 0 && premiumBucket.length === 0 && (
               <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50">
                  <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mb-4">
                    <Info size={24} className="text-zinc-600" />
                  </div>
                  <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Active Drops</p>
                  <p className="text-zinc-600 text-xs mt-2">The drop zone is currently empty. Check back soon.</p>
               </div>
             )}
           </div>
         )}

         {/* --- STANDARD CATEGORY VIEWS --- */}
         {!isFeaturedTab && (
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

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start mt-6">
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
           </div>
         )}

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