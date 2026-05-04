// sandbox/apps/storefront/product-card/CardPricingFooter.tsx
import React from 'react';
import { Flame, ArrowRight } from 'lucide-react';

export default function CardPricingFooter({ 
  item, 
  baseLowestPrice, 
  activeLowestPrice, 
  isOutOfStock, 
  isBundleOrBogo, 
  setIsFlipped, 
  UI 
}: any) {
  const config = item?.dealConfig;

  return (
    <div className="mt-auto pt-3 border-t border-zinc-800/50 flex items-center justify-between shrink-0 w-full text-left z-10 relative">
      {isBundleOrBogo && !isOutOfStock ? (
        <div className="flex flex-col items-start">
          <span className="text-[8px] font-black uppercase tracking-widest text-pink-500 mb-0.5 animate-pulse flex items-center gap-1">
            <Flame size={10}/> Unlocked Deal
          </span>
          {config.type === 'BUNDLE' && (
            <span className="text-xl md:text-2xl font-black font-mono leading-none tracking-tighter text-pink-400">
              {config.buyQty} FOR ${config.bundlePrice}
            </span>
          )}
          {config.type === 'BOGO' && (
            <span className="text-sm md:text-lg font-black uppercase leading-none tracking-tighter text-pink-400">
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
             <span className={`text-xl md:text-2xl font-black font-mono leading-none tracking-tighter ${item?.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>
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
  );
}