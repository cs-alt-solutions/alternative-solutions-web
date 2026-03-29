/* src/components/sandbox/apps/storefront/StorefrontComponents.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Minus, X, Leaf, Flame, Box, Image as ImageIcon, Sparkles, Wind, Target, Star, Award } from 'lucide-react';

// HELPER: Dynamic Sensory Parser
const SensoryStats = ({ text }: { text: string }) => {
  if (!text) return null;

  // Extracting specific sections from your text strings
  const feelsMatch = text.match(/Feels:\s*([^.]*)/i);
  const tasteMatch = text.match(/Taste:\s*([^.]*)/i);
  const usesMatch = text.match(/Uses:\s*([^.]*)/i);

  const feels = feelsMatch ? feelsMatch[1].split(',').map(s => s.trim()) : [];
  const tastes = tasteMatch ? tasteMatch[1].split(',').map(s => s.trim()) : [];

  return (
    <div className="w-full space-y-3 px-2 mt-2">
      {feels.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1.5">
          {feels.map((f, i) => (
            <span key={i} className="text-[8px] font-black uppercase tracking-tighter bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-[0_0_10px_rgba(34,211,238,0.1)]">
              <Sparkles size={8} /> {f}
            </span>
          ))}
        </div>
      )}
      
      {tastes.length > 0 && (
        <div className="flex items-center justify-center gap-4 py-1 border-y border-zinc-800/50">
           {tastes.slice(0, 3).map((t, i) => (
             <div key={i} className="flex flex-col items-center">
                <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mb-0.5">Note</span>
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 italic">
                  <Wind size={10} className="text-zinc-500" /> {t}
                </span>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export const StorefrontCard = ({ item, cart, updateCart }: { item: any, cart: any, updateCart: (itemId: string, size: any, options: any[], delta: number) => void }) => {
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
  
  const Icon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
  const optionsKey = selectedOptions.map(o => o.id).sort().join('+');
  const cartKey = `${item.id}_${selectedSize.id}_${optionsKey}`;
  const qty = cart[cartKey]?.qty || 0;

  const isBundleComplete = selectedOptions.length === bundleQty;
  const maxStockForDisplay = initialOption.stock !== undefined ? initialOption.stock : item.onHand;
  const isMaxReached = qty > 0 && qty >= maxStockForDisplay; 

  const lowestPrice = Math.min(...sizes.map((s:any) => (item.dailyDeal && s.promoPrice !== undefined && s.promoPrice !== '') ? s.promoPrice : s.price));

  // Clean description for the "Summary" block (removes the Feels/Taste technical parts)
  const cleanDescription = item.description?.split('Feels:')[0].split('Taste:')[0].trim();

  // Smart Cleanup: Removes "(Top Shelf)" from name text, stamp handles visual branding
  const cleanItemName = item.name?.replace(/\s*\(\s*Top Shelf\s*\)\s*/i, '').trim();

  return (
    <div className="group relative w-full h-[600px] perspective-[1000px]">
      <div className={`w-full h-full transition-all duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        
        {/* FRONT */}
        <div className={`absolute inset-0 backface-hidden bg-zinc-900 border ${item.isTopShelf ? 'border-amber-900/40 group-hover:border-amber-400' : 'border-zinc-800 group-hover:border-emerald-500/30'} rounded-[2.5rem] p-6 shadow-2xl flex flex-col items-center overflow-hidden transition-all duration-500`}>
          
          {/* Visual Header */}
          <div className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-3xl mb-6 flex items-center justify-center text-zinc-800 shadow-inner overflow-hidden relative group-hover:border-amber-500/30 transition-all duration-500">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-transparent to-transparent" />
             <Icon size={72} className="opacity-20 group-hover:scale-110 group-hover:opacity-40 transition-all duration-700" />
             
             <span className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/20 shadow-lg">
               ${lowestPrice.toFixed(2)}+
             </span>
             
             <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
               {/* TOP SHELF GOLD STAMP PROTOCOL */}
               {item.isTopShelf && (
                 <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950 bg-amber-400 px-3.5 py-1.5 rounded-full shadow-[0_0_20px_rgba(251,191,36,0.6)] flex items-center gap-1.5 border border-amber-100/50">
                    <Award size={14} className="animate-pulse" /> TOP SHELF <Star size={10} className="fill-current text-zinc-950" />
                 </span>
               )}
               {item.dailyDeal && (
                 <span className="text-[9px] font-black uppercase tracking-widest text-zinc-100 bg-rose-600 px-3 py-1 rounded-full shadow-[0_0_20px_rgba(225,29,72,0.4)] flex items-center gap-1.5 animate-pulse">
                   <Flame size={10} /> {item.dealType || 'Limited'}
                 </span>
               )}
             </div>
          </div>
          
          {/* Custom Deal Banner */}
          {item.dailyDeal && item.dealText && (
            <div className="w-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.15em] p-2.5 rounded-2xl mb-4 text-center flex items-center justify-center gap-2 shadow-inner">
               <Target size={12} className="animate-bounce" /> {item.dealText}
            </div>
          )}

          {/* Content Body */}
          <div className="flex-1 w-full text-center space-y-3">
            <div>
              <h3 className={`font-black ${item.isTopShelf ? 'text-amber-300' : 'text-zinc-100'} text-2xl tracking-tight leading-none mb-1`}>{cleanItemName}</h3>
              <p className="text-[9px] font-black text-amber-500/50 uppercase tracking-[0.3em]">{item.subCategory || item.category}</p>
            </div>

            {/* Smart Sensory Tags */}
            <SensoryStats text={item.description} />
            
            {cleanDescription && (
              <div className="relative group/desc">
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 font-medium px-4 mt-2 italic">
                  "{cleanDescription}"
                </p>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-amber-500/20 rounded-full" />
              </div>
            )}
          </div>

          <button 
            onClick={() => setIsFlipped(true)} 
            className={`w-full mt-6 bg-zinc-950 ${item.isTopShelf ? 'hover:bg-amber-400' : 'hover:bg-emerald-500'} hover:text-zinc-950 ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} border ${item.isTopShelf ? 'border-amber-900/50 hover:border-amber-100' : 'border-zinc-800 hover:border-emerald-400'} py-4 rounded-2xl font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95`}
          >
            Select & Order
          </button>
        </div>

        {/* BACK - (Enhanced Gold Accents for Top Shelf) */}
        <div className={`absolute inset-0 backface-hidden transform-[rotateY(180deg)] bg-zinc-900 ${item.isTopShelf ? 'border border-amber-500/30' : 'border border-emerald-500/30'} rounded-[2.5rem] p-6 ${item.isTopShelf ? 'shadow-[0_0_60px_rgba(251,191,36,0.15)]' : 'shadow-[0_0_50px_rgba(16,185,129,0.15)]'} flex flex-col transition-all duration-500`}>
          <div className="flex justify-between items-start mb-5 shrink-0">
             <div>
               <h3 className={`font-black ${item.isTopShelf ? 'text-amber-300' : 'text-zinc-100'} text-xl leading-tight`}>{cleanItemName}</h3>
               <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Configuration</p>
             </div>
             <button onClick={() => setIsFlipped(false)} className="text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-950 p-2 rounded-full border border-zinc-800"><X size={18} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
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
                      ) : (
                         <span className="truncate w-full text-center uppercase tracking-tighter">{s.label}</span>
                      )}
                      
                      <span className={`font-mono text-[10px] ${showPromo ? 'text-rose-400' : 'opacity-70'}`}>
                        ${displayPrice.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {hasMultipleOptions && (
              <div className="flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-[10px] font-black uppercase tracking-widest ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} flex items-center gap-2`}>
                    <Sparkles size={12} /> Variant
                  </label>
                  {bundleQty > 1 && <span className="text-[9px] font-black text-amber-500 uppercase bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">Mix {bundleQty}</span>}
                </div>
                
                {bundleQty > 1 && (
                   <div className="mb-4 flex flex-wrap gap-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-800 shadow-inner">
                     {selectedOptions.map((sel, idx) => (
                       <div key={idx} className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl flex items-center gap-2">
                         {sel.label}
                         <button onClick={(e) => { e.stopPropagation(); removeSelectedOption(idx); }} className="hover:text-rose-400 transition-colors"><X size={12}/></button>
                       </div>
                     ))}
                     {Array.from({ length: bundleQty - selectedOptions.length }).map((_, idx) => (
                       <div key={`empty-${idx}`} className="bg-zinc-900 border border-dashed border-zinc-800 text-zinc-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl">Slot {selectedOptions.length + idx + 1}</div>
                     ))}
                   </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {options.map((o: any) => {
                    const optStock = o.stock !== undefined ? o.stock : item.onHand;
                    const inSelectionCount = selectedOptions.filter(sel => sel.id === o.id).length;
                    const isSoldOut = optStock <= 0 || inSelectionCount >= optStock;
                    
                    return (
                      <button 
                        key={o.id} onClick={() => !isSoldOut && handleSelectOption(o)} disabled={isSoldOut}
                        className={`px-3 py-3 rounded-2xl text-[11px] font-black uppercase tracking-tighter transition-all border flex flex-col items-center justify-center 
                          ${isSoldOut ? 'opacity-30 cursor-not-allowed bg-zinc-950 border-zinc-800' : 
                            selectedOptions.some(sel => sel.id === o.id) ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg' : 
                            'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}
                      >
                        <span className="truncate block w-full text-center">{o.label}</span>
                        {isSoldOut ? <span className="text-[8px] text-rose-500">Gone</span> : optStock <= 5 ? <span className="text-[8px] text-amber-500">{optStock} Left</span> : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar - (improved with gold highlights) */}
          <div className="mt-6 pt-6 border-t border-zinc-800 shrink-0">
            {qty === 0 ? (
              <button 
                onClick={() => isBundleComplete && !isMaxReached && updateCart(item.id, selectedSize, selectedOptions, 1)} 
                disabled={!isBundleComplete || isMaxReached}
                className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex justify-center items-center gap-3 shadow-xl
                  ${!isBundleComplete || isMaxReached ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed opacity-50' : `${item.isTopShelf ? 'bg-amber-400 hover:bg-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)]' : 'bg-emerald-500 hover:bg-emerald-400'} text-zinc-950 active:scale-95`}`}
              >
                {!isBundleComplete ? `Add ${bundleQty - selectedOptions.length} More` : isMaxReached ? 'Sold Out' : <><Plus size={20} /> Add to Cart</>}
              </button>
            ) : (
              <div className={`w-full flex items-center justify-between bg-zinc-950 border ${item.isTopShelf ? 'border-amber-500/30 shadow-[0_0_20px_rgba(251,191,36,0.15)]' : 'border-emerald-500/30 shadow-2xl'} rounded-2xl p-1.5`}>
                <button onClick={() => updateCart(item.id, selectedSize, selectedOptions, -1)} className="p-4 hover:bg-zinc-900 rounded-xl text-rose-400 transition-all active:scale-90"><Minus size={20}/></button>
                <div className="flex flex-col items-center">
                  <span className={`font-black text-2xl ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} leading-none`}>{qty}</span>
                  <span className={`text-[10px] font-black ${item.isTopShelf ? 'text-amber-400/40' : 'text-emerald-400/40'} uppercase tracking-widest mt-1`}>In Cart</span>
                </div>
                <button onClick={() => !isMaxReached && updateCart(item.id, selectedSize, selectedOptions, 1)} disabled={isMaxReached} className={`p-4 rounded-xl transition-all active:scale-90 ${isMaxReached ? 'text-zinc-800 cursor-not-allowed' : `hover:bg-zinc-900 ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'}`}`}><Plus size={20}/></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};