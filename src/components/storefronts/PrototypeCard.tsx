/* src/components/storefronts/PrototypeCard.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, Info, RotateCcw, Loader2 } from 'lucide-react';

const VIBE_NAMES: Record<string, string> = {
  industrial: "Raw & Industrial", 
  neo: "Neo-Brutalist", 
  cyberpunk: "Neon Tech",
  minimal: "Clean & Minimal", 
  elegant: "High Editorial", 
  organic: "Earthy & Natural",
  editorial: "Magazine Style", 
  retropop: "Retro Pop",
  midnight: "Midnight Onyx"
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
  const [isMounted, setIsMounted] = useState(false);
  
  const siteUrl = site.custom_domain ? `https://${site.custom_domain}` : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

  // 🛑 FIX 2: Stagger the iframe loading so it doesn't freeze the browser when you scroll
  useEffect(() => {
    // Randomly stagger the load between 1s and 2.5s after the page hits
    const timer = setTimeout(() => setIsMounted(true), 1000 + Math.random() * 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full aspect-16/10 perspective-[1000px] group">
      <div 
        className={`w-full h-full transition-all duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}
      >
        
        {/* FRONT FACE */}
        {/* 🛑 FIX 1: 'isolation-isolate' and 'translateZ(0)' stops Chrome from punching holes in the background */}
        <div 
          className="absolute inset-0 backface-hidden bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl group-hover:border-cyan-500/50 transition-colors isolate"
          style={{ transform: 'translateZ(0)' }}
        >
          <div className="w-full h-full relative bg-zinc-950 isolate">
            
            {/* Loading State */}
            {!isMounted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950">
                <Loader2 size={24} className="animate-spin mb-2 text-cyan-500/50" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Initializing Engine...</span>
              </div>
            )}

            {/* Full-bleed website preview */}
            {isMounted && (
              <div className="w-full h-full overflow-hidden relative z-10">
                 <div className="absolute w-[300%] h-[300%] origin-top-left scale-[0.333]">
                   <iframe 
                     src={siteUrl} 
                     className="w-full h-full border-none pointer-events-none bg-zinc-950" 
                     title={site.business_name} 
                     tabIndex={-1} 
                   />
                 </div>
              </div>
            )}
            
            {/* Floating Interaction Pills */}
            <div className="absolute bottom-3 right-3 flex gap-2 z-20">
              <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="bg-zinc-950 border border-zinc-700 text-white p-2.5 rounded-full hover:bg-cyan-500 hover:text-black hover:border-cyan-500 transition-all shadow-xl" title="View Site">
                <ExternalLink size={14} />
              </a>
              <button 
                onClick={() => setIsFlipped(true)}
                className="bg-zinc-950 border border-zinc-700 text-white p-2.5 rounded-full hover:bg-fuchsia-500 hover:text-black hover:border-fuchsia-500 transition-all shadow-xl"
                title="Vibe Check"
              >
                <Info size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800 rounded-2xl p-6 flex flex-col shadow-2xl overflow-hidden">
          <div className="flex justify-between items-start mb-6">
             <h3 className="text-xl font-black text-white uppercase tracking-tight">Vibe Check</h3>
             <button onClick={() => setIsFlipped(false)} className="bg-black p-1.5 rounded-full border border-zinc-700 text-zinc-400 hover:text-white transition-all">
               <RotateCcw size={14} />
             </button>
          </div>
          
          <div className="grow space-y-6">
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

          <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="mt-6 w-full py-3 bg-zinc-900 hover:bg-cyan-500 hover:text-black font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 rounded-lg transition-all border border-zinc-800 hover:border-cyan-500">
            Launch Prototype <ArrowRight size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}