import React, { useState, useEffect } from 'react';
import StorefrontCardFront from './StorefrontCardFront';
import StorefrontCardBack from './StorefrontCardBack';

export const getRequiredGrams = (label: string) => {
  if (!label) return 0;
  const l = label.toLowerCase();
  if (l.includes('oz') || l.includes('ounce') || l.includes('full')) return 28;
  if (l.includes('half') || l.includes('hlf') || l.includes('1/2')) return 14;
  if (l.includes('qtr') || l.includes('quarter') || l.includes('1/4')) return 7;
  if (l.includes('8th') || l.includes('eighth') || l.includes('1/8')) return 3.5;
  const match = l.match(/(\d+(?:\.\d+)?)\s*g/);
  if (match) return Number(match[1]);
  return 1;
};

export const StorefrontCard = ({ item, cart, updateCart, clientConfig, isHero = false }: any) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const rawSizes = Array.isArray(item?.sizes) ? item.sizes : [];
  const cleanSizes = rawSizes.filter((s: any) => s && typeof s === 'object');
  const sizes = cleanSizes.length > 0 ? cleanSizes : [{ id: 'std', label: 'Standard', price: item?.price || 0, bundleQty: 1 }];
  
  const rawOptions = Array.isArray(item?.options) ? item.options : [];
  const cleanOptions = rawOptions.filter((o: any) => o && typeof o === 'object');
  const options = cleanOptions.length > 0 ? cleanOptions : [{ id: 'std', label: 'Standard', stock: item?.onHand || 0 }];
  
  const initialOption = options.find((o: any) => (o?.stock !== undefined ? o.stock : item?.onHand) > 0) || options[0];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const bundleQty = selectedSize?.bundleQty || 1;
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const isFlower = item?.mainCategory === 'Flower & Plants';
  const isMerch = item?.mainCategory === 'Merch & Extras';
  const forceHideVariants = isFlower || isMerch;

  const hasMultipleOptions = !forceHideVariants && (options.length > 1 || (options.length === 1 && options[0]?.label !== 'Standard'));

  useEffect(() => {
    if (bundleQty === 1) setSelectedOptions([initialOption]);
    else setSelectedOptions([]);
  }, [selectedSize?.id, bundleQty, initialOption?.id]);

  const handleSelectOption = (o: any) => {
    if (bundleQty === 1) setSelectedOptions([o]);
    else setSelectedOptions(selectedOptions.length < bundleQty ? [...selectedOptions, o] : [...selectedOptions.slice(1), o]);
  };

  const removeSelectedOption = (index: number) => {
    const newOpts = [...selectedOptions];
    newOpts.splice(index, 1);
    setSelectedOptions(newOpts);
  };
  
  const optionsKey = selectedOptions.map(o => o?.id).sort().join('+');
  const cartKey = `${item?.id}_${selectedSize?.id}_${optionsKey}`;
  const qty = cart[cartKey]?.qty || 0;
  const isBundleComplete = selectedOptions.length === bundleQty;
  
  let maxStockForDisplay = 0;
  if (isFlower) {
     const gramsNeeded = getRequiredGrams(selectedSize.label);
     maxStockForDisplay = Math.floor((item?.onHand || 0) / gramsNeeded);
  } else {
     maxStockForDisplay = forceHideVariants ? item?.onHand : (initialOption?.stock !== undefined ? initialOption.stock : item?.onHand);
  }
  const isMaxReached = qty > 0 && qty >= maxStockForDisplay; 

  const baseLowestPrice = Math.min(...sizes.map((s:any) => Number(s?.price || 0)));
  
  // UPDATED: Now reads the dynamic dealConfig math correctly
  const activeLowestPrice = Math.min(...sizes.map((s:any) => {
    let price = Number(s?.price || 0);
    if (item?.dailyDeal && item?.dealConfig) {
       const config = item.dealConfig;
       if (config.type === 'DISCOUNT') {
          if (config.discountType === 'TIERED' && s.promoPrice) price = Number(s.promoPrice);
          else if (config.discountType === 'PERCENT') price = price * (1 - config.discountValue / 100);
          else if (config.discountType === 'DOLLAR') price = Math.max(0, price - config.discountValue);
          else if (config.discountType === 'FIXED') price = config.discountValue;
       } else if (config.type === 'BUNDLE') {
          price = config.bundlePrice / config.buyQty;
       } else if (config.type === 'BOGO') {
          let getP = 0;
          if (config.discount === 'PCT_50') getP = price * 0.5;
          else if (config.discount === 'PENNY') getP = 0.01;
          price = ((config.buyQty * price) + (config.getQty * getP)) / (config.buyQty + config.getQty);
       }
    }
    return price;
  }));

  const cleanItemName = item?.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim();

  let glowClass = "";
  if (item?.dailyDeal) {
    glowClass = "shadow-[0_0_30px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/20"; 
  } else if (item?.isTopShelf || item?.featured) {
    glowClass = "shadow-[0_0_30px_rgba(251,191,36,0.1)] ring-1 ring-amber-500/20"; 
  }

  return (
    <div className={`group h-104 relative w-full perspective-[1000px] ${isFlipped ? 'z-40' : 'z-10 hover:z-30'}`}>
      <div className={`absolute inset-0 rounded-[2.5rem] transition-all duration-500 ${glowClass} group-hover:opacity-100 ${isFlipped ? 'opacity-0' : 'opacity-70'}`} />

      <div className={`relative w-full h-full transition-all duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        <StorefrontCardFront 
          item={item} cleanItemName={cleanItemName} sizes={sizes} isFlower={isFlower}
          baseLowestPrice={baseLowestPrice} activeLowestPrice={activeLowestPrice} 
          setIsFlipped={setIsFlipped} clientConfig={clientConfig}
        />
        <StorefrontCardBack 
          item={item} cleanItemName={cleanItemName} setIsFlipped={setIsFlipped} isFlower={isFlower}
          sizes={sizes} options={options} selectedSize={selectedSize} setSelectedSize={setSelectedSize}
          bundleQty={bundleQty} selectedOptions={selectedOptions} handleSelectOption={handleSelectOption}
          removeSelectedOption={removeSelectedOption} hasMultipleOptions={hasMultipleOptions}
          qty={qty} updateCart={updateCart} isBundleComplete={isBundleComplete} isMaxReached={isMaxReached}
          clientConfig={clientConfig}
        />
      </div>
    </div>
  );
};