import React from 'react';
import { Award, Flame, Star, Leaf, Box, Image as ImageIcon, ArrowRight, Dna } from 'lucide-react';
import { getRequiredGrams } from './StorefrontComponents';

export default function StorefrontCardFront({ item, cleanItemName, lowestPrice, lowestDiscounted, setIsFlipped, sizes, isFlower, clientConfig }: any) {
  const ItemIcon = item?.iconName === 'Leaf' ? Leaf : item?.iconName === 'Flame' ? Flame : item?.iconName === 'Box' ? Box : ImageIcon;
  
  // Use client-specific dictionary for standard labels
  const UI = clientConfig?.dictionary?.storefront || {
    topShelf: 'Top Shelf',
    featured: 'Featured',
    promo: 'Promo',
    by: 'By',
    startingAt: 'Starting At',
    options: 'Options',
    unnamed: 'Unnamed Item',
    viewInfo: 'View Info'
  };

  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || UI.promo);

  // --- WEIGHT-AWARE OOS CALCULATION ---
  let isOutOfStock = false;
  if (isFlower) {
      const minRequiredGrams = sizes && sizes.length > 0 ? Math.min(...sizes.map((s:any) => getRequiredGrams(s.label))) : 1;
      isOutOfStock = (item?.onHand || 0) < minRequiredGrams;
  } else {
      const displayStock = item?.onHand || (item?.options?.length > 0 ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : 0);
      isOutOfStock = displayStock <= 0;
  }

  // --- DYNAMIC GENETICS COLOR ENGINE ---
  let strainColorClass = "text-zinc-400 bg-zinc-950/50 border-zinc-800/80"; 
  const typeStr = item?.strainType?.toLowerCase() || '';
  
  if (typeStr.includes('sativa')) {
    strainColorClass = "text-orange-400 bg-orange-500/10 border-orange-500/20";
  } else if (typeStr.includes('indica')) {
    strainColorClass = "text-purple-400 bg-purple-500/10 border-purple-500/20";
  } else if (typeStr.includes('hybrid')) {
    strainColorClass = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
  }

  const isSteal = item?.subCategory?.toLowerCase().includes('steals');

  return (
    <div className={`absolute inset-0 w-full h-full backface-hidden bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-xl overflow-hidden transition-all duration-500 ${isOutOfStock ? 'opacity-85 grayscale-30' : ''}`}>
      
      <div className="relative w-full h-[45%] shrink-0 bg-zinc-950 border-b border-zinc-800 overflow-hidden group">
        
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/60 backdrop-blur-[2px]">
             <div className="-rotate-12 border-2 border-rose-500/80 px-6 py-2 rounded-xl shadow-[0_0_30px_rgba(244,63,94,0.3)] bg-zinc-950/90 flex flex-col items-center">
                <span className="text-rose-500 font-black text-xl md:text-2xl uppercase tracking-[0.2em] drop-shadow-md leading-none">Sold Out</span>
                <span className="text-rose-400/80 text-[8px] font-black uppercase tracking-[0.3em] text-center mt-1">Be Back Soon</span>
             </div>
          </div>
        )}

        {item?.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800">
            <ItemIcon size={48} />
          </div>
        )}

        {item?.isTopShelf && !isOutOfStock && (
          <div className="absolute top-3 right-3 z-10 rotate-12 drop-shadow-xl opacity-95 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center justify-center w-14 h-14 rounded-full border-2 border-amber-400/80 bg-zinc-950/60 backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.3)]">
              <Award size={16} className="text-amber-400 mb-0.5" />
              <span className="text-amber-400 text-[7px] font-black uppercase tracking-widest text-center leading-none">
                {UI.topShelf}
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex flex-col gap-1.5 items-start z-10">
           {item?.featured && !isOutOfStock && (
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-zinc-950/80 backdrop-blur-md border-cyan-500/50 shadow-lg">
               <Star size={10} className="text-cyan-400 animate-pulse" />
               <span className="text-cyan-400 text-[8px] font-black uppercase tracking-widest">{UI.featured}</span>
             </div>
           )}

           {item?.dailyDeal && !isOutOfStock && (
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] border-pink-400">
               <Flame size={10} className="text-zinc-950" />
               <span className="text-zinc-950 text-[8px] font-black uppercase tracking-widest">
                 {item.dealLogic && item.dealLogic !== 'STANDARD' ? formatPromo(item.dealLogic) : UI.promo}
               </span>
             </div>
           )}
        </div>

        {item?.strainType && item.strainType !== 'N/A' && (
           <div className="absolute bottom-3 right-3 z-10">
             <div className={`px-2.5 py-1 border rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg backdrop-blur-md ${strainColorClass}`}>
               {item.strainType}
             </div>
           </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5 items-center text-center">
          <div className="flex items-center justify-center flex-wrap gap-1.5 w-full mb-3 mt-auto">
             {item?.subCategory && (
               <span className={`px-3 py-1 border rounded-full text-[9px] font-black uppercase tracking-widest shadow-inner ${isSteal ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-zinc-900 border-zinc-700/50 text-zinc-300'}`}>
                 {item.subCategory}
               </span>
             )}
          </div>

          <div className="mb-auto w-full flex flex-col items-center overflow-hidden">
             <h3 className={`text-xl md:text-2xl font-black leading-tight tracking-tighter line-clamp-2 ${item?.isTopShelf ? 'text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-200' : 'text-zinc-100'}`}>
               {cleanItemName || UI.unnamed}
             </h3>
             
             {item?.brand && (
               <span className="text-[9px] font-black text-emerald-500/70 uppercase tracking-widest mt-1">
                 {UI.by} {item.brand}
               </span>
             )}
             
             {item?.lineage && (
               <div className="mt-2.5 flex items-center justify-center gap-1.5 flex-wrap w-full">
                 {item.lineage.split(/\s*[xX]\s*/).map((parent: string, index: number, array: string[]) => (
                    <React.Fragment key={index}>
                       <span className={`px-3 py-1 border rounded-full text-[9px] font-bold tracking-wide text-center shadow-inner flex items-center gap-1.5 ${strainColorClass}`}>
                         {index === 0 && <Dna size={10} className="shrink-0 opacity-70" />}
                         {parent.trim()}
                       </span>
                       {index < array.length - 1 && <span className="text-xs font-black text-zinc-600">x</span>}
                    </React.Fragment>
                 ))}
               </div>
             )}
          </div>

          <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between shrink-0 w-full">
            <div className="flex flex-col items-start">
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{UI.startingAt}</span>
              <div className="flex items-end gap-1.5">
                 {lowestDiscounted < lowestPrice && <span className="text-[11px] font-black font-mono text-zinc-600 line-through leading-none mb-0.5">${lowestPrice.toFixed(0)}</span>}
                 <span className={`text-xl font-black font-mono leading-none ${item?.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>${lowestDiscounted.toFixed(0)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsFlipped(true)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1 ${isOutOfStock ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-white text-zinc-950 active:scale-95'}`}
            >
              {isOutOfStock ? UI.viewInfo : UI.options} <ArrowRight size={14} className="ml-1" />
            </button>
          </div>
      </div>
    </div>
  );
}