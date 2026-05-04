// sandbox/apps/storefront/StorefrontCardFront.tsx
import React from 'react';
import { getRequiredGrams } from './StorefrontComponents';
import CardImageHero from './product-card/CardImageHero';
import CardTitleBlock from './product-card/CardTitleBlock';
import CardPricingFooter from './product-card/CardPricingFooter';

export default function StorefrontCardFront({ 
  item, 
  cleanItemName, 
  baseLowestPrice, 
  activeLowestPrice, 
  setIsFlipped, 
  sizes, 
  isFlower, 
  clientConfig 
}: any) {
  
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

  return (
    <div className={`absolute inset-0 w-full h-full backface-hidden bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-[2.5rem] flex flex-col shadow-xl overflow-hidden transition-all duration-500 ${isOutOfStock ? 'opacity-85 grayscale-30' : ''}`}>
      
      <CardImageHero 
        item={item} 
        isOutOfStock={isOutOfStock} 
        strainColorClass={strainColorClass} 
        UI={UI} 
        renderDealMath={renderDealMath} 
      />

      {/* Reduced padding here to p-4, ensuring flex layout manages space nicely */}
      <div className="flex flex-col flex-1 p-4 justify-between bg-zinc-900/90 relative">
        <CardTitleBlock 
          item={item} 
          cleanItemName={cleanItemName} 
          UI={UI} 
        />
        
        <CardPricingFooter 
          item={item}
          baseLowestPrice={baseLowestPrice}
          activeLowestPrice={activeLowestPrice}
          isOutOfStock={isOutOfStock}
          isBundleOrBogo={isBundleOrBogo}
          setIsFlipped={setIsFlipped}
          UI={UI}
        />
      </div>
    </div>
  );
}