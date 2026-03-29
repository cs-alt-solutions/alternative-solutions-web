import React, { useState } from 'react';
import { Store, Zap, AlertTriangle, TrendingDown, Flame, CheckCircle, Clock } from 'lucide-react';
import { useStickyState } from '@/hooks/useStickyState';

export default function AdminStorefrontModule({ stock, setStock, inventoryMatrix, setNotification, clientConfig }: any) {
  const [dayStatus, setDayStatus] = useStickyState<'standby' | 'review' | 'live'>('standby', `day_status_${clientConfig?.id}`);
  
  const [storeHours, setStoreHours] = useStickyState({ open: '08:00', shiftChange: '12:00', close: '17:00' }, `store_hours_${clientConfig?.id}`);
  const [tempHours, setTempHours] = useState(storeHours);

  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const codeA = `${month}${day}A`;
  const codeB = `${month}${day}B`;

  const toggleFlag = (itemId: string, flagType: 'featured' | 'dailyDeal') => {
    setStock((prev: any[]) => prev.map((item: any) => 
      item.id === itemId ? { ...item, [flagType]: !item[flagType] } : item
    ));
    setNotification(`Updated: ${flagType === 'featured' ? 'Featured Status' : 'Daily Deal'}`);
  };

  const advancePipeline = (nextState: 'review' | 'live' | 'standby') => {
    if (nextState === 'review') {
      setStoreHours(tempHours);
    }
    setDayStatus(nextState);
    if (nextState === 'live') {
      setNotification("Codes Generated. Storefront is LIVE.");
    } else if (nextState === 'standby') {
      setNotification("Day Closed. Resetting sequence.");
    }
  };

  return (
    <div className="p-4 md:p-8 animate-in fade-in">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-fuchsia-500/10 p-3 rounded-2xl border border-fuchsia-500/30 text-fuchsia-400">
            <Store size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Daily Operations</h2>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Storefront Pipeline</p>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-2 shadow-inner">
           <div className={`w-2 h-2 rounded-full ${dayStatus === 'live' ? 'bg-emerald-500 animate-pulse' : dayStatus === 'review' ? 'bg-amber-500' : 'bg-zinc-600'}`} />
           <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
             {dayStatus === 'live' ? 'Market Live' : dayStatus === 'review' ? 'Menu Review' : 'Market Closed'}
           </span>
        </div>
      </div>

      {dayStatus === 'standby' && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-100">
          <Clock size={48} className="text-emerald-400 mb-4 animate-pulse" />
          <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Set Operating Hours</h3>
          <p className="text-sm font-bold text-zinc-500 mb-8 max-w-sm">Configure today's operational limits. Carts will automatically clear at the shift change.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-8">
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-left">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Store Opens</label>
               <input type="time" value={tempHours.open} onChange={(e) => setTempHours({...tempHours, open: e.target.value})} className="w-full bg-zinc-900 text-white font-mono p-3 rounded-lg border border-zinc-700 outline-none" />
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-left relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Shift Cutoff (Nuke)</label>
               <input type="time" value={tempHours.shiftChange} onChange={(e) => setTempHours({...tempHours, shiftChange: e.target.value})} className="w-full bg-zinc-900 text-white font-mono p-3 rounded-lg border border-zinc-700 outline-none" />
            </div>
            <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-xl text-left">
               <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Store Closes</label>
               <input type="time" value={tempHours.close} onChange={(e) => setTempHours({...tempHours, close: e.target.value})} className="w-full bg-zinc-900 text-white font-mono p-3 rounded-lg border border-zinc-700 outline-none" />
            </div>
          </div>

          <button 
            onClick={() => advancePipeline('review')}
            className="bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-black uppercase tracking-widest py-4 px-12 rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(217,70,239,0.3)] flex items-center gap-2"
          >
            <Zap size={20} /> Lock Times & Ignite
          </button>
        </div>
      )}

      {dayStatus === 'review' && (
        <div className="animate-in slide-in-from-bottom-4">
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-6 flex justify-between items-center shadow-inner">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={16} /> Reviewing Board Before Code Generation
            </p>
            <button 
              onClick={() => advancePipeline('live')}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black uppercase tracking-widest py-2 px-6 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
            >
              Lock Menu & Generate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stock.map((item: any) => {
              const matrixData = inventoryMatrix?.find((i: any) => i.id === item.id);
              const availableUnits = matrixData ? matrixData.available : item.onHand;
              const isAbundant = availableUnits >= 15;

              return (
                <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 transition-all hover:border-zinc-700 relative overflow-hidden">
                  {isAbundant && !item.dailyDeal && (
                     <div className="absolute top-0 left-0 w-full bg-emerald-500/10 border-b border-emerald-500/20 py-1 flex items-center justify-center gap-1.5 animate-pulse">
                       <TrendingDown size={12} className="text-emerald-400" />
                       <span className="text-[9px] font-black uppercase tracking-widest text-emerald-400">System Suggestion: High Yield ({availableUnits} avail) - Push Deal</span>
                     </div>
                  )}
                  <div className={`flex justify-between items-start mb-4 ${isAbundant && !item.dailyDeal ? 'mt-6' : ''}`}>
                    <div>
                      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{item.category}</p>
                      <h3 className="text-lg font-black text-white uppercase leading-none">{item.name}</h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button onClick={() => toggleFlag(item.id, 'featured')} className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${item.featured ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                      <span className="text-lg leading-none">{item.featured ? '⭐' : '☆'}</span> 
                      <span className="text-[9px] font-black uppercase tracking-widest">Featured</span>
                    </button>
                    <button onClick={() => toggleFlag(item.id, 'dailyDeal')} className={`p-3 rounded-xl border transition-all flex flex-col items-center justify-center gap-1 ${item.dailyDeal ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
                      <Flame size={18} className={item.dailyDeal ? "animate-pulse" : ""} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Daily Deal</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {dayStatus === 'live' && (
        <div className="animate-in slide-in-from-bottom-4">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-8 mb-8 text-center shadow-lg">
            <h3 className="text-xl font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center justify-center gap-2">
              <CheckCircle size={24} /> Transmission Payloads Ready
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-500" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Shift A ({storeHours.open} - {storeHours.shiftChange})</p>
                <p className="text-4xl font-black text-white font-mono">{codeA}</p>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-fuchsia-500" />
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Shift B ({storeHours.shiftChange} - {storeHours.close})</p>
                <p className="text-4xl font-black text-white font-mono">{codeB}</p>
              </div>
            </div>
          </div>
          <button onClick={() => advancePipeline('standby')} className="w-full text-[10px] font-black text-zinc-600 hover:text-rose-500 uppercase tracking-widest">End Day & Close Market</button>
        </div>
      )}
    </div>
  );
}