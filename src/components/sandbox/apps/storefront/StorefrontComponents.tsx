/* src/components/sandbox/apps/storefront/StorefrontComponents.tsx */
'use client';

import React, { useState } from 'react';
import { Plus, Minus, X, Leaf, Flame, Box, Image as ImageIcon } from 'lucide-react';

// ==========================================
// 1. 3D FLIPPING PRODUCT CARD
// ==========================================
export const StorefrontCard = ({ item, cart, updateCart }: { item: any, cart: any, updateCart: (itemId: string, size: any, option: any, delta: number) => void }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Provide fallbacks to prevent crashes if data is missing
  const sizes = item.sizes && item.sizes.length > 0 ? item.sizes : [{ id: 'std', label: 'Standard', price: item.price || 0 }];
  const options = item.options && item.options.length > 0 ? item.options : [{ id: 'std', label: 'Standard' }];
  
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  
  const Icon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;
  
  // The unique key for the cart now includes both the size AND the option
  const cartKey = `${item.id}_${selectedSize.id}_${selectedOption.id}`;
  const qty = cart[cartKey]?.qty || 0;

  return (
    <div className="group relative w-full h-[480px] perspective-[1000px]">
      <div className={`w-full h-full transition-transform duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow-lg flex flex-col items-center">
          <div className="w-full h-48 bg-zinc-950 border border-zinc-800 rounded-2xl mb-4 flex items-center justify-center text-zinc-800 shadow-inner overflow-hidden relative group-hover:border-emerald-500/30 transition-colors">
             <Icon size={64} className="opacity-50" />
             <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent opacity-80" />
             <span className="absolute bottom-3 left-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/50 px-2 py-1 rounded border border-emerald-900/50">
               Starts at ${sizes[0].price.toFixed(2)}
             </span>
             {item.featured && (
               <span className="absolute top-3 right-3 text-[10px] font-black uppercase tracking-widest text-zinc-950 bg-emerald-500 px-2 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                 Daily Deal
               </span>
             )}
          </div>
          <h3 className="font-black text-zinc-100 text-xl tracking-tight text-center mb-1 w-full truncate">{item.name}</h3>
          <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-auto">{item.category}</p>
          <button onClick={() => setIsFlipped(true)} className="w-full mt-4 bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-zinc-700 py-3 rounded-xl font-black uppercase tracking-widest transition-all">Select Options</button>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] bg-zinc-900 border border-emerald-500/30 rounded-3xl p-5 shadow-[0_0_30px_rgba(52,211,153,0.1)] flex flex-col">
          <div className="flex justify-between items-start mb-3 shrink-0">
             <h3 className="font-black text-zinc-100 text-lg leading-tight truncate">{item.name}</h3>
             <button onClick={() => setIsFlipped(false)} className="text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-950 p-1.5 rounded-full border border-zinc-800"><X size={16} /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
            {/* ROW 1: SIZES / WEIGHTS */}
            <div className="flex flex-col min-h-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 shrink-0">Select Weight / Size</label>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((s: any) => (
                  <button key={s.id} onClick={() => setSelectedSize(s)} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center ${selectedSize.id === s.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}>
                    <span className="truncate w-full text-center">{s.label}</span>
                    <span className="font-mono mt-1 text-[10px] opacity-70">${s.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ROW 2: OPTIONS / FLAVORS */}
            <div className="flex flex-col min-h-0">
              <label className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 shrink-0">Select Flavor / Variant</label>
              <div className="grid grid-cols-2 gap-2">
                {options.map((o: any) => (
                  <button key={o.id} onClick={() => setSelectedOption(o)} className={`px-2 py-2 rounded-xl text-xs font-bold transition-all border ${selectedOption.id === o.id ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-emerald-500/30'}`}>
                    <span className="truncate block w-full text-center">{o.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-800 shrink-0">
            {qty === 0 ? (
              <button onClick={() => updateCart(item.id, selectedSize, selectedOption, 1)} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-3 rounded-xl font-black uppercase tracking-widest transition-all flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.3)]"><Plus size={16} /> Add to Cart</button>
            ) : (
              <div className="w-full flex items-center justify-between bg-zinc-950 border border-emerald-500/30 rounded-xl p-1 shadow-inner">
                <button onClick={() => updateCart(item.id, selectedSize, selectedOption, -1)} className="p-3 hover:bg-zinc-900 rounded-lg text-rose-400 transition-colors"><Minus size={18}/></button>
                <div className="flex flex-col items-center">
                  <span className="font-black text-xl text-emerald-400 leading-none">{qty}</span>
                  <span className="text-[9px] font-mono text-emerald-400/50 uppercase">In Cart</span>
                </div>
                <button onClick={() => updateCart(item.id, selectedSize, selectedOption, 1)} className="p-3 hover:bg-zinc-900 rounded-lg text-emerald-400 transition-colors"><Plus size={18}/></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};