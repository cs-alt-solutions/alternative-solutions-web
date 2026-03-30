import React from 'react';
import { X, Box, Sparkles, Plus, Minus } from 'lucide-react';

export default function StorefrontCardBack({
  item, cleanItemName, setIsFlipped, sizes, options,
  selectedSize, setSelectedSize, bundleQty, selectedOptions,
  handleSelectOption, removeSelectedOption, hasMultipleOptions,
  qty, updateCart, isBundleComplete, isMaxReached
}: any) {

  const isMultiStrain = options.some((o: any) => o.label && o.label.includes(' x '));

  return (
    <div className={`col-start-1 row-start-1 backface-hidden w-full h-full transform-[rotateY(180deg)] bg-zinc-900/90 backdrop-blur-xl border ${item.isTopShelf ? 'border-amber-900/30' : 'border-zinc-800/80'} rounded-4xl p-5 shadow-2xl flex flex-col transition-all duration-500`}>
      <div className="flex justify-between items-start mb-5 shrink-0">
         <div>
           <h3 className={`font-black ${item.isTopShelf ? 'text-amber-300' : 'text-zinc-100'} text-xl leading-tight`}>{cleanItemName}</h3>
           <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Configuration</p>
         </div>
         <button onClick={() => setIsFlipped(false)} className="text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-950 p-2 rounded-xl border border-zinc-800"><X size={18} /></button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pb-4">
        <div className="flex flex-col min-h-0">
          <label className={`text-[10px] font-black uppercase tracking-widest ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} mb-3 flex items-center gap-2`}>
            <Box size={12} /> Select Quantity
          </label>
          <div className="grid grid-cols-2 gap-3">
            {sizes.map((s: any) => {
              const showPromo = item.dailyDeal && (s.promoLabel || s.promoPrice !== undefined && s.promoPrice !== '');
              const displayLabel = showPromo && s.promoLabel ? s.promoLabel : s.label;
              const displayPrice = showPromo && s.promoPrice !== undefined && s.promoPrice !== '' ? s.promoPrice : s.price;
              
              return (
                <button key={s.id} onClick={() => setSelectedSize(s)} className={`px-3 py-3 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1 ${selectedSize.id === s.id ? `${item.isTopShelf ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'}` : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}>
                  {showPromo && s.promoLabel ? (
                     <div className="flex flex-col items-center">
                       <s className="text-[8px] font-medium text-zinc-600 uppercase">{s.label}</s>
                       <span className="truncate w-full text-center text-rose-400 uppercase tracking-tighter">{s.promoLabel}</span>
                     </div>
                  ) : <span className="truncate w-full text-center uppercase tracking-tighter">{s.label}</span>}
                  <span className={`font-mono text-[10px] ${showPromo ? 'text-rose-400' : 'opacity-70'}`}>${displayPrice.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {hasMultipleOptions && (
          <div className="flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-3">
              <label className={`text-[10px] font-black uppercase tracking-widest ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} flex items-center gap-2`}><Sparkles size={12} /> Variant</label>
              {bundleQty > 1 && <span className="text-[9px] font-black text-amber-500 uppercase bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">Mix {bundleQty}</span>}
            </div>
            
            {bundleQty > 1 && (
               <div className="mb-4 flex flex-wrap gap-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-800 shadow-inner">
                 {selectedOptions.map((sel: any, idx: number) => (
                   <div key={idx} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-2">
                     {sel.label} <button onClick={(e) => { e.stopPropagation(); removeSelectedOption(idx); }} className="hover:text-rose-400 transition-colors"><X size={12}/></button>
                   </div>
                 ))}
                 {Array.from({ length: bundleQty - selectedOptions.length }).map((_, idx) => (
                   <div key={`empty-${idx}`} className="bg-zinc-900 border border-dashed border-zinc-800 text-zinc-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">Slot {selectedOptions.length + idx + 1}</div>
                 ))}
               </div>
            )}

            <div className={`grid ${isMultiStrain ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
              {options.map((o: any) => {
                const optStock = o.stock !== undefined ? o.stock : item.onHand;
                const inSelectionCount = selectedOptions.filter((sel: any) => sel.id === o.id).length;
                const isSoldOut = optStock <= 0 || inSelectionCount >= optStock;
                const isSelected = selectedOptions.some((sel: any) => sel.id === o.id);
                
                return (
                  <button 
                    key={o.id} onClick={() => !isSoldOut && handleSelectOption(o)} disabled={isSoldOut}
                    className={`px-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all border flex flex-col items-center justify-center 
                      ${isSoldOut ? 'opacity-30 cursor-not-allowed bg-zinc-950 border-zinc-800' : 
                        isSelected ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}
                  >
                    <span className={`${isMultiStrain ? 'text-center' : 'truncate block w-full text-center'}`}>{o.label}</span>
                    
                    {o.strainType && o.strainType !== 'N/A' && (
                      <span className={`text-[8px] uppercase tracking-widest mt-0.5 ${isSelected ? 'text-emerald-300' : 'text-zinc-600'}`}>
                        {o.strainType}
                      </span>
                    )}

                    {isSoldOut ? <span className="text-[8px] text-rose-500 mt-0.5">Gone</span> : optStock <= 5 ? <span className="text-[8px] text-amber-500 mt-0.5">{optStock} Left</span> : null}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto pt-5 border-t border-zinc-800/50 shrink-0">
        {qty === 0 ? (
          <button 
            onClick={() => isBundleComplete && !isMaxReached && updateCart(item.id, selectedSize, selectedOptions, 1)} 
            disabled={!isBundleComplete || isMaxReached}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-xl ${!isBundleComplete || isMaxReached ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50' : `${item.isTopShelf ? 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)]' : 'bg-emerald-500 hover:bg-emerald-400'} text-zinc-950 active:scale-95`}`}
          >
            {!isBundleComplete ? `Add ${bundleQty - selectedOptions.length} More` : isMaxReached ? 'Sold Out' : <><Plus size={20} /> Add to Cart</>}
          </button>
        ) : (
          <div className={`w-full flex items-center justify-between bg-zinc-950 border ${item.isTopShelf ? 'border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]' : 'border-emerald-500/30 shadow-2xl'} rounded-xl p-1.5`}>
            <button onClick={() => updateCart(item.id, selectedSize, selectedOptions, -1)} className="p-3 hover:bg-zinc-900 rounded-lg text-rose-400 transition-all active:scale-90"><Minus size={18}/></button>
            <div className="flex flex-col items-center">
              <span className={`font-black text-xl ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} leading-none`}>{qty}</span>
              <span className={`text-[9px] font-black ${item.isTopShelf ? 'text-amber-400/40' : 'text-emerald-400/40'} uppercase tracking-widest mt-1`}>In Cart</span>
            </div>
            <button onClick={() => !isMaxReached && updateCart(item.id, selectedSize, selectedOptions, 1)} disabled={isMaxReached} className={`p-3 rounded-lg transition-all active:scale-90 ${isMaxReached ? 'text-zinc-800 cursor-not-allowed' : `hover:bg-zinc-900 ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'}`}`}><Plus size={18}/></button>
          </div>
        )}
      </div>
    </div>
  );
}