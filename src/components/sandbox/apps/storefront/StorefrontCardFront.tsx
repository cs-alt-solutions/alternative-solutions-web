import React from 'react';
import { Flame, Star, Award, Target, Wind, Sparkles, Leaf, Box, Image as ImageIcon, Dna, Lightbulb } from 'lucide-react';

const getTypeColor = (type: string) => {
  switch(type?.toLowerCase()) {
    case 'indica': return 'bg-indigo-500';
    case 'sativa': return 'bg-orange-500';
    case 'hybrid': return 'bg-emerald-500';
    case 'indica-dom': return 'bg-indigo-400';
    case 'sativa-dom': return 'bg-orange-400';
    case 'high-cbd': return 'bg-sky-500';
    default: return 'bg-zinc-500';
  }
};

export default function StorefrontCardFront({ item, cleanItemName, lowestPrice, setIsFlipped }: any) {
  const Icon = item.iconName === 'Leaf' ? Leaf : item.iconName === 'Flame' ? Flame : item.iconName === 'Box' ? Box : ImageIcon;

  const desc = item.description || '';
  const feelsMatch = desc.match(/Feels:\s*([^.]*)/i);
  const tasteMatch = desc.match(/Taste:\s*([^.]*)/i);
  const usesMatch = desc.match(/Uses:\s*([^.]*)/i);
  const factMatch = desc.match(/Fun Fact:\s*(.*)/i);

  const feels = feelsMatch ? feelsMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const tastes = tasteMatch ? tasteMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const uses = usesMatch ? usesMatch[1].split(',').map((s: string) => s.trim()).filter(Boolean) : [];
  const funFact = factMatch ? factMatch[1].trim() : '';

  let cleanBaseDesc = desc.split(/(Feels:|Taste:|Uses:|Fun Fact:)/i)[0].trim();
  if (item.lineage && cleanBaseDesc.startsWith(item.lineage + '.')) {
      cleanBaseDesc = cleanBaseDesc.substring(item.lineage.length + 1).trim();
  }

  return (
    <div className={`col-start-1 row-start-1 backface-hidden w-full h-full bg-zinc-900/90 backdrop-blur-xl border ${item.isTopShelf ? 'border-amber-900/30 group-hover:border-amber-500/60' : 'border-zinc-800/80 group-hover:border-emerald-500/40'} rounded-4xl p-5 shadow-2xl flex flex-col items-center transition-all duration-500`}>
      
      {/* HEADER IMAGE / ICON */}
      <div className="w-full h-28 shrink-0 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl mb-4 flex items-center justify-center text-zinc-800 shadow-inner overflow-hidden relative group-hover:border-zinc-700/50 transition-all duration-500">
         <div className={`absolute inset-0 opacity-40 mix-blend-overlay ${item.isTopShelf ? 'bg-linear-to-br from-amber-500/20 via-transparent to-transparent' : 'bg-linear-to-br from-emerald-500/10 via-transparent to-transparent'}`} />
         <Icon size={56} className="opacity-30 group-hover:scale-110 group-hover:opacity-50 transition-all duration-700" />
         <span className="absolute bottom-2 left-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-100 bg-zinc-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-zinc-800 shadow-lg">${lowestPrice.toFixed(2)}+</span>
         <div className="absolute top-2 right-2 flex flex-col gap-1.5 items-end">
           {item.isTopShelf && (
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-950 bg-amber-400 px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(251,191,36,0.4)] flex items-center gap-1">
                <Award size={10} /> TOP SHELF
             </span>
           )}
           {item.dailyDeal && (
             <span className="text-[8px] font-black uppercase tracking-widest text-zinc-100 bg-rose-600 px-2.5 py-1 rounded-md shadow-[0_0_15px_rgba(225,29,72,0.4)] flex items-center gap-1 animate-pulse">
               <Flame size={10} /> {item.dealType || 'Promo'}
             </span>
           )}
         </div>
      </div>
      
      {item.dailyDeal && item.dealText && (
        <div className="w-full shrink-0 bg-rose-500/5 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest p-2 rounded-xl mb-3 text-center flex items-center justify-center gap-2">
           <Target size={12} /> {item.dealText}
        </div>
      )}

      {/* FIXED: DYNAMIC SCROLL CONTAINER now uses scrollbar-hide */}
      <div className="flex-1 w-full min-h-0 overflow-y-auto scrollbar-hide flex flex-col mb-3">
        <div className="my-auto w-full flex flex-col gap-3 pb-2 pt-1 px-1">
          
          <div className="text-center shrink-0">
            <h3 className={`font-black ${item.isTopShelf ? 'text-amber-300' : 'text-zinc-100'} text-xl tracking-tight leading-none mb-2`}>{cleanItemName}</h3>
            
            <div className="flex items-center justify-center gap-2 mb-2.5">
               <span className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">{item.subCategory || item.category}</span>
               {item.strainType && item.strainType !== 'N/A' && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${getTypeColor(item.strainType)} shadow-sm`} /> {item.strainType}
                    </span>
                  </>
               )}
            </div>
            
            {item.lineage && (
              <div className="flex justify-center mb-2">
                <span className="text-[9px] font-bold text-zinc-400 bg-zinc-950/80 border border-zinc-800/50 px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <Dna size={10} className="text-emerald-500/70"/> {item.lineage}
                </span>
              </div>
            )}
          </div>

          <div className="w-full text-left space-y-3">
            {cleanBaseDesc && (
              <p className="text-[11px] text-zinc-400/80 leading-relaxed font-medium italic text-center px-2">"{cleanBaseDesc}"</p>
            )}
            
            {(feels.length > 0 || tastes.length > 0 || uses.length > 0) && (
              <div className="space-y-2.5 w-full bg-zinc-950/40 rounded-xl p-3 border border-zinc-800/30">
                
                {feels.length > 0 && (
                  <div className="flex items-start gap-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-cyan-500/70 w-14 shrink-0 flex items-center gap-1 mt-0.5"><Sparkles size={10} className="shrink-0"/> Feels</p>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {feels.map((f: string, i: number) => (
                        <span key={`f-${i}`} className="text-[8px] font-bold uppercase tracking-wider bg-zinc-950 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {tastes.length > 0 && (
                  <div className="flex items-start gap-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/70 w-14 shrink-0 flex items-center gap-1 mt-0.5"><Wind size={10} className="shrink-0"/> Taste</p>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {tastes.map((t: string, i: number) => (
                        <span key={`t-${i}`} className="text-[8px] font-bold uppercase tracking-wider bg-zinc-950 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {uses.length > 0 && (
                  <div className="flex items-start gap-2">
                    <p className="text-[8px] font-black uppercase tracking-widest text-fuchsia-500/70 w-14 shrink-0 flex items-center gap-1 mt-0.5"><Target size={10} className="shrink-0"/> Uses</p>
                    <div className="flex flex-wrap gap-1.5 flex-1">
                      {uses.map((u: string, i: number) => (
                        <span key={`u-${i}`} className="text-[8px] font-bold uppercase tracking-wider bg-zinc-950 text-fuchsia-400 border border-fuchsia-500/30 px-2 py-0.5 rounded-md whitespace-nowrap">
                          {u}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {funFact && (
              <div className="w-full bg-zinc-950/30 border border-zinc-800/40 rounded-xl p-3 text-center mt-2">
                 <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 flex items-center justify-center gap-1 mb-1.5"><Lightbulb size={10} className="text-amber-500/70"/> Fun Fact</p>
                 <p className="text-[10px] text-zinc-400 font-medium leading-relaxed">"{funFact}"</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* FOOTER BUTTON */}
      <button onClick={() => setIsFlipped(true)} className={`shrink-0 w-full mt-auto bg-zinc-950 ${item.isTopShelf ? 'hover:bg-amber-500' : 'hover:bg-emerald-500'} hover:text-zinc-950 ${item.isTopShelf ? 'text-amber-400' : 'text-emerald-400'} border ${item.isTopShelf ? 'border-amber-500/30 hover:border-amber-400' : 'border-emerald-500/30 hover:border-emerald-400'} py-3.5 rounded-xl font-black uppercase tracking-widest transition-all duration-300 shadow-lg active:scale-95 flex justify-center items-center gap-2`}>
        Select & Order
      </button>
    </div>
  );
}