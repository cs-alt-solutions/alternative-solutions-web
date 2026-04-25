// sandbox/apps/storefront/StorefrontCatalog.tsx
import React, { useEffect, useState } from 'react';
import { useStickyState } from '@/hooks/useStickyState';
import { Info, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, Tag, Activity } from 'lucide-react';
import { StorefrontCard, getRequiredGrams } from './StorefrontComponents';
import StorefrontHeader from './StorefrontHeader';
import { IconMap, ThemeMap, getThemeColor } from '../admin/storefront/StorefrontBuilder';
import CatalogHeroCarousel from './catalog/CatalogHeroCarousel';
import CatalogBentoGrid from './catalog/CatalogBentoGrid';
import CatalogDealLanes from './catalog/CatalogDealLanes';

export default function StorefrontCatalog({
  onExit, cartItemCount, cartTotal, setShowPolicies,
  activeCategory, setActiveCategory, categories, 
  activeSubCategory, setActiveSubCategory, availableSubCategories,
  filteredInventory, cart, updateCart, timeData,
  setIsCheckingOut, clientConfig 
}: any) {
  
  const fallbackConfig = { hero: {}, bento: [], categoryImages: {} };
  const [homeConfig] = useStickyState(clientConfig?.homeConfig || fallbackConfig, `alt_solutions_home_config_v3_${clientConfig?.id}`);
  const [heroIndex, setHeroIndex] = useState(0);

  const isItemOOS = (item: any) => {
     const activeSubCat = item.subCategory?.toLowerCase() || '';
     const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
     const isRawFlower = (item.mainCategory?.includes('Flower') || item.mainCategory === 'Backroom Stash') && !isPreRoll;

     if (isRawFlower) {
         const minGrams = item.sizes?.length > 0 ? Math.min(...item.sizes.map((s:any) => getRequiredGrams(s.label))) : 1;
         return (item.onHand || 0) < minGrams;
     } else {
         const hasTrueVariants = item.options && item.options.length > 0 && item.options[0].label !== 'Standard';
         const displayStock = hasTrueVariants 
             ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) 
             : (item.onHand || 0);
         return displayStock <= 0;
     }
  };

  const safeInventory = [...(filteredInventory || [])].sort((a: any, b: any) => {
    const aOOS = isItemOOS(a) ? 1 : 0;
    const bOOS = isItemOOS(b) ? 1 : 0;
    if (aOOS !== bOOS) return aOOS - bOOS;
    const aScore = (a.isTopShelf || a.isChefsReserve || a.isNewDrop || a.isReturned || a.isClearance ? 3 : 0) + (a.dailyDeal ? 1 : 0);
    const bScore = (b.isTopShelf || b.isChefsReserve || b.isNewDrop || b.isReturned || b.isClearance ? 3 : 0) + (b.dailyDeal ? 1 : 0);
    if (aScore > bScore) return -1;
    if (aScore < bScore) return 1;
    return 0; 
  });

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [activeCategory]);

  let HeaderIcon = Tag;
  let iconColorClass = "text-emerald-400";
  let bgBoxClass = "bg-emerald-500/10 border-emerald-500/20";
  let textGradientClass = "from-emerald-400 via-cyan-400 to-blue-500";

  if (activeCategory?.includes('Flower')) HeaderIcon = Leaf;
  else if (activeCategory === 'Vapes & Pens') { HeaderIcon = Wind; iconColorClass = "text-cyan-400"; bgBoxClass = "bg-cyan-500/10 border-cyan-500/20"; textGradientClass = "from-cyan-400 via-blue-400 to-indigo-500"; }
  else if (activeCategory === 'Edibles') { HeaderIcon = Cookie; iconColorClass = "text-amber-400"; bgBoxClass = "bg-amber-500/10 border-amber-500/20"; textGradientClass = "from-amber-400 via-orange-400 to-rose-500"; }
  else if (activeCategory === 'Concentrates') { HeaderIcon = Droplet; iconColorClass = "text-orange-500"; bgBoxClass = "bg-orange-500/10 border-orange-500/20"; textGradientClass = "from-orange-500 via-red-400 to-rose-600"; }
  else if (activeCategory === 'Healthcare & Topicals') { HeaderIcon = Activity; iconColorClass = "text-rose-400"; bgBoxClass = "bg-rose-500/10 border-rose-500/20"; textGradientClass = "from-rose-400 via-pink-400 to-fuchsia-500"; }
  else if (activeCategory === 'Merch & Extras') { HeaderIcon = Shirt; iconColorClass = "text-fuchsia-400"; bgBoxClass = "bg-fuchsia-500/10 border-fuchsia-500/20"; textGradientClass = "from-fuchsia-400 via-pink-400 to-rose-500"; }

  const isFeaturedTab = activeCategory === 'Home' || activeCategory === 'Daily Deals';
  
  const currentDayId = new Date().getDay();
  const currentDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  let dayTitle = "Daily Drop";
  let daySub = "Today's recurring specials.";
  
  switch(currentDayId) {
    case 0: dayTitle = "Sunday Strains"; daySub = "Prep for the week ahead."; break;
    case 1: dayTitle = "Munchie Monday"; daySub = "Start the week deliciously."; break;
    case 2: dayTitle = "Dabs & Badder"; daySub = "Your premium extract drop."; break;
    case 3: dayTitle = "Weed Wednesday"; daySub = "The ultimate mid-week re-up."; break;
    case 4: dayTitle = "Dabs & Badder"; daySub = "Thursday's premium extract drop."; break;
    case 5: dayTitle = "Flower Friday"; daySub = "Fresh buds for the weekend."; break;
    case 6: dayTitle = "Shatterday"; daySub = "Elevate your Saturday."; break;
  }

  const isStashActive = homeConfig?.stashConfig?.active;
  const rawStashDrops = isStashActive ? (homeConfig?.backroomStash || []) : [];
  
  const backroomStashDrops = rawStashDrops.map((drop: any) => ({
      id: drop.id,
      name: drop.name,
      mainCategory: 'Backroom Stash', 
      subCategory: drop.category || 'Flower', 
      imageUrl: drop.imgUrl, 
      onHand: 999, 
      sizes: drop.sizes || [],
      price: drop.sizes?.length > 0 ? Math.min(...drop.sizes.map((s:any) => s.price || 0)) : 0,
      options: [],
      iconName: drop.category === 'Flower' ? 'Leaf' : drop.category === 'Concentrates' ? 'Droplet' : drop.category === 'Edibles' ? 'Cookie' : 'Wind'
  }));

  const oneShotDeals = safeInventory.filter((i: any) => i.dealType === 'One-Shot' ? i.dealDays?.includes(currentDayId) : i.dailyDeal && i.dealType !== 'Recurring');
  const recurringDeals = safeInventory.filter((i: any) => i.dealType === 'Recurring' && (!i.dealDays || i.dealDays.length === 0 || i.dealDays.includes(currentDayId)));
  const newDropsBucket = safeInventory.filter((i: any) => i.isNewDrop && !i.isConfiguredDeal && !i.isClearance);
  const premiumWarehouseBucket = safeInventory.filter((i: any) => (i.isTopShelf || i.isChefsReserve) && !i.isNewDrop && !i.isConfiguredDeal && !i.isClearance);
  const smokyStealsBucket = safeInventory.filter((i: any) => i.isClearance && !i.dailyDeal);
  const returnedBucket = safeInventory.filter((i: any) => i.isReturned && !i.isNewDrop && !i.isConfiguredDeal && !i.isClearance);
  const activeTodaysDeals = [...oneShotDeals, ...recurringDeals].filter(item => !isItemOOS(item));

  const heroSlides: any[] = [
    {
      title: homeConfig?.hero?.title || 'LOADING...', subtitle: homeConfig?.hero?.subtitle || '', buttonText: homeConfig?.hero?.buttonText || 'ENTER',
      themeColor: getThemeColor((homeConfig?.hero as any)?.color || homeConfig?.hero?.colorFrom), icon: homeConfig?.hero?.icon || 'Flame', imgUrl: (homeConfig?.hero as any)?.imgUrl || undefined,
      action: () => document.getElementById('live-deals-section')?.scrollIntoView({ behavior: 'smooth' })
    },
    ...activeTodaysDeals.map((item: any) => {
      let catName = item.subCategory && item.subCategory !== 'All' ? item.subCategory : item.mainCategory;
      if (catName?.includes('Flower')) catName = 'Premium Flower';
      if (catName === 'Vapes & Pens') catName = 'Vapes';
      
      let topText = item.dealType === 'Recurring' ? dayTitle.toUpperCase() : item.campaignTag === 'NEW_DROP' ? "FRESH DROP" : item.campaignTag === 'VAULT_CLEARANCE' ? "CLEARANCE" : "DAILY DEAL";
      return {
        title: `${topText}\nON ${catName.toUpperCase()}`, subtitle: item.name, buttonText: "Shop Deal",
        themeColor: item.campaignTag === 'NEW_DROP' ? "cyan" : item.campaignTag === 'VAULT_CLEARANCE' ? "rose" : "orange",
        icon: item.campaignTag === 'NEW_DROP' ? "Star" : item.campaignTag === 'VAULT_CLEARANCE' ? "Tag" : "Flame",
        imgUrl: item.imageUrl || item.imgUrl || item.image || item.image_url || undefined,
        action: () => document.getElementById(item.dealType === 'Recurring' ? 'recurring-deals-section' : 'live-deals-section')?.scrollIntoView({ behavior: 'smooth' })
      };
    })
  ];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => setHeroIndex(prev => (prev + 1) % heroSlides.length), 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    <>
      <StorefrontHeader 
        onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal} setShowPolicies={setShowPolicies}
        activeCategory={activeCategory === 'Daily Deals' ? 'Home' : activeCategory}
        setActiveCategory={(cat: string) => setActiveCategory(cat === 'Home' ? 'Daily Deals' : cat)}
        categories={categories} timeData={timeData} setIsCheckingOut={setIsCheckingOut}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 relative pb-20">
         {isFeaturedTab ? (
           <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 pt-2 sm:pt-0">
             <CatalogHeroCarousel heroSlides={heroSlides} heroIndex={heroIndex} setHeroIndex={setHeroIndex} />
             <CatalogBentoGrid homeConfig={homeConfig} setActiveCategory={setActiveCategory} setActiveSubCategory={setActiveSubCategory} />
             
             {/* 🚀 Redundant Secondary Block NUKED from here! Flows straight into Deals now. */}

             <CatalogDealLanes 
                recurringDeals={recurringDeals} oneShotDeals={oneShotDeals} newDropsBucket={newDropsBucket} 
                premiumWarehouseBucket={premiumWarehouseBucket} smokyStealsBucket={smokyStealsBucket} returnedBucket={returnedBucket} 
                vaultDropBucket={backroomStashDrops} 
                currentDayName={currentDayName} dayTitle={dayTitle} daySub={daySub} cart={cart} updateCart={updateCart} clientConfig={clientConfig} 
             />
           </div>
         ) : (
           <div className="mb-8 animate-in fade-in slide-in-from-bottom-4">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
               <div className="flex items-center gap-3">
                 <div className={`p-2.5 border rounded-2xl ${bgBoxClass}`}><HeaderIcon size={24} className={iconColorClass} /></div>
                 <h2 className={`text-2xl md:text-3xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r ${textGradientClass}`}>{activeCategory}</h2>
               </div>
             </div>

             {activeCategory !== 'Home' && activeCategory !== 'Daily Deals' && activeCategory !== 'All' && availableSubCategories?.length > 0 && (
               <div className="w-full overflow-x-auto scrollbar-hide pb-2">
                 <div className="inline-flex p-1.5 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl backdrop-blur-xl">
                   <button onClick={() => setActiveSubCategory('All')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubCategory === 'All' ? 'bg-zinc-800 text-emerald-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>All</button>
                   {availableSubCategories.map((sub: string) => (
                     <button key={sub} onClick={() => setActiveSubCategory(sub)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubCategory === sub ? 'bg-zinc-800 text-emerald-400 shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-700/50' : 'text-zinc-500 hover:text-zinc-300'}`}>{sub}</button>
                   ))}
                 </div>
               </div>
             )}

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start mt-6">
                {safeInventory.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} /> )}
                {safeInventory.length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50">
                     <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mb-4"><Info size={24} className="text-zinc-600" /></div>
                     <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Active Stock</p>
                  </div>
                )}
             </div>
           </div>
         )}
      </main>

      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 px-6 z-60 flex justify-center animate-in slide-in-from-bottom-10">
          <button onClick={() => setIsCheckingOut(true)} className="w-full max-w-md bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-[0_10px_40px_rgba(52,211,153,0.4)] py-4 px-6 rounded-2xl font-black uppercase tracking-widest text-lg flex items-center justify-between transition-all hover:scale-105 border border-emerald-400" >
            <span className="flex items-center gap-2"><ShoppingCart size={20}/> Review Cart</span> 
            <span className="bg-zinc-950 text-emerald-400 px-4 py-1.5 rounded-xl font-mono">${cartTotal.toFixed(2)}</span> 
          </button>
        </div>
      )}
    </>
  );
}