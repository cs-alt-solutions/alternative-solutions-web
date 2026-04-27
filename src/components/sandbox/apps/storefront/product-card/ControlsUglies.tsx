// sandbox/apps/storefront/product-card/ControlsUglies.tsx
import React from 'react';
import { Minus, Plus, Flame } from 'lucide-react';
import { getRequiredGrams } from '../StorefrontComponents';

export default function ControlsUglies({
  item, config, sortedSizes, cart, updateCart, remainingGrams, formatSizeText
}: any) {
  return (
    <div className={`flex flex-col gap-1 flex-1 min-h-0`}>
      <div className="flex justify-between items-start px-1 shrink-0 mb-0.5">
        <label className="text-[8px] sm:text-[9px] font-black text-pink-500 uppercase tracking-widest leading-tight flex items-center gap-1">
            <Flame size={10} /> Snag a Steal
        </label>
      </div>
      <div className="flex flex-col overflow-y-auto scrollbar-hide gap-1 flex-1 min-h-0 pb-1">
        {sortedSizes.map((s: any) => {
            const sizeCartKey = `${item.id}_${s.id}_`;
            const sizeQty = cart?.[sizeCartKey]?.qty || 0;
            const isSelected = sizeQty > 0;

            let tierFinalPrice = Number(s.price || 0);
            if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
              if (config.discountType === 'TIERED' && s.promoPrice) tierFinalPrice = Number(s.promoPrice);
              else if (config.discountType === 'PERCENT') tierFinalPrice = tierFinalPrice * (1 - config.discountValue / 100);
              else if (config.discountType === 'DOLLAR') tierFinalPrice = Math.max(0, tierFinalPrice - config.discountValue);
              else if (config.discountType === 'FIXED') tierFinalPrice = config.discountValue;
            }

            const reqGrams = getRequiredGrams(s.label);
            const isTooHeavy = remainingGrams < reqGrams;

            return (
                <div key={s.id} className={`flex items-center justify-between px-2 py-1.5 rounded-xl border transition-all ${isTooHeavy && !isSelected ? 'bg-zinc-950 border-zinc-800/50 opacity-50 grayscale' : isSelected ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}`}>
                    <div className="flex flex-col items-start min-w-0 pr-1">
                      <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${isTooHeavy && !isSelected ? 'text-zinc-600 line-through' : isSelected ? 'text-emerald-400' : 'text-zinc-200'}`}>
                        {formatSizeText(s.label, 'STASH')}
                      </span>
                      <span className={`text-[11px] sm:text-xs font-mono font-black leading-none mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-emerald-500'}`}>
                        ${tierFinalPrice.toFixed(2)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0 pl-1">
                      <button disabled={sizeQty === 0} onClick={() => updateCart(item.id, s, [], -1)} className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors disabled:opacity-30 ${isSelected ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}><Minus size={12}/></button>
                      <span className={`w-3 sm:w-4 text-center text-[10px] sm:text-[11px] font-mono font-black ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>{sizeQty}</span>
                      <button disabled={isTooHeavy} onClick={() => updateCart(item.id, s, [], 1)} className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors disabled:opacity-30 ${isSelected ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}><Plus size={12}/></button>
                  </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}