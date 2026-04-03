import React from 'react';
import { Award, Flame, Star, Leaf, Box, Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function StorefrontCardFront({ item, cleanItemName, lowestPrice, lowestDiscounted, setIsFlipped }: any) {
  const ItemIcon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
  
  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || 'PROMO');

  return (
    <div className="absolute inset-0 w-full h-full backface-hidden bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-xl overflow-hidden">
      
      {/* Top 45% - Full Bleed Image Header */}
      <div className="relative w-full h-[45%] shrink-0 bg-zinc-950 border-b border-zinc-800 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800">
            <ItemIcon size={48} />
          </div>
        )}

        {/* Floating Custom Tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 items-start z-10">
           {item.isTopShelf && (
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-zinc-950/80 backdrop-blur-md border-amber-500/50 shadow-lg">
               <Award size={10} className="text-amber-400" />
               <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest text-shadow-sm">Reserve</span>
             </div>
           )}

           {item.featured && (
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-zinc-950/80 backdrop-blur-md border-cyan-500/50 shadow-lg">
               <Star size={10} className="text-cyan-400 animate-pulse" />
               <span className="text-cyan-400 text-[9px] font-black uppercase tracking-widest">Featured</span>
             </div>
           )}

           {item.dailyDeal && (
             <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] border-pink-400">
               <Flame size={10} className="text-zinc-950" />
               <span className="text-zinc-950 text-[9px] font-black uppercase tracking-widest">
                 {item.dealLogic && item.dealLogic !== 'STANDARD' ? formatPromo(item.dealLogic) : 'Promo'}
               </span>
             </div>
           )}
        </div>
      </div>

      {/* Bottom 55% - Centered Content Body */}
      <div className="flex flex-col flex-1 p-5 items-center text-center">
          
          {/* Classification Pills - Separated Admin Style */}
          <div className="flex items-center justify-center flex-wrap gap-1.5 w-full mb-3">
             <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 rounded text-[8px] font-bold text-zinc-400 uppercase tracking-widest shadow-inner">
               {item.mainCategory}
             </span>
             {item.subCategory && (
               <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-700/50 rounded text-[8px] font-bold text-zinc-300 uppercase tracking-widest shadow-inner">
                 {item.subCategory}
               </span>
             )}
             {item.strainType && item.strainType !== 'N/A' && (
               <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-bold text-emerald-400 uppercase tracking-widest shadow-inner">
                 {item.strainType}
               </span>
             )}
          </div>

          {/* Title */}
          <div className="mb-3 w-full">
             <h3 className={`text-xl md:text-2xl font-black leading-tight tracking-tighter line-clamp-2 ${item.isTopShelf ? 'text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-200' : 'text-zinc-100'}`}>
               {cleanItemName || 'Unnamed Item'}
             </h3>
          </div>

          {/* Marketing Description */}
          <div className="flex-1 w-full overflow-hidden mb-3">
             {item.descBase ? (
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium line-clamp-3">
                  {item.descBase}
                </p>
             ) : (
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic">No marketing copy provided.</p>
             )}
          </div>

          {/* Footer Actions */}
          <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between shrink-0 w-full">
            <div className="flex flex-col items-start">
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Starting At</span>
              <div className="flex items-end gap-1.5">
                 {lowestDiscounted < lowestPrice && <span className="text-[11px] font-black font-mono text-zinc-600 line-through leading-none mb-0.5">${lowestPrice.toFixed(0)}</span>}
                 <span className={`text-xl font-black font-mono leading-none ${item.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>${lowestDiscounted.toFixed(0)}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsFlipped(true)}
              className="bg-zinc-100 hover:bg-white text-zinc-950 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-md flex items-center gap-1"
            >
              Options <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
      </div>
    </div>
  );
}