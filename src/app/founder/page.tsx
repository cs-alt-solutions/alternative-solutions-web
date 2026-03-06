/* src/app/founder/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap, BrainCircuit, Code, Coffee, Cat, Network, Cpu, ShieldAlert } from 'lucide-react';

export default function FounderPage() {
  const copy = WEBSITE_COPY.PUBLIC_SITE.FOUNDER;

  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-x-hidden font-sans pt-32 pb-24">
      {/* Dynamic Background Atmosphere */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <section className="text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block border border-fuchsia-500/40 bg-fuchsia-950/30 px-5 py-2 rounded-full font-mono text-fuchsia-400 text-xs tracking-[0.3em] mb-8 uppercase shadow-[0_0_20px_rgba(232,121,249,0.3)]">
            {copy.HEADER.TAG}
          </div>
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
            {copy.HEADER.TITLE_1} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 via-brand-primary to-fuchsia-400 animate-text-gradient">{copy.HEADER.TITLE_2}</span>
          </h1>
        </section>

        {/* THE BENTO DASHBOARD */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-32">
          
          {/* CARD 1: THE ORIGIN & THE TRAP (Wide Card) */}
          <div className="md:col-span-12 lg:col-span-8 bg-black/40 border border-white/5 rounded-3xl p-10 backdrop-blur-md shadow-xl hover:border-white/10 transition-colors group">
            <div className="flex items-center gap-3 mb-8">
              <Network className="text-fuchsia-500" size={24} />
              <h2 className="text-white font-mono text-sm tracking-widest uppercase">System History</h2>
            </div>
            <div className="space-y-6 text-lg text-slate-300 font-light leading-relaxed">
              <p className="border-l-2 border-fuchsia-500/50 pl-6 text-xl text-white">
                {copy.CONTENT.INTRO}
              </p>
              <p className="pl-6 text-text-muted">
                {copy.CONTENT.THE_HYBRID}
              </p>
            </div>
          </div>

          {/* CARD 2: THE TELEMETRY (Tall Card) */}
          <div className="md:col-span-6 lg:col-span-4 lg:row-span-2 bg-white/2 border border-brand-primary/20 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.05)] hover:border-brand-primary/50 transition-all duration-500 group">
             <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-brand-primary via-fuchsia-500 to-brand-primary" />
             
             <h3 className="font-mono text-brand-primary text-xs tracking-[0.2em] mb-10 uppercase flex items-center gap-2">
               <Code size={16} /> {copy.STATS.TITLE}
             </h3>

             <div className="space-y-8">
               <div className="border-b border-white/5 pb-4">
                 <div className="text-[10px] font-mono text-white/50 uppercase tracking-widest mb-2">DESIGNATION</div>
                 <div className="text-xl text-white font-bold tracking-wide">{copy.STATS.ROLE}</div>
               </div>
               
               <div className="border-b border-white/5 pb-4">
                 <div className="text-[10px] font-mono text-fuchsia-400 uppercase tracking-widest mb-2">CLASS BUILD</div>
                 <div className="text-lg text-white font-bold">{copy.STATS.CLASS}</div>
               </div>

               <div className="border-b border-white/5 pb-4">
                 <div className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                   <Zap size={12} /> SYSTEM WIRING
                 </div>
                 <div className="text-lg text-white font-bold">{copy.STATS.WIRING}</div>
               </div>

               <div className="border-b border-white/5 pb-4">
                 <div className="text-[10px] font-mono text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                   PRIMARY FUEL
                 </div>
                 <div className="text-sm text-white font-medium flex items-start gap-3 leading-relaxed">
                   <Coffee size={16} className="text-amber-500 shrink-0 mt-0.5" /> 
                   <span>{copy.STATS.FUEL}</span>
                 </div>
               </div>

               <div className="pt-2">
                 <div className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2 flex items-center gap-2">
                   OFFICE SUPERVISORS
                 </div>
                 <div className="text-sm text-white font-medium flex items-center gap-3">
                   <Cat size={16} className="text-white/60" /> {copy.STATS.CO_WORKERS}
                 </div>
               </div>
             </div>
          </div>

          {/* CARD 3: THE SUPERPOWER (Glowing Accent Card) */}
          <div className="md:col-span-6 lg:col-span-4 bg-brand-primary/5 border border-brand-primary/30 rounded-3xl p-8 backdrop-blur-md relative overflow-hidden group hover:bg-brand-primary/10 transition-all duration-500">
            <div className="absolute -right-8 -bottom-8 text-brand-primary/20 group-hover:text-brand-primary/30 group-hover:scale-110 transition-all duration-700">
              <BrainCircuit size={160} />
            </div>
            <h3 className="relative z-10 font-mono text-brand-primary tracking-widest text-[10px] mb-6 uppercase flex items-center gap-2">
              <Zap size={14} className="animate-pulse" /> {copy.CONTENT.BOX_TAG}
            </h3>
            <p className="relative z-10 text-white font-medium text-lg leading-relaxed">
              {copy.CONTENT.BOX_QUOTE}
            </p>
          </div>

         {/* CARD 4: TECH MEETS BRAIN (Neuroplasticity Card) */}
          <div className="md:col-span-6 lg:col-span-4 bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-3xl p-8 backdrop-blur-md hover:border-fuchsia-500/40 transition-colors flex flex-col justify-center">
             <h4 className="text-fuchsia-400 font-mono text-[10px] tracking-widest uppercase mb-6 flex items-center gap-2">
               <Cpu size={14} /> {copy.CONTENT.THE_MINDSET_TITLE}
             </h4>
             <p className="text-slate-300 font-light text-[15px] leading-relaxed">
               {copy.CONTENT.THE_MINDSET}
             </p>
          </div>

          {/* CARD 5: ARCHITECTURE PHILOSOPHY (Fake AI Block) */}
          <div className="md:col-span-12 lg:col-span-8 bg-black/60 border border-white/5 border-dashed rounded-3xl p-8 backdrop-blur-md flex flex-col justify-center relative overflow-hidden">
            <div className="flex items-start gap-4">
              <div className="mt-1 bg-white/5 p-2 rounded-lg">
                <ShieldAlert className="text-white/40" size={20} />
              </div>
              <div>
                <h4 className="text-white/50 font-mono text-[10px] tracking-widest uppercase mb-3">Architectural Standard</h4>
                <p className="text-slate-300 font-light leading-relaxed">
                  {copy.CONTENT.P3}
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div className="text-center pt-16 border-t border-white/10">
            <h2 className="text-3xl font-black text-white mb-8 tracking-tight uppercase">{copy.FOOTER.TITLE}</h2>
            <button className="bg-brand-primary hover:bg-brand-primary/90 text-black font-black uppercase tracking-widest px-10 py-5 rounded-xl transition-all shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              {copy.FOOTER.CTA}
            </button>
        </div>

      </div>
    </main>
  );
}