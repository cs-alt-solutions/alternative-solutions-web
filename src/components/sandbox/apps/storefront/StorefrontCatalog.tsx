// src/components/sandbox/apps/storefront/StorefrontCatalog.tsx
import React, { useEffect, useState } from 'react';
import { useStickyState } from '@/hooks/useStickyState';
import { Info, Flame, ShoppingCart, Leaf, Wind, Cookie, Droplet, Shirt, LayoutGrid, Tag, Award, Sparkles, Star, ArrowRight, Home, Activity, ChevronLeft, ChevronRight, RotateCcw, Zap, ChevronDown } from 'lucide-react';
import { StorefrontCard, getRequiredGrams } from './StorefrontComponents';
import StorefrontHeader from './StorefrontHeader';
import { IconMap, ThemeMap, getThemeColor, getSmartBentoSpan } from '../admin/storefront/StorefrontBuilder';

export default function StorefrontCatalog({
  onExit, cartItemCount, cartTotal, setShowPolicies,
  activeCategory, setActiveCategory, categories, 
  activeSubCategory, setActiveSubCategory, availableSubCategories,
  filteredInventory, cart, updateCart, timeData,
  setIsCheckingOut, clientConfig 
}: any) {
  
  const fallbackConfig = { hero: {}, bento: [], secondary: {}, categoryImages: {} };
  const [homeConfig] = useStickyState(clientConfig?.homeConfig || fallbackConfig, `alt_solutions_home_config_v3_${clientConfig?.id}`);
  
  const [heroIndex, setHeroIndex] = useState(0);

  const isItemOOS = (item: any) => {
     const activeSubCat = item.subCategory?.toLowerCase() || '';
     const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
     const isRawFlower = item.mainCategory === 'Flower & Prerolls' && !isPreRoll;

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeCategory]);

  let HeaderIcon = Tag;
  let iconColorClass = "text-emerald-400";
  let bgBoxClass = "bg-emerald-500/10 border-emerald-500/20";
  let textGradientClass = "from-emerald-400 via-cyan-400 to-blue-500";

  if (activeCategory === 'Flower & Prerolls') HeaderIcon = Leaf;
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

  const oneShotDeals = safeInventory.filter((i: any) => {
    if (i.dealType === 'One-Shot') return i.dealDays && i.dealDays.includes(currentDayId);
    if (i.dailyDeal && i.dealType !== 'Recurring') return true; 
    return false;
  });

  const recurringDeals = safeInventory.filter((i: any) => {
    if (i.dealType === 'Recurring') {
      if (!i.dealDays || i.dealDays.length === 0) return true;
      return i.dealDays.includes(currentDayId);
    }
    return false;
  });

  const newDropsBucket = safeInventory.filter((i: any) => i.isNewDrop && !i.isConfiguredDeal && !i.isClearance);
  const premiumWarehouseBucket = safeInventory.filter((i: any) => (i.isTopShelf || i.isChefsReserve) && !i.isNewDrop && !i.isConfiguredDeal && !i.isClearance);
  const smokyStealsBucket = safeInventory.filter((i: any) => i.isClearance && !i.dailyDeal);
  const returnedBucket = safeInventory.filter((i: any) => i.isReturned && !i.isNewDrop && !i.isConfiguredDeal && !i.isClearance);

  const activeTodaysDeals = [...oneShotDeals, ...recurringDeals].filter(item => !isItemOOS(item));

  const heroSlides: any[] = [
    {
      title: homeConfig?.hero?.title || 'LOADING...',
      subtitle: homeConfig?.hero?.subtitle || '',
      buttonText: homeConfig?.hero?.buttonText || 'ENTER',
      themeColor: getThemeColor((homeConfig?.hero as any)?.color || homeConfig?.hero?.colorFrom),
      icon: homeConfig?.hero?.icon || 'Flame',
      imgUrl: (homeConfig?.hero as any)?.imgUrl || undefined,
      action: () => {
         const dealsSection = document.getElementById('live-deals-section');
         if (dealsSection) dealsSection.scrollIntoView({ behavior: 'smooth' });
      }
    },
    ...activeTodaysDeals.map((item: any) => {
      const isNewDrop = item.campaignTag === 'NEW_DROP';
      const isClearance = item.campaignTag === 'VAULT_CLEARANCE';
      
      let catName = item.subCategory && item.subCategory !== 'All' ? item.subCategory : item.mainCategory;
      if (catName === 'Flower & Prerolls') catName = 'Premium Flower';
      if (catName === 'Vapes & Pens') catName = 'Vapes';
      if (catName === 'Merch & Extras') catName = 'Gear';
      if (catName === 'Healthcare & Topicals') catName = 'Wellness';

      let topText = "DAILY DEAL";
      if (item.dealType === 'Recurring') topText = dayTitle.toUpperCase();
      if (isNewDrop) topText = "FRESH DROP";
      if (isClearance) topText = "CLEARANCE";
      
      return {
        title: `${topText}\nON ${catName.toUpperCase()}`,
        subtitle: item.name,
        buttonText: "Shop Deal",
        themeColor: isNewDrop ? "cyan" : isClearance ? "rose" : "orange",
        icon: isNewDrop ? "Star" : isClearance ? "Tag" : "Flame",
        imgUrl: item.imageUrl || item.imgUrl || item.image || item.image_url || undefined,
        action: () => {
           const dealsSection = document.getElementById(item.dealType === 'Recurring' ? 'recurring-deals-section' : 'live-deals-section');
           if (dealsSection) dealsSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    })
  ];

  const slideCount = heroSlides.length;
  
  useEffect(() => {
    if (slideCount <= 1) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % slideCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [slideCount, heroIndex]);

  const activeHero = heroSlides[heroIndex] || heroSlides[0];
  const activeTheme = ThemeMap[activeHero.themeColor] || ThemeMap['cyan'];
  const ActiveHeroIcon = IconMap[activeHero.icon] || Flame;
  const secTheme = ThemeMap[getThemeColor((homeConfig?.secondary as any)?.color || homeConfig?.secondary?.colorFrom)] || ThemeMap['emerald'];
  const SecIcon = IconMap[homeConfig?.secondary?.icon] || Award;
  
  const isMasterSlide = heroIndex === 0;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeroIndex(prev => (prev + 1) % slideCount);
  };
  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHeroIndex(prev => (prev - 1 + slideCount) % slideCount);
  };

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
             
             <div onClick={activeHero.action} className={`w-full ${activeHero.imgUrl ? 'bg-zinc-950' : activeTheme.heroGrad} cursor-pointer rounded-3xl ${isMasterSlide ? 'p-4 md:p-8' : 'p-8 md:p-12'} flex flex-col justify-end shadow-2xl overflow-hidden relative group transition-all duration-700 h-100 md:h-125`}>
                {activeHero.imgUrl ? (
                   <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000">
                     <img src={activeHero.imgUrl} className={`w-full h-full object-cover ${isMasterSlide ? 'opacity-30' : 'opacity-90'}`} alt="Deal Background" />
                     <div className={`absolute inset-0 bg-linear-to-t ${isMasterSlide ? 'from-zinc-950 via-zinc-950/80 to-zinc-950/60' : 'from-zinc-950/90 via-zinc-950/20 to-transparent'}`} />
                   </div>
                ) : (
                   <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-1000">
                      {isMasterSlide && (
                         <>
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                            <div className="absolute inset-0 bg-radial-gradient from-transparent to-zinc-950"></div>
                         </>
                      )}
                   </div>
                )}
                
                {isMasterSlide ? (
                    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full my-auto py-4 pointer-events-none">
                        <div className="flex flex-col items-center text-center animate-[pulse_3s_ease-in-out_infinite] max-w-3xl mx-auto w-full">
                            <div className="relative mb-2">
                              <ActiveHeroIcon size={48} className="text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,1)] animate-bounce relative z-10" />
                              <div className="absolute inset-0 bg-pink-500 blur-2xl opacity-50 rounded-full animate-pulse"></div>
                            </div>
                            <div className="space-y-1 md:space-y-2 w-full">
                                {activeHero.title?.split('\n').map((line: string, i: number) => {
                                    const isCyan = i % 2 !== 0;
                                    return (
                                      <h2 key={i} className={`text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none ${isCyan ? 'text-cyan-300 drop-shadow-[0_0_20px_rgba(6,182,212,0.9)]' : 'text-pink-400 drop-shadow-[0_0_20px_rgba(236,72,153,0.9)]'}`}>
                                          {line}
                                      </h2>
                                    )
                                })}
                            </div>
                            <p className="mt-6 text-pink-100 font-black tracking-[0.3em] uppercase text-[10px] md:text-xs drop-shadow-[0_0_8px_rgba(236,72,153,0.8)]">
                                {activeHero.subtitle}
                            </p>
                            <div className="mt-8 px-8 py-3 border-2 border-cyan-400 text-cyan-300 font-black uppercase tracking-widest rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3),inset_0_0_15px_rgba(6,182,212,0.3)] hover:bg-cyan-400 hover:text-zinc-950 hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all pointer-events-auto relative overflow-hidden bg-zinc-950/40 backdrop-blur-sm">
                                <span className="relative z-10">{activeHero.buttonText}</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between w-full mt-auto gap-6 pointer-events-none">
                      <div>
                          <div key={`title-${heroIndex}`} className="flex flex-col gap-1 mb-2 animate-in slide-in-from-left-4 fade-in duration-500">
                             {activeHero.title?.split('\n').map((line: string, i: number) => {
                                 const isCyan = i % 2 !== 0;
                                 return (
                                   <h2 key={i} className={`text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter leading-none ${isCyan ? 'text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]' : 'text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.9)]'}`}>
                                       {line}
                                   </h2>
                                 )
                             })}
                          </div>
                          <p key={`sub-${heroIndex}`} className={`text-sm md:text-xl font-black uppercase tracking-widest mb-0 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] animate-in slide-in-from-left-4 fade-in duration-500 delay-75 text-white`}>
                            {activeHero.subtitle}
                          </p>
                      </div>
                      <button key={`btn-${heroIndex}`} className="shrink-0 bg-zinc-950/90 backdrop-blur-md text-white px-8 py-4 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-zinc-900 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-4 fade-in duration-500 delay-150 border border-zinc-800 pointer-events-auto">
                          {activeHero.buttonText}
                      </button>
                      {!activeHero.imgUrl && (
                        <ActiveHeroIcon key={`icon-${heroIndex}`} size={180} className="text-white/10 absolute right-0 md:-right-10 top-1/2 -translate-y-1/2 rotate-12 group-hover:scale-110 transition-transform duration-700 animate-in fade-in zoom-in-90" />
                      )}
                    </div>
                )}
                
                {slideCount > 1 && (
                  <>
                    <button onClick={prevSlide} className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-zinc-950/60 backdrop-blur-md text-white rounded-full hover:bg-zinc-900 border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 shadow-xl"><ChevronLeft size={24} /></button>
                    <button onClick={nextSlide} className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-30 p-3 bg-zinc-950/60 backdrop-blur-md text-white rounded-full hover:bg-zinc-900 border border-zinc-700/50 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 active:scale-95 shadow-xl"><ChevronRight size={24} /></button>

                    <div className="absolute top-6 right-6 flex items-center gap-2 z-20 bg-zinc-950/50 backdrop-blur-md px-3 py-2 rounded-full border border-zinc-800/50 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
                      {heroSlides.map((_, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); setHeroIndex(i); }} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === heroIndex ? 'bg-white scale-125 shadow-[0_0_10px_white]' : 'bg-white/30 hover:bg-white/70'}`} />
                      ))}
                    </div>
                  </>
                )}
             </div>

             {homeConfig?.bento && homeConfig.bento.length > 0 && (
               <div className="pt-4">
                 <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter text-zinc-100 mb-6 text-center">Shop By Categories</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 grid-flow-row-dense auto-rows-[160px] md:auto-rows-[180px]">
                   {homeConfig.bento.map((c: any, idx: number) => {
                     const BIcon = IconMap[c.icon] || Tag;
                     const sanitizedSpan = getSmartBentoSpan(idx, homeConfig.bento.length);
                     const theme = ThemeMap[getThemeColor(c.color)] || ThemeMap['emerald'];
                     
                     // 🚀 FALLBACK LOGIC
                     const displayImg = c.imgUrl || homeConfig.categoryImages?.[c.cat] || null;

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
                         {displayImg ? (
                            <div className="absolute inset-0 z-0 group-hover:scale-105 transition-transform duration-700">
                               <img src={displayImg} alt={c.name} className="w-full h-full object-cover opacity-40 mix-blend-luminosity" />
                               <div className={`absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/40`} />
                               <div className={`absolute inset-0 bg-linear-to-t ${theme.bentoOverlay} opacity-30`} />
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
             )}

             <div className={`w-full h-62.5 md:h-75 ${secTheme.secBg} rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-xl border border-zinc-700 overflow-hidden relative group`}>
                <div className="relative z-10 my-auto">
                  <p className="text-xs font-black uppercase tracking-widest text-zinc-900 mb-2">{homeConfig?.secondary?.subtitle}</p>
                  <h2 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tighter leading-none mb-6 whitespace-pre-line">{homeConfig?.secondary?.title}</h2>
                  <button className={`bg-zinc-950 ${secTheme.secBtnText} px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg border border-zinc-800`}>{homeConfig?.secondary?.buttonText}</button>
                </div>
                <SecIcon size={140} className="text-black/10 absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 group-hover:rotate-12 transition-transform duration-700" />
             </div>

             {recurringDeals.length > 0 && (
                <div id="recurring-deals-section" className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-6 border-t border-zinc-800/50 scroll-mt-24 relative overflow-hidden">
                   <div className="absolute top-0 left-1/4 w-1/3 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
                   <div className="flex items-center gap-6 mb-8 pt-6 relative z-10 pl-2">
                     <div className="shrink-0 border-[3px] border-rose-500 text-rose-500 px-3 py-1 rounded-md transform -rotate-12 shadow-[0_0_15px_rgba(244,63,94,0.4)] bg-zinc-950/80 backdrop-blur-sm relative after:absolute after:inset-0 after:border after:border-rose-500/30 after:rounded-md after:-m-1.5">
                       <span className="text-lg md:text-2xl font-black uppercase tracking-[0.2em] leading-none block pt-1">{currentDayName}</span>
                     </div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-violet-500 via-indigo-400 to-cyan-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">{dayTitle}</h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">{daySub}</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {recurringDeals.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
             )}

             {oneShotDeals.length > 0 && (
                <div id="live-deals-section" className="pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 mt-6 border-t border-zinc-800/50 scroll-mt-24 relative overflow-hidden">
                   <div className="absolute top-0 right-1/4 w-1/3 h-32 bg-orange-500/5 blur-3xl rounded-full" />
                   <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                     <div className="p-3 bg-orange-500/10 rounded-2xl border border-orange-500/40 shadow-[0_0_20px_rgba(249,115,22,0.3)]">
                       <Flame size={24} className="text-orange-400 animate-bounce" />
                     </div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-pink-500 via-orange-400 to-yellow-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">Live Right Now</h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Active daily flash promos.</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {oneShotDeals.map((item: any, idx: number) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} isHero={idx === 0} />)}
                   </div>
                </div>
             )}

             {newDropsBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50 relative overflow-hidden">
                   <div className="flex items-center justify-between mb-8 pt-6 relative z-10">
                     <div className="flex items-center gap-4">
                       <div className="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/40 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                         <Zap size={24} className="text-cyan-400 animate-pulse" />
                       </div>
                       <div>
                         <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-blue-500 via-cyan-400 to-indigo-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">New Arrivals</h3>
                         <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1 hidden sm:block">Fresh drops hitting the Warehouse.</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest bg-zinc-900/80 backdrop-blur-md px-4 py-2 rounded-full border border-zinc-800 shadow-md relative z-10">
                       Swipe <ArrowRight size={12} className="inline" />
                     </div>
                   </div>
                   
                   <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-6 pb-4 -mx-4 px-4 md:mx-0 md:px-0 relative z-10">
                     {newDropsBucket.map((item: any) => (
                       <div key={item.id} className="snap-start shrink-0 w-[85vw] sm:w-85">
                         <StorefrontCard item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />
                       </div>
                     ))}
                   </div>
                </div>
             )}

             {returnedBucket.length > 0 && (
                <div className="pt-6 animate-in fade-in mt-6 border-t border-zinc-800/50 relative overflow-hidden">
                   <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                     <div className="p-3 bg-lime-500/10 rounded-2xl border border-lime-500/40 shadow-[0_0_20px_rgba(132,204,22,0.3)]">
                       <RotateCcw size={24} className="text-lime-400" />
                     </div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-green-500 via-lime-400 to-emerald-400 drop-shadow-[0_0_10px_rgba(132,204,22,0.3)]">Back In The Warehouse</h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Returned by popular demand.</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {returnedBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
             )}

             {smokyStealsBucket.length > 0 && (
                <div className="pt-8 animate-in fade-in zoom-in-95 slide-in-from-bottom-12 duration-1000 mt-8 border-t border-zinc-800/50 relative overflow-hidden">
                 <div className="absolute top-0 left-1/4 w-1/2 h-32 bg-lime-500/5 blur-3xl rounded-full animate-pulse" />
                 <div className="absolute top-0 left-1/3 w-1/3 h-24 bg-zinc-500/10 blur-3xl rounded-full animate-pulse delay-75" />
                 <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                     <div className="p-3 bg-zinc-950 rounded-2xl border border-dashed border-lime-500/50 shadow-[0_0_20px_rgba(132,204,22,0.15)] relative overflow-hidden group">
                       <div className="absolute inset-0 bg-lime-500/20 blur-md group-hover:scale-150 transition-transform duration-1000" />
                       <Wind size={24} className="text-lime-400 relative z-10 animate-pulse" />
                     </div>
                     <div>
                       <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-zinc-500 via-lime-400 to-zinc-400 drop-shadow-[0_0_10px_rgba(132,204,22,0.2)]">
                         Smoky Steals
                       </h3>
                       <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Premium Selections • Clearance Prices</p>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                     {smokyStealsBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                   </div>
                </div>
             )}

             {premiumWarehouseBucket.length > 0 && (
                <div className="pt-8 animate-in fade-in mt-8 border-t border-zinc-800/50 relative overflow-hidden">
                 <div className="flex items-center gap-4 mb-8 pt-6 relative z-10">
                    <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]"> 
                      <Award size={24} className="text-amber-400" /> 
                    </div>
                    <div> 
                      <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-linear-to-r from-yellow-500 via-amber-400 to-amber-200 drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">The Premium Warehouse</h3> 
                      <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Exclusive Top Shelf Selections</p> 
                    </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                   {premiumWarehouseBucket.map((item: any) => <StorefrontCard key={item.id} item={item} cart={cart} updateCart={updateCart} clientConfig={clientConfig} />)}
                 </div>
               </div>
             )}

             {oneShotDeals.length === 0 && recurringDeals.length === 0 && newDropsBucket.length === 0 && premiumWarehouseBucket.length === 0 && smokyStealsBucket.length === 0 && returnedBucket.length === 0 && (
               <div className="flex flex-col items-center justify-center py-24 bg-zinc-900/20 rounded-3xl border border-dashed border-zinc-800/50 mt-6">
                  <div className="w-16 h-16 bg-zinc-950 rounded-full border border-zinc-800 flex items-center justify-center mb-4"> <Info size={24} className="text-zinc-600" /> </div>
                  <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">No Active Stock</p>
                  <p className="text-zinc-600 text-xs mt-2">Check back soon.</p>
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