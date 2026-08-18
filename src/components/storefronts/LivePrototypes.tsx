// src/components/storefronts/LivePrototypes.tsx
import React from 'react';
import { TerminalSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import PrototypeGrid from './PrototypeGrid'; // 🚀 Plug in the new clean grid
import { STOREFRONTS } from '@/config/marketing/sector-zero';

export default async function LivePrototypes() {
  const supabase = await createClient();

  const { data: prototypes, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('is_template', true)
    .eq('is_published', true) // Only grab visible templates
    .order('created_at', { ascending: false });

  if (error) console.error("Supabase Error ->", error.message);

  const activePrototypes = prototypes || [];
  const { GALLERY } = STOREFRONTS;

  return (
    <div className="w-full mt-20 mb-32 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#22d3ee,#d946ef,#67e8f9)] animate-text-gradient drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            Vibe
          </span>
        </h2>
        
        <div className="max-w-2xl mx-auto text-zinc-400 font-light text-base md:text-lg leading-relaxed">
          <p>
            We don't do cookie-cutter themes. Building your digital storefront is a tailored process that starts with finding your business's pulse. 
            Browse our current architectural concepts below.
          </p>
        </div>
      </div>

      {activePrototypes.length === 0 ? (
        <div className="w-full max-w-3xl mx-auto p-12 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-center bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <TerminalSquare size={48} className="text-cyan-400 mb-6 animate-pulse" />
          <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">{GALLERY.EMPTY_TITLE}</h3>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">{GALLERY.EMPTY_DESC}</p>
        </div>
      ) : (
        <PrototypeGrid prototypes={activePrototypes} />
      )}
    </div>
  );
}