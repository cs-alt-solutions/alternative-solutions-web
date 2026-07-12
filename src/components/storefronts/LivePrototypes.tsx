/* src/components/storefronts/LivePrototypes.tsx */
import React from 'react';
import { ExternalLink, TerminalSquare, LayoutTemplate, Layers, CheckCircle2 } from 'lucide-react';
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
  'classic': "Smooth Stack",
  'bento': "Bento Grid",
  'sticky': "Sticky Scroll",
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
    <div className="w-full max-w-screen-2xl mx-auto mt-20 mb-32 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
          Live Storefront <span className="text-cyan-400">Gallery</span>
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          These aren't static mockups. Click any node to interact with a live, custom-engineered digital storefront.
        </p>
      </div>

      {(!prototypes || prototypes.length === 0) ? (
        <div className="w-full max-w-3xl mx-auto p-12 rounded-3xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center bg-white/5">
          <TerminalSquare size={48} className="text-cyan-500/50 mb-6" />
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">No Active Prototypes</h3>
          <p className="text-slate-400 text-sm font-mono">
            Database empty. Sync your prototypes via the Dashboard.
          </p>
        </div>
      ) : (
        /* THE GRID: Scales up to 4 columns on extra large screens */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {prototypes?.map((site) => {
            const siteUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

            return (
              <div 
                key={site.id} 
                className="group relative bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg 
                           hover:shadow-[0_20px_40px_rgba(6,182,212,0.15)] hover:border-cyan-500/40 
                           transition-all duration-500 ease-out hover:-translate-y-2 flex flex-col"
              >
                {/* 1. The Iframe Engine - Bleeding to the edges */}
                <div className="w-full aspect-[16/10] bg-black border-b border-zinc-800 relative z-10">
                  
                  {/* Browser Chrome - Dark/Minimal with hover states */}
                  <div className="h-8 bg-zinc-900 flex items-center px-4 gap-2 border-b border-zinc-800 shrink-0 w-full relative">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-rose-500/80 transition-colors duration-300" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-amber-500/80 transition-colors duration-300 delay-75" />
                      <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-emerald-500/80 transition-colors duration-300 delay-150" />
                    </div>
                    {/* Minimal URL Bar simulation */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-1/3 h-3 bg-zinc-950/50 rounded-full border border-zinc-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* The Scaled Preview */}
                  <div className="w-full h-[calc(100%-2rem)] relative bg-zinc-950 overflow-hidden">
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20 cursor-pointer" />
                    <div className="absolute w-[300%] h-[300%] origin-top-left scale-[0.333]">
                      <iframe 
                        src={siteUrl} 
                        className="w-full h-full border-none pointer-events-none bg-zinc-950" 
                        title={site.business_name}
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Spec Sheet & Content Info */}
                <div className="p-6 flex flex-col flex-1 relative bg-zinc-950">
                  
                  {/* Meta Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-cyan-400 uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/10 px-2 py-1 rounded">
                      <CheckCircle2 size={10} />
                      <span className="truncate max-w-[150px]">Client: {site.business_name}</span>
                    </div>
                    <ExternalLink size={16} className="text-zinc-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                  </div>

                  {/* The Design Vibe (Main Hook) */}
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-6">
                    {VIBE_NAMES[site.theme_style] || 'Custom Vibe'}
                  </h3>

                  {/* 3. Explicit Architecture Specs */}
                  <div className="mt-auto space-y-4 pt-5 border-t border-zinc-800/80">
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-teal-500">
                         <LayoutTemplate size={14} />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest leading-none mb-1">Hero Engine</span>
                         <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest leading-none">{HOOK_NAMES[site.hero_layout] || 'Standard Flow'}</span>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                       <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-fuchsia-500">
                         <Layers size={14} />
                       </div>
                       <div className="flex flex-col">
                         <span className="text-[9px] text-zinc-500 font-mono uppercase tracking-widest leading-none mb-1">Content Journey</span>
                         <span className="text-xs text-zinc-300 font-bold uppercase tracking-widest leading-none">{JOURNEY_NAMES[site.content_layout] || 'Standard Stack'}</span>
                       </div>
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