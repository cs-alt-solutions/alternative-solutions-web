// sandbox/apps/storefront/StorefrontCardFront.tsx
import React from 'react';
import { Award, Flame, Star, Leaf, Box, Image as ImageIcon, ArrowRight, Dna, BookText } from 'lucide-react';
import { getRequiredGrams } from './StorefrontComponents';

export default function StorefrontCardFront({ item, cleanItemName, baseLowestPrice, activeLowestPrice, setIsFlipped, sizes, isFlower, clientConfig }: any) {
  const ItemIcon = item?.iconName === 'Leaf' ? Leaf : item?.iconName === 'Flame' ? Flame : item?.iconName === 'Box' ? Box : ImageIcon;
  
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

  const renderDealMath = (config: any) => {
    if (!config) return UI.promo;
    if (config.type === 'BUNDLE') return `${config.buyQty} for $${config.bundlePrice}`;
    if (config.type === 'DISCOUNT') {
      if (config.discountType === 'PERCENT') return `${config.discountValue}% OFF`;
      if (config.discountType === 'DOLLAR') return `$${config.discountValue} OFF`;
      if (config.discountType === 'FIXED') return `NOW $${config.discountValue}`;
      if (config.discountType === 'TIERED') return `TIERED PRICING`;
    }
    return `B${config.buyQty || 1} G${config.getQty || 1}`;
  };

  const activeSubCat = item?.subCategory?.toLowerCase() || '';
  const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
  const isRawFlower = isFlower && !isPreRoll;

  let isOutOfStock = false;
  if (isRawFlower) {
      const minRequiredGrams = sizes && sizes.length > 0 ? Math.min(...sizes.map((s:any) => getRequiredGrams(s.label))) : 1;
      isOutOfStock = (item?.onHand || 0) < minRequiredGrams;
  } else {
      const hasTrueVariants = item?.options && item.options.length > 0 && item.options[0].label !== 'Standard';
      const displayStock = hasTrueVariants 
          ? item.options.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) 
          : (item?.onHand || 0);
      isOutOfStock = displayStock <= 0;
  }

  let strainColorClass = "text-zinc-400"; 
  const typeStr = item?.strainType?.toLowerCase() || '';
  if (typeStr.includes('sativa')) {
    strainColorClass = "text-orange-400";
  } else if (typeStr.includes('indica')) {
    strainColorClass = "text-purple-400";
  } else if (typeStr.includes('hybrid')) {
    strainColorClass = "text-emerald-400";
  }

  const config = item?.dealConfig;
  const isBundleOrBogo = item?.dailyDeal && config && (config.type === 'BUNDLE' || config.type === 'BOGO');

  const formatLineageDisplay = (text: string) => {
    if (!text) return null;
    const parts = text.split(/x|×/i).map(p => p.trim()).filter(Boolean);
    
    if (parts.length === 3) {
      return (
        <span className="leading-tight text-center">
          {parts[0]} × {parts[1]}<br />× {parts[2]}
        </span>
      );
    }
    
    return (
      <span className="leading-tight text-center wrap-break-word whitespace-normal">
        {parts.join(' × ')}
      </span>
    );
  };

  return (
    <div className={`absolute inset-0 w-full h-full backface-hidden bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-xl overflow-hidden transition-all duration-500 ${isOutOfStock ? 'opacity-85 grayscale-30' : ''}`}>
      
      {/* HEADER IMAGE SECTION */}
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

        <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10">
           {item?.dailyDeal && !isOutOfStock && (
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400">
               <Flame size={10} className="text-zinc-950" />
               <span className="text-zinc-950 text-[8px] font-black uppercase tracking-widest">
                 {renderDealMath(item.dealConfig)}
               </span>
             </div>
           )}
           {item?.featured && !isOutOfStock && (
             <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-cyan-500/50 shadow-lg">
               <Star size={10} className="text-cyan-400 animate-pulse" />
               <span className="text-cyan-400 text-[8px] font-black uppercase tracking-widest">{UI.featured}</span>
             </div>
           )}
        </div>

        {item?.strainType && item.strainType !== 'N/A' && (
           <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800/80 shadow-lg animate-in fade-in">
             <div className={`w-1.5 h-1.5 rounded-full ${strainColorClass.replace('text-', 'bg-')}`} />
             <span className={`text-[9px] font-black uppercase tracking-widest ${strainColorClass}`}>
               {item.strainType}
             </span>
           </div>
        )}
      </div>

      {item?.iconUrl && (
         <div className="absolute top-[45%] left-6 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-zinc-900 bg-white/95 overflow-hidden shadow-[0_10px_20px_rgba(0,0,0,0.5)] z-20 animate-in fade-in">
           <img src={item.iconUrl} alt="Brand Stamp" className="w-full h-full object-cover" />
         </div>
      )}

      {/* TEXT/INFO SECTION */}
      <div className="flex flex-col flex-1 p-6 pt-10 text-center">
          
          <div className="mt-auto mb-1 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest h-4">
             {item?.subCategory && (
               <span className={item?.subCategory?.toLowerCase().includes('steals') ? 'text-rose-400' : 'text-zinc-500'}>
                 {item.subCategory}
               </span>
             )}
             {item?.subCategory && item?.brand && <span className="text-zinc-700">•</span>}
             {item?.brand && (
               <span className="text-emerald-500/70">
                 {UI.by} {item.brand}
               </span>
             )}
          </div>

          <div className="mb-auto w-full flex flex-col items-center overflow-hidden">
             <h3 className={`text-2xl font-black leading-tight tracking-tighter text-center line-clamp-2 ${item?.isTopShelf ? 'text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-200' : 'text-zinc-100'}`}>
               {cleanItemName || UI.unnamed}
             </h3>
             
             {item?.lineage ? (
               <div className="mt-2 flex items-center justify-center gap-1.5 w-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <Dna size={12} className="text-zinc-600 shrink-0" />
                  {formatLineageDisplay(item.lineage)}
               </div>
             ) : item?.descBase ? (
               <div className="mt-2 flex items-center justify-center gap-1.5 w-full text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <BookText size={12} className="text-zinc-600 shrink-0" />
                  <span className="leading-tight text-center wrap-break-word whitespace-normal normal-case text-zinc-400 font-medium line-clamp-2">{item.descBase}</span>
               </div>
             ) : null}
          </div>

          {/* FOOTER */}
          <div className="mt-auto pt-4 border-t border-zinc-800/50 flex items-center justify-between shrink-0 w-full text-left">
            
            {isBundleOrBogo && !isOutOfStock ? (
              <div className="flex flex-col items-start">
                <span className="text-[8px] font-black uppercase tracking-widest text-pink-500 mb-0.5 animate-pulse flex items-center gap-1"><Flame size={10}/> Unlocked Deal</span>
                {config.type === 'BUNDLE' && (
                  <span className="text-2xl font-black font-mono leading-none tracking-tighter text-pink-400">
                    {config.buyQty} FOR ${config.bundlePrice}
                  </span>
                )}
                {config.type === 'BOGO' && (
                  <span className="text-lg font-black uppercase leading-none tracking-tighter text-pink-400">
                    BUY {config.buyQty}{config.unit === 'GRAMS' ? 'G' : ''} GET {config.getQty}{config.unit === 'GRAMS' ? 'G' : ''} {config.discount === 'PCT_50' ? '50% OFF' : config.discount === 'PENNY' ? 'FOR 1¢' : 'FREE'}
                  </span>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-start">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{UI.startingAt}</span>
                <div className="flex items-baseline gap-2">
                   {activeLowestPrice < baseLowestPrice && !isOutOfStock && (
                     <span className="text-xs font-black font-mono text-zinc-600 line-through leading-none decoration-rose-500/50">
                       ${baseLowestPrice.toFixed(0)}
                     </span>
                   )}
                   <span className={`text-2xl font-black font-mono leading-none tracking-tighter ${item?.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>
                     ${activeLowestPrice.toFixed(0)}
                   </span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => setIsFlipped(true)}
              className={`px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center gap-1.5 ${isOutOfStock ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-white text-zinc-950 active:scale-95'}`}
            >
              {isOutOfStock ? UI.viewInfo : UI.options} <ArrowRight size={14} />
            </button>
          </div>
      </div>
    </div>
  );
}