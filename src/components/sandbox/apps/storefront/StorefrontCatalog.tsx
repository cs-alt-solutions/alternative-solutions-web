import React, { useEffect, useMemo } from 'react';
import { Info, Flame, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, LayoutGrid, Tag, Award, Sparkles, Activity, Star } from 'lucide-react';
import { StorefrontCard, getRequiredGrams } from './StorefrontComponents';
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
  setIsCheckingOut, clientConfig 
}: any) {
  
  const isItemOOS = (item: any) => {
     if (item.mainCategory === 'Flower & Plants') {
         const minGrams = item.sizes?.length > 0 ? Math.min(...item.sizes.map((s:any) => getRequiredGrams(s.label))) : 1;
         return (item.onHand || 0) < minGrams;
     } else {
         const displayStock = item.onHand || (item.options?.length > 0 ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
         return displayStock <= 0;
     }
  };

  const safeInventory = [...(filteredInventory || [])].sort((a: any, b: any) => {
    const aOOS = isItemOOS(a) ? 1 : 0;
    const bOOS = isItemOOS(b) ? 1 : 0;

    if (aOOS !== bOOS) return aOOS - bOOS;

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

  if (activeCategory === 'All') HeaderIcon = LayoutGrid;
  else if (activeCategory === 'Flower & Plants') HeaderIcon = Leaf;
  else if (activeCategory === 'Vapes & Pens') { HeaderIcon = Wind; iconColorClass = "text-cyan-400"; bgBoxClass = "bg-cyan-500/10 border-cyan-500/20"; textGradientClass = "from-cyan-400 via-blue-400 to-indigo-500"; }
  else if (activeCategory === 'Edibles') { HeaderIcon = Cookie; iconColorClass = "text-amber-400"; bgBoxClass = "bg-amber-500/10 border-amber-500/20"; textGradientClass = "from-amber-400 via-orange-400 to-rose-500"; }
  else if (activeCategory === 'Concentrates') { HeaderIcon = Droplet; iconColorClass = "text-orange-500"; bgBoxClass = "bg-orange-500/10 border-orange-500/20"; textGradientClass = "from-orange-500 via-red-400 to-rose-600"; }
  else if (activeCategory === 'Merch & Extras') { HeaderIcon = Shirt; iconColorClass = "text-fuchsia-400"; bgBoxClass = "bg-fuchsia-500/10 border-fuchsia-500/20"; textGradientClass = "from-fuchsia-400 via-pink-400 to-rose-500"; }

  const isFeaturedTab = activeCategory === 'Daily Deals';
  
  const allDeals = safeInventory.filter((i: any) => i.isConfiguredDeal);
  const todaysDeals = safeInventory.filter((i: any) => i.dailyDeal);
  const newDropsBucket = safeInventory.filter((i: any) => i.featured && !i.isConfiguredDeal && !i.subCategory?.toLowerCase().includes('steals'));
  const premiumVaultBucket = safeInventory.filter((i: any) => i.isTopShelf && !i.featured && !i.isConfiguredDeal && !i.subCategory?.toLowerCase().includes('steals'));
  const smokyStealsBucket = safeInventory.filter((i: any) => i.subCategory?.toLowerCase().includes('steals') && !i.dailyDeal && !i.featured);

  const renderDealMath = (config: any) => {
    if (!config) return 'PROMO';
    if (config.type === 'BUNDLE') return `${config.buyQty} for $${config.bundlePrice}`;
    if (config.type === 'DISCOUNT') {
      if (config.discountType === 'PERCENT') return `${config.discountValue}% OFF`;
      if (config.discountType === 'DOLLAR') return `$${config.discountValue} OFF`;
      if (config.discountType === 'FIXED') return `$${config.discountValue}`;
      if (config.discountType === 'TIERED') return `TIERED PRICING`;
    }
    return `B${config.buyQty || 1} G${config.getQty || 1}`;
  };

  const tickerItems = useMemo(() => {
    const items: any[] = [];
    for (let i = 1; i <= 7; i++) {
       const targetDayIndex = (timeData.dayOfWeek + i) % 7;
       const targetDay = DAYS_OF_WEEK[targetDayIndex];
       
       const dayDeals = allDeals.filter((d: any) => d.dealDays?.includes(targetDayIndex));
       dayDeals.forEach((d: any) => { items.push({ day: targetDay.short, name: d.name, promo: renderDealMath(d.dealConfig) }); });
    }
    return items;
  }, [allDeals, timeData.dayOfWeek]);

  return (
    <>
      <StorefrontHeader 
        onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal} setShowPolicies={setShowPolicies}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        categories={categories} timeData={timeData} setIsCheckingOut={setIsCheckingOut}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 relative pb-20">
         {isFeaturedTab ? (
           <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-inner"><Sparkles size={28} className="text-zinc-100" /></div>
                 <div>
                   <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-100">Daily Deals</h2>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mt-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Deals & Premium Vault
                   </div>
                 </div>
               </div>
               <button onClick={() => setShowPolicies(true)} className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Info size={14}/> Read Policies</button>
             </div>

             {allDeals.length > 0 && (
               <div className="w-full flex items-center overflow-x-auto scrollbar-hide py-2 border-b border-zinc-800/50 -mt-6 mb-4">
                  <div className="text-pink-500 font-black uppercase tracking-widest text-[9px] flex items-center gap-1.5 shrink-0 mr-4">
                    <Activity size={12} className="animate-pulse" /> Radar
                  </div>
                  <div className="flex items-center gap-4 relative whitespace-nowrap">
                     {tickerItems.length > 0 ? tickerItems.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2 shrink-0">
                           <span className="text-[8px] font-black text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">{t.day}</span>
                           <span className="text-[9px] font-black text-zinc-300 uppercase tracking-wider">{t.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                           <span className="text-[8px] font-black text-pink-400 uppercase tracking-widest">{t.promo}</span>
                           {idx < tickerItems.length - 1 && <span className="text-zinc-800 ml-2">•</span>}
                        </div>
                     )) : (
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest italic">No upcoming scheduled drops.</span>
                     )}
                  </div>
               </div>
             )}

             {todaysDeals.length > 0 && (
                <div className="pt-2 animate-in fade-in">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                       <Flame size={16} className="text-orange-400 animate-pulse" />
                     </div>
                     <div>
                       <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-orange-400">Live Right Now</h3>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Active daily and weekly promos.</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {todaysDeals.map((item: any, idx: number) => (
                       <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} isHero={idx === 0} />
                     ))}
                   </div>
                </div>
             )}

             {smokyStealsBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6">
                 <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-zinc-950 rounded-xl border border-dashed border-lime-500/30">
                       <Tag size={16} className="text-lime-400" />
                     </div>
                     <div>
                       <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-lime-400 to-yellow-400">Smoky Steals</h3>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Premium Selections at Clearance Prices</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {smokyStealsBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
             )}
             
             {newDropsBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6">
                   <div className="flex items-center gap-3 mb-6">
                     <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                       <Star size={16} className="text-cyan-400 animate-pulse" />
                     </div>
                     <div>
                       <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-cyan-400">Fresh Features</h3>
                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">New additions and highlighted selections.</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                     {newDropsBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
             )}

             {premiumVaultBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6">
                 <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]"> 
                      <Award size={16} className="text-amber-400" /> 
                    </div>
                    <div> 
                      <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-amber-200">The Premium Vault</h3> 
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">Exclusive Top Shelf Selections</p> 
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {premiumVaultBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                 </div>
               </div>
             )}

             {allDeals.length === 0 && newDropsBucket.length === 0 && premiumVaultBucket.length === 0 && smokyStealsBucket.length === 0 && (
               <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50">
                  <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mb-4"> <Info size={24} className="text-zinc-600" /> </div>
                  <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Active Deals</p>
                  <p className="text-zinc-600 text-xs mt-2">Check back soon for new promotions.</p>
               </div>
             )}
           </div>
         ) : (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
               <div className="flex items-center gap-3">
                 <div className={`p-2.5 border rounded-2xl ${bgBoxClass}`}> <HeaderIcon size={24} className={iconColorClass} /> </div>
                 <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r ${textGradientClass}`}> {activeCategory} </h2>
               </div>
               <button onClick={() => setShowPolicies(true)} className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Info size={14}/> Read Policies</button>
             </div>

             {activeCategory !== 'All' && availableSubCategories?.length > 0 && (
               <div className="w-full overflow-x-auto scrollbar-hide pb-2">
                 <div className="inline-flex p-1.5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl backdrop-blur-xl">
                   <button onClick={() => setActiveSubCategory('All')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubCategory === 'All' ? 'bg-zinc-800 text-emerald-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}> All </button>
                   {availableSubCategories.map((sub: string) => (
                     <button key={sub} onClick={() => setActiveSubCategory(sub)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubCategory === sub ? 'bg-zinc-800 text-emerald-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}> {sub} </button>
                   ))}
                 </div>
               </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start mt-6">
                {safeInventory.map((item: any) => ( <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} /> ))}
                {safeInventory.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50">
                     <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mb-4"> <Info size={24} className="text-zinc-600" /> </div>
                     <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Active Stock</p>
                     <p className="text-zinc-600 text-xs mt-2">Check back later for restocks.</p>
                  </div>
                )}
             </div>
           </div>
         )}
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-60 flex justify-center animate-in slide-in-from-bottom-10">
          <button onClick={() => setIsCheckingOut(true)} className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105 border border-emerald-400" > <span className="flex items-center gap-2"><ShoppingCart size={20}/> Review Cart</span> <span className="bg-zinc-950 text-emerald-400 px-4 py-1.5 rounded-xl font-mono">${cartTotal.toFixed(2)}</span> </button>
        </div>
      )}
    </>
  );
}