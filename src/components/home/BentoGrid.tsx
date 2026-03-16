/* src/components/home/BentoGrid.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { BrainCircuit, Terminal, Blocks, ArrowRight, Cpu, Users, Sparkles } from 'lucide-react';

export default function BentoGrid() {
  const { BENTO } = WEBSITE_COPY.PUBLIC_SITE.HOME;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 animate-in fade-in duration-1000 delay-500">
      
      {/* 1. THE ORIGIN STORY CARD (6 Cols) */}
      <Link 
        href={BENTO.STORY.LINK} 
        className="md:col-span-12 lg:col-span-6 group relative bg-black/60 border border-fuchsia-500/20 hover:border-fuchsia-500/50 rounded-3xl p-8 overflow-hidden transition-all duration-500 backdrop-blur-md shadow-[0_0_30px_rgba(232,121,249,0.1)] hover:shadow-[0_0_60px_rgba(232,121,249,0.3)] flex flex-col justify-between min-h-80"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-[80px] group-hover:bg-fuchsia-500/20 transition-colors duration-500 pointer-events-none" />
        <BrainCircuit size={250} className="absolute -bottom-10 -right-10 text-fuchsia-500/5 group-hover:text-fuchsia-500/10 transition-all duration-700 transform rotate-12 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/30 flex items-center justify-center mb-6 text-fuchsia-400 group-hover:scale-110 group-hover:bg-fuchsia-500/30 transition-all duration-500 shadow-[0_0_20px_rgba(232,121,249,0.3)]">
            <BrainCircuit size={24} />
          </div>
          <div className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest mb-2">
            {BENTO.STORY.TAG}
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
            {BENTO.STORY.TITLE}
          </h3>
          <p className="text-sm text-slate-300 font-light leading-relaxed max-w-sm">
            {BENTO.STORY.DESC}
          </p>
        </div>

        <div className="relative z-10 mt-8 flex items-center gap-2 text-fuchsia-400 font-mono text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
          {BENTO.STORY.CTA} <ArrowRight size={16} />
        </div>
      </Link>

      {/* 2. THE ECOSYSTEM DIRECTORY (6 Cols) */}
      <Link 
        href={BENTO.PRODUCT.LINK}
        className="md:col-span-12 lg:col-span-6 group relative bg-black/60 border border-brand-primary/20 hover:border-brand-primary/50 rounded-3xl p-8 overflow-hidden transition-all duration-500 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] flex flex-col justify-between min-h-80"
      >
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-colors duration-500 pointer-events-none" />
        <Blocks size={250} className="absolute -bottom-10 -right-10 text-brand-primary/5 group-hover:text-brand-primary/10 transition-all duration-700 transform -rotate-12 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-all duration-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
               <Blocks size={24} />
            </div>
            <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
              {BENTO.PRODUCT.TAG}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3">
            {BENTO.PRODUCT.TITLE}
          </h2>
          <p className="text-sm text-slate-300 font-light max-w-sm leading-relaxed">
            {BENTO.PRODUCT.DESC}
          </p>
        </div>
        <div className="relative z-10 mt-8 flex items-center gap-2 text-brand-primary font-mono text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all duration-300">
          {BENTO.PRODUCT.CTA} <ArrowRight size={16} />
        </div>
      </Link>

      {/* 3. CO-OP / CONTACT CARD (7 Cols) */}
      <Link
        href={BENTO.BETA.LINK}
        className="md:col-span-12 lg:col-span-7 group relative bg-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/60 rounded-3xl p-8 overflow-hidden transition-all duration-500 backdrop-blur-md shadow-[0_0_30px_rgba(52,211,153,0.1)] hover:shadow-[0_0_60px_rgba(52,211,153,0.35)] flex flex-col justify-between min-h-56"
      >
         <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
         <Users size={180} className="absolute -bottom-10 -right-5 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-700 transform rotate-12 pointer-events-none" />
         
         <div className="relative z-10 flex justify-between items-start mb-6">
           <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(52,211,153,0.3)]">
                 <Terminal size={20} />
              </div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest transition-colors">
                {BENTO.BETA.TAG}
              </div>
           </div>
           {/* Pulsing "Live" indicator */}
           <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(52,211,153,0.2)]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <span className="text-[9px] font-mono text-emerald-300 tracking-widest uppercase font-bold">Accepting Signups</span>
           </div>
         </div>
         
         <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
           <div className="max-w-md">
             <h3 className="text-3xl font-black text-white uppercase tracking-tight mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
               {BENTO.BETA.TITLE}
             </h3>
             <p className="text-emerald-100/80 font-light text-sm leading-relaxed">
               {BENTO.BETA.DESC}
             </p>
           </div>
           
           <div className="flex items-center shrink-0 gap-2 text-emerald-400 font-bold text-xs uppercase tracking-widest group-hover:bg-emerald-400 group-hover:text-black px-6 py-3 rounded-lg border border-emerald-500/60 transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
             {BENTO.BETA.CTA} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </div>
         </div>
      </Link>

      {/* 4. AI PHILOSOPHY CARD (5 Cols) */}
      <div className="md:col-span-12 lg:col-span-5 bg-black/80 border border-brand-primary/30 rounded-3xl p-8 backdrop-blur-md flex flex-col relative overflow-hidden group hover:border-brand-primary/60 transition-all duration-500 shadow-[0_0_30px_rgba(6,182,212,0.1)] hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] min-h-56">
        <Cpu size={150} className="absolute -top-10 -right-5 text-brand-primary/10 group-hover:text-brand-primary/20 transition-all duration-700 transform -rotate-12 pointer-events-none" />
        
        <div className="relative z-10 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(6,182,212,0.2)]">
              <Sparkles size={20} />
            </div>
            <h4 className="text-brand-primary/80 font-mono text-[10px] tracking-widest uppercase group-hover:text-brand-primary transition-colors font-bold">
              {BENTO.TECH.TAG}
            </h4>
          </div>
        </div>

        <div className="relative z-10 flex-1 flex flex-col justify-end">
          <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
             {BENTO.TECH.TITLE}
          </h3>
          
          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-xl p-5 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
             <p className="text-brand-primary/90 font-light text-sm leading-relaxed">
                {BENTO.TECH.DESC}
             </p>
          </div>
        </div>
      </div>

    </div>
  );
}