import React, { useEffect, useMemo } from 'react';
import { Info, Flame, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, LayoutGrid, Tag, Award, Sparkles, Activity, Star } from 'lucide-react';
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
  setIsCheckingOut, clientConfig // RECEIVING CLIENT CONFIG
}: any) {
  
  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || 'PROMO');

  const safeInventory = [...(filteredInventory || [])].sort((a: any, b: any) => {
    const aStock = a.onHand || (a.options?.length > 0 ? a.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
    const bStock = b.onHand || (b.options?.length > 0 ? b.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
    const aOOS = aStock <= 0 ? 1 : 0;
    const bOOS = bStock <= 0 ? 1 : 0;

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
  else if (activeCategory === 'Vapes & Pens') {
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
  const todaysDeals = safeInventory.filter((i: any) => i.dailyDeal);
  const newDropsBucket = safeInventory.filter((i: any) => i.featured && !i.isConfiguredDeal);
  const premiumVaultBucket = safeInventory.filter((i: any) => i.isTopShelf && !i.featured && !i.isConfiguredDeal);

  return (
    <>
      <StorefrontHeader 
        onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal}
        activeCategory={activeCategory} setActiveCategory={setActiveCategory}
        categories={categories} timeData={timeData}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8">
         {isFeaturedTab ? (
           <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
               <div className="flex items-center gap-4">
                 <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-inner"><Sparkles size={28} className="text-zinc-100" /></div>
                 <div>
                   <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-zinc-100">The Drop Zone</h2>
                   <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400 mt-1 flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Promos & Premium Vault
                   </div>
                 </div>
               </div>
               <button onClick={() => setShowPolicies(true)} className="bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 text-zinc-400 transition-colors px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"><Info size={14}/> Read Policies</button>
             </div>

             {todaysDeals.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {todaysDeals.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                </div>
             )}
             
             {newDropsBucket.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {newDropsBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                </div>
             )}

             {premiumVaultBucket.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {premiumVaultBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                </div>
             )}
           </div>
         ) : (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start mt-6">
                {safeInventory.map((item: any) => (
                  <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />
                ))}
             </div>
           </div>
         )}
      </main>
    </>
  );
}