// sandbox/apps/storefront/product-card/ControlsFooter.tsx
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getRequiredGrams } from '../StorefrontComponents';

export default function ControlsFooter({
  isRawFlower, qty, showVariantsAsCartRows, currentSubtotal, activeBasePrice,
  showSingleCartRow, isUglies, updateCart, item, selectedSize, safeSelectedOptions,
  isMaxReached, displayStock
}: any) {
  return (
    <>
      {!(showSingleCartRow) && (
        <div className={`flex items-center justify-between bg-zinc-900/80 border-zinc-800/50 border p-1.5 sm:p-2 rounded-xl shrink-0 mt-auto`}>
           <div className="flex flex-col pl-1">
             <span className={`text-[6px] sm:text-[7px] font-bold uppercase tracking-widest text-zinc-500`}>
               {isRawFlower ? 'Live Subtotal' : (qty > 0 ? 'Live Subtotal' : (showVariantsAsCartRows ? 'Base Price' : 'Starting At'))}
             </span>
             <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-none text-emerald-400`}>
               ${isRawFlower ? currentSubtotal.toFixed(2) : (qty > 0 ? currentSubtotal.toFixed(2) : activeBasePrice.toFixed(2))}
             </span>
           </div>
           
           {(isRawFlower || qty > 0) && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border transition-colors ${qty > 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-zinc-950 border-zinc-800'}`}>
                 <span className={`text-[9px] font-black leading-none ${qty > 0 ? 'text-emerald-400' : 'text-zinc-600'}`}>{qty}</span>
                 <span className={`text-[6px] font-bold uppercase tracking-widest leading-none ${qty > 0 ? 'text-emerald-500' : 'text-zinc-600'}`}>Added</span>
              </div>
           )}
        </div>
      )}

      {showSingleCartRow && !isUglies && (
        <div className={`flex items-center justify-between bg-zinc-900 border border-zinc-800 p-1.5 sm:p-2 rounded-xl shrink-0 mt-auto`}>
           <div className="flex flex-col pl-1">
             <span className="text-[10px] sm:text-[11px] font-black uppercase text-emerald-400 tracking-widest leading-none">${activeBasePrice.toFixed(2)}</span>
             {qty > 0 && <span className="text-[7px] sm:text-[8px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">Sub: ${currentSubtotal.toFixed(2)}</span>}
           </div>

           <div className="flex items-center gap-1">
              <button disabled={qty === 0} onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, -1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-rose-400 transition-colors active:scale-90 border border-zinc-800 disabled:opacity-30">
                {qty <= 1 && qty > 0 ? <Trash2 size={12} /> : <Minus size={12} />}
              </button>
              <span className="w-4 text-center font-mono font-black text-zinc-100 text-[10px] sm:text-[11px]">{qty}</span>
              <button disabled={isMaxReached || (isRawFlower && displayStock < getRequiredGrams(selectedSize.label))} onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, 1)} className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-950 transition-colors active:scale-90 border border-emerald-400 disabled:opacity-30">
                <Plus size={12} />
              </button>
           </div>
        </div>
      )}
    </>
  );
}