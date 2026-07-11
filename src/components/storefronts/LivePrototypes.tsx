import React from 'react';
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
    console.error("Supabase Fetch Error ->", error.message, error.details, error.hint);
  }

  return (
    <div className="w-full max-w-7xl mx-auto mt-20 mb-32 px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4">
          Live Storefront Gallery
        </h2>
        <p className="text-slate-400 font-light max-w-2xl mx-auto text-lg">
          Click through real, functioning websites. These aren't static mockups—they are live, 
          lightning-fast examples of what can be built for your business.
        </p>
      </div>

      {(!prototypes || prototypes.length === 0) ? (
        <div className="w-full p-12 rounded-2xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center bg-white/5">
          <TerminalSquare size={32} className="text-brand-primary/50 mb-4" />
          <h3 className="text-white font-bold uppercase tracking-widest mb-2">No Active Prototypes Found</h3>
          <p className="text-slate-400 text-sm font-mono max-w-md leading-relaxed">
            Database returned 0 results. Check your Dashboard to toggle prototypes on.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prototypes?.map((site) => {
            const siteUrl = site.custom_domain 
              ? `https://${site.custom_domain}` 
              : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

            const vibeDisplay = VIBE_NAMES[site.theme_style] || 'Custom Vibe';
            const hookDisplay = HOOK_NAMES[site.hero_layout] || 'Custom Hook';
            const journeyDisplay = JOURNEY_NAMES[site.content_layout] || 'Custom Journey';

            return (
              <div key={site.id} className="flex flex-col group relative bg-black/20 rounded-3xl p-4 border border-white/5 hover:border-brand-primary/30 transition-colors">
                
                {/* 1. The Iframe Engine (Now sitting inside the card like a screen) */}
                <div className="w-full aspect-16/10 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden mb-5 relative shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                  
                  {/* Fake Browser Chrome */}
                  <div className="h-6 bg-zinc-950 border-b border-zinc-800 flex items-center px-3 gap-1.5 shrink-0 z-20 absolute top-0 w-full">
                    <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-rose-500/80 transition-colors" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-amber-500/80 transition-colors" />
                    <div className="w-2 h-2 rounded-full bg-zinc-800 group-hover:bg-emerald-500/80 transition-colors" />
                    <div className="ml-2 flex-1 text-center pr-8">
                       <span className="text-[8px] font-mono text-zinc-600 tracking-widest truncate block">
                         {siteUrl.replace('https://', '')}
                       </span>
                    </div>
                  </div>

                  {/* Iframe */}
                  <div className="w-full h-full bg-white overflow-hidden relative pt-6">
                    <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 cursor-pointer block bg-transparent" />
                    <div className="absolute w-[400%] h-[400%] origin-top-left scale-25 mt-6">
                      <iframe 
                        src={siteUrl} 
                        className="w-full h-full border-none pointer-events-none" 
                        title={site.business_name}
                        tabIndex={-1}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. The Title */}
                <div className="px-2 mb-4">
                  <h3 className="text-2xl font-black text-white tracking-tight group-hover:text-brand-primary transition-colors flex items-center justify-between">
                    {site.business_name}
                    <ExternalLink size={18} className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110" />
                  </h3>
                </div>

                {/* 3. The Architecture HUD (This is what triggers the "Holy Shit" reaction) */}
                <div className="mt-auto px-2 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                    <span className="text-[9px] font-mono font-bold tracking-[0.2em] uppercase text-slate-500">
                      System Architecture
                    </span>
                  </div>
                  
                  {/* Modular Badges */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-md text-brand-primary group-hover:bg-brand-primary group-hover:text-black transition-colors duration-300">
                      <Palette size={12} className="shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{vibeDisplay}</span>
                    </div>
                    
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-md text-fuchsia-400 group-hover:bg-fuchsia-500 group-hover:text-black transition-colors duration-300 delay-75">
                      <LayoutTemplate size={12} className="shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{hookDisplay}</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-md text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors duration-300 delay-150">
                      <Layers size={12} className="shrink-0" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">{journeyDisplay}</span>
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