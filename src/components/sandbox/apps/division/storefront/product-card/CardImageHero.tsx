// sandbox/apps/storefront/product-card/CardImageHero.tsx
import React from 'react';
import { Award, Flame, Star, Leaf, Box, Image as ImageIcon } from 'lucide-react';

export default function CardImageHero({ item, isOutOfStock, strainColorClass, UI, renderDealMath }: any) {
  const ItemIcon = item?.iconName === 'Leaf' ? Leaf : item?.iconName === 'Flame' ? Flame : item?.iconName === 'Box' ? Box : ImageIcon;

  return (
    <div className="relative w-full h-[60%] shrink-0 bg-zinc-950 border-b border-zinc-800 group z-20">

      {/* Main Image Container */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {isOutOfStock && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-zinc-950/60 backdrop-blur-[2px]">
             <div className="-rotate-12 border-2 border-rose-500/80 px-6 py-2 rounded-xl shadow-[0_0_30px_rgba(244,63,94,0.3)] bg-zinc-950/90 flex flex-col items-center">
                <span className="text-rose-500 font-black text-xl md:text-2xl uppercase tracking-[0.2em] drop-shadow-md leading-none">Sold Out</span>
                <span className="text-rose-400/80 text-[8px] font-black uppercase tracking-[0.3em] text-center mt-1">Be Back Soon</span>
             </div>
          </div>
        )}

        {item?.imageUrl ? (
          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-800">
            <ItemIcon size={48} />
          </div>
        )}
      </div>

      {/* REFACTORED TOP SHELF RIBBON */}
      {item?.isTopShelf && !isOutOfStock && (
        <div className="absolute top-0 right-5 z-10 drop-shadow-[0_10px_15px_rgba(251,191,36,0.5)] group-hover:scale-105 origin-top transition-transform duration-500">
          {/* Ribbon Main Body */}
          <div className="bg-linear-to-b from-amber-200 via-amber-400 to-amber-500 w-12 flex flex-col items-center pt-3 pb-1 relative z-10 border-x border-amber-300/30">
            <span className="text-zinc-950 font-black text-2xl tracking-tighter leading-none drop-shadow-sm">#1</span>
            <span className="text-zinc-900 text-[6.5px] font-black uppercase tracking-widest text-center leading-[1.1] mt-1 opacity-95 px-0.5 w-full wrap-break-word">
              {UI.topShelf}
            </span>
          </div>
          {/* Ribbon Tails (Pure Tailwind Chevron Cutout) */}
          <div className="flex w-12 relative z-0">
             <div className="w-6 h-4 bg-amber-500 origin-top-left -skew-y-25 shadow-sm rounded-br-sm border-l border-amber-400/30"></div>
             <div className="w-6 h-4 bg-amber-500 origin-top-right skew-y-25 shadow-sm rounded-bl-sm border-r border-amber-400/30"></div>
          </div>
        </div>
      )}

      {/* Promo/Featured Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 items-start z-10">
         {item?.dailyDeal && !isOutOfStock && (
           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400">
             <Flame size={10} className="text-zinc-950" />
             <span className="text-zinc-950 text-[8px] font-black uppercase tracking-widest">
               {renderDealMath(item.dealConfig)}
             </span>
           </div>
         )}
         {item?.featured && !isOutOfStock && (
           <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-cyan-500/50 shadow-lg">
             <Star size={10} className="text-cyan-400 animate-pulse" />
             <span className="text-cyan-400 text-[8px] font-black uppercase tracking-widest">{UI.featured}</span>
           </div>
         )}
      </div>

      {/* Strain Tag */}
      {item?.strainType && item.strainType !== 'N/A' && (
         <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800/80 shadow-lg animate-in fade-in">
           <div className={`w-1.5 h-1.5 rounded-full ${strainColorClass.replace('text-', 'bg-')}`} />
           <span className={`text-[9px] font-black uppercase tracking-widest ${strainColorClass}`}>
             {item.strainType}
           </span>
         </div>
      )}

      {/* BRAND STAMP (Bezel Architecture) */}
      {item?.iconUrl && (
         <div className="absolute -bottom-8 left-6 z-40 animate-in fade-in group-hover:scale-110 transition-transform duration-500 -rotate-12">
           <div className="w-20 h-20 rounded-full bg-zinc-900 p-1 shadow-[0_15px_30px_-5px_rgba(0,0,0,1)] ring-1 ring-white/20 flex items-center justify-center">
             <div className="w-full h-full rounded-full overflow-hidden bg-zinc-950">
               <img src={item.iconUrl} alt="Brand Stamp" className="w-full h-full object-cover" />
             </div>
           </div>
         </div>
      )}
    </div>
  );
}