'use client';

import React, { useState } from 'react';
import { TrendingDown, ChevronRight, AlertTriangle, ChevronDown } from 'lucide-react';

export default function PromoInsights({ overstockCandidates, openCampaignConfig }: any) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getMaxTier = (onHand: number, isFlower: boolean) => {
    if (!isFlower) return { label: 'N/A', color: 'text-zinc-500', bg: 'bg-zinc-900 border-zinc-800' };
    if (onHand >= 28) return { label: 'Ounce (28g)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (onHand >= 14) return { label: 'Half (14g)', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' };
    if (onHand >= 7) return { label: 'Quarter (7g)', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (onHand >= 3.5) return { label: 'Eighth (3.5g)', color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' };
    if (onHand >= 1) return { label: 'Gram (1g)', color: 'text-rose-500', bg: 'bg-rose-950 border-rose-900/50' };
    return { label: 'Critical / 0g', color: 'text-zinc-600', bg: 'bg-zinc-950 border-zinc-800' };
  };

  const hasCandidates = overstockCandidates && overstockCandidates.length > 0;

  return (
    <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800 rounded-4xl shadow-xl flex flex-col overflow-hidden transition-all duration-300">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-5 md:p-6 w-full hover:bg-zinc-800/50 transition-colors"
      >
         <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
             <TrendingDown size={18} />
           </div>
           <div className="text-left">
             {/* FIXED: Changed text from Clearance to Promo Candidates */}
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2">
               Promo Candidates
             </h3>
             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
               {hasCandidates ? `${overstockCandidates.length} Items Flagged for Promotion` : 'Warehouse is optimized'}
             </p>
           </div>
         </div>
         <div className="flex items-center gap-4">
           {hasCandidates && !isExpanded && (
             <span className="hidden sm:flex px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[9px] font-black uppercase tracking-widest rounded-lg animate-pulse">
               Promo Opportunity
             </span>
           )}
           <div className={`p-2 bg-zinc-950 rounded-full border border-zinc-800 text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
             <ChevronDown size={16} />
           </div>
         </div>
      </button>

      {isExpanded && (
        <div className="p-6 pt-0 border-t border-zinc-800/50 mt-2 animate-in slide-in-from-top-4">
          {hasCandidates ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {overstockCandidates.map((item: any) => {
                const totalStock = item.onHand || (item.options ? item.options.reduce((sum: number, o: any) => sum + (Number(o.stock) || 0), 0) : 0);
                const isFlower = item.mainCategory === 'Flower & Plants';
                const tierStatus = getMaxTier(totalStock, isFlower);
                
                return (
                  <div key={item.id} className="flex flex-col bg-zinc-950 border border-zinc-800 p-4 rounded-3xl transition-colors hover:border-cyan-500/30 group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex flex-col pr-2">
                        <span className="text-xs font-black text-zinc-200 truncate group-hover:text-cyan-400 transition-colors">{item.name}</span>
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">{item.mainCategory}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-cyan-500 mb-0.5">Stock</span>
                        <span className="text-sm font-mono font-black text-zinc-300">{totalStock}</span>
                      </div>
                    </div>

                    {isFlower && (
                      <div className="mb-3 flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl p-2">
                        <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-1"><AlertTriangle size={10}/> Max Fulfillable</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${tierStatus.bg} ${tierStatus.color}`}>
                          {tierStatus.label}
                        </span>
                      </div>
                    )}

                    <button 
                      onClick={() => openCampaignConfig(item)} 
                      className="w-full mt-auto bg-zinc-900 hover:bg-cyan-500 hover:text-zinc-950 text-cyan-400 border border-cyan-900/50 transition-colors py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 flex justify-center items-center gap-2"
                    >
                      Config Deal <ChevronRight size={12}/>
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Warehouse is highly optimized. No overstock detected.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}