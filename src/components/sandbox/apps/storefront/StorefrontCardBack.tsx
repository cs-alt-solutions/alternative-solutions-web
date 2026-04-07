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
  const basePrice = item?.dailyDeal && selectedSize?.promoPrice !== undefined && selectedSize?.promoPrice !== '' ? Number(selectedSize.promoPrice) : Number(selectedSize?.price || 0);
  
  let chargeableQty = qty;
  let finalPrice = basePrice;

  if (item?.dailyDeal) {
     if (item.dealLogic === 'B2G1') chargeableQty = qty - Math.floor(qty / 3);
     else if (item.dealLogic === 'BOGO') chargeableQty = qty - Math.floor(qty / 2);
     else if (item.dealLogic === 'B5G1') chargeableQty = qty - Math.floor(qty / 6);
     else if (item.dealLogic === 'PCT_15') finalPrice = basePrice * 0.85;
  }

  const currentSubtotal = finalPrice * chargeableQty;
  const originalSubtotal = Number(selectedSize?.price || 0) * qty;
  const savings = originalSubtotal - currentSubtotal;

  let savingsText = "";
  if (item?.dailyDeal) {
      if (item.dealLogic === 'B2G1' || item.dealLogic === 'BOGO' || item.dealLogic === 'B5G1') {
         const freeItems = qty - chargeableQty;
         if (freeItems > 0) {
           savingsText = `${freeItems} Free Unit${freeItems > 1 ? 's' : ''} Added! (Saved $${savings.toFixed(2)})`;
         } else if (qty > 0) {
           if (item.dealLogic === 'B2G1') savingsText = `Add 1 more to get a 3rd Free!`;
           if (item.dealLogic === 'B5G1') savingsText = `Add ${5 - qty} more to get a 6th Free!`;
         }
      } else if (item.dealLogic === 'PCT_15' && savings > 0) {
         savingsText = `Discount Applied! (Saved $${savings.toFixed(2)})`;
      } else if (item.dealLogic === 'PENNY_150' && qty > 0) {
         savingsText = `Unlock for $0.01 at $150 Cart Total`;
      }
  }

  return (
    <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-5 flex flex-col shadow-2xl overflow-hidden">
      
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800/50 pb-3 shrink-0">
        <button onClick={() => setIsFlipped(false)} className="p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-xl transition-colors active:scale-95 shrink-0">
          <ArrowLeft size={16} />
        </button>
        <div className="flex flex-col items-end overflow-hidden ml-4">
          <h3 className="text-sm font-black text-zinc-100 truncate uppercase tracking-wider">{cleanItemName}</h3>
          {item?.brand && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest truncate mt-0.5">BY {item.brand}</span>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-20 pr-1">
        {(item?.descBase || hasDNA) ? (
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-4 flex flex-col gap-3">
             {item?.descBase && (
                <p className={`text-xs text-zinc-300 italic leading-relaxed ${hasDNA ? 'border-b border-zinc-800/50 pb-3' : ''}`}>
                  {item.descBase}
                </p>
             )}
             {hasDNA && (
               <div className="grid grid-cols-3 gap-3">
                 {item?.descFeels && (
                   <div className="flex items-start gap-2 border-r border-zinc-800/50 pr-2">
                     <Wind size={14} className="text-cyan-400 mt-0.5 shrink-0" />
                     <div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">{UI.feels}</span>
                       <span className="text-xs font-bold text-zinc-200 leading-snug">{item.descFeels}</span>
                     </div>
                   </div>
                 )}
                 {item?.descTaste && (
                   <div className="flex items-start gap-2 border-r border-zinc-800/50 px-2">
                     <Cookie size={14} className="text-amber-400 mt-0.5 shrink-0" />
                     <div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">{UI.taste}</span>
                       <span className="text-xs font-bold text-zinc-200 leading-snug">{item.descTaste}</span>
                     </div>
                   </div>
                 )}
                 {item?.descUses && (
                   <div className="flex items-start gap-2 pl-2">
                     <Droplet size={14} className="text-emerald-400 mt-0.5 shrink-0" />
                     <div>
                       <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">{UI.uses}</span>
                       <span className="text-xs font-bold text-zinc-200 leading-snug">{item.descUses}</span>
                     </div>
                   </div>
                 )}
               </div>
             )}
             {item?.descFact && (
               <div className="flex items-start gap-2 border-t border-zinc-800/50 pt-3">
                 <Sparkles size={14} className="text-amber-400 mt-0.5 shrink-0" />
                 <div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1">{UI.insiderFact}</span>
                   <span className="text-xs font-bold text-zinc-200 leading-relaxed">{item.descFact}</span>
                 </div>
               </div>
             )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-xs font-black uppercase tracking-widest text-zinc-600">{UI.noDna}</span>
          </div>
        )}
      </div>

      <div className="shrink-0 flex flex-col gap-3 pt-3 mt-3 border-t border-zinc-800/50">
        {sizes.length > 1 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 bg-zinc-900 border border-zinc-800/50 rounded-xl p-1.5 gap-1.5">
            {sizes.map((s: any) => {
              const isSelected = selectedSize?.id === s.id;
              
              const rawBasePrice = Number(s.price || 0);
              let tierFinalPrice = rawBasePrice;

              if (item?.dailyDeal) {
                  if (s.promoPrice !== undefined && s.promoPrice !== '') {
                      tierFinalPrice = Number(s.promoPrice);
                  }
                  if (item.dealLogic === 'PCT_15') tierFinalPrice *= 0.85;
              }

              const reqGrams = isFlower ? getRequiredGrams(s.label) : 1;
              const available = item?.onHand || 0;
              const isTooHeavy = isFlower && available < reqGrams;

              return (
                <button 
                  key={s.id} 
                  disabled={isTooHeavy}
                  onClick={() => setSelectedSize(s)}
                  className={`px-2 py-2 rounded-lg text-center transition-all ${isTooHeavy ? 'bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed opacity-50' : isSelected ? 'bg-zinc-100 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'}`}
                >
                  <span className={`block text-[10px] font-black uppercase tracking-widest leading-none mb-1 ${isTooHeavy ? 'line-through text-rose-900' : ''}`}>{s.label}</span>
                  <span className={`flex text-xs md:text-sm font-mono font-bold leading-none justify-center items-center gap-1 ${isTooHeavy ? 'text-zinc-700' : isSelected ? 'text-emerald-700' : item?.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>
                    {tierFinalPrice < rawBasePrice && !isTooHeavy && <span className="line-through text-zinc-500/50 text-[10px]">${rawBasePrice.toFixed(0)}</span>}
                    ${tierFinalPrice.toFixed(0)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {hasMultipleOptions && (
          <div>
            <div className="flex justify-between items-center mb-2 px-1">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{UI.selectOptions}</label>
            </div>
            <div className="flex flex-wrap gap-2 bg-zinc-900 border border-zinc-800/50 rounded-xl p-2.5">
              {options.map((opt: any) => {
                const stockVal = opt.stock !== undefined ? opt.stock : item?.onHand;
                const isOutOfStock = stockVal <= 0;
                const instancesInBundle = selectedOptions.filter((so:any) => so?.id === opt.id).length;
                const isSelected = bundleQty === 1 ? selectedOptions[0]?.id === opt.id : instancesInBundle > 0;

                return (
                  <button 
                    key={opt.id}
                    disabled={isOutOfStock || (bundleQty > 1 && isBundleComplete)}
                    onClick={() => handleSelectOption(opt)}
                    className={`relative flex-1 min-w-24 p-2.5 rounded-lg text-center border transition-all active:scale-95 ${isOutOfStock ? 'bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed line-through' : isSelected ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-zinc-100'}`}
                  >
                    <span className="block text-[10px] md:text-xs font-black uppercase tracking-wider leading-tight">{opt.label}</span>
                    {instancesInBundle > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-5 h-5 bg-emerald-500 text-zinc-950 text-[10px] font-black rounded-full shadow-lg border border-zinc-950">{instancesInBundle}x</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="shrink-0 mt-2">
          {!isBundleComplete && bundleQty > 1 ? (
            <div className="w-full py-4 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 text-zinc-500 text-center text-[10px] font-black uppercase tracking-widest">
              Pick {bundleQty - selectedOptions.length} More
            </div>
          ) : qty === 0 ? (
            <button 
              onClick={() => updateCart(item.id, selectedSize, selectedOptions, 1)}
              disabled={isMaxReached || (isFlower && (item?.onHand || 0) < getRequiredGrams(selectedSize.label))}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_5px_20px_rgba(52,211,153,0.3)] active:scale-95 flex items-center justify-center gap-2 text-xs md:text-sm disabled:opacity-50"
            >
              <ShoppingCart size={18} /> {UI.addToCart}
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between bg-zinc-900 border border-emerald-500/30 p-2 rounded-xl">
                <button 
                  onClick={() => updateCart(item.id, selectedSize, selectedOptions, -1)}
                  className="w-12 h-10 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-rose-400 transition-colors active:scale-90 border border-zinc-800"
                >
                  {qty === 1 ? <Trash2 size={16} /> : <Minus size={16} />}
                </button>
                <div className="flex flex-col items-center justify-center px-4">
                  <span className="text-xl font-black font-mono text-zinc-100 leading-none">{qty}</span>
                  <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1 mt-1"><CheckCircle size={10}/> {UI.inCart}</span>
                </div>
                <button 
                  onClick={() => updateCart(item.id, selectedSize, selectedOptions, 1)}
                  disabled={isMaxReached}
                  className="w-12 h-10 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-emerald-400 transition-colors active:scale-90 border border-zinc-800 disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>

              <div className="flex items-center justify-between px-2 py-1">
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{UI.liveSubtotal}</span>
                 <div className="flex items-end gap-2">
                    {savings > 0 && <span className="text-xs font-mono font-bold text-rose-500/50 line-through leading-none mb-0.5">${originalSubtotal.toFixed(2)}</span>}
                    <span className="text-lg font-mono font-black text-emerald-400 leading-none">${currentSubtotal.toFixed(2)}</span>
                 </div>
              </div>
              
              {savingsText && (
                 <div className="text-center bg-pink-500/10 border border-pink-500/20 py-2 rounded-lg mt-1 animate-in zoom-in-95">
                    <span className="text-[10px] font-black uppercase tracking-widest text-pink-400 flex items-center justify-center gap-1.5"><Flame size={12}/> {savingsText}</span>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}