// sandbox/apps/storefront/StorefrontCardBack.tsx
'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getRequiredGrams } from './StorefrontComponents';

import EdibleComplianceLabel from './product-card/EdibleComplianceLabel';
import PreRollLabel from './product-card/PreRollLabel';
import ProductDnaPanel from './product-card/ProductDnaPanel';
import CardCommerceControls from './product-card/CardCommerceControls';

export default function StorefrontCardBack({ 
  item, cleanItemName, setIsFlipped, isFlower,
  sizes, options, selectedSize, setSelectedSize,
  bundleQty, selectedOptions, handleSelectOption,
  hasMultipleOptions, qty, updateCart, isBundleComplete, isMaxReached,
  clientConfig, cart 
}: any) {
  
  const UI = clientConfig?.dictionary?.storefront || {
    selectOptions: 'Select Options', liveSubtotal: 'Live Subtotal', addToCart: 'Add to Cart',
    inCart: 'In Cart', noDna: 'No Product DNA Available', feels: 'Feels', taste: 'Taste',
    uses: 'Uses', insiderFact: 'Insider Fact'
  };

  // 1. IDENTIFY PRODUCT TYPE FIRST
  const activeCat = item?.mainCategory?.toLowerCase() || '';
  const activeSubCat = item?.subCategory?.toLowerCase() || '';
  const isMerch = activeCat.includes('merch');
  const isEdible = activeCat.includes('edible'); 
  const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
  const isRawFlower = isFlower && !isPreRoll;
  
  const isDisposable = activeSubCat.includes('disposable') || activeSubCat.includes('vape') || cleanItemName?.toLowerCase().includes('disposable');
  const isHardware = isMerch || activeSubCat.includes('batteries') || activeSubCat.includes('hardware') || activeSubCat.includes('gear') || activeSubCat.includes('glass') || activeSubCat.includes('accessories');
  
  // 🚀 2. GHOST DATA SCRUBBER: Filter out legacy raw flower sizes if item is a vape or edible
  const safeSizes = (sizes || []).filter((s: any) => {
      if (isDisposable || isHardware || isEdible) {
          const lbl = (s.label || '').toLowerCase();
          // If the size label contains raw flower weights, kill it.
          if (lbl.includes('3.5') || lbl.includes('1/8') || lbl.includes('7g') || lbl.includes('14g') || lbl.includes('28g') || lbl.includes('ounce') || lbl.includes('quarter') || lbl.includes('half')) {
              return false;
          }
      }
      return true;
  });

  const safeOptions = options || [];
  const safeSelectedOptions = selectedOptions || [];
  const safeBundleQty = bundleQty || 1;

  const hasDNA = item?.descFeels || item?.descTaste || item?.descUses || item?.descFact;
  const config = item?.dealConfig;
  
  const expectsDNA = !isHardware;
  const profileLabel = isHardware ? 'Product Details' : 'Cultivar Profile';

  const hasTrueVariants = safeOptions.length > 0 && safeOptions[0].label !== 'Standard';
  const displayStock = hasTrueVariants ? safeOptions.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : (item?.onHand || 0);
  const rawPrice = Number(selectedSize?.price || 0);
  let activeBasePrice = rawPrice;
  let savingsText = "";

  const isCompletelyOOS = isRawFlower && safeSizes.length > 0 ? displayStock < Math.min(...safeSizes.map((s:any) => getRequiredGrams(s.label))) : displayStock <= 0;

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

  let trueCartQty = 0;
  let trueBaseTotal = 0;
  let trueLineTotal = 0;
  
  Object.keys(cart || {}).forEach(k => {
    if (k.startsWith(item.id + '_') || k === item.id) {
      const cItem = cart[k];
      const cQty = cItem.qty || 0;
      trueCartQty += cQty;
      
      let cPrice = Number(cItem.size?.price || rawPrice);
      trueBaseTotal += cPrice * cQty;
      
      if (item?.dailyDeal && config && config.type === 'DISCOUNT') {
         if (config.discountType === 'TIERED' && cItem.size?.promoPrice) cPrice = Number(cItem.size.promoPrice);
         else if (config.discountType === 'PERCENT') cPrice = cPrice * (1 - config.discountValue / 100);
         else if (config.discountType === 'DOLLAR') cPrice = Math.max(0, cPrice - config.discountValue);
         else if (config.discountType === 'FIXED') cPrice = config.discountValue;
      }
      trueLineTotal += cPrice * cQty;
    }
  });

  if (item?.dailyDeal && config) {
    if (config.type === 'DISCOUNT') {
      if (trueLineTotal < trueBaseTotal && trueCartQty > 0) {
         savingsText = `Saved $${(trueBaseTotal - trueLineTotal).toFixed(2)}`;
      }
    } else if (config.type === 'BUNDLE') {
      const bundles = Math.floor(trueCartQty / config.buyQty);
      const remainder = trueCartQty % config.buyQty;
      trueLineTotal = (bundles * config.bundlePrice) + (remainder * rawPrice);
      if (bundles > 0) savingsText = `Bundle Saved $${(trueBaseTotal - trueLineTotal).toFixed(2)}`;
    } else if (config.type === 'BOGO') {
      trueLineTotal = trueBaseTotal;
      const earnedQty = Math.floor(trueCartQty / config.buyQty) * config.getQty;
      if (earnedQty > 0) savingsText = `Unlocked ${earnedQty} ${config.discount === 'PCT_50' ? '50% OFF' : config.discount === 'PENNY' ? 'FOR 1¢' : 'FREE'}! (Auto-added at checkout)`;
    }
  }

  const currentSubtotal = trueLineTotal;

  const sortedSizes = [...safeSizes].sort((a: any, b: any) => {
    const aReq = isRawFlower ? getRequiredGrams(a.label) : 1;
    const bReq = isRawFlower ? getRequiredGrams(b.label) : 1;
    return ((isRawFlower && displayStock < aReq) ? 1 : 0) - ((isRawFlower && displayStock < bReq) ? 1 : 0);
  });

  const sortedOptions = [...safeOptions].sort((a: any, b: any) => {
    return ((a.stock !== undefined ? a.stock : displayStock) <= 0 ? 1 : 0) - ((b.stock !== undefined ? b.stock : displayStock) <= 0 ? 1 : 0);
  });

  return (
    <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-2xl overflow-hidden">
       
       <div className={`shrink-0 flex items-center justify-between z-20 px-4 pt-3 ${isCompletelyOOS ? 'pb-1' : ''}`}>
          {isCompletelyOOS && (
            <div className="text-[10px] font-black uppercase tracking-widest text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-md">
              Sold Out
            </div>
          )}
          <button onClick={() => setIsFlipped(false)} className="p-1.5 ml-auto bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors active:scale-95 shadow-sm">
            <ArrowLeft size={16} />
          </button>
       </div>

       <div className={`flex-1 min-h-0 overflow-y-auto scrollbar-hide ${isDisposable ? 'flex flex-col px-4 pb-4 gap-4' : 'flex flex-row'}`}>
          
          <div className={`${isCompletelyOOS || isDisposable ? 'w-full' : 'w-[60%]'} flex flex-col relative z-10 transition-all duration-300 ${!isDisposable && (isEdible || isPreRoll) ? 'bg-zinc-900 border-r-2 border-zinc-800' : isCompletelyOOS ? 'bg-zinc-950 px-4 pb-6' : isDisposable ? '' : 'border-r border-zinc-800/50 px-3 pb-6'}`}>
             
             {isEdible ? (
               <EdibleComplianceLabel item={item} cleanItemName={cleanItemName} isSideStacked={true} />
             ) : isPreRoll ? (
               <PreRollLabel item={item} cleanItemName={cleanItemName} isSideStacked={true} />
             ) : (
               <div className="flex flex-col h-full relative">
                  <div className={`flex items-start justify-between gap-2 mb-1.5 shrink-0 pb-1.5 border-b border-zinc-800/50 pr-1`}>
                     <div className="flex flex-col min-w-0">
                       <p className={`font-black uppercase tracking-widest text-zinc-500 mb-0.5 ${isCompletelyOOS ? 'text-[9px] sm:text-[10px]' : 'text-[8px] sm:text-[9px]'}`}>
                         {profileLabel}
                       </p>
                       <h3 className={`font-black text-zinc-100 uppercase tracking-tighter leading-none wrap-break-word transition-all ${isCompletelyOOS ? 'text-xl sm:text-3xl mb-1' : 'text-base sm:text-xl'}`}>
                         {cleanItemName}
                       </h3>
                       {item?.brand && (
                         <span className={`font-black text-emerald-500 uppercase tracking-widest block mt-0.5 ${isCompletelyOOS ? 'text-[9px] sm:text-[10px]' : 'text-[8px] sm:text-[9px]'}`}>
                           BY {item.brand}
                         </span>
                       )}
                     </div>
                  </div>
                  
                  <div className={`flex flex-col flex-1 ${isDisposable ? 'mt-2' : 'overflow-y-auto scrollbar-hide pr-1 mt-2'}`}>
                     {(item?.descBase || item?.lineage || item?.strainType || (hasDNA && expectsDNA) || isDisposable) ? (
                        <ProductDnaPanel item={item} UI={UI} hasDNA={hasDNA} expectsDNA={expectsDNA} isDisposable={isDisposable} cleanItemName={cleanItemName} />
                     ) : expectsDNA ? (
                        <div className="flex items-center justify-center pt-10"><span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{UI.noDna}</span></div>
                     ) : null}
                  </div>
               </div>
             )}
          </div>

          {!isCompletelyOOS && (
            <div className={`${isDisposable ? 'w-full mt-auto pt-2 border-t border-zinc-800/50' : 'w-[40%] pl-2 pr-3 pb-3'} flex flex-col relative bg-zinc-950 transition-all duration-300`}>
               <CardCommerceControls 
                 item={item} UI={UI} config={config} safeSizes={safeSizes} sortedSizes={sortedSizes} 
                 selectedSize={selectedSize} setSelectedSize={setSelectedSize}
                 isRawFlower={isRawFlower} displayStock={displayStock} 
                 hasMultipleOptions={hasMultipleOptions} safeOptions={safeOptions} sortedOptions={sortedOptions} 
                 safeSelectedOptions={safeSelectedOptions} handleSelectOption={handleSelectOption} 
                 savingsText={savingsText} 
                 qty={trueCartQty}
                 updateCart={updateCart} cartAddQty={cartAddQty} 
                 isReadyToAdd={isReadyToAdd} isMaxReached={isMaxReached} projectedAddPrice={projectedAddPrice} 
                 currentSubtotal={currentSubtotal} cart={cart} 
               />
            </div>
          )}
          
       </div>
    </div>
  );
}