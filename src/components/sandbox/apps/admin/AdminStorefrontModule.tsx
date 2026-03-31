import React, { useState, useMemo } from 'react';
import { Store, Clock, CalendarDays, Megaphone, Flame, Award, Star, Package, TrendingDown, Save, ChefHat, LayoutList, Calendar, CalendarRange } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Sunday' },
  { id: 1, label: 'Monday' },
  { id: 2, label: 'Tuesday' },
  { id: 3, label: 'Wednesday' },
  { id: 4, label: 'Thursday' },
  { id: 5, label: 'Friday' },
  { id: 6, label: 'Saturday' }
];

export default function AdminStorefrontModule({ inventoryMatrix, setNotification, clientConfig }: any) {
  
  // Weekly Schedule State
  const defaultWeeklySchedule = {
    0: { open: '08:00', close: '17:00', isClosed: true },
    1: { open: '08:00', close: '17:00', isClosed: true },
    2: { open: '08:00', close: '17:00', isClosed: false },
    3: { open: '08:00', close: '17:00', isClosed: false },
    4: { open: '08:00', close: '17:00', isClosed: false },
    5: { open: '08:00', close: '17:00', isClosed: false },
    6: { open: '08:00', close: '17:00', isClosed: false },
  };
  const [weeklySchedule, setWeeklySchedule] = useStickyState<any>(defaultWeeklySchedule, `store_weekly_hours_${clientConfig?.id}`);
  
  // Operational Settings
  const [shiftChange, setShiftChange] = useStickyState('12:00', `store_shift_change_${clientConfig?.id}`);
  const [storeOverride, setStoreOverride] = useStickyState('AUTO', `store_override_${clientConfig?.id}`); 
  
  // Campaign Engine View State
  const [campaignView, setCampaignView] = useState<'LIST' | 'WEEK' | 'MONTH'>('WEEK');

  const handleScheduleChange = (dayId: number, field: string, value: any) => {
    setWeeklySchedule((prev: any) => ({ ...prev, [dayId]: { ...prev[dayId], [field]: value } }));
  };

  const handleSaveHours = () => {
    setNotification("Store hours & operational settings updated securely.");
  };

  // --- ENGINE INSIGHTS & METRICS ---
  
  const activeDeals = useMemo(() => {
    return inventoryMatrix.filter((i: any) => i.dailyDeal);
  }, [inventoryMatrix]);

  const overstockCandidates = useMemo(() => {
    return inventoryMatrix
      .filter((i: any) => {
        const totalStock = i.onHand || (i.options ? i.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        return totalStock >= 30 && !i.dailyDeal;
      })
      .sort((a: any, b: any) => {
        const aStock = a.onHand || (a.options ? a.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        const bStock = b.onHand || (b.options ? b.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
        return bStock - aStock;
      })
      .slice(0, 4); 
  }, [inventoryMatrix]);

  const topShelfFlowerCount = inventoryMatrix.filter((i: any) => i.isTopShelf && i.mainCategory !== 'Edibles').length;
  const chefsReserveCount = inventoryMatrix.filter((i: any) => i.isTopShelf && i.mainCategory === 'Edibles').length;
  const featuredCount = inventoryMatrix.filter((i: any) => i.featured).length;

  // Mock Calendar Generation for Monthly View
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const monthDays = Array.from({ length: 35 }, (_, i) => {
    const dayNumber = i - firstDayOfMonth + 1;
    return (dayNumber > 0 && dayNumber <= daysInMonth) ? dayNumber : null;
  });

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-500/10 p-4 rounded-3xl border border-indigo-500/30 text-indigo-400 shadow-lg">
            <Store size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight">Store Operations</h2>
            <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
              Live Terminal Control <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-950/80 backdrop-blur-md border border-zinc-800 p-1.5 rounded-2xl shadow-inner">
           <button 
             onClick={() => setStoreOverride('AUTO')}
             className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'AUTO' ? 'bg-indigo-500 text-zinc-950 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'}`}
           >
             Auto Set
           </button>
           <button 
             onClick={() => setStoreOverride('FORCE_OPEN')}
             className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'FORCE_OPEN' ? 'bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-zinc-500 hover:text-emerald-400 hover:bg-zinc-900'}`}
           >
             Force Open
           </button>
           <button 
             onClick={() => setStoreOverride('FORCE_CLOSE')}
             className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${storeOverride === 'FORCE_CLOSE' ? 'bg-rose-500 text-zinc-950 shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-zinc-500 hover:text-rose-400 hover:bg-zinc-900'}`}
           >
             Force Close
           </button>
        </div>
      </div>

      {/* METRICS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
         <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
            <Flame size={20} className="text-rose-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{activeDeals.length}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Active Promos</span>
         </div>
         <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
            <Award size={20} className="text-amber-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{topShelfFlowerCount}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Top Shelf Items</span>
         </div>
         <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
            <ChefHat size={20} className="text-fuchsia-400 mb-2" />
            <span className="text-3xl font-black text-zinc-100 leading-none">{chefsReserveCount}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1">Chef's Reserve</span>
         </div>
         <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors" />
            <Star size={20} className="text-cyan-400 mb-2 z-10" />
            <span className="text-3xl font-black text-zinc-100 leading-none z-10">{featuredCount}</span>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1 z-10">Featured Drops</span>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: SCHEDULE CONTROLS */}
        <div className="xl:col-span-4 space-y-6">
           <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                  <CalendarDays size={16} className="text-indigo-400"/> Master Schedule
                </h3>
             </div>
             
             <div className="space-y-3 mb-6">
               {DAYS_OF_WEEK.map((day) => {
                 const sched = weeklySchedule[day.id];
                 return (
                   <div key={day.id} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${sched.isClosed ? 'bg-zinc-950/50 border-zinc-800/50 opacity-60' : 'bg-zinc-950 border-zinc-800 shadow-inner'}`}>
                     <div className="flex items-center gap-3 w-28">
                       <button 
                         onClick={() => handleScheduleChange(day.id, 'isClosed', !sched.isClosed)}
                         className={`w-10 h-5 rounded-full relative transition-colors ${sched.isClosed ? 'bg-rose-500/20 border border-rose-500/50' : 'bg-emerald-500/20 border border-emerald-500/50'}`}
                       >
                         <div className={`w-3 h-3 rounded-full absolute top-0.5 transition-all ${sched.isClosed ? 'left-0.5 bg-rose-400' : 'left-5 bg-emerald-400'}`} />
                       </button>
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{day.label.substring(0,3)}</span>
                     </div>
                     
                     <div className="flex items-center gap-2 flex-1 justify-end">
                       <input 
                         type="time" value={sched.open} onChange={(e) => handleScheduleChange(day.id, 'open', e.target.value)} disabled={sched.isClosed}
                         className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 p-2 rounded-lg outline-none disabled:opacity-50"
                       />
                       <span className="text-zinc-600 text-[10px]">TO</span>
                       <input 
                         type="time" value={sched.close} onChange={(e) => handleScheduleChange(day.id, 'close', e.target.value)} disabled={sched.isClosed}
                         className="bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-300 p-2 rounded-lg outline-none disabled:opacity-50"
                       />
                     </div>
                   </div>
                 );
               })}
             </div>

             <div className="pt-6 border-t border-zinc-800/50">
                <div className="flex items-center justify-between bg-zinc-950 border border-zinc-800 p-4 rounded-2xl shadow-inner">
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 flex items-center gap-1.5"><Clock size={12}/> Shift Change Cutoff</h4>
                    <p className="text-[9px] font-bold text-zinc-500">Time when Shift A transitions to Shift B</p>
                  </div>
                  <input 
                    type="time" value={shiftChange} onChange={(e) => setShiftChange(e.target.value)}
                    className="bg-zinc-900 border border-amber-500/30 text-sm font-mono text-amber-400 p-2.5 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>
             </div>

             <button onClick={handleSaveHours} className="w-full mt-6 bg-indigo-500 hover:bg-indigo-400 text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95">
                <Save size={16} /> Commit Schedule
             </button>
           </div>
        </div>

        {/* RIGHT COLUMN: PROMOTIONS & INSIGHTS */}
        <div className="xl:col-span-8 space-y-6">
           
           {/* CAMPAIGN ENGINE WITH CALENDAR VIEWS */}
           <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl flex flex-col h-120">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0 border-b border-zinc-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <Megaphone size={20} className="text-rose-400"/> 
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">Campaign Engine</h3>
                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{activeDeals.length} Live Deals Configured</p>
                  </div>
                </div>
                
                {/* VIEW TOGGLES */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 p-1.5 rounded-xl shadow-inner">
                  <button onClick={() => setCampaignView('LIST')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'LIST' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`}><LayoutList size={12}/> List</button>
                  <button onClick={() => setCampaignView('WEEK')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'WEEK' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`}><CalendarRange size={12}/> Week</button>
                  <button onClick={() => setCampaignView('MONTH')} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${campaignView === 'MONTH' ? 'bg-zinc-800 text-rose-400' : 'text-zinc-500 hover:text-zinc-300'}`}><Calendar size={12}/> Month</button>
                </div>
             </div>
             
             {/* DYNAMIC VIEW RENDERER */}
             <div className="flex-1 overflow-hidden min-h-0 relative">
               
               {/* LIST VIEW */}
               {campaignView === 'LIST' && (
                 <div className="h-full overflow-y-auto custom-scrollbar pr-2 space-y-3">
                   {activeDeals.length > 0 ? activeDeals.map((item: any) => (
                     <div key={item.id} className="bg-zinc-950 border border-rose-500/20 p-4 rounded-2xl flex items-center justify-between shadow-inner">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                           <Flame size={18} />
                         </div>
                         <div>
                           <h4 className="font-black text-sm text-zinc-100 leading-none mb-1.5">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</h4>
                           <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md">{item.dealType}</span>
                             <span className="text-[9px] font-bold text-zinc-400">{item.dealText}</span>
                           </div>
                         </div>
                       </div>
                     </div>
                   )) : (
                     <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                        <Megaphone size={32} className="mb-2 opacity-50" />
                        <p className="text-[10px] font-black uppercase tracking-widest">No Active Campaigns</p>
                     </div>
                   )}
                 </div>
               )}

               {/* WEEKLY VIEW */}
               {campaignView === 'WEEK' && (
                 <div className="h-full grid grid-cols-7 gap-2 overflow-x-auto pb-2">
                   {DAYS_OF_WEEK.map((day) => {
                     const todaysDeals = activeDeals.filter((d: any) => !d.dealDays || d.dealDays.length === 0 || d.dealDays.includes(day.id) || d.dealType === 'Daily Deal');
                     return (
                       <div key={day.id} className="bg-zinc-950 border border-zinc-800/50 rounded-2xl p-2 flex flex-col min-w-25">
                         <div className="text-center border-b border-zinc-800/50 pb-2 mb-2">
                           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{day.label.substring(0,3)}</span>
                         </div>
                         <div className="flex-1 overflow-y-auto custom-scrollbar space-y-1.5 pr-1">
                           {todaysDeals.map((deal: any) => (
                             <div key={deal.id} className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-1.5" title={deal.dealText}>
                               <p className="text-[8px] font-black text-rose-400 uppercase tracking-tight leading-tight truncate">{deal.name}</p>
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               )}

               {/* MONTHLY CALENDAR VIEW */}
               {campaignView === 'MONTH' && (
                 <div className="h-full flex flex-col">
                   <div className="grid grid-cols-7 gap-1 mb-2 shrink-0">
                     {['S','M','T','W','T','F','S'].map((day, i) => (
                       <div key={i} className="text-center text-[10px] font-black uppercase text-zinc-500">{day}</div>
                     ))}
                   </div>
                   <div className="flex-1 grid grid-cols-7 gap-1">
                     {monthDays.map((dayNum, idx) => {
                       const isToday = dayNum === currentDate.getDate();
                       const dealsThisDay = dayNum ? activeDeals.filter((d: any) => !d.dealDays || d.dealDays.length === 0 || d.dealDays.includes(idx % 7) || d.dealType === 'Daily Deal') : [];
                       
                       return (
                         <div key={idx} className={`border rounded-xl p-1 flex flex-col ${dayNum ? (isToday ? 'bg-zinc-900 border-emerald-500/30' : 'bg-zinc-950 border-zinc-800/50') : 'border-transparent opacity-0'}`}>
                           <span className={`text-[10px] font-bold ${isToday ? 'text-emerald-400' : 'text-zinc-600'} pl-1`}>{dayNum}</span>
                           <div className="flex-1 flex flex-wrap gap-0.5 mt-1 overflow-hidden content-start">
                              {dealsThisDay.slice(0, 4).map((d: any, i: number) => (
                                <div key={i} className="w-2 h-2 rounded-full bg-rose-500/50" title={d.name} />
                              ))}
                              {dealsThisDay.length > 4 && <span className="text-[8px] text-zinc-500 leading-none">+{dealsThisDay.length - 4}</span>}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
               )}
             </div>
           </div>

           {/* OVERSTOCK INSIGHTS */}
           <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl p-6 shadow-xl">
             <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
                  <TrendingDown size={16} className="text-cyan-400"/> Promo Candidates
                </h3>
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">High Stock Alerts</span>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {overstockCandidates.length > 0 ? overstockCandidates.map((item: any) => {
                 const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
                 
                 return (
                   <div key={item.id} className="flex flex-col bg-zinc-950 border border-zinc-800 p-4 rounded-2xl">
                     <div className="flex items-start justify-between mb-3">
                       <div className="flex flex-col pr-2">
                         <span className="text-xs font-black text-zinc-200 truncate">{item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim()}</span>
                         <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{item.mainCategory}</span>
                       </div>
                       <div className="text-right shrink-0">
                         <span className="block text-[8px] font-black uppercase tracking-widest text-cyan-500 mb-0.5">Vault Stock</span>
                         <span className="text-sm font-mono font-black text-zinc-300">{totalStock}</span>
                       </div>
                     </div>
                     <button className="w-full bg-zinc-900 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-400 border border-cyan-900/50 transition-colors py-2 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95">
                       Create Campaign
                     </button>
                   </div>
                 );
               }) : (
                 <div className="col-span-full text-center text-zinc-500 text-[10px] font-black uppercase tracking-widest py-4">
                   Inventory is highly optimized. No overstock detected.
                 </div>
               )}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}