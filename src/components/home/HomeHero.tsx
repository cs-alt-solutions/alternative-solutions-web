/* src/components/home/HomeHero.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowRight, Database, Triangle, CreditCard, Github, Code2, Layers, Aperture } from 'lucide-react';

export default function HomeHero() {
  const { HERO, AUTHORITY_BANNER } = WEBSITE_COPY.PUBLIC_SITE.HOME;

  const getTechIcon = (techName: string) => {
    switch(techName) {
      case 'SUPABASE': return <Database size={24} />;
      case 'VERCEL': return <Triangle size={24} />;
      case 'STRIPE': return <CreditCard size={24} />;
      case 'GITHUB': return <Github size={24} />;
      case 'VS CODE': return <Code2 size={24} />;
      case 'NEXT.JS': default: return <Layers size={24} />;
    }
  };

  return (
    <section className="mb-24 pt-10 md:pt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-16 px-6">
        
        {/* LEFT COLUMN: THE VISION */}
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
          <p className="text-xl text-text-muted font-light max-w-2xl leading-relaxed mx-auto lg:mx-0 mb-10">
            {HERO.SUBHEAD}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <Link 
              href={HERO.CTA_PRIMARY_LINK} 
              className="btn-brand flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-4 text-xs shadow-[0_0_30px_rgba(6,182,212,0.4)]"
            >
              {HERO.CTA_PRIMARY} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href={HERO.CTA_SECONDARY_LINK} 
              className="px-8 py-3.5 rounded-full border border-white/20 text-white font-bold text-xs uppercase tracking-wider hover:bg-white/10 hover:border-white/40 transition-all w-full sm:w-auto text-center"
            >
              {HERO.CTA_SECONDARY}
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: THE ADAPTIVE IDENTITY PEDESTAL (Waiting for Luckystrike) */}
        <div className="w-full lg:w-2/5 relative flex justify-center lg:justify-end">
          <div className="w-full aspect-square max-w-sm rounded-full flex items-center justify-center relative group">
            
            {/* Outer Glow & Spin Track */}
            <div className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent_0_340deg,rgba(6,182,212,0.3)_360deg)] animate-[spin_4s_linear_infinite] rounded-full blur-md" />
            <div className="absolute inset-0 border border-brand-primary/20 rounded-full" />
            
            {/* The Inner Sanctum */}
            <div className="absolute inset-2 bg-zinc-950/80 backdrop-blur-xl rounded-full flex flex-col items-center justify-center border border-white/5 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Core Pulse */}
              <div className="absolute w-40 h-40 bg-brand-primary/20 rounded-full blur-3xl animate-pulse" />
              
              <Aperture size={80} className="text-brand-primary/40 mb-6 animate-[spin_30s_linear_infinite] relative z-10" strokeWidth={1} />
              
              <div className="relative z-10 text-center">
                 <p className="text-[12px] font-black text-white uppercase tracking-[0.3em] mb-1">Adaptive</p>
                 <p className="text-[9px] font-mono text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20 inline-block">Awaiting Identity</p>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* AUTHORITY BANNER */}
      <div className="mt-24 pt-8 border-t border-white/5 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 w-full max-w-6xl mx-auto px-6">
         <p className="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mb-12 text-center">
           {AUTHORITY_BANNER.TEXT}
         </p>
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 w-full justify-items-center transition-all duration-500">
           {AUTHORITY_BANNER.STACK.map((tech: { name: string, desc: string }, idx: number) => {
             const getTechStyling = (t: string) => {
               switch(t) {
                 case 'SUPABASE': return 'hover:text-emerald-400 hover:drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]';
                 case 'STRIPE': return 'hover:text-indigo-400 hover:drop-shadow-[0_0_12px_rgba(129,140,248,0.7)]';
                 case 'VS CODE': return 'hover:text-sky-400 hover:drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]';
                 case 'VERCEL': case 'GITHUB': case 'NEXT.JS': default: 
                   return 'hover:text-white hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]';
               }
             };
             
             const dynamicClasses = getTechStyling(tech.name);

             return (
               <div key={idx} className={`relative flex items-center justify-center gap-3 text-sm md:text-lg font-black uppercase tracking-widest cursor-default group transition-all duration-300 text-white/50 hover:scale-105 ${dynamicClasses}`}>
                  <div className="group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all">
                    {getTechIcon(tech.name)}
                  </div>
                  <span>{tech.name}</span>
                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 p-3 bg-black/95 border border-brand-primary/30 rounded-xl text-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                    <p className="text-[11px] font-sans font-light text-slate-300 normal-case tracking-normal leading-snug">
                      {tech.desc}
                    </p>
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-black border-r border-b border-brand-primary/30 rotate-45"></div>
                  </div>
               </div>
             )
           })}
         </div>
      </div>
    </section>
  );
}