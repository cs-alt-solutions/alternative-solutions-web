'use client';

import React from 'react';
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart, X, Trash2, Wind, Droplet, Cookie, Sparkles, Flame } from 'lucide-react';
import { getRequiredGrams } from './StorefrontComponents';

export default function StorefrontCardBack({ 
  item, cleanItemName, setIsFlipped, isFlower,
  sizes, options, selectedSize, setSelectedSize,
  bundleQty, selectedOptions, handleSelectOption,
  hasMultipleOptions, qty, updateCart, isBundleComplete, isMaxReached,
  clientConfig 
}: any) {
  
  const UI = clientConfig?.dictionary?.storefront || {
    selectOptions: 'Select Options',
    liveSubtotal: 'Live Subtotal',
    addToCart: 'Add to Cart',
    inCart: 'In Cart',
    noDna: 'No Product DNA Available',
    feels: 'Feels',
    taste: 'Taste',
    uses: 'Uses',
    insiderFact: 'Insider Fact'
  };

  const hasDNA = item?.descFeels || item?.descTaste || item?.descUses || item?.descFact;
  const config = item?.dealConfig;
  
  const rawPrice = Number(selectedSize?.price || 0);
  let activeBasePrice = rawPrice;
  let lineTotal = rawPrice * qty;
  let savingsText = "";

  if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
    if (config.discountType === 'TIERED' && selectedSize?.promoPrice) activeBasePrice = Number(selectedSize.promoPrice);
    else if (config.discountType === 'PERCENT') activeBasePrice = rawPrice * (1 - config.discountValue / 100);
    else if (config.discountType === 'DOLLAR') activeBasePrice = Math.max(0, rawPrice - config.discountValue);
    else if (config.discountType === 'FIXED') activeBasePrice = config.discountValue;
  }

  let projectedAddPrice = activeBasePrice * bundleQty; 
  if (item?.dailyDeal && config && config.type === 'BUNDLE') {
    projectedAddPrice = config.bundlePrice;
  }

  if (item?.dailyDeal && config) {
    if (config.type === 'DISCOUNT') {
      lineTotal = activeBasePrice * qty;
      if (lineTotal < rawPrice * qty && qty > 0) savingsText = `Saved $${((rawPrice * qty) - lineTotal).toFixed(2)}`;
    } else if (config.type === 'BUNDLE') {
      const bundles = Math.floor(qty / config.buyQty);
      const remainder = qty % config.buyQty;
      lineTotal = (bundles * config.bundlePrice) + (remainder * rawPrice);
      
      if (bundles > 0) savingsText = `Bundle Saved $${((rawPrice * qty) - lineTotal).toFixed(2)}`;
      else if (config.buyQty - remainder === 1 && qty > 0) savingsText = `Add 1 for $${config.bundlePrice} Bundle!`;
    } else if (config.type === 'BOGO') {
      lineTotal = rawPrice * qty;
      const earnedQty = Math.floor(qty / config.buyQty) * config.getQty;
      
      if (earnedQty > 0) {
        const disc = config.discount === 'PCT_50' ? '50% OFF' : config.discount === 'PENNY' ? 'FOR 1¢' : 'FREE';
        savingsText = `Unlocked ${earnedQty} ${disc}! (Auto-added at checkout)`;
      } else if (qty > 0) {
        savingsText = `Add ${config.buyQty - qty} more to get ${config.getQty} ${config.discount === 'FREE' ? 'FREE' : 'Discounted'}!`;
      }
    }
  }

  const currentSubtotal = lineTotal;

  const handleSmartSelect = (opt: any) => {
    if (bundleQty === 1) {
      handleSelectOption([opt]);
    } else {
      const isAlreadySelected = selectedOptions.some((so: any) => so.id === opt.id);
      if (isAlreadySelected) {
        const index = selectedOptions.findIndex((so: any) => so.id === opt.id);
        const newArr = [...selectedOptions];
        newArr.splice(index, 1);
        handleSelectOption(newArr);
      } else {
        if (selectedOptions.length < bundleQty) {
          handleSelectOption([...selectedOptions, opt]);
        } else {
          handleSelectOption([...selectedOptions.slice(1), opt]);
        }
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 pb-3 border-b border-zinc-800/50 shrink-0 bg-zinc-950 z-10">
        <button onClick={() => setIsFlipped(false)} className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors active:scale-95 shrink-0">
          <ArrowLeft size={16} />
        </button>
        
        <div className="flex items-center gap-2.5 overflow-hidden ml-auto">
          {item?.iconUrl && (
            <div className="w-8 h-8 rounded-full border border-zinc-800 bg-white/95 overflow-hidden shrink-0 shadow-lg">
              <img src={item.iconUrl} alt="Brand Stamp" className="w-full h-full object-contain" />
            </div>
          )}
          <div className="flex flex-col items-end overflow-hidden">
            <h3 className="text-xs font-black text-zinc-100 truncate uppercase tracking-wider">{cleanItemName}</h3>
            {item?.brand && <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest truncate mt-0.5">BY {item.brand}</span>}
          </div>
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 relative">
        
        {(item?.descBase || hasDNA) ? (
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-2.5">
             {item?.descBase && (
                <p className={`text-[10px] text-zinc-300 italic leading-relaxed ${hasDNA ? 'border-b border-zinc-800/50 pb-2' : ''}`}>
                  {item.descBase}
                </p>
             )}
             {hasDNA && (
               <div className="grid grid-cols-3 gap-2">
                 {item?.descFeels && (
                   <div className="flex items-start gap-1.5 border-r border-zinc-800/50 pr-1">
                     <Wind size={12} className="text-cyan-400 mt-0.5 shrink-0" />
                     <div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.feels}</span>
                       <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descFeels}</span>
                     </div>
                   </div>
                 )}
                 {item?.descTaste && (
                   <div className="flex items-start gap-1.5 border-r border-zinc-800/50 px-1">
                     <Cookie size={12} className="text-amber-400 mt-0.5 shrink-0" />
                     <div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.taste}</span>
                       <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descTaste}</span>
                     </div>
                   </div>
                 )}
                 {item?.descUses && (
                   <div className="flex items-start gap-1.5 pl-1">
                     <Droplet size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                     <div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.uses}</span>
                       <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descUses}</span>
                     </div>
                   </div>
                 )}
               </div>
             )}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center py-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{UI.noDna}</span>
          </div>
        )}

        {sizes.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-zinc-900 border border-zinc-800/50 rounded-lg p-1 gap-1">
            {sizes.map((s: any) => {
              const isSelected = selectedSize?.id === s.id;
              let tierFinalPrice = Number(s.price || 0);

              if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
                if (config.discountType === 'TIERED' && s.promoPrice) tierFinalPrice = Number(s.promoPrice);
                else if (config.discountType === 'PERCENT') tierFinalPrice = tierFinalPrice * (1 - config.discountValue / 100);
                else if (config.discountType === 'DOLLAR') tierFinalPrice = Math.max(0, tierFinalPrice - config.discountValue);
                else if (config.discountType === 'FIXED') tierFinalPrice = config.discountValue;
              }

              const reqGrams = isFlower ? getRequiredGrams(s.label) : 1;
              const available = item?.onHand || 0;
              const isTooHeavy = isFlower && available < reqGrams;

              return (
                <button 
                  key={s.id} 
                  disabled={isTooHeavy}
                  onClick={() => setSelectedSize(s)}
                  className={`px-1 py-1.5 rounded-md text-center transition-all ${isTooHeavy ? 'bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed opacity-50' : isSelected ? 'bg-zinc-100 text-zinc-950 shadow-sm' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                >
                  <span className={`block text-[9px] font-black uppercase tracking-widest leading-none mb-0.5 ${isTooHeavy ? 'line-through text-rose-900' : ''}`}>{s.label}</span>
                  <span className={`flex text-xs font-mono font-bold leading-none justify-center items-center gap-1 ${isTooHeavy ? 'text-zinc-700' : isSelected ? 'text-emerald-700' : item?.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>
                    ${tierFinalPrice.toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {hasMultipleOptions && (
          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{UI.selectOptions}</label>
            </div>
            <div className="flex flex-wrap gap-1.5 bg-zinc-900 border border-zinc-800/50 rounded-lg p-1.5">
              {options.map((opt: any) => {
                const stockVal = opt.stock !== undefined ? opt.stock : item?.onHand;
                const isOutOfStock = stockVal <= 0;
                const instancesInBundle = selectedOptions.filter((so:any) => so?.id === opt.id).length;
                const isSelected = bundleQty === 1 ? selectedOptions[0]?.id === opt.id : instancesInBundle > 0;

                return (
                  <button 
                    key={opt.id}
                    disabled={isOutOfStock} 
                    onClick={() => handleSmartSelect(opt)} 
                    className={`relative flex-1 min-w-17.5 p-1.5 rounded-md text-center border transition-all active:scale-95 ${isOutOfStock ? 'bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed line-through' : isSelected ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-sm' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'}`}
                  >
                    <span className="block text-[9px] font-black uppercase tracking-wider leading-tight">{opt.label}</span>
                    {instancesInBundle > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-emerald-500 text-zinc-950 text-[8px] font-black rounded-full shadow-lg border border-zinc-950">{instancesInBundle}x</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="shrink-0 p-4 bg-zinc-950 border-t border-zinc-800/50 relative z-20">
         
         {savingsText && qty > 0 && (
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-pink-500 text-zinc-950 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md whitespace-nowrap z-30">
               {savingsText}
            </div>
         )}

         {!isBundleComplete && bundleQty > 1 && qty === 0 ? (
            <div className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 text-zinc-500">
              <span className="text-[10px] font-black uppercase tracking-widest">
                Pick {bundleQty - selectedOptions.length} More
              </span>
              <span className="font-mono font-black text-sm opacity-50">${projectedAddPrice.toFixed(2)}</span>
            </div>
         ) : qty === 0 ? (
            <button 
              onClick={() => updateCart(item.id, selectedSize, selectedOptions, bundleQty)}
              disabled={isMaxReached || (isFlower && (item?.onHand || 0) < getRequiredGrams(selectedSize.label))}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl transition-all active:scale-95 flex items-center justify-between px-4 py-2.5 shadow-[0_0_15px_rgba(52,211,153,0.15)] disabled:opacity-50"
            >
              <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px]">
                <ShoppingCart size={14} /> 
                {bundleQty > 1 ? `Add ${bundleQty} for Deal!` : UI.addToCart}
              </span>
              <span className="font-mono font-black text-sm">${projectedAddPrice.toFixed(2)}</span>
            </button>
         ) : (
            <div className="flex items-center justify-between bg-zinc-900 border border-emerald-500/30 p-1.5 rounded-xl">
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => updateCart(item.id, selectedSize, selectedOptions, -bundleQty)}
                  className="w-10 h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-rose-400 transition-colors active:scale-90 border border-zinc-800"
                >
                  {qty === bundleQty ? <Trash2 size={14} /> : <Minus size={14} />}
                </button>
                <span className="w-8 text-center font-mono font-black text-zinc-100 text-sm">{qty}</span>
                <button 
                  onClick={() => updateCart(item.id, selectedSize, selectedOptions, bundleQty)}
                  disabled={isMaxReached}
                  className="w-10 h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-emerald-400 transition-colors active:scale-90 border border-zinc-800 disabled:opacity-50"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 pr-3">
                 <span className="hidden sm:flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-emerald-500"><CheckCircle size={10}/> {UI.inCart}</span>
                 <span className="text-lg font-mono font-black text-emerald-400 leading-none">${currentSubtotal.toFixed(2)}</span>
              </div>
            </div>
         )}
      </div>

    </div>
  );
}