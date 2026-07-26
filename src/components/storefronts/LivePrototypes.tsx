// src/components/storefronts/LivePrototypes.tsx
import React from 'react';
import { TerminalSquare } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import PerspectiveStage from './PerspectiveStage';
import { STOREFRONTS } from '@/config/marketing/sector-zero';

export default async function LivePrototypes() {
  const supabase = await createClient();

  const { data: prototypes, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  if (error) console.error("Supabase Error ->", error.message);

  const activePrototypes = prototypes || [];
  const { GALLERY } = STOREFRONTS;

  return (
    <div className="w-full mt-20 mb-32 relative z-10">
      <div className="max-w-screen-2xl mx-auto px-6 text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
          {GALLERY.TITLE_1}{" "}
          {/* 🚀 ANIMATED NEON TEXT GRADIENT: Dynamic color transition with subtle neon glow */}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-fuchsia-400 to-cyan-300 animate-text-gradient drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]">
            {GALLERY.TITLE_2}
          </span>
        </h2>
        
        <p className="text-zinc-300 font-normal max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
          <span className="text-white font-bold">{GALLERY.PITCH_BOLD}</span> {GALLERY.PITCH_REST}
        </p>
      </div>

      {activePrototypes.length === 0 ? (
        <div className="w-full max-w-3xl mx-auto p-12 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center text-center bg-zinc-950 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
          <TerminalSquare size={48} className="text-cyan-400 mb-6 animate-pulse" />
          <h3 className="text-white font-black uppercase tracking-widest text-sm mb-2">{GALLERY.EMPTY_TITLE}</h3>
          <p className="text-zinc-500 text-xs font-mono uppercase tracking-wider">{GALLERY.EMPTY_DESC}</p>
        </div>
      ) : (
        <PerspectiveStage prototypes={activePrototypes} />
      )}
    </div>
  );
}