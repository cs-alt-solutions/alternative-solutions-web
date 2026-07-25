// src/components/storefronts/PrototypeCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, Info, RotateCcw, Loader2, Sparkles, LayoutTemplate, BookOpen } from 'lucide-react';

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

const HERO_STRUCTURES: Record<string, string> = {
  'center': "Centered Focus",
  'split-left': "Bold Left Split",
  'split-right': "Bold Right Split",
  'cinematic': "Full Cinematic",
  'minimal-type': "Typography Focus",
  'fullscreen-video': "Immersive Video"
};

const STORY_FLOWS: Record<string, string> = {
  'classic': "Smooth Stack",
  'bento': "Bento Grid",
  'sticky': "Sticky Scroll",
  'editorial': "Hover Stack",
  'accordion': "Accordion Flow",
  'split-story': "Split-Screen",
  'zigzag': "Z-Pattern Flow"
};

// 🚀 UPGRADE: Added onFlipChange to communicate with the marquee stage
interface PrototypeCardProps {
  site: any;
  onFlipChange?: (isFlipped: boolean) => void;
}

export default function PrototypeCard({ site, onFlipChange }: PrototypeCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_BASE_URL || 'https://storefronts.alternativesolutions.io'}/${site.slug}`;

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 1000 + Math.random() * 1500);
    return () => clearTimeout(timer);
  }, []);

  const displayVibe = VIBE_NAMES[site.theme_style] || site.theme_style || 'Custom Engineered';
  const displayHero = HERO_STRUCTURES[site.hero_layout] || site.hero_layout || 'Standard Flow';
  const displayStory = STORY_FLOWS[site.about_layout || site.content_layout] || site.about_layout || site.content_layout || 'Structured Stack';

  return (
    <div className="relative w-full aspect-16/10 perspective-[1000px] group">
      <div className={`w-full h-full transition-all duration-700 transform-3d ${isFlipped ? 'transform-[rotateY(180deg)]' : ''}`}>
        
        {/* ================= FRONT FACE ================= */}
        <div className="absolute inset-0 backface-hidden bg-zinc-950 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9)] group-hover:border-cyan-400 transition-colors isolate transform-[translateZ(0)]">
          <div className="w-full h-full relative bg-zinc-950 isolate">
            
            {!isMounted && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-600 bg-zinc-950 z-20">
                <Loader2 size={24} className="animate-spin mb-2 text-cyan-400" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">Initializing Engine...</span>
              </div>
            )}

            {isMounted && (
              <div className="w-full h-full overflow-hidden relative z-10 bg-zinc-950">
                <div className="absolute w-[300%] h-[300%] origin-top-left scale-[0.333] bg-zinc-950">
                  <iframe
                    src={siteUrl}
                    className="w-full h-full border-none pointer-events-none bg-zinc-950 block"
                    title={site.business_name}
                    tabIndex={-1}
                  />
                </div>
              </div>
            )}

            <div className="absolute bottom-3 right-3 flex gap-2 z-30">
              <a
                href={siteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-950 border border-zinc-700 text-white p-2.5 rounded-full hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                title="View Site"
              >
                <ExternalLink size={14} />
              </a>
              {/* 🚀 TELEMETRY TRIGGER: Reports flip state ON */}
              <button
                onClick={() => {
                  setIsFlipped(true);
                  onFlipChange?.(true);
                }}
                className="bg-zinc-950 border border-zinc-700 text-white p-2.5 rounded-full hover:bg-fuchsia-500 hover:text-black hover:border-fuchsia-500 transition-all shadow-[0_4px_12px_rgba(0,0,0,0.8)] cursor-pointer"
                title="Vibe Check & Layout"
              >
                <Info size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* ================= BACK FACE ================= */}
        <div className="absolute inset-0 backface-hidden transform-[rotateY(180deg)] bg-zinc-950 border border-zinc-800/80 rounded-2xl p-4 md:p-5 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden">
          <div className="flex justify-between items-center border-b border-white/5 pb-2 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Vibe Check</h3>
            </div>
            {/* 🚀 TELEMETRY TRIGGER: Reports flip state OFF */}
            <button
              onClick={() => {
                setIsFlipped(false);
                onFlipChange?.(false);
              }}
              className="bg-black p-1 rounded-full border border-zinc-800 text-zinc-400 hover:text-white hover:border-white transition-all cursor-pointer shadow-md shrink-0"
              title="Flip Back"
            >
              <RotateCcw size={13} />
            </button>
          </div>

          <div className="my-auto space-y-2.5 py-1">
            <div className="bg-black/60 border border-fuchsia-500/30 rounded-xl p-2.5 md:p-3 flex items-center justify-between gap-3 group/row hover:border-fuchsia-500/60 transition-colors">
              <div className="flex items-center gap-2 text-fuchsia-400 shrink-0">
                <Sparkles size={14} className="shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Foundational Vibe</span>
              </div>
              <p className="text-xs md:text-sm text-white font-black uppercase tracking-wide text-right leading-tight wrap-break-word">
                {displayVibe}
              </p>
            </div>
            <div className="bg-black/60 border border-cyan-500/30 rounded-xl p-2.5 md:p-3 flex items-center justify-between gap-3 group/row hover:border-cyan-500/60 transition-colors">
              <div className="flex items-center gap-2 text-cyan-400 shrink-0">
                <LayoutTemplate size={14} className="shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Hero Structure</span>
              </div>
              <p className="text-xs md:text-sm text-white font-black uppercase tracking-wide text-right leading-tight wrap-break-word">
                {displayHero}
              </p>
            </div>
            <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-2.5 md:p-3 flex items-center justify-between gap-3 group/row hover:border-emerald-500/60 transition-colors">
              <div className="flex items-center gap-2 text-emerald-400 shrink-0">
                <BookOpen size={14} className="shrink-0" />
                <span className="text-[9px] font-black uppercase tracking-[0.15em]">Story / About</span>
              </div>
              <p className="text-xs md:text-sm text-white font-black uppercase tracking-wide text-right leading-tight wrap-break-word">
                {displayStory}
              </p>
            </div>
          </div>

          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-black hover:bg-cyan-400 hover:text-black font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 rounded-xl transition-all border border-zinc-800 hover:border-cyan-400 shadow-lg shrink-0 group/btn"
          >
            <span>Launch Prototype</span>
            <ArrowRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}