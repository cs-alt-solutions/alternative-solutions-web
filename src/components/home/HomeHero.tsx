/* src/components/home/HomeHero.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Waypoints, Sparkle, ArrowRightLeft } from 'lucide-react';

export default function HomeHero() {
  const { HERO } = WEBSITE_COPY.PUBLIC_SITE.HOME;

  return (
    <section className="mb-24 pt-10 md:pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* LEFT COLUMN: THE TEXT */}
        <div className="w-full lg:w-3/5 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/5 text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-8 border border-white/10 shadow-inner">
             <div className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-pulse" />
             {HERO.TAG}
          </div>
          <h1 className="text-white text-6xl md:text-[5.5rem] font-black tracking-tighter mb-6 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {HERO.TITLE_1} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary via-fuchsia-400 to-brand-primary animate-text-gradient">
              {HERO.TITLE_2}
            </span>
          </h1>
          <p className="text-xl text-text-muted font-light max-w-2xl leading-relaxed mx-auto lg:mx-0">
            {HERO.SUBHEAD}
          </p>
        </div>

        {/* RIGHT COLUMN: THE ARCHITECTURAL SILHOUETTE */}
        <div className="hidden lg:flex w-full lg:w-2/5 justify-center relative pointer-events-none select-none h-96 items-center">
           
           {/* Ambient Core Glows */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-primary/20 rounded-full blur-[100px] animate-pulse" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-fuchsia-500/10 rounded-full blur-[80px]" />
           
           {/* Decorative Blueprint Grid (Masked to fade out at edges) */}
           <div className="absolute inset-0 bg-[linear-gradient(to_right,#06b6d415_1px,transparent_1px),linear-gradient(to_bottom,#06b6d415_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_at_center,white,transparent_60%)]" />

           {/* Floating Data Nodes (The I/O Waypoint Silhouette) */}
           <div className="relative z-10 transform -rotate-12 hover:rotate-0 hover:scale-105 transition-all duration-1000 ease-out flex items-center justify-center">
             
             {/* Base Block: The Dotted Lines & Connections */}
             <Waypoints size={350} strokeWidth={1} className="text-brand-primary/15 drop-shadow-[0_0_40px_rgba(6,182,212,0.3)]" />
             
             {/* Inner Core: The Twin Sparks (AI / Duality Concept) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
               <Sparkle size={130} strokeWidth={1} className="text-fuchsia-400/20 drop-shadow-[0_0_30px_rgba(232,121,249,0.3)]" />
               <Sparkle size={60} strokeWidth={1.5} className="absolute -top-6 -right-6 text-brand-primary/40 drop-shadow-[0_0_20px_rgba(6,182,212,0.5)] animate-pulse" />
             </div>
             
             {/* Orbiting Element: Input / Output */}
             <ArrowRightLeft size={80} strokeWidth={1.5} className="absolute -bottom-8 -right-8 text-white/10" />
             
           </div>
        </div>

      </div>
    </section>
  );
}