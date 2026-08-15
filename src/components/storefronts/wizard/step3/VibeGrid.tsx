// src/components/storefronts/wizard/step3/VibeGrid.tsx
'use client';

import React from 'react';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';

interface VibeGridProps {
  selectedVibe: string | null;
  onSelect: (vibeId: string) => void;
}

export default function VibeGrid({ selectedVibe, onSelect }: VibeGridProps) {
  const vibesList = WIZARD_COPY.VIBES_LIST || [];
  const cluelessId = WIZARD_COPY.VIBES_META?.CLUELESS_ID || 'clueless';

  const getVibeStyles = (id: string) => {
    switch(id) {
      case 'brutalist': return 'bg-yellow-400 border-4 border-black text-black font-black uppercase rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]';
      case 'neon': return 'bg-zinc-950 border-2 border-fuchsia-500 text-cyan-400 font-mono rounded-xl shadow-[0_0_15px_rgba(217,70,239,0.2)]';
      case 'minimal': return 'bg-zinc-100 border border-zinc-300 text-zinc-900 font-sans rounded-2xl';
      case 'organic': return 'bg-stone-200 border-2 border-stone-400 text-stone-800 font-serif rounded-[2rem]';
      case 'onyx': return 'bg-zinc-950 border border-zinc-700 text-zinc-100 font-sans rounded-xl shadow-2xl';
      case 'retro': return 'bg-amber-100 border-2 border-orange-400 text-orange-950 font-serif rounded-3xl';
      case 'corporate': return 'bg-slate-900 border border-slate-700 text-sky-200 font-sans rounded-lg';
      case 'editorial': return 'bg-white border-2 border-black text-black font-serif tracking-tighter rounded-none';
      case 'clueless': return 'bg-zinc-900/60 border-2 border-dashed border-zinc-700 text-zinc-400 rounded-2xl mt-2 sm:col-span-2 md:col-span-4 hover:border-zinc-500';
      default: return 'bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-xl';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {vibesList.map((vibe) => (
        <div 
          key={vibe.id}
          onClick={() => onSelect(vibe.id)}
          className={`relative p-5 cursor-pointer transition-all flex flex-col justify-between min-h-35 group ${getVibeStyles(vibe.id)} ${selectedVibe === vibe.id ? 'ring-4 ring-cyan-400 scale-[1.02] z-10' : 'opacity-80 hover:opacity-100 hover:scale-[1.01]'}`}
        >
          <div className="flex justify-between items-start gap-2">
            <h4 className="text-lg font-bold tracking-tight leading-tight">{vibe.title}</h4>
            {selectedVibe === vibe.id && (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-current animate-in zoom-in-50 duration-200" />
            )}
          </div>
          <p className="opacity-80 text-xs font-normal mt-3 leading-relaxed text-left">{vibe.desc}</p>
        </div>
      ))}

      {/* WILDCARD */}
      <div 
        onClick={() => onSelect(cluelessId)}
        className={`relative p-6 cursor-pointer transition-all flex flex-col items-center justify-center text-center group ${getVibeStyles('clueless')} ${selectedVibe === cluelessId ? 'ring-4 ring-fuchsia-400 bg-zinc-900' : 'opacity-70 hover:opacity-100'}`}
      >
        <HelpCircle className="w-8 h-8 mb-2 text-fuchsia-400 group-hover:scale-110 transition-transform" />
        <h4 className="text-base font-bold text-zinc-200">{WIZARD_COPY.VIBES_META?.CLUELESS_TITLE}</h4>
        <p className="text-xs text-zinc-500 max-w-md mt-1 font-normal">{WIZARD_COPY.VIBES_META?.CLUELESS_DESC}</p>
      </div>
    </div>
  );
}