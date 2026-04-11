'use client';

import React from 'react';
import { Megaphone, Leaf, Box, Image as ImageIcon, Zap, Repeat, X, Plus } from 'lucide-react';
import { DAYS_OF_WEEK } from './StorefrontSettings';

export default function CampaignEngine({ activeDeals, openCampaignConfig, removeDeal, openInventorySelector, weeklySchedule, clearOneShots }: any) {
  
  const oneShotDeals = activeDeals.filter((d: any) => d.dealType === 'One-Shot');
  const recurringDeals = activeDeals.filter((d: any) => d.dealType === 'Recurring' || d.dailyDeal);

  // Filter out any days that are explicitly marked as closed in the schedule
  const activeDays = DAYS_OF_WEEK.filter(day => {
    const sched = weeklySchedule?.[day.id];
    return !sched?.isClosed; // If there's no schedule object, assume it's open
  });
  
  const closedDaysCount = 7 - activeDays.length;

  // Hardcoded map to ensure Tailwind compiles the grid columns correctly
  const gridColsClass = 
    activeDays.length === 7 ? 'xl:grid-cols-7' :
    activeDays.length === 6 ? 'xl:grid-cols-6' :
    activeDays.length === 5 ? 'xl:grid-cols-5' :
    activeDays.length === 4 ? 'xl:grid-cols-4' :
    'xl:grid-cols-3';

  const getCardStyle = (tag: string) => {
    switch(tag) {
      case 'NEW_DROP': return 'border-cyan-500/50 bg-cyan-500/10 text-cyan-400';
      case 'TOP_SHELF': return 'border-amber-500/50 bg-amber-500/10 text-amber-400';
      case 'VAULT_CLEARANCE': return 'border-rose-500/50 bg-rose-500/10 text-rose-400';
      case 'HAPPY_HOUR': return 'border-indigo-500/50 bg-indigo-500/10 text-indigo-400';
      default: return 'border-pink-500/20 bg-pink-500/10 text-pink-500';
    }
  };

  const renderDealMath = (config: any) => {
    if (!config) return 'PROMO';
    if (config.type === 'BUNDLE') return `${config.buyQty} for $${config.bundlePrice}`;
    if (config.type === 'DISCOUNT') {
      if (config.discountType === 'PERCENT') return `${config.discountValue}% OFF`;
      if (config.discountType === 'DOLLAR') return `$${config.discountValue} OFF`;
      if (config.discountType === 'FIXED') return `NOW $${config.discountValue}`;
      if (config.discountType === 'TIERED') return `TIERED PRICING`; 
    }
    return `B${config.buyQty || 1} G${config.getQty || 1}`;
  };

  const renderDealCard = (deal: any) => {
    const ItemIcon = deal.iconName === 'Leaf' ? Leaf : deal.iconName === 'Box' ? Box : ImageIcon;
    const isLowStock = deal.onHand <= 5; 
    
    return (
      <div key={deal.id} className={`relative bg-zinc-900 border ${isLowStock ? 'border-rose-500/50 opacity-60 grayscale' : 'border-zinc-800'} p-3 rounded-2xl hover:border-pink-500/50 transition-all group shadow-sm flex flex-col gap-2`}>
        <button onClick={(e) => { e.stopPropagation(); removeDeal(deal); }} className="absolute -top-2 -right-2 bg-zinc-950 border border-zinc-800 text-zinc-500 hover:text-rose-400 hover:border-rose-500/50 p-1.5 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100">
          <X size={12} />
        </button>
        {isLowStock && <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-[1px] z-10 rounded-2xl flex items-center justify-center border border-rose-500/30"><span className="text-[10px] font-black text-rose-400 uppercase tracking-widest bg-zinc-950 px-2 py-1 rounded border border-rose-500/50">Deal Killed: Low Stock</span></div>}
        
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => openCampaignConfig(deal)}>
          <div className="w-8 h-8 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800 text-zinc-700 flex items-center justify-center">
            {deal.imageUrl ? <img src={deal.imageUrl} className="w-full h-full object-cover" alt="" /> : <ItemIcon size={12}/>}
          </div>
          <span className={`text-[10px] font-black text-zinc-100 line-clamp-2 transition-colors ${isLowStock ? '' : 'group-hover:text-pink-400'}`}>{deal.name}</span>
        </div>
        
        <div className="flex items-center justify-between mt-1 cursor-pointer" onClick={() => openCampaignConfig(deal)}>
          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded w-fit border ${getCardStyle(deal.campaignTag || 'PROMO')}`}>
            {deal.campaignTag || 'PROMO'}
          </span>
          <span className="text-[9px] font-mono font-bold text-zinc-400">{renderDealMath(deal.dealConfig)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl flex flex-col h-full w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-zinc-800/50 pb-4">
         <div className="flex items-center gap-3">
           <div className="p-2 bg-pink-500/10 rounded-lg text-pink-400"><Megaphone size={20}/></div>
           <div>
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Panoramic Strategy Board</h3>
             <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{activeDeals.length} Live Campaigns</p>
           </div>
         </div>
         {closedDaysCount > 0 && (
           <div className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
             <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
             Missing a day? Check settings—closed days are hidden.
           </div>
         )}
      </div>
      
      <div className="flex flex-col gap-8 w-full">
        {/* ONE-SHOT SPRINTS */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-zinc-800/50 pb-2 gap-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-2">
              <Zap size={14} className="text-amber-400"/> One-Shot Sprints (Manual Review)
            </h4>
            {oneShotDeals.length > 0 && (
              <button 
                onClick={clearOneShots}
                className="text-[9px] font-black uppercase tracking-widest text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <X size={12} /> Clear Sprints
              </button>
            )}
          </div>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-3`}>
            {activeDays.map((day) => {
              const todaysDeals = oneShotDeals.filter((d: any) => d.dealDays?.includes(day.id));
              const isToday = new Date().getDay() === day.id;
              return (
                <div key={`oneshot-${day.id}`} className={`flex flex-col rounded-3xl border transition-all ${isToday ? 'bg-amber-500/5 border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'bg-zinc-950/30 border-zinc-800/50'}`}>
                  <div className={`p-2 border-b text-center ${isToday ? 'border-amber-500/30 bg-amber-500/10' : 'border-zinc-800/50 bg-zinc-950'}`}>
                    <h4 className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-amber-400' : 'text-zinc-500'}`}>{isToday ? '🔥 Today' : day.label}</h4>
                  </div>
                  <div className="flex-1 p-3 space-y-2 flex flex-col">
                    {todaysDeals.map(renderDealCard)}
                    <button onClick={() => openInventorySelector(day.id, 'One-Shot')} className="mt-auto h-16 flex flex-col items-center justify-center border border-dashed border-zinc-700/50 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-2xl w-full text-zinc-600 hover:text-amber-400 transition-colors group active:scale-95">
                      <Plus size={16} className="mb-1 group-hover:scale-110 transition-transform"/>
                      <span className="text-[8px] font-black uppercase tracking-widest">Assign Deal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RECURRING BASELINE */}
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 flex items-center gap-2 border-b border-zinc-800/50 pb-2"><Repeat size={14} className="text-indigo-400"/> Recurring Baseline (Weekly Auto-Run)</h4>
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${gridColsClass} gap-3`}>
            {activeDays.map((day) => {
              const todaysDeals = recurringDeals.filter((d: any) => !d.dealDays || d.dealDays.length === 0 || d.dealDays.includes(day.id));
              const isToday = new Date().getDay() === day.id;
              return (
                <div key={`recurring-${day.id}`} className={`flex flex-col rounded-3xl border transition-all ${isToday ? 'bg-indigo-500/5 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)]' : 'bg-zinc-950/50 border-zinc-800'}`}>
                  <div className={`p-2 border-b text-center ${isToday ? 'border-indigo-500/30 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/80'}`}>
                    <h4 className={`text-[9px] font-black uppercase tracking-widest ${isToday ? 'text-indigo-400' : 'text-zinc-500'}`}>{isToday ? '🔥 Today' : day.label}</h4>
                  </div>
                  <div className="flex-1 p-3 space-y-2 flex flex-col">
                    {todaysDeals.map(renderDealCard)}
                    <button onClick={() => openInventorySelector(day.id, 'Recurring')} className="mt-auto h-16 flex flex-col items-center justify-center border border-dashed border-zinc-700/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 rounded-2xl w-full text-zinc-600 hover:text-indigo-400 transition-colors group active:scale-95">
                      <Plus size={16} className="mb-1 group-hover:scale-110 transition-transform"/>
                      <span className="text-[8px] font-black uppercase tracking-widest">Set Base</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}