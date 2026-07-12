/* src/components/storefronts/LivePrototypes.tsx */
import React from 'react';
import Link from 'next/link';
import { ExternalLink, TerminalSquare, Palette, LayoutTemplate, Layers } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

// --- HUMANIZED DICTIONARIES ---
const VIBE_NAMES: Record<string, string> = {
  industrial: "Raw & Industrial",
  neo: "Neo-Brutalist",
  cyberpunk: "Neon Tech",
  minimal: "Clean & Minimal",
  elegant: "High Editorial",
  organic: "Earthy & Natural",
  editorial: "Magazine Style",
  retropop: "Retro Pop"
};

const HOOK_NAMES: Record<string, string> = {
  'center': "Centered Focus",
  'split-left': "Bold Left Split",
  'split-right': "Bold Right Split",
  'cinematic': "Full Cinematic"
};

const JOURNEY_NAMES: Record<string, string> = {
  'classic': "Smooth Scroll",
  'bento': "Bento Grid",
  'sticky': "Sticky Storytelling",
  'editorial': "Hover Stack",
  'accordion': "Accordion Flow"
};

export default async function LivePrototypes() {
  const supabase = await createClient();

  const { data: prototypes, error } = await supabase
    .from('storefronts')
    .select('*')
    .eq('is_template', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Supabase Fetch Error ->", error.message);
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
          Live Storefront <span className="text-cyan-400">Gallery</span>
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          These aren't static mockups. Click any node to interact with a live, custom-engineered digital storefront.
        </p>
      </div>

      {(!prototypes || prototypes.length === 0) ? (
        <div className="w-full p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/5">
          <TerminalSquare size={48} className="text-cyan-500/50 mb-6" />
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">No Active Prototypes</h3>
          <p className="text-slate-400 text-sm font-mono">
            Database empty. Sync your prototypes via the Dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prototypes?.map((site) => {
            const siteUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

            return (
              <div 
                key={site.id} 
                className="group relative bg-zinc-900/50 border border-white/10 rounded-3xl p-5 backdrop-blur-md 
                           hover:border-cyan-500/50 hover:shadow-[0_20px_50px_-15px_rgba(34,211,238,0.2)] 
                           transition-all duration-500 ease-out hover:-translate-y-2"
              >
                {/* 1. The Iframe Engine - Styled as a floating window */}
                <div className="w-full aspect-[16/10] rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden mb-6 relative shadow-inner">
                  
                  {/* Browser Chrome - Dark/Minimal */}
                  <div className="h-8 bg-zinc-900 flex items-center px-4 gap-2 border-b border-zinc-800">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
                    <span className="ml-3 text-[9px] font-mono text-zinc-600 truncate">
                      {siteUrl.replace('https://', '').replace('http://', '')}
                    </span>
                  </div>

                  {/* The Preview */}
                  <div className="w-full h-full relative">
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 cursor-pointer" />
                    <div className="absolute w-[400%] h-[400%] origin-top-left scale-25 mt-8">
                      <iframe 
                        src={siteUrl} 
                        className="w-full h-full border-none pointer-events-none" 
                        title={site.business_name}
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Content Info */}
                <div className="px-2">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight mb-6 flex items-center justify-between group-hover:text-cyan-400 transition-colors">
                    {site.business_name}
                    <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>

                  {/* 3. Tech Stack HUD */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                       <Palette size={12} className="text-cyan-500" />
                       {VIBE_NAMES[site.theme_style] || 'Custom Engineered'}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
                       <LayoutTemplate size={12} className="text-teal-500" />
                       {HOOK_NAMES[site.hero_layout] || 'Standard Flow'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}