'use client';

import React, { useState } from 'react';
import { Fingerprint, ArrowRight } from 'lucide-react';

export default function InteractiveVibeShowcase({ prototypes }: { prototypes: any[] }) {
  // Extract unique themes from the prototypes that actually exist in the DB
  const availableThemes = Array.from(new Set(prototypes.map(p => p.theme_style).filter(Boolean)));
  
  // Default to the first available theme
  const [activeTheme, setActiveTheme] = useState(availableThemes[0] || 'industrial');

  // Find the featured prototype for the selected theme
  const activeStore = prototypes.find(p => p.theme_style === activeTheme) || prototypes[0];

  if (!activeStore) return null;

  const brandColor = activeStore.brand_color || '#06b6d4';
  
  // Generate the actual live URL for the iframe to render
  const liveUrl = activeStore.custom_domain 
    ? `https://${activeStore.custom_domain}` 
    : `https://storefronts.alternativesolutions.io/${activeStore.slug}`;

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 items-center animate-in fade-in duration-700">
      
      {/* 🟢 THE VIBE SWITCHBOARD (TABS) */}
      <div className="flex flex-wrap justify-center gap-3">
        {availableThemes.map((theme: any) => (
          <button
            key={theme}
            onClick={() => setActiveTheme(theme)}
            className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              activeTheme === theme 
                ? 'bg-zinc-100 text-zinc-950 shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                : 'bg-zinc-900/50 text-zinc-500 border border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
            }`}
          >
            {theme.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* 🟢 THE INTERACTIVE STAGE (CONCEPT VS REALITY) */}
      <div 
        className="group relative w-full aspect-video md:aspect-21/9 rounded-3xl overflow-hidden shadow-2xl"
        style={{ '--brand-color': brandColor } as React.CSSProperties}
      >
        
        {/* === LAYER 1: THE BLUEPRINT (BEFORE) === */}
        <div className="absolute inset-0 bg-[#030303] flex items-center justify-center transition-opacity duration-700 group-hover:opacity-0 z-10 border border-zinc-800 rounded-3xl overflow-hidden">
          
          {/* Architectural Grid & Crosshairs */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-size-[3rem_3rem]" />
          <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800/50" />
          <div className="absolute left-1/2 top-0 w-px h-full bg-zinc-800/50" />
          
          <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between p-8 md:p-16 opacity-80">
            
            {/* Structured Wireframe Content */}
            <div className="w-full md:w-1/2 space-y-4 flex flex-col items-start relative">
               
               {/* Hollow CSS Outline for Business Name */}
               <h3 
                 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-transparent" 
                 style={{ WebkitTextStroke: '1px #52525b' }}
               >
                 {activeStore.business_name}
               </h3>
               
               {/* Wireframe Tagline */}
               <div className="w-full border-l-2 border-zinc-800 pl-4 py-1 mt-2">
                 <p className="font-mono text-xs text-zinc-500 line-clamp-2">
                   {activeStore.tagline || 'Awaiting Content Injection'}
                 </p>
               </div>
               
               {/* Wireframe Button */}
               <div className="mt-6 border border-dashed border-zinc-700 px-6 py-3 rounded-full flex items-center gap-2 text-zinc-600">
                 <span className="text-[9px] font-black uppercase tracking-[0.2em]">PRIMARY ACTION</span>
               </div>
            </div>

            {/* Media Schematic Placeholder */}
            <div className="hidden md:flex relative w-5/12 h-full border border-zinc-800 rounded-2xl items-center justify-center bg-zinc-900/20 backdrop-blur-sm overflow-hidden">
               <svg className="absolute inset-0 w-full h-full text-zinc-800/30" preserveAspectRatio="none">
                 <line x1="0" y1="0" x2="100%" y2="100%" stroke="currentColor" strokeWidth="1" />
                 <line x1="100%" y1="0" x2="0" y2="100%" stroke="currentColor" strokeWidth="1" />
               </svg>
               <div className="bg-zinc-950 border border-zinc-800 px-4 py-2 rounded-md z-10 flex flex-col items-center shadow-2xl">
                 <span className="font-mono text-zinc-500 text-[10px] tracking-[0.2em] uppercase block mb-1">Visual Asset</span>
               </div>
            </div>
          </div>

          {/* Telemetry Data (Bottom Left) */}
          <div className="absolute bottom-6 left-6 text-left font-mono text-[9px] text-zinc-500 space-y-1 bg-[#050505]/90 p-4 rounded-xl border border-zinc-800/80 backdrop-blur-md shadow-2xl z-20">
            <p className="flex justify-between gap-8"><span>AESTHETIC_CLASS:</span> <span className="text-white uppercase">{activeStore.theme_style}</span></p>
            <p className="flex justify-between gap-8"><span>PRIMARY_HEX:</span> <span style={{ color: brandColor }}>{brandColor}</span></p>
            <p className="flex justify-between gap-8"><span>LAYOUT_ENGINE:</span> <span className="text-white uppercase">{activeStore.hero_layout}</span></p>
          </div>

          {/* Central Instruction Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2 group-hover:scale-90 group-hover:opacity-0 transition-all duration-500 z-30 pointer-events-none">
            <Fingerprint size={14} className="animate-pulse" /> Hover To Compile
          </div>
        </div>

        {/* === LAYER 2: THE EXECUTION (AFTER) === */}
        {/* We load the ACTUAL live website in an iframe so it is 100% accurate to reality */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 bg-zinc-950 rounded-3xl overflow-hidden">
          
          <iframe 
            key={activeStore.id}
            src={liveUrl} 
            className="w-full h-full border-none opacity-100" 
            style={{ pointerEvents: 'none' }} // Prevents user from accidentally scrolling inside the preview
            title={`${activeStore.business_name} Preview`}
            loading="lazy"
          />

          {/* The Absolute "Test Drive" Floating Button */}
          <div className="absolute bottom-6 right-6 z-30">
            <a 
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] group/btn border border-zinc-200 pointer-events-auto"
            >
              Test Drive <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        {/* Outer Edge Neon Glow (Activated on hover) */}
        <div 
          className="absolute -inset-1 opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 -z-10 pointer-events-none"
          style={{ backgroundColor: 'var(--brand-color)' }}
        />
      </div>

    </div>
  );
}