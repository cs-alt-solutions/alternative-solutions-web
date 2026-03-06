/* src/app/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { BrainCircuit, Terminal, Blocks, ArrowRight, Cpu } from 'lucide-react';

export default function HomePage() {
  const copy = WEBSITE_COPY.PUBLIC_SITE.HOME;

  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-x-hidden font-sans pt-32 pb-24">
      {/* Ambient Backgrounds - Updated with canonical Tailwind classes */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />
      <div className="absolute top-20 left-10 w-125 h-125 bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-10 right-10 w-100 h-100 bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HERO SECTION */}
        <section className="mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {copy?.HERO?.TITLE_1 || "BUILDING THE"} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary via-fuchsia-400 to-brand-primary animate-text-gradient">
              {copy?.HERO?.TITLE_2 || "FOUNDATION."}
            </span>
          </h1>
          <p className="text-xl text-slate-400 font-light max-w-2xl leading-relaxed">
            {copy?.HERO?.SUBHEAD || "We don't do cookie-cutter templates. We architect custom, high-performance ecosystems driven by AI and built for scale."}
          </p>
        </section>

        {/* BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* MAIN ECOSYSTEM CARD (Spans 8 cols) - Mapped to copy.BENTO.PRODUCT */}
          <Link 
            href={copy?.BENTO?.PRODUCT?.LINK || "/products"}
            className="md:col-span-12 lg:col-span-8 group relative bg-black/40 border border-white/5 hover:border-brand-primary/30 rounded-3xl p-10 overflow-hidden transition-all duration-500 backdrop-blur-md shadow-xl flex flex-col justify-between min-h-87.5"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-colors duration-500 pointer-events-none" />
            
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Blocks className="text-brand-primary" size={28} />
                <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
                  {copy?.BENTO?.PRODUCT?.TAG || "THE ENGINE"}
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-4">
                {copy?.BENTO?.PRODUCT?.TITLE || "ENTER THE ECOSYSTEM"}
              </h2>
              <p className="text-lg text-slate-300 font-light max-w-xl">
                {copy?.BENTO?.PRODUCT?.DESC || "Stop wrestling with disconnected systems. Explore the hybrid frameworks and AI-powered architecture built to run your business."}
              </p>
            </div>

            <div className="mt-12 flex items-center gap-2 text-brand-primary font-mono text-xs uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
              {copy?.BENTO?.PRODUCT?.CTA || "Initialize Sequence"} <ArrowRight size={16} />
            </div>
          </Link>

          {/* THE ORIGIN STORY CARD (Spans 4 cols) */}
          <Link 
            href={copy?.BENTO?.STORY?.LINK || "/founder"} 
            className="md:col-span-6 lg:col-span-4 group relative bg-black/40 border border-white/5 hover:border-fuchsia-500/30 rounded-3xl p-8 overflow-hidden transition-all duration-500 backdrop-blur-md shadow-xl flex flex-col justify-between min-h-87.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/10 rounded-full blur-[50px] group-hover:bg-fuchsia-500/20 transition-colors duration-500 pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500/20 transition-all duration-500">
                <BrainCircuit size={24} />
              </div>
              <div className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest mb-2">
                {copy?.BENTO?.STORY?.TAG || "THE ARCHITECT"}
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
                {copy?.BENTO?.STORY?.TITLE || "BUILT DIFFERENT."}
              </h3>
              <p className="text-sm text-slate-400 font-light leading-relaxed">
                {copy?.BENTO?.STORY?.DESC || "No corporate boxes. No fragile workarounds. Just a relentlessly strong foundation built by a neurodivergent mind."}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 text-fuchsia-400 font-mono text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
              {copy?.BENTO?.STORY?.CTA || "View Telemetry"} <ArrowRight size={16} />
            </div>
          </Link>

          {/* CO-OP / CONTACT CARD (Spans 6 cols) - Mapped to copy.BENTO.BETA */}
          <Link
            href={copy?.BENTO?.BETA?.LINK || "/co-op"}
            className="md:col-span-6 lg:col-span-6 group relative bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl p-8 overflow-hidden transition-all duration-500 backdrop-blur-md flex flex-col justify-between min-h-50"
          >
             <div className="flex justify-between items-start mb-8">
               <Terminal className="text-slate-400 group-hover:text-white transition-colors" size={28} />
               <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
             </div>
             <div>
               <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-2">
                 {copy?.BENTO?.BETA?.TAG || "CO-OP MODE"}
               </div>
               <h3 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                 {copy?.BENTO?.BETA?.TITLE || "INITIATE CONTACT"} <ArrowRight size={20} className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
               </h3>
             </div>
          </Link>

          {/* AI PHILOSOPHY CARD (Spans 6 cols) */}
          <div className="md:col-span-6 lg:col-span-6 bg-black/60 border border-brand-primary/20 border-dashed rounded-3xl p-8 backdrop-blur-md flex flex-col justify-center relative overflow-hidden group hover:border-brand-primary/40 transition-colors min-h-50">
            <Cpu className="text-brand-primary/40 mb-4 group-hover:text-brand-primary/60 transition-colors" size={24} />
            <h4 className="text-white/50 font-mono text-[10px] tracking-widest uppercase mb-2">
              {copy?.BENTO?.TECH?.TAG || "INTERNAL WIRING"}
            </h4>
            <p className="text-slate-300 font-light text-sm">
              {copy?.BENTO?.TECH?.DESC || "We don't build fake AI wrappers. We use AI internally as a relentless coding partner to construct bulletproof systems."}
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}