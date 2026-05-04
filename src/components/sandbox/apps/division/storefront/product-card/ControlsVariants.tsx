// sandbox/apps/storefront/product-card/ControlsVariants.tsx
import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function ControlsVariants({
  item, sortedOptions, displayStock, safeSelectedOptions, handleSelectOption, updateCart, selectedSize
}: any) {

  const formatStrainText = (text: string) => {
    if (!text) return text;
    const parts = text.split(/(?:\(\s*)?(Indica Dom Hybrid|Sativa Dom Hybrid|Indica|Sativa|Hybrid|CBD)(?:\s*\))?/i);
    
    return parts.map((part, i) => {
      if (!part) return null;
      const type = part.toLowerCase();
      let letter = ''; 
      let colorClass = '';

      if (type === 'sativa') { letter = 'S'; colorClass = 'bg-orange-500/10 text-orange-400 border-orange-500/30'; } 
      else if (type === 'indica') { letter = 'I'; colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30'; } 
      else if (type === 'hybrid') { letter = 'H'; colorClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'; }
      else if (type === 'indica dom hybrid') { letter = 'I'; colorClass = 'bg-purple-500/10 text-purple-400 border-purple-500/30'; }
      else if (type === 'sativa dom hybrid') { letter = 'S'; colorClass = 'bg-orange-500/10 text-orange-400 border-orange-500/30'; }
      else if (type === 'cbd') { letter = 'C'; colorClass = 'bg-blue-500/10 text-blue-400 border-blue-500/30'; }
      
      if (letter) {
        return (
          <span key={i} className={`inline-flex items-center justify-center w-3 h-3 sm:w-4 sm:h-4 text-[7px] sm:text-[8px] font-black rounded-full border mx-0.5 align-middle shadow-sm ${colorClass}`} title={part.toUpperCase()}>
            {letter}
          </span>
        );
      }
      return <React.Fragment key={part}>{part}</React.Fragment>;
    });
  };

  return (
    <div className={`flex flex-col gap-1 flex-1 min-h-0`}>
      <div className="flex justify-between items-start px-1 shrink-0">
        <label className="text-[8px] sm:text-[9px] font-black text-zinc-500 uppercase tracking-widest leading-tight">
          {item?.dealConfig?.type === 'BUNDLE' ? `Mix & Match` : `Tap + To Add`}
        </label>
      </div>
      
      <div className="grid grid-cols-2 gap-2 overflow-y-auto scrollbar-hide pb-1">
        {sortedOptions.map((opt: any) => {
            const stockVal = opt.stock !== undefined ? opt.stock : displayStock;
            const instancesInBundle = safeSelectedOptions.filter((so:any) => so?.id === opt.id).length;
            const isOutOfStock = stockVal <= 0;
            const isSelected = instancesInBundle > 0;

            return (
              <div key={opt.id} className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-all ${isOutOfStock ? 'bg-zinc-950 border-zinc-800/50 opacity-50 grayscale' : isSelected ? 'bg-emerald-500/10 border-emerald-500/30 shadow-inner' : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'}`}>
                  <div className="flex-1 min-w-0 pr-1">
                    <span className={`text-[8px] sm:text-[9px] font-black uppercase tracking-wider flex items-center flex-wrap gap-x-0.5 ${isOutOfStock ? 'text-zinc-600 line-through' : isSelected ? 'text-emerald-400' : 'text-zinc-200'}`}>
                      {formatStrainText(opt.label)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    <button disabled={instancesInBundle === 0 || isOutOfStock} onClick={() => {
                        const idx = safeSelectedOptions.findIndex((so:any) => so.id === opt.id);
                        if (idx > -1) {
                          const newArr = [...safeSelectedOptions];
                          newArr.splice(idx, 1);
                          handleSelectOption(newArr);
                          updateCart(item.id, selectedSize, [opt], -1);
                        }
                      }} className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors disabled:opacity-30 ${isSelected ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}><Minus size={12}/></button>
                    <span className={`w-3 sm:w-4 text-center text-[10px] sm:text-[11px] font-mono font-black ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`}>{instancesInBundle}</span>
                    <button disabled={instancesInBundle >= stockVal || isOutOfStock} onClick={() => {
                        const newArr = [...safeSelectedOptions, opt];
                        handleSelectOption(newArr);
                        updateCart(item.id, selectedSize, [opt], 1);
                      }} className={`w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full transition-colors disabled:opacity-30 ${isSelected ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30' : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}><Plus size={12}/></button>
                  </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}