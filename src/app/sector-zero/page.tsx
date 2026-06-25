import React, { Suspense } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import SectorZeroPledge from '@/components/sector-zero/SectorZeroPledge';
import LiveRoster from '@/components/sector-zero/LiveRoster';
import { TerminalSquare, HeartHandshake, ArrowRight, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SectorZeroPage() {
  const copy = WEBSITE_COPY.SECTOR_ZERO;

  return (
    <main className="min-h-screen bg-bg-app text-white relative overflow-x-hidden pt-32 pb-24 font-sans">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-size-[24px_24px] mask-[linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HEADER - Tightened spacing and removed redundant description */}
        <section className="text-center mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-primary/30 bg-brand-primary/10 text-[10px] font-mono text-brand-primary uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <TerminalSquare size={14} className="animate-pulse" />
            {copy.HEADER.TAG}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {copy.HEADER.TITLE_1} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary via-fuchsia-400 to-brand-primary animate-text-gradient">
              {copy.HEADER.TITLE_2}
            </span>
          </h1>
        </section>

        {/* SECTION 1: THE INTERACTIVE PLEDGE & PERKS */}
        <SectorZeroPledge />

        {/* SECTION 2: THE 2 FUNDING PATHS */}
        <section className="mb-24 scroll-mt-32" id="funding-options">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.FUNDING_PATHS.TITLE}
             </h2>
             <p className="text-slate-400 font-light max-w-xl mx-auto">
               {copy.FUNDING_PATHS.SUBTITLE}
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* PATH 1: THE BASELINE BUILD */}
            <div className="bg-black/60 border border-brand-primary/30 hover:border-brand-primary/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-[9px] font-mono text-brand-primary uppercase tracking-widest mb-6 w-max">
                {copy.FUNDING_PATHS.PATH_1.TAG}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                {copy.FUNDING_PATHS.PATH_1.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-6 font-light">
                {copy.FUNDING_PATHS.PATH_1.DESC}
              </p>
              
              <div className="flex-1 space-y-3 mb-8">
                {copy.FUNDING_PATHS.PATH_1.TIERS.map((tier: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-start">
                    <div className="text-brand-primary font-black text-lg min-w-25">{tier.price}</div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">{tier.name}</div>
                      <div className="text-xs text-slate-400 leading-snug">{tier.perk}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto">
                <Link href="/sector-zero/apply" className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                  {copy.FUNDING_PATHS.PATH_1.BTN_TEXT} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* PATH 2: THE BOOST */}
            <div className="bg-black/60 border border-orange-500/30 hover:border-orange-500/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_30px_rgba(249,115,22,0.05)] transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-orange-500 to-transparent opacity-50" />
              <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-[9px] font-mono text-orange-400 uppercase tracking-widest mb-6 w-max">
                {copy.FUNDING_PATHS.PATH_2.TAG}
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                {copy.FUNDING_PATHS.PATH_2.TITLE}
              </h3>
              <p className="text-sm text-slate-300 mb-8 font-light flex-1">
                {copy.FUNDING_PATHS.PATH_2.DESC}
              </p>
              <div className="mt-auto">
                <div className="mb-6">
                  <span className="text-4xl font-black text-white">{copy.FUNDING_PATHS.PATH_2.PRICE}</span>
                </div>
                <Link href={copy.FUNDING_PATHS.PATH_2.LINK} className="flex items-center justify-center gap-2 w-full py-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 hover:bg-orange-500 hover:text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] transition-all">
                  {copy.FUNDING_PATHS.PATH_2.BTN_TEXT} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: THE FOUNDATION ROSTER (The Grid) */}
        <section className="pt-16 border-t border-white/10 animate-in fade-in duration-1000 delay-300">
           <div className="text-center mb-12">
             <h2 className="text-sm font-mono text-brand-primary uppercase tracking-[0.3em] mb-4 flex items-center justify-center gap-2">
               <HeartHandshake size={16} /> {copy.ROSTER.TAG}
             </h2>
             <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.ROSTER.TITLE}
             </h3>
             <p className="text-slate-400 font-light max-w-2xl mx-auto">
               {copy.ROSTER.DESC}
             </p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-5xl mx-auto min-h-50">
             {/* THE SUSPENSE BOUNDARY FIX */}
             <Suspense fallback={
               <div className="col-span-1 sm:col-span-2 md:col-span-3 flex items-center justify-center py-12">
                 <Loader2 className="animate-spin text-brand-primary" size={32} />
               </div>
             }>
               <LiveRoster />
             </Suspense>
           </div>
        </section>
      </div>
    </main>
  );
}