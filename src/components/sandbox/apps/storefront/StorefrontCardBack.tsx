import React from 'react';
import { ArrowLeft, CheckCircle, Minus, Plus, ShoppingCart, FlaskConical, X, Trash2, Wind, Droplet, Cookie, Sparkles, Flame } from 'lucide-react';

export default function StorefrontCardBack({ 
  item, cleanItemName, setIsFlipped,
  sizes, options, selectedSize, setSelectedSize,
  bundleQty, selectedOptions, handleSelectOption,
  removeSelectedOption, hasMultipleOptions,
  qty, updateCart, isBundleComplete, isMaxReached
}: any) {
  
  const hasDNA = item.descFeels || item.descTaste || item.descUses || item.descFact;
  const formatPromo = (logic: string) => ({ 'PCT_15': '15% OFF', 'PENNY_150': '$0.01 UNLOCK', 'BOGO': 'BOGO', 'B2G1': 'B2G1', 'B5G1': 'B5G1' }[logic] || logic || 'PROMO');

  // --- LIVE PROMO MATH ENGINE ---
  const basePrice = item.dailyDeal && selectedSize.promoPrice ? selectedSize.promoPrice : selectedSize.price;
  let chargeableQty = qty;
  let finalPrice = basePrice;

  if (item.dailyDeal) {
     if (item.dealLogic === 'B2G1') chargeableQty = qty - Math.floor(qty / 3);
     else if (item.dealLogic === 'BOGO') chargeableQty = qty - Math.floor(qty / 2);
     else if (item.dealLogic === 'B5G1') chargeableQty = qty - Math.floor(qty / 6);
     else if (item.dealLogic === 'PCT_15') finalPrice = basePrice * 0.85;
  }

  const currentSubtotal = finalPrice * chargeableQty;
  const originalSubtotal = basePrice * qty;
  const savings = originalSubtotal - currentSubtotal;

  let savingsText = "";
  if (item.dailyDeal) {
      if (item.dealLogic === 'B2G1' || item.dealLogic === 'BOGO' || item.dealLogic === 'B5G1') {
         const freeItems = qty - chargeableQty;
         if (freeItems > 0) {
           savingsText = `${freeItems} Free Unit${freeItems > 1 ? 's' : ''} Added! (Saved $${savings.toFixed(2)})`;
         } else if (qty > 0) {
           if (item.dealLogic === 'B2G1') savingsText = `Add 1 more to get a 3rd Free!`;
           if (item.dealLogic === 'B5G1') savingsText = `Add ${5 - qty} more to get a 6th Free!`;
         }
      } else if (item.dealLogic === 'PCT_15' && savings > 0) {
         savingsText = `15% Off Applied! (Saved $${savings.toFixed(2)})`;
      } else if (item.dealLogic === 'PENNY_150' && qty > 0) {
         savingsText = `Unlock for $0.01 at $150 Cart Total`;
      }
  }

  return (
    <div className="absolute inset-0 w-full h-full backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-5 flex flex-col shadow-2xl overflow-hidden">
      
      {/* 1. FIXED HEADER */}
      <div className="flex items-center justify-between mb-3 border-b border-zinc-800/50 pb-3 shrink-0">
        <button onClick={() => setIsFlipped(false)} className="p-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-lg transition-colors active:scale-95">
          <ArrowLeft size={14} />
        </button>
        <h3 className="text-xs font-black text-zinc-100 truncate flex-1 text-right ml-4 uppercase tracking-wider">{cleanItemName}</h3>
      </div>

      {/* 2. SCROLLABLE DNA AREA */}
      <div className="flex-1 overflow-y-auto scrollbar-hide min-h-20 pr-1">
        {hasDNA ? (
          <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-3">
             <div className="grid grid-cols-3 gap-2">
               {item.descFeels && (
                 <div className="flex items-start gap-1.5 border-r border-zinc-800/50 pr-1.5">
                   <Wind size={12} className="text-cyan-400 mt-0.5 shrink-0" />
                   <div>
                     <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">Feels</span>
                     <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descFeels}</span>
                   </div>
                 </div>
               )}
               {item.descTaste && (
                 <div className="flex items-start gap-1.5 border-r border-zinc-800/50 px-1.5">
                   <Cookie size={12} className="text-amber-400 mt-0.5 shrink-0" />
                   <div>
                     <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">Taste</span>
                     <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descTaste}</span>
                   </div>
                 </div>
               )}
               {item.descUses && (
                 <div className="flex items-start gap-1.5 pl-1.5">
                   <Droplet size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                   <div>
                     <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">Uses</span>
                     <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descUses}</span>
                   </div>
                 </div>
               )}
             </div>
             
             {item.descFact && (
               <div className="flex items-start gap-1.5 border-t border-zinc-800/50 pt-2.5">
                 <Sparkles size={12} className="text-amber-400 mt-0.5 shrink-0" />
                 <div>
                   <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">Insider Fact</span>
                   <span className="text-[9px] font-bold text-zinc-200 leading-snug">{item.descFact}</span>
                 </div>
               </div>
             )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No Product DNA Available</span>
          </div>
        )}
      </div>

      {/* 3. FIXED ACTION ANCHOR */}
      <div className="shrink-0 flex flex-col gap-3 pt-3 mt-3 border-t border-zinc-800/50">
        
        {/* Pricing Tiers */}
        {sizes.length > 1 && (
          <div>
            <div className="flex flex-wrap items-center bg-zinc-900 border border-zinc-800/50 rounded-xl p-1 gap-1">
              {sizes.map((s: any) => {
                const isSelected = selectedSize.id === s.id;
                const activePrice = item.dailyDeal && s.promoPrice ? s.promoPrice : s.price;
                let tierFinalPrice = activePrice;
                if (item.dailyDeal && item.dealLogic === 'PCT_15') tierFinalPrice = activePrice * 0.85;

                return (
                  <button 
                    key={s.id} 
                    onClick={() => setSelectedSize(s)}
                    className={`flex-1 min-w-17.5 px-2 py-1.5 rounded-lg text-center transition-all ${isSelected ? 'bg-zinc-100 text-zinc-950 shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    <span className="block text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">{s.label}</span>
                    <span className={`flex text-[10px] font-mono font-bold leading-none justify-center items-center gap-1 ${isSelected ? 'text-emerald-700' : item.dailyDeal ? 'text-pink-400' : 'text-emerald-400'}`}>
                      {tierFinalPrice < activePrice && <span className="line-through text-zinc-500/50 text-[9px]">${activePrice.toFixed(0)}</span>}
                      ${tierFinalPrice.toFixed(0)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Flavor / Options */}
        {hasMultipleOptions && (
          <div>
            <div className="flex justify-between items-center mb-1.5 px-1">
              <label className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Select Options</label>
              {bundleQty > 1 && (
                <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${isBundleComplete ? 'bg-emerald-500/20 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                  {selectedOptions.length} / {bundleQty} Picked
                </span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1.5 bg-zinc-900 border border-zinc-800/50 rounded-xl p-2">
              {options.map((opt: any) => {
                const stockVal = opt.stock !== undefined ? opt.stock : item.onHand;
                const isOutOfStock = stockVal <= 0;
                
                const instancesInBundle = selectedOptions.filter((so:any) => so.id === opt.id).length;
                const isSelected = bundleQty === 1 ? selectedOptions[0]?.id === opt.id : instancesInBundle > 0;

                return (
                  <button 
                    key={opt.id}
                    disabled={isOutOfStock || (bundleQty > 1 && isBundleComplete)}
                    onClick={() => handleSelectOption(opt)}
                    className={`relative flex-1 min-w-20 p-2 rounded-lg text-center border transition-all active:scale-95 ${isOutOfStock ? 'bg-zinc-950 border-zinc-800 text-zinc-700 cursor-not-allowed line-through' : isSelected ? 'bg-zinc-100 text-zinc-950 border-zinc-100 shadow-md' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-100'}`}
                  >
                    <span className="block text-[8px] font-black uppercase tracking-widest">{opt.label}</span>
                    {instancesInBundle > 1 && (
                        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 bg-emerald-500 text-zinc-950 text-[9px] font-black rounded-full shadow-lg border border-zinc-950">{instancesInBundle}x</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Add To Cart Area & Live Math Engine */}
        <div className="shrink-0 mt-1">
          {!isBundleComplete && bundleQty > 1 ? (
            <div className="w-full py-3 rounded-xl bg-zinc-900 border border-dashed border-zinc-700 text-zinc-600 text-center text-[9px] font-black uppercase tracking-widest">
              Select {bundleQty - selectedOptions.length} More Options
            </div>
          ) : qty === 0 ? (
            <button 
              onClick={() => updateCart(item.id, selectedSize, selectedOptions, 1)}
              disabled={isMaxReached}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-[0_5px_20px_rgba(52,211,153,0.3)] active:scale-95 flex items-center justify-center gap-2 text-[11px]"
            >
              <ShoppingCart size={16} /> Add to Cart
            </button>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between bg-zinc-900 border border-emerald-500/30 p-1.5 rounded-xl">
                <button 
                  onClick={() => updateCart(item.id, selectedSize, selectedOptions, -1)}
                  className="w-10 h-9 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-rose-400 transition-colors active:scale-90 border border-zinc-800"
                >
                  {qty === 1 ? <Trash2 size={12} /> : <Minus size={12} />}
                </button>
                <div className="flex flex-col items-center justify-center px-4">
                  <span className="text-lg font-black font-mono text-zinc-100 leading-none">{qty}</span>
                  <span className="text-[7px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-1 mt-1"><CheckCircle size={8}/> In Cart</span>
                </div>
                <button 
                  onClick={() => updateCart(item.id, selectedSize, selectedOptions, 1)}
                  disabled={isMaxReached}
                  className="w-10 h-9 flex items-center justify-center bg-zinc-950 hover:bg-zinc-800 rounded-lg text-emerald-400 transition-colors active:scale-90 border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={12} />
                </button>
              </div>

              {/* LIVE SUBTOTAL */}
              <div className="flex items-center justify-between px-1.5 py-0.5">
                 <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">Live Subtotal</span>
                 <div className="flex items-end gap-1.5">
                    {savings > 0 && <span className="text-[10px] font-mono font-bold text-rose-500/50 line-through leading-none">${originalSubtotal.toFixed(2)}</span>}
                    <span className="text-sm font-mono font-black text-emerald-400 leading-none">${currentSubtotal.toFixed(2)}</span>
                 </div>
              </div>
              
              {/* SAVINGS CALLOUT */}
              {savingsText && (
                 <div className="text-center bg-pink-500/10 border border-pink-500/20 py-1.5 rounded-lg animate-in zoom-in-95 mt-0.5">
                    <span className="text-[8px] font-black uppercase tracking-widest text-pink-400 flex items-center justify-center gap-1"><Flame size={10}/> {savingsText}</span>
                 </div>
              )}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}