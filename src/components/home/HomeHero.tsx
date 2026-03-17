/* src/components/home/HomeHero.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Activity, Zap, Timer, ArrowRight, Database, Triangle, CreditCard, Github, Code2, Layers } from 'lucide-react';

export default function HomeHero({ liveSpotsRemaining = 20 }: { liveSpotsRemaining?: number }) {
  const { HERO, LAUNCH_TELEMETRY, AUTHORITY_BANNER } = WEBSITE_COPY.PUBLIC_SITE.HOME;
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(LAUNCH_TELEMETRY.COUNTDOWN_TARGET).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [LAUNCH_TELEMETRY.COUNTDOWN_TARGET]);

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

        {/* RIGHT COLUMN: THE SYSTEM TELEMETRY */}
        <div className="w-full lg:w-2/5 relative">
          <div className="bg-black/60 border border-brand-primary/20 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] relative overflow-hidden group">
            
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-all duration-700" />
            
            <div className="relative z-10 mb-10 pb-8 border-b border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-brand-primary uppercase tracking-[0.2em] mb-4">
                <Activity size={14} className="animate-pulse" /> {LAUNCH_TELEMETRY.SPOTS_LABEL}
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl font-black text-white italic tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  {liveSpotsRemaining}
                </span>
                <span className="text-xl font-mono text-white/20 uppercase">/ {LAUNCH_TELEMETRY.SPOTS_TOTAL} SLOTS</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full mt-6 overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-brand-primary to-fuchsia-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]" 
                  style={{ width: `${(liveSpotsRemaining / LAUNCH_TELEMETRY.SPOTS_TOTAL) * 100}%` }}
                />
              </div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-mono text-fuchsia-400 uppercase tracking-[0.2em] mb-6">
                <Timer size={14} /> {LAUNCH_TELEMETRY.COUNTDOWN_LABEL}
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { val: timeLeft.days, label: 'DD' },
                  { val: timeLeft.hours, label: 'HH' },
                  { val: timeLeft.minutes, label: 'MM' },
                  { val: timeLeft.seconds, label: 'SS' }
                ].map((unit, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-2xl md:text-3xl font-black text-white font-mono tabular-nums leading-none mb-1">
                      {String(unit.val).padStart(2, '0')}
                    </div>
                    <div className="text-[8px] font-mono text-white/30 uppercase tracking-widest">{unit.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-white/5 relative z-10">
               <p className="text-[10px] font-mono text-brand-primary/60 uppercase leading-relaxed italic">
                 {LAUNCH_TELEMETRY.CTA_URGENCY}
               </p>
            </div>

          </div>
        </div>

      </div>

      {/* AUTHORITY BANNER: Now with Tooltips */}
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
                  
                  {/* Icon */}
                  <div className="group-hover:drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] transition-all">
                    {getTechIcon(tech.name)}
                  </div>
                  
                  {/* Name */}
                  <span>{tech.name}</span>

                  {/* THE HUMAN TALK TOOLTIP */}
                  <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-48 p-3 bg-black/95 border border-brand-primary/30 rounded-xl text-center opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 pointer-events-none z-50 shadow-2xl backdrop-blur-xl">
                    <p className="text-[11px] font-sans font-light text-slate-300 normal-case tracking-normal leading-snug">
                      {tech.desc}
                    </p>
                    {/* The little downward pointing triangle on the bubble */}
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