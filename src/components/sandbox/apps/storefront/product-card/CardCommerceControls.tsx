import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { getRequiredGrams } from '../StorefrontComponents';

export default function CardCommerceControls({
  item, UI, config,
  safeSizes, sortedSizes, selectedSize, setSelectedSize,
  isRawFlower, displayStock,
  hasMultipleOptions, safeOptions, sortedOptions, safeSelectedOptions, handleSelectOption,
  savingsText, qty, updateCart, isMaxReached, currentSubtotal, cart
}: any) {
  
  const formatStrainText = (text: string) => {
    if (!text) return text;
    const parts = text.split(/\(\s*(Indica|Sativa|Hybrid|Indica Dom Hybrid|Sativa Dom Hybrid|CBD)\s*\)/i);
    return parts.map((part, i) => {
      if (i % 2 === 1) { 
        const type = part.toLowerCase();
        let letter = 'H'; let colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        if (type.includes('sativa')) { letter = 'S'; colorClass = 'bg-orange-500/10 text-orange-400 border-orange-500/30'; } 
        else if (type.includes('indica')) { letter = 'I'; colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30'; } 
        else if (type.includes('cbd')) { letter = 'C'; colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30'; }
        
        return <span key={i} className={`inline-flex items-center justify-center w-4 h-4 sm:w-4 sm:h-4 text-[7px] sm:text-[8px] font-black rounded-full border mx-0.5 align-middle shadow-sm ${colorClass}`} title={part.toUpperCase()}>{letter}</span>;
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  let totalCartQty = 0;
  let gramsInCart = 0;
  Object.keys(cart || {}).forEach(k => {
    if (k.startsWith(item.id + '_')) {
      const itemQty = cart[k].qty || 0;
      totalCartQty += itemQty;
      if (isRawFlower) {
         const sizeId = k.split('_')[1];
         const sizeObj = safeSizes.find((s:any) => s.id === sizeId);
         if (sizeObj) gramsInCart += itemQty * getRequiredGrams(sizeObj.label);
      }
    }
  });
  const remainingGrams = displayStock - gramsInCart;

  let activeBasePrice = Number(selectedSize?.price || 0);
  if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
    if (config.discountType === 'TIERED' && selectedSize?.promoPrice) activeBasePrice = Number(selectedSize.promoPrice);
    else if (config.discountType === 'PERCENT') activeBasePrice = activeBasePrice * (1 - config.discountValue / 100);
    else if (config.discountType === 'DOLLAR') activeBasePrice = Math.max(0, activeBasePrice - config.discountValue);
    else if (config.discountType === 'FIXED') activeBasePrice = config.discountValue;
  }

  const showSizeGridSelector = safeSizes.length > 1 && hasMultipleOptions;
  const showSizesAsCartRows = safeSizes.length > 1 && !hasMultipleOptions;
  const showVariantsAsCartRows = hasMultipleOptions && safeOptions.length > 0;
  const showSingleCartRow = safeSizes.length <= 1 && !hasMultipleOptions;

  return (
    <div className={`relative z-20 flex flex-col gap-1.5 flex-1 min-h-0`}>
      
      {savingsText && qty > 0 && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-zinc-950 px-2.5 py-0.5 rounded-full text-[6px] sm:text-[7px] font-black uppercase tracking-widest shadow-md whitespace-nowrap z-30">
             {savingsText}
          </div>
      )}

      {/* STATE 1: SIZE SELECTOR GRID */}
      {showSizeGridSelector && (
        <div className={`grid gap-1 grid-cols-2 bg-zinc-900/80 border border-zinc-800/50 rounded-xl p-1 shrink-0`}>
          {sortedSizes.map((s: any) => {
            const isSelected = selectedSize?.id === s.id;
            let tierFinalPrice = Number(s.price || 0);
            if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
              if (config.discountType === 'TIERED' && s.promoPrice) tierFinalPrice = Number(s.promoPrice);
              else if (config.discountType === 'PERCENT') tierFinalPrice = tierFinalPrice * (1 - config.discountValue / 100);
              else if (config.discountType === 'DOLLAR') tierFinalPrice = Math.max(0, tierFinalPrice - config.discountValue);
              else if (config.discountType === 'FIXED') tierFinalPrice = config.discountValue;
            }
            const isTooHeavy = isRawFlower && displayStock < (isRawFlower ? getRequiredGrams(s.label) : 1);

            return (
              <button key={s.id} disabled={isTooHeavy} onClick={() => setSelectedSize(s)} className={`px-1 py-1.5 rounded-lg text-center transition-all ${isTooHeavy ? 'bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed opacity-50' : isSelected ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}>
                <span className={`block text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-none mb-0.5 ${isTooHeavy ? 'line-through text-rose-900' : ''}`}>{s.label}</span>
                <span className={`flex text-[11px] sm:text-xs font-mono font-black leading-none justify-center items-center gap-1 ${isTooHeavy ? 'text-zinc-700' : isSelected ? 'text-emerald-700' : item?.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>${tierFinalPrice.toFixed(0)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* STATE 2: SIZES ACT AS CART ROWS */}
      {showSizesAsCartRows && (
        <div className={`flex flex-col gap-1.5 flex-1 min-h-0`}>
          {/* 🚀 FIXED: Header is now outside the scrollable div */}
          <div className="flex justify-between items-start px-1 shrink-0">
            <label className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-tight">
               Tap + To Add Size
            </label>
          </div>
          
          <div className="flex flex-col overflow-y-auto scrollbar-hide gap-1.5 flex-1 min-h-0 pb-2">
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

              const reqGrams = isRawFlower ? getRequiredGrams(s.label) : 1;
              const isTooHeavy = isRawFlower ? (remainingGrams < reqGrams) : ((displayStock - totalCartQty) < 1);

              return (
                  <div key={s.id} className={`flex flex-col gap-1.5 px-1.5 py-1.5 rounded-lg border transition-all ${isTooHeavy && !isSelected ? 'bg-zinc-950 border-zinc-800/50 opacity-50 grayscale' : isSelected ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                      <div className="flex items-center justify-between w-full min-w-0 pl-0.5">
                        <span className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${isTooHeavy && !isSelected ? 'text-zinc-600 line-through' : isSelected ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {s.label}
                        </span>
                        <span className={`text-[11px] sm:text-xs font-mono font-bold pr-1 ${isSelected ? 'text-emerald-500' : 'text-zinc-400'}`}>
                          ${tierFinalPrice.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0 w-full justify-between">
                         {/* 🚀 FIXED: Minus button is now outlined when active to separate it from the Plus button */}
                         <button 
                           disabled={sizeQty === 0}
                           onClick={() => updateCart(item.id, s, [], -1)} 
                           className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border rounded-md transition-colors ${isSelected ? 'bg-zinc-950 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10' : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                         ><Minus size={12}/></button>
                         
                         <span className={`w-5 text-center text-[10px] sm:text-xs font-mono font-black ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>{sizeQty}</span>
                         
                         <button 
                           disabled={isTooHeavy}
                           onClick={() => updateCart(item.id, s, [], 1)} 
                           className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border rounded-md transition-colors ${isSelected ? 'bg-emerald-500 text-zinc-950 border-emerald-400 hover:bg-emerald-400' : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                         ><Plus size={12}/></button>
                      </div>
                  </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 3: VARIANTS ACT AS CART ROWS */}
      {showVariantsAsCartRows && (
        <div className={`flex flex-col gap-1.5 flex-1 min-h-0`}>
          {/* 🚀 FIXED: Header is now outside the scrollable div */}
          <div className="flex justify-between items-start px-1 shrink-0 pt-0.5">
            <label className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-tight">
               {item?.dealConfig?.type === 'BUNDLE' ? `Mix & Match (Deal)` : `Tap + To Add`}
            </label>
          </div>
          
          <div className="flex flex-col overflow-y-auto scrollbar-hide gap-1.5 flex-1 min-h-0 pb-2">
            {sortedOptions.map((opt: any) => {
                const stockVal = opt.stock !== undefined ? opt.stock : displayStock;
                const instancesInBundle = safeSelectedOptions.filter((so:any) => so?.id === opt.id).length;
                const isOutOfStock = stockVal <= 0;
                const isSelected = instancesInBundle > 0;

                return (
                  <div key={opt.id} className={`flex flex-col gap-1.5 px-1.5 py-1.5 rounded-lg border transition-all ${isOutOfStock ? 'bg-zinc-950 border-zinc-800/50 opacity-50 grayscale' : isSelected ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                      <div className="flex items-center justify-between w-full min-w-0 pl-0.5">
                        <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider flex items-center flex-wrap gap-x-1 ${isOutOfStock ? 'text-zinc-600 line-through' : isSelected ? 'text-emerald-400' : 'text-zinc-300'}`}>
                          {formatStrainText(opt.label)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 shrink-0 w-full justify-between">
                         {/* 🚀 FIXED: Minus button is now outlined when active */}
                         <button 
                           disabled={instancesInBundle === 0 || isOutOfStock}
                           onClick={() => {
                             const idx = safeSelectedOptions.findIndex((so:any) => so.id === opt.id);
                             if (idx > -1) {
                               const newArr = [...safeSelectedOptions];
                               newArr.splice(idx, 1);
                               handleSelectOption(newArr);
                               updateCart(item.id, selectedSize, [opt], -1);
                             }
                           }}
                           className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border rounded-md transition-colors ${isSelected ? 'bg-zinc-950 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10' : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                         ><Minus size={12}/></button>
                         
                         <span className={`w-5 text-center text-[10px] sm:text-xs font-mono font-black ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>{instancesInBundle}</span>
                         
                         <button 
                           disabled={instancesInBundle >= stockVal || isOutOfStock}
                           onClick={() => {
                             const newArr = [...safeSelectedOptions, opt];
                             handleSelectOption(newArr);
                             updateCart(item.id, selectedSize, [opt], 1);
                           }}
                           className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center border rounded-md transition-colors ${isSelected ? 'bg-emerald-500 text-zinc-950 border-emerald-400 hover:bg-emerald-400' : 'bg-zinc-950 border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}
                         ><Plus size={12}/></button>
                      </div>
                  </div>
                );
            })}
          </div>
        </div>
      )}

      {/* FIXED SUBTOTAL / PRICE SUMMARY FOOTER (For List Views) */}
      {!showSingleCartRow && (
        <div className="flex items-center justify-between bg-zinc-900/80 border border-zinc-800/50 p-2 sm:p-2.5 rounded-xl shrink-0 mt-auto">
           <div className="flex flex-col pl-1">
             <span className="text-[7px] sm:text-[8px] text-zinc-500 font-bold uppercase tracking-widest mb-0.5">
               {qty > 0 ? 'Live Subtotal' : (showVariantsAsCartRows ? 'Base Price' : 'Starting At')}
             </span>
             <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-400 tracking-widest leading-none">
               ${qty > 0 ? currentSubtotal.toFixed(2) : activeBasePrice.toFixed(2)}
             </span>
           </div>
           {qty > 0 && (
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                 <span className="text-[10px] font-black text-emerald-400 leading-none">{qty}</span>
                 <span className="text-[7px] font-bold text-emerald-500 uppercase tracking-widest leading-none">Added</span>
              </div>
           )}
        </div>
      )}

      {/* STATE 4: NO VARIANTS OR SIZES (Single Standard Inline Row) */}
      {showSingleCartRow && (
        <div className={`flex items-center justify-between bg-zinc-900 border border-zinc-800 p-2 sm:p-2.5 rounded-xl shrink-0 mt-auto`}>
           <div className="flex flex-col pl-1">
             <span className="text-[11px] sm:text-xs font-black uppercase text-emerald-400 tracking-widest">${activeBasePrice.toFixed(2)}</span>
             {qty > 0 && <span className="text-[8px] sm:text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Sub: ${currentSubtotal.toFixed(2)}</span>}
           </div>

           <div className="flex items-center gap-1.5">
              <button 
                onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, -1)}
                disabled={qty === 0}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-rose-400 transition-colors active:scale-90 border border-zinc-800 disabled:opacity-30"
              >
                {qty <= 1 && qty > 0 ? <Trash2 size={12} /> : <Minus size={12} />}
              </button>
              <span className="w-5 text-center font-mono font-black text-zinc-100 text-[11px] sm:text-xs">{qty}</span>
              <button 
                onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, 1)}
                disabled={isMaxReached || (isRawFlower && displayStock < getRequiredGrams(selectedSize.label))}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-emerald-500 hover:bg-emerald-400 rounded-lg text-zinc-950 transition-colors active:scale-90 border border-emerald-400 disabled:opacity-30"
              >
                <Plus size={12} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
}