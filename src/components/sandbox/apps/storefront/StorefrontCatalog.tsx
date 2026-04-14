// sandbox/apps/storefront/StorefrontCatalog.tsx
import React, { useEffect } from 'react';
import { useStickyState } from '@/hooks/useStickyState';
import { Info, Flame, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, LayoutGrid, Tag, Award, Sparkles, Star, ArrowRight, Home, Activity } from 'lucide-react';
import { StorefrontCard, getRequiredGrams } from './StorefrontComponents';
import StorefrontHeader from './StorefrontHeader';
import { IconMap, ThemeMap, getThemeColor } from '../admin/storefront/StorefrontBuilder';

const defaultHomeConfig = {
  hero: { title: "30% OFF\nSALE", subtitle: "On Select Brands. Let's Stock Up!", buttonText: "Shop The Sale", colorFrom: "pink-600", colorTo: "rose-600", icon: "Flame" },
  bento: [
    { name: "Flower", cat: "Flower & Plants", sub: "All", icon: "Leaf", color: "emerald", desc: "Premium flower and reserve tiers.", span: "md:col-span-2 md:row-span-2", imgUrl: "" },
    { name: "Vapes", cat: "Vapes & Pens", sub: "All", icon: "Wind", color: "cyan", desc: "Disposables & carts.", span: "col-span-1 md:col-span-1 md:row-span-2", imgUrl: "" },
    { name: "Pre Rolls", cat: "Flower & Plants", sub: "Pre-Rolls & Blunts", icon: "Tag", color: "pink", desc: "Ready to enjoy.", span: "col-span-1 md:col-span-1 md:row-span-1", imgUrl: "" },
    { name: "Concentrates", cat: "Concentrates", sub: "All", icon: "Droplet", color: "orange", desc: "Dabs & sauces.", span: "col-span-2 md:col-span-1 md:row-span-1", imgUrl: "" }
  ],
  secondary: { title: "Don't Miss\nThese Deals", subtitle: "While Supplies Last.", buttonText: "Click To Save", colorFrom: "emerald-500", colorTo: "emerald-500", icon: "Award" }
};

