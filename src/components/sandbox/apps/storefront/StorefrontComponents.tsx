import React, { useState, useEffect } from 'react';
import StorefrontCardFront from './StorefrontCardFront';
import StorefrontCardBack from './StorefrontCardBack';

export const StorefrontCard = ({ item, cart, updateCart, isHero = false }: { item: any, cart: any, updateCart: (itemId: string, size: any, options: any[], delta: number) => void, isHero?: boolean }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const sizes = item.sizes && item.sizes.length > 0 ? item.sizes : [{ id: 'std', label: 'Standard', price: item.price || 0, bundleQty: 1 }];
  const options = item.options && item.options.length > 0 ? item.options : [{ id: 'std', label: 'Standard', stock: item.onHand }];
  const initialOption = options.find((o: any) => (o.stock !== undefined ? o.stock : item.onHand) > 0) || options[0];
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const bundleQty = selectedSize.bundleQty || 1;
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  const hasMultipleOptions = options.length > 1 || (options.length === 1 && options[0].label !== 'Standard');

  useEffect(() => {
    if (bundleQty === 1) setSelectedOptions([initialOption]);
    else setSelectedOptions([]);
  }, [selectedSize.id, bundleQty, initialOption]);

  const handleSelectOption = (o: any) => {
    if (bundleQty === 1) setSelectedOptions([o]);
    else setSelectedOptions(selectedOptions.length < bundleQty ? [...selectedOptions, o] : [...selectedOptions.slice(1), o]);
  };

  const removeSelectedOption = (index: number) => {
    const newOpts = [...selectedOptions];
    newOpts.splice(index, 1);
    setSelectedOptions(newOpts);
  };
  
  const optionsKey = selectedOptions.map(o => o.id).sort().join('+');
  const cartKey = `${item.id}_${selectedSize.id}_${optionsKey}`;
  const qty = cart[cartKey]?.qty || 0;

  const isBundleComplete = selectedOptions.length === bundleQty;
  const maxStockForDisplay = initialOption.stock !== undefined ? initialOption.stock : item.onHand;
  const isMaxReached = qty > 0 && qty >= maxStockForDisplay; 

  const lowestPrice = Math.min(...sizes.map((s:any) => (item.dailyDeal && s.promoPrice !== undefined && s.promoPrice !== '') ? s.promoPrice : s.price));
  
  // Calculate lowest possible price after pure % discounts so the front card can show a strike-through
  let lowestDiscounted = lowestPrice;
  if (item.dailyDeal && item.dealLogic === 'PCT_15') lowestDiscounted = lowestPrice * 0.85;

  const cleanItemName = item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim();

  let glowClass = "";
  if (item.dailyDeal) {
    glowClass = "shadow-[0_0_30px_rgba(236,72,153,0.15)] ring-1 ring-pink-500/20"; 
  } else if (item.isTopShelf || item.featured) {
    glowClass = "shadow-[0_0_30px_rgba(251,191,36,0.1)] ring-1 ring-amber-500/20"; 
  }

  const heightClass = "h-[26rem]";

  return (
    <div className={`group ${heightClass} relative w-full perspective-[1000px] ${isFlipped ? 'z-40' : 'z-10 hover:z-30'}`}>
      <div className={`absolute inset-0 rounded-[2.5rem] transition-all duration-500 ${glowClass} group-hover:opacity-100 ${isFlipped ? 'opacity-0' : 'opacity-70'}`} />

      <div className={`relative w-full h-full transition-all duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        <StorefrontCardFront 
          item={item} cleanItemName={cleanItemName}
          lowestPrice={lowestPrice} lowestDiscounted={lowestDiscounted} setIsFlipped={setIsFlipped}
        />
        <StorefrontCardBack 
          item={item} cleanItemName={cleanItemName} setIsFlipped={setIsFlipped}
          sizes={sizes} options={options} selectedSize={selectedSize} setSelectedSize={setSelectedSize}
          bundleQty={bundleQty} selectedOptions={selectedOptions} handleSelectOption={handleSelectOption}
          removeSelectedOption={removeSelectedOption} hasMultipleOptions={hasMultipleOptions}
          qty={qty} updateCart={updateCart} isBundleComplete={isBundleComplete} isMaxReached={isMaxReached}
        />
      </div>
    </div>
  );
};