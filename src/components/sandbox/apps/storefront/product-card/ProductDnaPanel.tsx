import React from 'react';
import { Wind, Droplet, Cookie, Sparkles, Dna } from 'lucide-react';

export default function ProductDnaPanel({ item, UI, hasDNA, expectsDNA }: any) {
  if (!item?.descBase && !hasDNA && !item?.lineage && !item?.strainType) return null;

  return (
    <div className="flex flex-col gap-3 pb-2">
       
       {/* GENETICS BLOCK */}
       {(item?.lineage || (item?.strainType && item.strainType !== 'N/A')) && (
         <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col gap-2">
            <div className="flex items-center gap-1.5 border-b border-zinc-800/50 pb-1.5 mb-0.5">
               <Dna size={12} className="text-indigo-400" />
               <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest text-zinc-400">Genetics</span>
            </div>
            {item?.strainType && item.strainType !== 'N/A' && (
              <div className="flex justify-between items-end">
                 <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Class</span>
                 <span className="text-[9px] sm:text-[10px] font-black text-indigo-400">{item.strainType}</span>
              </div>
            )}
            {item?.lineage && (
              <div className="flex justify-between items-end">
                 <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">Cross</span>
                 <span className="text-[9px] sm:text-[10px] font-black text-zinc-200 text-right wrap-break-word max-w-[70%]">{item.lineage}</span>
              </div>
            )}
         </div>
       )}

       {/* SENSORY DNA BLOCK */}
       {hasDNA && expectsDNA && (
         <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-2.5 flex flex-col gap-2.5">
            <div className="grid grid-cols-3 gap-2">
              {item?.descFeels && (
                <div className="flex flex-col border-r border-zinc-800/50 pr-1">
                  <div className="flex items-center gap-1 mb-1">
                     <Wind size={10} className="text-cyan-400 shrink-0" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500">{UI.feels}</span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-zinc-200 leading-tight">{item.descFeels}</span>
                </div>
              )}
              {item?.descTaste && (
                <div className="flex flex-col border-r border-zinc-800/50 px-1">
                  <div className="flex items-center gap-1 mb-1">
                     <Cookie size={10} className="text-amber-400 shrink-0" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500">{UI.taste}</span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-zinc-200 leading-tight">{item.descTaste}</span>
                </div>
              )}
              {item?.descUses && (
                <div className="flex flex-col pl-1">
                  <div className="flex items-center gap-1 mb-1">
                     <Droplet size={10} className="text-emerald-400 shrink-0" />
                     <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500">{UI.uses}</span>
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-zinc-200 leading-tight">{item.descUses}</span>
                </div>
              )}
            </div>

            {item?.descFact && (
              <div className="pt-2 border-t border-zinc-800/50 flex flex-col gap-1">
                <div className="flex items-center gap-1">
                   <Sparkles size={10} className="text-pink-400 shrink-0" />
                   <span className="text-[7px] font-black uppercase tracking-widest text-zinc-500">{UI.insiderFact}</span>
                </div>
                <span className="text-[8px] sm:text-[9px] font-bold text-zinc-200 leading-relaxed">{item.descFact}</span>
              </div>
            )}
         </div>
       )}

       {/* STANDARD DESCRIPTION */}
       {item?.descBase && (
          <div className="pt-1">
            <p className="text-[8px] sm:text-[9px] text-zinc-400 font-medium leading-relaxed whitespace-pre-wrap text-justify">
              {item.descBase}
            </p>
          </div>
       )}
    </div>
  );
}