export default function StorefrontCatalog({
  onExit, cartItemCount, cartTotal, setShowPolicies,
  activeCategory, setActiveCategory, categories, 
  activeSubCategory, setActiveSubCategory, availableSubCategories,
  filteredInventory, cart, updateCart, timeData,
  setIsCheckingOut, clientConfig 
}: any) {
  
  const [homeConfig] = useStickyState(defaultHomeConfig, `division_home_config_v1`);

  const isItemOOS = (item: any) => {
     const activeSubCat = item.subCategory?.toLowerCase() || '';
     const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
     const isRawFlower = item.mainCategory === 'Flower & Plants' && !isPreRoll;

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

  if (activeCategory === 'Flower & Plants') HeaderIcon = Leaf;
  else if (activeCategory === 'Vapes & Pens') { HeaderIcon = Wind; iconColorClass = "text-cyan-400"; bgBoxClass = "bg-cyan-500/10 border-cyan-500/20"; textGradientClass = "from-cyan-400 via-blue-400 to-indigo-500"; }
  else if (activeCategory === 'Edibles') { HeaderIcon = Cookie; iconColorClass = "text-amber-400"; bgBoxClass = "bg-amber-500/10 border-amber-500/20"; textGradientClass = "from-amber-400 via-orange-400 to-rose-500"; }
  else if (activeCategory === 'Concentrates') { HeaderIcon = Droplet; iconColorClass = "text-orange-500"; bgBoxClass = "bg-orange-500/10 border-orange-500/20"; textGradientClass = "from-orange-500 via-red-400 to-rose-600"; }
  else if (activeCategory === 'Healthcare & Topicals') { HeaderIcon = Activity; iconColorClass = "text-rose-400"; bgBoxClass = "bg-rose-500/10 border-rose-500/20"; textGradientClass = "from-rose-400 via-pink-400 to-fuchsia-500"; }
  else if (activeCategory === 'Merch & Extras') { HeaderIcon = Shirt; iconColorClass = "text-fuchsia-400"; bgBoxClass = "bg-fuchsia-500/10 border-fuchsia-500/20"; textGradientClass = "from-fuchsia-400 via-pink-400 to-rose-500"; }

  const isFeaturedTab = activeCategory === 'Home' || activeCategory === 'Daily Deals';
  
  const todaysDeals = safeInventory.filter((i: any) => i.dailyDeal);
  const newDropsBucket = safeInventory.filter((i: any) => i.featured && !i.isConfiguredDeal && !i.subCategory?.toLowerCase().includes('steals'));
  const premiumVaultBucket = safeInventory.filter((i: any) => i.isTopShelf && !i.featured && !i.isConfiguredDeal && !i.subCategory?.toLowerCase().includes('steals'));
  const smokyStealsBucket = safeInventory.filter((i: any) => i.subCategory?.toLowerCase().includes('steals') && !i.dailyDeal && !i.featured);

  const heroTheme = ThemeMap[getThemeColor((homeConfig.hero as any).color || homeConfig.hero.colorFrom)] || ThemeMap['pink'];
  const secTheme = ThemeMap[getThemeColor((homeConfig.secondary as any).color || homeConfig.secondary.colorFrom)] || ThemeMap['emerald'];

  const HeroIcon = IconMap[homeConfig.hero.icon] || Flame;
  const SecIcon = IconMap[homeConfig.secondary.icon] || Award;

  return (
    <>
      <StorefrontHeader 
        onExit={onExit} cartItemCount={cartItemCount} cartTotal={cartTotal} setShowPolicies={setShowPolicies}
        activeCategory={activeCategory === 'Daily Deals' ? 'Home' : activeCategory}
        setActiveCategory={(cat: string) => {
           if (cat === 'Home') setActiveCategory('Daily Deals');
           else setActiveCategory(cat);
        }}
        categories={categories} timeData={timeData} setIsCheckingOut={setIsCheckingOut}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 md:p-8 relative pb-20">
         {isFeaturedTab ? (
           <div className="animate-in fade-in slide-in-from-bottom-4 space-y-10 pt-2 sm:pt-0">
             
             {/* DYNAMIC: Promo Banner 1 (Primary) */}
             <div className={`w-full ${heroTheme.heroGrad} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl overflow-hidden relative group`}>
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none mb-2 drop-shadow-md whitespace-pre-line">{homeConfig.hero.title}</h2>
                  <p className="text-xs font-black uppercase tracking-widest text-white/80 mb-6 drop-shadow">{homeConfig.hero.subtitle}</p>
                  <button className="bg-zinc-950 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors shadow-lg">{homeConfig.hero.buttonText}</button>
                </div>
                <HeroIcon size={140} className="text-white/20 absolute right-0 md:-right-10 top-1/2 -translate-y-1/2 rotate-12 group-hover:scale-110 transition-transform duration-700" />
             </div>

             {/* DYNAMIC: Auto-Packing Dense Bento Grid */}
             <div className="pt-4">
               <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-6 text-center">Shop By Categories</h3>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-flow-row-dense auto-rows-[160px] md:auto-rows-[180px]">
                 {homeConfig.bento.map((c: any, idx: number) => {
                   const BIcon = IconMap[c.icon] || Tag;
                   const sanitizedSpan = c.span.replace(/md:col-start-\d+/g, '').trim();
                   const theme = ThemeMap[getThemeColor(c.color)] || ThemeMap['emerald'];

                   return (
                     <button 
                       key={idx}
                       onClick={() => {
                          setActiveCategory(c.cat);
                          if (c.sub) setActiveSubCategory(c.sub);
                          else setActiveSubCategory('All');
                       }}
                       className={`rounded-3xl p-6 flex flex-col items-start justify-end gap-1 ${theme.bentoHover} transition-all group relative overflow-hidden ${sanitizedSpan} bg-zinc-950 border-2 border-zinc-800 shadow-lg`}
                     >
                       {c.imgUrl ? (
                          <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700">
                             <img src={c.imgUrl} alt={c.name} className="w-full h-full object-cover" />
                             <div className={`absolute inset-0 bg-linear-to-t via-black/40 to-transparent ${theme.bentoOverlay}`} />
                          </div>
                       ) : (
                          <div className={`absolute inset-0 z-0 ${theme.bentoFallback} group-hover:scale-105 transition-transform duration-700`} />
                       )}
  
                       <div className="relative z-10 w-full flex flex-col items-start">
                          <div className={`p-3 rounded-xl border border-zinc-800/50 mb-4 group-hover:scale-110 transition-transform bg-zinc-950/80 ${theme.bentoIconText}`}>
                             <BIcon size={24} />
                          </div>
                          <span className="text-sm sm:text-lg font-black uppercase tracking-widest text-zinc-100 drop-shadow-md">{c.name}</span>
                          <p className={`text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed text-left ${(sanitizedSpan.includes('row-span-2') ? '' : 'hidden md:block')}`}>
                             {c.desc}
                          </p>
                       </div>
                     </button>
                   );
                 })}
               </div>
             </div>

             {/* DYNAMIC: Promo Banner 2 (Secondary) */}
             <div className={`w-full ${secTheme.secBg} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl border border-zinc-700 overflow-hidden relative group`}>
                <div className="relative z-10">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-2">{homeConfig.secondary.subtitle}</p>
                  <h2 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter leading-none mb-6 whitespace-pre-line">{homeConfig.secondary.title}</h2>
                  <button className={`bg-zinc-950 ${secTheme.secBtnText} px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg border border-zinc-800`}>{homeConfig.secondary.buttonText}</button>
                </div>
                <SecIcon size={140} className="text-black/10 absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 group-hover:rotate-12 transition-transform duration-700" />
             </div>

             {/* CAROUSEL: FRESH FEATURES */}
             {newDropsBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50">
                   <div className="flex items-center justify-between mb-6 pt-6">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-cyan-500/20 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                         <Star size={16} className="text-cyan-400 animate-pulse" />
                       </div>
                       <div>
                         <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-cyan-400">Fresh Features</h3>
                         <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5 hidden sm:block">New additions and highlighted selections.</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-900 px-3 py-1.5 rounded-full border border-zinc-800">
                       Swipe <ArrowRight size={12} className="inline" />
                     </div>
                   </div>
                   
                   <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0">
                     {newDropsBucket.map((item: any) => (
                       <div key={item.id} className="snap-start shrink-0 w-[85vw] sm:w-85">
                         <StorefrontCard item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />
                       </div>
                     ))}
                   </div>
                </div>
             )}

             {/* REGULAR LIVE DEALS */}
             {todaysDeals.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50">
                   <div className="flex items-center gap-3 mb-6 pt-6">
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
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50">
                 <div className="flex items-center gap-3 mb-6 pt-6">
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

             {premiumVaultBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50">
                 <div className="flex items-center gap-4 mb-6 pt-6">
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

             {todaysDeals.length === 0 && newDropsBucket.length === 0 && premiumVaultBucket.length === 0 && smokyStealsBucket.length === 0 && (
               <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50 mt-6">
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
             </div>

             {activeCategory !== 'Home' && activeCategory !== 'Daily Deals' && activeCategory !== 'All' && availableSubCategories?.length > 0 && (
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