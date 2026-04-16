// sandbox/apps/storefront/StorefrontCardBack.tsx
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

  const safeSizes = sizes || [];
  const safeOptions = options || [];
  const safeSelectedOptions = selectedOptions || [];
  const safeBundleQty = bundleQty || 1;

  const hasDNA = item?.descFeels || item?.descTaste || item?.descUses || item?.descFact;
  const config = item?.dealConfig;
  
  const activeCat = item?.mainCategory?.toLowerCase() || '';
  const activeSubCat = item?.subCategory?.toLowerCase() || '';
  const isVape = activeCat.includes('vape');
  const isMerch = activeCat.includes('merch');
  
  const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
  const isRawFlower = isFlower && !isPreRoll;
  
  // NEW: We now treat both Vapes and Pre-Rolls as "Expanded Variant" layouts
  const expandVariants = isVape || isPreRoll;
  const expectsDNA = !expandVariants && !isMerch;

  const hasTrueVariants = safeOptions.length > 0 && safeOptions[0].label !== 'Standard';
  const displayStock = hasTrueVariants 
      ? safeOptions.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) 
      : (item?.onHand || 0);

  const rawPrice = Number(selectedSize?.price || 0);
  let activeBasePrice = rawPrice;
  let lineTotal = rawPrice * qty;
  let savingsText = "";

  const isCompletelyOOS = isRawFlower && safeSizes.length > 0 
    ? displayStock < Math.min(...safeSizes.map((s:any) => getRequiredGrams(s.label))) 
    : displayStock <= 0;

  if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
    if (config.discountType === 'TIERED' && selectedSize?.promoPrice) activeBasePrice = Number(selectedSize.promoPrice);
    else if (config.discountType === 'PERCENT') activeBasePrice = rawPrice * (1 - config.discountValue / 100);
    else if (config.discountType === 'DOLLAR') activeBasePrice = Math.max(0, rawPrice - config.discountValue);
    else if (config.discountType === 'FIXED') activeBasePrice = config.discountValue;
  }

  const cartAddQty = hasMultipleOptions ? Math.max(1, safeSelectedOptions.length) : safeBundleQty;
  const isReadyToAdd = !hasMultipleOptions || safeSelectedOptions.length > 0;

  let projectedAddPrice = activeBasePrice * cartAddQty; 
  if (item?.dailyDeal && config && config.type === 'BUNDLE') {
    const bundles = Math.floor(cartAddQty / config.buyQty);
    const remainder = cartAddQty % config.buyQty;
    projectedAddPrice = (bundles * config.bundlePrice) + (remainder * activeBasePrice);
  } else if (item?.dailyDeal && config && config.type === 'BOGO') {
    projectedAddPrice = activeBasePrice * cartAddQty;
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
    } else if (config.type === 'BOGO') {
      lineTotal = rawPrice * qty;
      const earnedQty = Math.floor(qty / config.buyQty) * config.getQty;
      if (earnedQty > 0) {
        const disc = config.discount === 'PCT_50' ? '50% OFF' : config.discount === 'PENNY' ? 'FOR 1¢' : 'FREE';
        savingsText = `Unlocked ${earnedQty} ${disc}! (Auto-added at checkout)`;
      }
    }
  }

  const currentSubtotal = lineTotal;

  // Pushes any out-of-stock size tiers to the bottom of the list
  const sortedSizes = [...safeSizes].sort((a: any, b: any) => {
    const aReq = isRawFlower ? getRequiredGrams(a.label) : 1;
    const bReq = isRawFlower ? getRequiredGrams(b.label) : 1;
    const aOOS = (isRawFlower && displayStock < aReq) ? 1 : 0;
    const bOOS = (isRawFlower && displayStock < bReq) ? 1 : 0;
    return aOOS - bOOS;
  });

  // Pushes any out-of-stock variants/flavors to the bottom of the scrollable list
  const sortedOptions = [...safeOptions].sort((a: any, b: any) => {
    const aStock = a.stock !== undefined ? a.stock : displayStock;
    const bStock = b.stock !== undefined ? b.stock : displayStock;
    const aOOS = aStock <= 0 ? 1 : 0;
    const bOOS = bStock <= 0 ? 1 : 0;
    return aOOS - bOOS;
  });

  const formatStrainText = (text: string) => {
    if (!text) return text;
    const parts = text.split(/\(\s*(Indica|Sativa|Hybrid|Indica Dom Hybrid|Sativa Dom Hybrid|CBD)\s*\)/i);
    
    return parts.map((part, i) => {
      if (i % 2 === 1) { 
        const type = part.toLowerCase();
        let letter = 'H';
        let colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        
        if (type.includes('sativa')) { 
          letter = 'S'; colorClass = 'bg-orange-500/10 text-orange-400 border-orange-500/30'; 
        } else if (type.includes('indica')) { 
          letter = 'I'; colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30'; 
        } else if (type.includes('cbd')) {
          letter = 'C'; colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
        }
        
        return (
          <span key={i} className={`inline-flex items-center justify-center w-3.5 h-3.5 text-[8px] font-black rounded-full border mx-0.5 align-middle shadow-sm ${colorClass}`} title={part.toUpperCase()}>
            {letter}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden">
      
      {isCompletelyOOS && (
        <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
           <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="absolute top-6 left-6 p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
             <ArrowLeft size={16} />
           </button>
           <div className="bg-rose-500 text-zinc-950 font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-400 transform -rotate-12 scale-110">
             Sold Out
           </div>
        </div>
      )}

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

      {/* SCROLLABLE DNA SECTION (Hidden for Vapes & Pre-Rolls to maximize options space) */}
      {!expandVariants && (
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3 relative">
          {(item?.descBase || (hasDNA && expectsDNA)) ? (
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-2.5">
               {item?.descBase && (
                  <p className={`text-[10px] text-zinc-300 italic leading-relaxed ${(hasDNA && expectsDNA) ? 'border-b border-zinc-800/50 pb-2' : ''}`}>
                    {item.descBase}
                  </p>
               )}
               {hasDNA && expectsDNA && (
                 <div className="flex flex-col">
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

                   {item?.descFact && (
                     <div className="mt-2.5 pt-2.5 border-t border-zinc-800/50 flex items-start gap-1.5 pl-1">
                       <Sparkles size={12} className="text-pink-400 mt-0.5 shrink-0" />
                       <div>
                         <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.insiderFact}</span>
                         <span className="text-[10px] font-bold text-zinc-200 leading-relaxed">{item.descFact}</span>
                       </div>
                     </div>
                   )}
                 </div>
               )}
            </div>
          ) : expectsDNA ? (
            <div className="w-full flex items-center justify-center py-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{UI.noDna}</span>
            </div>
          ) : null}
        </div>
      )}

      {/* STATIC BOTTOM CONTROL PANEL (Options & Cart) */}
      <div className={`${expandVariants ? 'flex-1 overflow-hidden' : 'shrink-0'} bg-zinc-950 border-t border-zinc-800/50 relative z-20 flex flex-col`}>
        
        {/* STATIC OPTIONS / SIZES */}
        {((safeSizes.length > 1 && !expandVariants && !isMerch) || (hasMultipleOptions && safeOptions.length > 0)) && (
          <div className={`px-4 pt-3 pb-1 space-y-2 ${expandVariants ? 'flex-1 flex flex-col overflow-hidden' : ''}`}>
            
            {safeSizes.length > 1 && !expandVariants && !isMerch && (
              <div className="grid grid-cols-2 sm:grid-cols-4 bg-zinc-900 border border-zinc-800/50 rounded-lg p-1 gap-1">
                {sortedSizes.map((s: any) => {
                  const isSelected = selectedSize?.id === s.id;
                  let tierFinalPrice = Number(s.price || 0);

                  if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
                    if (config.discountType === 'TIERED' && s.promoPrice) tierFinalPrice = Number(s.promoPrice);
                    else if (config.discountType === 'PERCENT') tierFinalPrice = tierFinalPrice * (1 - config.discountValue / 100);
                    else if (config.discountType === 'DOLLAR') tierFinalPrice = Math.max(0, tierFinalPrice - config.discountValue);
                    else if (config.discountType === 'FIXED') tierFinalPrice = config.discountValue;
                  }

                  const reqGrams = isRawFlower ? getRequiredGrams(s.label) : 1;
                  const available = displayStock;
                  const isTooHeavy = isRawFlower && available < reqGrams;

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

            {hasMultipleOptions && safeOptions.length > 0 && (
              <div className={expandVariants ? 'flex-1 flex flex-col overflow-hidden' : ''}>
                <div className="flex justify-between items-start mb-2 px-1 shrink-0">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-tight">
                     {item?.dealConfig?.type === 'BUNDLE' ? `Mix & Match (Deal: ${item.dealConfig.buyQty} for $${item.dealConfig.bundlePrice})` : UI.selectOptions}
                  </label>
                  <span className={`text-[9px] font-black uppercase tracking-widest shrink-0 ml-4 ${safeSelectedOptions.length >= (item?.dealConfig?.buyQty || 1) ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {safeSelectedOptions.length} Selected
                  </span>
                </div>
                
                {/* DYNAMIC HEIGHT: Unlocked for Vapes and Pre-Rolls */}
                <div className={`flex flex-col gap-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-1.5 overflow-y-auto scrollbar-hide ${expandVariants ? 'flex-1' : 'max-h-28'}`}>
                  {sortedOptions.map((opt: any) => {
                    const stockVal = opt.stock !== undefined ? opt.stock : displayStock;
                    const instancesInBundle = safeSelectedOptions.filter((so:any) => so?.id === opt.id).length;
                    const isOutOfStock = stockVal <= 0;
                    const isMaxReachedForOpt = instancesInBundle >= stockVal;
                    const isSelected = instancesInBundle > 0;

                    return (
                      <div key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all ${isOutOfStock ? 'bg-zinc-950 border-zinc-800/50 opacity-50 grayscale' : isSelected ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'}`}>
                        <span className={`text-[10px] font-black uppercase tracking-wider flex-1 pr-2 ${isOutOfStock ? 'text-zinc-600 line-through' : 'text-zinc-300'}`}>
                          {formatStrainText(opt.label)}
                        </span>
                        
                        <div className="flex items-center gap-2 shrink-0">
                           <button 
                             disabled={instancesInBundle === 0 || isOutOfStock}
                             onClick={() => {
                               const idx = safeSelectedOptions.findIndex((so:any) => so.id === opt.id);
                               if (idx > -1) {
                                 const newArr = [...safeSelectedOptions];
                                 newArr.splice(idx, 1);
                                 handleSelectOption(newArr);
                               }
                             }}
                             className="w-6 h-6 flex items-center justify-center bg-zinc-950 border border-zinc-700 rounded text-zinc-400 disabled:opacity-30 hover:bg-zinc-800 transition-colors"
                           ><Minus size={12}/></button>
                           <span className="w-4 text-center text-xs font-mono font-bold text-zinc-100">{instancesInBundle}</span>
                           <button 
                             disabled={isMaxReachedForOpt || isOutOfStock}
                             onClick={() => handleSelectOption([...safeSelectedOptions, opt])}
                             className="w-6 h-6 flex items-center justify-center bg-zinc-950 border border-zinc-700 rounded text-zinc-400 disabled:opacity-30 hover:bg-zinc-800 transition-colors"
                           ><Plus size={12}/></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* CART ACTIONS */}
        <div className={`px-4 pb-4 shrink-0 ${((safeSizes.length > 1 && !expandVariants && !isMerch) || (hasMultipleOptions && safeOptions.length > 0)) ? 'pt-1' : 'pt-4'}`}>
           {savingsText && qty > 0 && (
              <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-pink-500 text-zinc-950 px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md whitespace-nowrap z-30">
                 {savingsText}
              </div>
           )}

           {qty === 0 ? (
              <button 
                onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, cartAddQty)}
                disabled={!isReadyToAdd || isMaxReached || (isRawFlower && displayStock < getRequiredGrams(selectedSize.label))}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 rounded-xl transition-all active:scale-95 flex items-center justify-between px-4 py-2.5 shadow-[0_0_15px_rgba(52,211,153,0.15)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-1.5 font-black uppercase tracking-widest text-[10px]">
                  <ShoppingCart size={14} /> 
                  {!isReadyToAdd ? UI.selectOptions : `Add ${cartAddQty} To Cart`}
                </span>
                <span className="font-mono font-black text-sm">${projectedAddPrice.toFixed(2)}</span>
              </button>
           ) : (
              <div className="flex items-center justify-between bg-zinc-900 border border-emerald-500/30 p-1.5 rounded-xl">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, -cartAddQty)}
                    className="w-10 h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-rose-400 transition-colors active:scale-90 border border-zinc-800"
                  >
                    {qty <= cartAddQty ? <Trash2 size={14} /> : <Minus size={14} />}
                  </button>
                  <span className="w-8 text-center font-mono font-black text-zinc-100 text-sm">{qty}</span>
                  <button 
                    onClick={() => updateCart(item.id, selectedSize, safeSelectedOptions, cartAddQty)}
                    disabled={isMaxReached}
                    className="w-10 h-8 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-emerald-400 transition-colors active:scale-90 border border-zinc-800 disabled:opacity-50"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <div className="flex items-center gap-2 pr-3">
                   <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500 hidden sm:flex items-center gap-1"><CheckCircle size={10}/> {UI.inCart}</span>
                   <span className="text-lg font-mono font-black text-emerald-400 leading-none">${currentSubtotal.toFixed(2)}</span>
                </div>
              </div>
           )}
        </div>
      </div>

    </div>
  );
}