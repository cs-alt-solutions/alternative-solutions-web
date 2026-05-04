// sandbox/apps/storefront/product-card/CardCommerceControls.tsx
import React from 'react';
import { getRequiredGrams } from '../StorefrontComponents';
import ControlsUglies from './ControlsUglies';
import ControlsSizes from './ControlsSizes';
import ControlsVariants from './ControlsVariants';
import ControlsFooter from './ControlsFooter';

export default function CardCommerceControls(props: any) {
  const {
    item, config, safeSizes, selectedSize, isRawFlower, displayStock,
    hasMultipleOptions, safeOptions, savingsText, qty, cart, isUglies = false 
  } = props;
  
  const formatSizeText = (label: string, suffix: string = '') => {
    if (!label) return label;
    const parts = label.split('(');
    if (parts.length > 1) {
      const mainText = parts[0].trim();
      const subText = '(' + parts.slice(1).join('(').trim();
      return (
        <span className="inline-flex items-baseline flex-wrap gap-x-1">
          <span>{mainText} {suffix}</span>
          <span className="text-[0.75em] text-zinc-500 font-bold tracking-widest opacity-80">{subText}</span>
        </span>
      );
    }
    return suffix ? `${label} ${suffix}`.trim() : label;
  };

  let totalCartQty = 0;
  let gramsInCart = 0;
  Object.keys(cart || {}).forEach(k => {
    if (k.startsWith(item.id + '_') || k === item.id) {
      const cartItem = cart[k];
      const itemQty = cartItem.qty || 0;
      totalCartQty += itemQty;
      if (isRawFlower && cartItem.size) gramsInCart += itemQty * getRequiredGrams(cartItem.size.label);
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

  const blockProps = {
    ...props,
    formatSizeText,
    totalCartQty,
    remainingGrams,
    activeBasePrice,
    showSizeGridSelector,
    showSizesAsCartRows,
    showVariantsAsCartRows,
    showSingleCartRow
  };

  return (
    <div className={`relative z-20 flex flex-col gap-1 flex-1 min-h-0`}>
      
      {savingsText && qty > 0 && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-zinc-950 px-2 py-0.5 rounded-full text-[6px] sm:text-[7px] font-black uppercase tracking-widest shadow-md whitespace-nowrap z-30">
             {savingsText}
          </div>
      )}

      {isUglies ? (
        <ControlsUglies {...blockProps} />
      ) : (
        <>
          {(showSizeGridSelector || showSizesAsCartRows) && <ControlsSizes {...blockProps} />}
          {showVariantsAsCartRows && <ControlsVariants {...blockProps} />}
        </>
      )}

      <ControlsFooter {...blockProps} />
    </div>
  );
}