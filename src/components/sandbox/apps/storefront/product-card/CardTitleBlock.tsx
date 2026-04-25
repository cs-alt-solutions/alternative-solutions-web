// sandbox/apps/storefront/product-card/CardTitleBlock.tsx
import React from 'react';

export default function CardTitleBlock({ item, cleanItemName, UI }: any) {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden pt-2">
      <div className="mb-1 flex items-center justify-center w-full gap-2 text-[9px] font-black uppercase tracking-widest h-4 text-center">
         {item?.subCategory && (
           <span className={item?.subCategory?.toLowerCase().includes('steals') ? 'text-rose-400' : 'text-zinc-500'}>
             {item.subCategory}
           </span>
         )}
         {item?.subCategory && item?.brand && <span className="text-zinc-700">•</span>}
         {item?.brand && (
           <span className="text-emerald-500/70">
             {UI.by} {item.brand}
           </span>
         )}
      </div>

      <h3 className={`w-full text-xl md:text-2xl font-black leading-tight tracking-tighter text-center line-clamp-2 ${item?.isTopShelf ? 'text-transparent bg-clip-text bg-linear-to-r from-amber-200 via-amber-400 to-amber-200' : 'text-zinc-100'}`}>
        {cleanItemName || UI.unnamed}
      </h3>
    </div>
  );
}