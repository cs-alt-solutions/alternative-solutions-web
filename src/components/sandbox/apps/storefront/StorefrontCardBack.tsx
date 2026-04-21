// sandbox/apps/storefront/StorefrontCardBack.tsx
'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getRequiredGrams } from './StorefrontComponents';

import EdibleComplianceLabel from './product-card/EdibleComplianceLabel';
import ProductDnaPanel from './product-card/ProductDnaPanel';
import CardCommerceControls from './product-card/CardCommerceControls';

export default function StorefrontCardBack({ 
  item, cleanItemName, setIsFlipped, isFlower,
  sizes, options, selectedSize, setSelectedSize,
  bundleQty, selectedOptions, handleSelectOption,
  hasMultipleOptions, qty, updateCart, isBundleComplete, isMaxReached,
  clientConfig 
}: any) {
  
  const UI = clientConfig?.dictionary?.storefront || {
    selectOptions: 'Select Options', liveSubtotal: 'Live Subtotal', addToCart: 'Add to Cart',
    inCart: 'In Cart', noDna: 'No Product DNA Available', feels: 'Feels', taste: 'Taste',
    uses: 'Uses', insiderFact: 'Insider Fact'
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
  const isEdible = activeCat.includes('edible'); 
  const isPreRoll = activeSubCat.includes('pre-roll') || activeSubCat.includes('blunt');
  const isRawFlower = isFlower && !isPreRoll;
  const isHardware = isMerch || activeSubCat.includes('batteries') || activeSubCat.includes('hardware') || activeSubCat.includes('gear') || activeSubCat.includes('glass') || activeSubCat.includes('accessories');
  
  const expandVariants = isVape || isPreRoll || activeCat.includes('concentrates');
  const expectsDNA = !expandVariants && !isHardware;

  const hasTrueVariants = safeOptions.length > 0 && safeOptions[0].label !== 'Standard';
  const displayStock = hasTrueVariants ? safeOptions.reduce((sum: number, opt: any) => sum + (Number(opt.stock) || 0), 0) : (item?.onHand || 0);
  const rawPrice = Number(selectedSize?.price || 0);
  let activeBasePrice = rawPrice;
  let lineTotal = rawPrice * qty;
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
      if (earnedQty > 0) savingsText = `Unlocked ${earnedQty} ${config.discount === 'PCT_50' ? '50% OFF' : config.discount === 'PENNY' ? 'FOR 1¢' : 'FREE'}! (Auto-added at checkout)`;
    }
  }

  const currentSubtotal = lineTotal;

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
      
      {isCompletelyOOS && (
        <div className="absolute inset-0 z-50 bg-zinc-950/80 backdrop-blur-sm flex items-center justify-center rounded-[2.5rem]">
           <button onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }} className="absolute top-6 left-6 p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors"><ArrowLeft size={16} /></button>
           <div className="bg-rose-500 text-zinc-950 font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-400 transform -rotate-12 scale-110">Sold Out</div>
        </div>
      )}

      {/* FLOATING BACK BUTTON FOR EDIBLES */}
      {isEdible && (
         <button onClick={() => setIsFlipped(false)} className="absolute top-4 left-4 z-50 p-1.5 bg-zinc-950/50 hover:bg-zinc-900 border border-zinc-800 backdrop-blur-sm text-zinc-400 rounded-lg transition-colors active:scale-95">
           <ArrowLeft size={16} />
         </button>
      )}

      {/* STANDARD HEADER FOR NON-EDIBLES */}
      {!isEdible && (
        <div className={`flex items-center justify-between p-3 md:p-4 border-b border-zinc-800/50 shrink-0 bg-zinc-950 z-10 pb-3`}>
          <button onClick={() => setIsFlipped(false)} className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors active:scale-95 shrink-0">
            <ArrowLeft size={16} />
          </button>
          <div className="flex items-center gap-2.5 overflow-hidden ml-auto">
            {item?.iconUrl && <div className="w-8 h-8 rounded-full border border-zinc-800 bg-white/95 overflow-hidden shrink-0 shadow-lg flex items-center justify-center"><img src={item.iconUrl} alt="Brand Stamp" className="max-w-[80%] max-h-[80%] object-contain" /></div>}
            <div className="flex flex-col items-end overflow-hidden">
              <h3 className="text-xs font-black text-zinc-100 truncate uppercase tracking-wider">{cleanItemName}</h3>
              {item?.brand && <span className="text-[7px] font-black text-emerald-500 uppercase tracking-widest truncate mt-0.5">BY {item.brand}</span>}
            </div>
          </div>
        </div>
      )}

      {/* SCROLLABLE DATA SECTION (Injecting DNA or Edible Label) */}
      {!expandVariants && (
        <div className={`flex-1 overflow-y-auto scrollbar-hide relative flex flex-col justify-center min-h-0 ${isEdible ? 'p-0' : 'p-4'}`}>
          {isEdible ? (
             <EdibleComplianceLabel item={item} cleanItemName={cleanItemName} />
          ) : (item?.descBase || (hasDNA && expectsDNA)) ? (
             <ProductDnaPanel item={item} UI={UI} hasDNA={hasDNA} expectsDNA={expectsDNA} />
          ) : expectsDNA ? (
             <div className="w-full flex items-center justify-center py-2"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{UI.noDna}</span></div>
          ) : null}
        </div>
      )}

      {/* CART & COMMERCE CONTROLS (Injecting Add to Cart, pricing, variants) */}
      <CardCommerceControls 
         item={item} UI={UI} config={config} safeSizes={safeSizes} sortedSizes={sortedSizes} 
         selectedSize={selectedSize} setSelectedSize={setSelectedSize} expandVariants={expandVariants} 
         isMerch={isMerch} isRawFlower={isRawFlower} displayStock={displayStock} 
         hasMultipleOptions={hasMultipleOptions} safeOptions={safeOptions} sortedOptions={sortedOptions} 
         safeSelectedOptions={safeSelectedOptions} handleSelectOption={handleSelectOption} 
         savingsText={savingsText} qty={qty} updateCart={updateCart} cartAddQty={cartAddQty} 
         isReadyToAdd={isReadyToAdd} isMaxReached={isMaxReached} projectedAddPrice={projectedAddPrice} 
         currentSubtotal={currentSubtotal} 
      />
    </div>
  );
}