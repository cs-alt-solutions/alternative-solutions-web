import React from 'react';
import { Wind, Droplet, Cookie, Sparkles } from 'lucide-react';

export default function ProductDnaPanel({ item, UI, hasDNA, expectsDNA }: any) {
  if (!item?.descBase && !hasDNA) return null;

  return (
    <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-xl p-3 flex flex-col gap-2.5">
      {item?.descBase && (
        <p className={`text-[10px] text-zinc-300 italic leading-relaxed ${(hasDNA && expectsDNA) ? 'border-b border-zinc-800/50 pb-2' : ''}`}>
          {item.descBase}
        </p>
      )}
      {hasDNA && expectsDNA && (
        <div className="flex flex-col">
          <div className="grid grid-cols-3 gap-2">
            {item?.descFeels && (
              <div className="flex items-start gap-1.5 border-r border-zinc-800/50 pr-1">
                <Wind size={12} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.feels}</span>
                  <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descFeels}</span>
                </div>
              </div>
            )}
            {item?.descTaste && (
              <div className="flex items-start gap-1.5 border-r border-zinc-800/50 px-1">
                <Cookie size={12} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.taste}</span>
                  <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descTaste}</span>
                </div>
              </div>
            )}
            {item?.descUses && (
              <div className="flex items-start gap-1.5 pl-1">
                <Droplet size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.uses}</span>
                  <span className="text-[10px] font-bold text-zinc-200 leading-tight">{item.descUses}</span>
                </div>
              </div>
            )}
          </div>

          {item?.descFact && (
            <div className="mt-2.5 pt-2.5 border-t border-zinc-800/50 flex items-start gap-1.5 pl-1">
              <Sparkles size={12} className="text-pink-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 block mb-0.5">{UI.insiderFact}</span>
                <span className="text-[10px] font-bold text-zinc-200 leading-relaxed">{item.descFact}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}