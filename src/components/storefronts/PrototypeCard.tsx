/* src/components/storefronts/PrototypeCard.tsx */
'use client';

import React, { useState } from 'react';
import { ExternalLink, Layers, LayoutTemplate, ArrowRight, Info, RotateCcw } from 'lucide-react';

const VIBE_NAMES: Record<string, string> = {
  industrial: "Raw & Industrial", 
  neo: "Neo-Brutalist", 
  cyberpunk: "Neon Tech",
  minimal: "Clean & Minimal", 
  elegant: "High Editorial", 
  organic: "Earthy & Natural",
  editorial: "Magazine Style", 
  retropop: "Retro Pop",
  midnight: "Midnight Onyx" // 🔮 ADDED HERE
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

export default function PrototypeCard({ site }: { site: any }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const siteUrl = site.custom_domain ? `https://${site.custom_domain}` : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

  return (
    <div className="relative w-full aspect-[16/10] [perspective:1000px] group">
      <div 
        className={`w-full h-full transition-all duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        
        {/* FRONT FACE */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg group-hover:border-zinc-700 transition-colors">
          <div className="w-full h-full relative">
            {/* Full-bleed website preview */}
            <div className="w-full h-full overflow-hidden relative">
               <div className="absolute w-[300%] h-[300%] origin-top-left scale-[0.333]">
                 <iframe src={siteUrl} className="w-full h-full border-none pointer-events-none bg-zinc-950" title={site.business_name} tabIndex={-1} />
               </div>
            </div>
            
            {/* Floating Interaction Pills */}
            <div className="absolute bottom-3 right-3 flex gap-2">
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="bg-black/80 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full hover:bg-cyan-500/20 hover:border-cyan-500/50 transition-all shadow-lg" title="View Site">
                <ExternalLink size={14} />
              </a>
              <button 
                onClick={() => setIsFlipped(true)}
                className="bg-black/80 backdrop-blur-md border border-white/10 text-white p-2.5 rounded-full hover:bg-fuchsia-500/20 hover:border-fuchsia-500/50 transition-all shadow-lg"
                title="Vibe Check"
              >
                <Info size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-6">
             <h3 className="text-xl font-black text-white uppercase tracking-tight">Vibe Check</h3>
             <button onClick={() => setIsFlipped(false)} className="bg-zinc-950 p-1.5 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-all">
               <RotateCcw size={14} />
             </button>
          </div>
          
          {/* Use flex-grow to push the launch button to the bottom */}
          <div className="flex-grow space-y-6">
            <div className="border-l-2 border-cyan-500 pl-4">
               <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">The Hook</p>
               <p className="text-xs text-zinc-200 font-bold uppercase tracking-wide">{HOOK_NAMES[site.hero_layout] || 'Standard Flow'}</p>
            </div>
            <div className="border-l-2 border-fuchsia-500 pl-4">
               <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">The Flow</p>
               <p className="text-xs text-zinc-200 font-bold uppercase tracking-wide">{JOURNEY_NAMES[site.content_layout] || 'Standard Stack'}</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-4">
               <p className="text-[8px] text-zinc-500 uppercase tracking-widest mb-1">Aesthetic</p>
               <p className="text-xs text-zinc-200 font-bold uppercase tracking-wide">{VIBE_NAMES[site.theme_style] || 'Custom Engineered'}</p>
            </div>
          </div>

          <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full py-3 bg-white/5 hover:bg-cyan-500 hover:text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 rounded-lg transition-all border border-white/10">
            Launch Prototype <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}