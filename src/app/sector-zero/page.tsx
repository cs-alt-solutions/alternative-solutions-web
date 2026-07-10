import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import SectorZeroPledge from '@/components/sector-zero/SectorZeroPledge';
import LivePrototypes from '@/components/storefronts/LivePrototypes';
import { TerminalSquare, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function SectorZeroPage() {
  const copy = WEBSITE_COPY.SECTOR_ZERO;

  return (
    <main className="min-h-screen bg-bg-app text-white relative overflow-x-hidden pt-32 pb-24 font-sans">
      {/* We removed the background grid div entirely */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
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

        {/* SECTION 1: THE PLEDGE & PERKS */}
        <SectorZeroPledge />

        {/* SECTION 2: THE STOREFRONT OFFER */}
        <section className="mb-12 scroll-mt-32" id="funding-options">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.STOREFRONT_OFFER.TITLE}
             </h2>
             <p className="text-slate-400 font-light max-w-xl mx-auto">
               {copy.STOREFRONT_OFFER.SUBTITLE}
             </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-black/60 border border-brand-primary/30 hover:border-brand-primary/50 rounded-3xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(6,182,212,0.1)] transition-all duration-500 relative flex flex-col h-full group text-center">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />
              
              <div className="flex justify-center mb-6">
                <div className="inline-block px-3 py-1 bg-brand-primary/10 border border-brand-primary/30 rounded-full text-[9px] font-mono text-brand-primary uppercase tracking-widest">
                  {copy.STOREFRONT_OFFER.TAG}
                </div>
              </div>
              
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
                {copy.STOREFRONT_OFFER.OFFER_TITLE}
              </h3>
              
              <p className="text-sm text-slate-300 mb-8 font-light max-w-xl mx-auto">
                {copy.STOREFRONT_OFFER.DESC}
              </p>
              
              <div className="flex-1 space-y-3 mb-8 max-w-md mx-auto w-full">
                {copy.STOREFRONT_OFFER.TIERS.map((tier: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4 items-center text-left">
                    <div className="text-brand-primary font-black text-xl min-w-25">{tier.price}</div>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider mb-1">{tier.name}</div>
                      <div className="text-xs text-slate-400 leading-snug">{tier.perk}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto max-w-md mx-auto w-full">
                <Link href={copy.STOREFRONT_OFFER.LINK} className="flex items-center justify-center gap-2 w-full py-4 text-sm font-bold font-mono uppercase tracking-widest rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all">
                  {copy.STOREFRONT_OFFER.BTN_TEXT} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SECTION 3: THE VISUAL PROTOTYPES */}
      <section className="animate-in fade-in duration-1000 delay-300">
        <LivePrototypes />
      </section>

    </main>
  );
}