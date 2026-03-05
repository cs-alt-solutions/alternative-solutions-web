/* src/app/blueprint/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function BlueprintPage() {
  const copy = WEBSITE_COPY.PUBLIC_SITE.BLUEPRINT;

  return (
    <main className="min-h-screen bg-bg-app text-slate-300 relative overflow-hidden font-sans pt-32 pb-24">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10 pointer-events-none"></div>
      <div className="absolute top-[10%] left-[-5%] w-125 h-125 bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <section className="text-center mb-32 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block border border-emerald-500/40 bg-emerald-950/30 px-5 py-2 rounded-full font-mono text-emerald-400 text-xs tracking-[0.3em] mb-10 uppercase shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            {copy.HEADER.TAG}
          </div>
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            {copy.HEADER.TITLE_1} <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 via-lime-400 to-emerald-400 animate-text-gradient drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">{copy.HEADER.TITLE_2}</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-300 max-w-4xl mx-auto leading-relaxed font-light mb-16">
            {copy.HEADER.DESC}
          </p>
        </section>

        <section className="bg-bg-app/80 border border-emerald-900/50 p-10 md:p-20 rounded-3xl relative overflow-hidden shadow-[0_0_40px_rgba(52,211,153,0.1)] backdrop-blur-sm">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-5xl font-black text-white mb-8 leading-none tracking-tighter whitespace-pre-line">{copy.REWARDS.TITLE}</h2>
              <p className="text-2xl text-slate-300 font-light mb-20 max-w-2xl mx-auto leading-relaxed">{copy.REWARDS.DESC}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-left">
                {/* RANK 1: OPERATIVE */}
                <div className="p-8 bg-bg-app rounded-2xl border border-white/10 transition-all duration-300 hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] group">
                  <svg className="w-10 h-10 text-slate-400 group-hover:text-emerald-400 transition-colors mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <div className="text-white text-2xl font-black mb-2 tracking-tight">{copy.REWARDS.RANKS[0].title}</div>
                  <div className="text-sm text-slate-400 font-light leading-relaxed">{copy.REWARDS.RANKS[0].desc}</div>
                </div>

                {/* RANK 2: ARCHITECT */}
                <div className="p-8 bg-bg-app rounded-2xl border border-white/10 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)] group">
                  <svg className="w-10 h-10 text-slate-400 group-hover:text-cyan-400 transition-colors mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" /></svg>
                  <div className="text-white text-2xl font-black mb-2 tracking-tight">{copy.REWARDS.RANKS[1].title}</div>
                  <div className="text-sm text-slate-400 font-light leading-relaxed">{copy.REWARDS.RANKS[1].desc}</div>
                </div>

                {/* RANK 3: APEX */}
                <div className="p-8 bg-bg-app rounded-2xl border border-emerald-500/50 shadow-[0_0_20px_rgba(52,211,153,0.2)] hover:bg-emerald-950/30 transition-all duration-300 group">
                  <svg className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 22h20L12 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 10l-4 8h8z" /></svg>
                  <div className="text-white text-2xl font-black mb-2 tracking-tight">{copy.REWARDS.RANKS[2].title}</div>
                  <div className="text-sm text-slate-400 font-light leading-relaxed">{copy.REWARDS.RANKS[2].desc}</div>
                </div>
              </div>
            </div>
        </section>
        
        <section className="text-center mt-24">
            <h2 className="text-white font-mono text-3xl md:text-4xl mb-12 tracking-tighter max-w-4xl mx-auto leading-tight">{copy.FOOTER.TITLE}</h2>
            <Link href="/apply" className="inline-block bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 font-black text-xl tracking-widest px-16 py-6 rounded-lg hover:bg-emerald-400 hover:text-black transition-all shadow-[0_0_40px_rgba(52,211,153,0.4)] mb-8 uppercase">
              {copy.FOOTER.CTA}
            </Link>
        </section>
      </div>
    </main>
  );
}