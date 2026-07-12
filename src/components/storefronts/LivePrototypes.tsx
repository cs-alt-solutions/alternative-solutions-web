/* src/components/storefronts/LivePrototypes.tsx */
import React from 'react';
import Link from 'next/link';
import { ExternalLink, TerminalSquare, Palette, LayoutTemplate, ArrowUpRight } from 'lucide-react';
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
    <div className="w-full mt-20 mb-32 relative">
      <div className="text-center mb-24 px-6 relative z-10">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-6">
          Live Storefront <span className="text-cyan-400">Gallery</span>
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          These aren't static mockups. Scroll to explore live, custom-engineered digital environments.
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
        /* THE STICKY STACK CONTAINER */
        <div className="relative flex flex-col gap-24 pb-48 px-4 md:px-8">
          {prototypes?.map((site, i) => {
            const siteUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

            return (
              <div 
                key={site.id} 
                className="sticky w-full max-w-6xl mx-auto bg-zinc-950/95 bg-linear-to-br from-cyan-500/10 via-emerald-500/5 to-transparent border border-cyan-500/20 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-2xl shadow-[0_-20px_50px_rgba(0,0,0,0.6)] flex flex-col lg:flex-row gap-12 items-center transition-all duration-700"
                style={{
                  top: `calc(12vh + ${i * 40}px)`, 
                  zIndex: i + 10
                }}
              >
                
                {/* LEFT COLUMN: THE NARRATIVE */}
                <div className="w-full lg:w-1/3 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase w-max mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    Live Environment
                  </div>

                  <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tight mb-8 leading-[1.1]">
                    {site.business_name}
                  </h3>

                  <div className="space-y-6 mb-10">
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Design Vibe</span>
                       <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-white font-bold">
                         <Palette size={16} className="text-cyan-500" />
                         {VIBE_NAMES[site.theme_style] || 'Custom Engineered'}
                       </div>
                    </div>
                    <div className="flex flex-col gap-2">
                       <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Hero Layout</span>
                       <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-white font-bold">
                         <LayoutTemplate size={16} className="text-emerald-500" />
                         {HOOK_NAMES[site.hero_layout] || 'Standard Flow'}
                       </div>
                    </div>
                  </div>

                  <a 
                    href={siteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center justify-between px-6 py-4 rounded-xl bg-linear-to-r from-cyan-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-cyan-400 hover:text-white border border-cyan-500/30 transition-all font-bold uppercase tracking-widest text-xs group"
                  >
                    Explore Preview
                    <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                </div>

                {/* RIGHT COLUMN: THE LIVE IFRAME */}
                <div className="w-full lg:w-2/3">
                  <div className="w-full aspect-16/10 rounded-2xl bg-zinc-950 border border-cyan-500/20 overflow-hidden relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] group/frame">
                    
                    {/* Dark Mode Browser Chrome */}
                    <div className="h-10 bg-zinc-900 flex items-center px-4 gap-2.5 border-b border-zinc-800">
                      <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                      <div className="ml-4 flex-1 bg-zinc-950 rounded-md py-1 px-3 border border-zinc-800 flex items-center">
                         <span className="text-[10px] font-mono text-zinc-500 truncate w-full">
                           {siteUrl.replace('https://', '')}
                         </span>
                      </div>
                    </div>

                    {/* The Scaled Preview */}
                    <div className="w-full h-full relative bg-zinc-950">
                      {/* Invisible overlay so you can still scroll the main page without getting trapped in the iframe */}
                      <div className="absolute inset-0 z-20" />
                      
                      <div className="absolute w-[300%] h-[300%] origin-top-left scale-[0.333]">
                        <iframe 
                          src={siteUrl} 
                          className="w-full h-full border-none pointer-events-none" 
                          title={site.business_name}
                          tabIndex={-1}
                        />
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