'use client';

import React from 'react';
import { Megaphone, LayoutList, CalendarRange, Flame, Edit3, Leaf, Box, Image as ImageIcon } from 'lucide-react';
import { DAYS_OF_WEEK } from './StorefrontSettings';

export default function CampaignEngine({ 
  activeDeals, 
  campaignView, 
  setCampaignView, 
  formatPromo, 
  openEditor 
}: any) {
  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl flex flex-col h-full flex-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-zinc-800/50 pb-4">
         <div className="flex items-center gap-3">
           <Megaphone size={20} className="text-pink-400"/> 
           <div>
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Campaign Engine</h3>
             <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{activeDeals.length} Live Deals Configured</p>
           </div>
         </div>
         
         <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl shadow-inner">
           <button onClick={() => setCampaignView('LIST')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'LIST' ? 'bg-zinc-800 text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutList size={12}/> List</button>
           <button onClick={() => setCampaignView('WEEK')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'WEEK' ? 'bg-zinc-800 text-pink-400' : 'text-zinc-500 hover:text-zinc-300'}`}><CalendarRange size={12}/> Week</button>
         </div>
      </div>
      
      <div className="flex-1 overflow-hidden min-h-0 relative">
        {campaignView === 'LIST' ? (
          <div className="h-full overflow-y-auto scrollbar-hide border border-zinc-800/50 rounded-2xl bg-zinc-950/30">
            <table className="w-full text-left border-collapse">
              <thead className="bg-zinc-950 border-b border-zinc-800 sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Product Target</th>
                  <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Hook & Logic</th>
                  <th className="py-3 px-4 text-[9px] font-black uppercase tracking-widest text-zinc-500">Schedule Status</th>
                  <th className="py-3 px-4 text-right text-[9px] font-black uppercase tracking-widest text-zinc-500">Manage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {activeDeals.map((item: any) => {
                  const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Box' ? Box : ImageIcon;
                  return (
                    <tr key={item.id} className="hover:bg-zinc-900/50 transition-colors">
                       <td className="py-3 px-4">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center text-zinc-700 shrink-0">
                               {item.imageUrl ? <img src={item.imageUrl} className="w-full h-full object-cover" /> : <ItemIcon size={16}/>}
                            </div>
                            <div>
                               <p className="text-xs font-black text-zinc-100 leading-none mb-1">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</p>
                               <p className="text-[8px] font-mono text-zinc-500">{item.id}</p>
                            </div>
                         </div>
                       </td>
                       <td className="py-3 px-4">
                         <div className="flex flex-col gap-1 items-start">
                           <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[8px] font-black uppercase tracking-widest rounded flex items-center gap-1"><Flame size={10}/> {item.dealLogic && item.dealLogic !== 'STANDARD' ? formatPromo(item.dealLogic) : 'PROMO'}</span>
                           <span className="text-[9px] font-bold text-zinc-300 italic">"{item.dealText}"</span>
                         </div>
                       </td>
                       <td className="py-3 px-4">
                         {item.dealType === 'Daily Deal' ? (
                           <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded w-fit border border-emerald-500/20">
                             <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/> Always Active
                           </span>
                         ) : (
                           <div className="flex gap-1 flex-wrap w-32">
                             {item.dealDays?.length > 0 ? item.dealDays.map((d: number) => (
                                <span key={d} className="text-[8px] font-black bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{DAYS_OF_WEEK[d].label.substring(0,3)}</span>
                             )) : <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">No Days</span>}
                           </div>
                         )}
                       </td>
                       <td className="py-3 px-4 text-right">
                          <button onClick={() => openEditor(item)} className="p-2 bg-zinc-950 hover:bg-emerald-500/20 border border-zinc-800 hover:border-emerald-500/50 rounded-lg text-zinc-500 hover:text-emerald-400 transition-colors shadow-inner inline-flex">
                            <Edit3 size={14}/>
                          </button>
                       </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-full flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {DAYS_OF_WEEK.map((day) => {
              const todaysDeals = activeDeals.filter((d: any) => !d.dealDays || d.dealDays.length === 0 || d.dealDays.includes(day.id) || d.dealType === 'Daily Deal');
              const isToday = new Date().getDay() === day.id;
              return (
                <div key={day.id} className={`flex flex-col min-w-55 rounded-2xl border transition-colors ${isToday ? 'bg-pink-500/5 border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.05)]' : 'bg-zinc-950/50 border-zinc-800'} overflow-hidden`}>
                  <div className={`p-3 border-b text-center ${isToday ? 'border-pink-500/30 bg-pink-500/10' : 'border-zinc-800 bg-zinc-900/80'}`}>
                    <h4 className={`text-[10px] font-black uppercase tracking-widest ${isToday ? 'text-pink-400' : 'text-zinc-500'}`}>
                      {isToday ? '🔥 Today' : day.label}
                    </h4>
                  </div>
                  <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide">
                    {todaysDeals.map((deal: any) => {
                      const ItemIcon = deal.iconName === 'Leaf' ? Leaf : deal.iconName === 'Box' ? Box : ImageIcon;
                      return (
                        <div key={deal.id} onClick={() => openEditor(deal)} className="bg-zinc-900 border border-zinc-800 p-2.5 rounded-xl cursor-pointer hover:border-pink-500/50 transition-colors group shadow-sm flex flex-col gap-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-zinc-950 overflow-hidden shrink-0 border border-zinc-800 text-zinc-700 flex items-center justify-center">
                              {deal.imageUrl ? <img src={deal.imageUrl} className="w-full h-full object-cover" /> : <ItemIcon size={12}/>}
                            </div>
                            <span className="text-[10px] font-black text-zinc-100 line-clamp-2 group-hover:text-pink-400 transition-colors">{deal.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-pink-500 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded w-fit">{deal.dealLogic && deal.dealLogic !== 'STANDARD' ? formatPromo(deal.dealLogic) : 'PROMO'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}