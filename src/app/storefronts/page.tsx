/* src/app/storefronts/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import LivePrototypes from '@/components/storefronts/LivePrototypes';
import { Store, ArrowRight, Zap } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function StorefrontsPage() {
  const copy = WEBSITE_COPY.STOREFRONTS;

  return (
    <main className="min-h-screen bg-bg-app text-white relative overflow-x-hidden pt-32 pb-24 font-sans">
      {/* VIBRANT CYAN/TEAL GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* HEADER */}
        <section className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 text-[10px] font-mono text-cyan-400 uppercase tracking-[0.3em] mb-8 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <Store size={14} className="animate-pulse" />
            {copy.HEADER.TAG}
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 leading-none uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {copy.HEADER.TITLE_1} <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-300 via-cyan-400 to-emerald-300 animate-text-gradient">
              {copy.HEADER.TITLE_2}
            </span>
          </h1>
        </section>

        {/* SECTION 1: THE STOREFRONT OFFER */}
        <section className="mb-20 scroll-mt-32" id="funding-options">
          <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white mb-4">
               {copy.STOREFRONT_OFFER.TITLE}
             </h2>
             <p className="text-slate-400 font-light max-w-xl mx-auto text-lg">
               {copy.STOREFRONT_OFFER.SUBTITLE}
             </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-black/60 border border-cyan-500/30 hover:border-cyan-400/50 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-[0_0_50px_rgba(34,211,238,0.1)] transition-all duration-500 relative flex flex-col h-full group">
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-cyan-400 to-transparent opacity-50" />
              
              {/* TAG & TITLE */}
              <div className="flex flex-col text-center mb-10">
                <div className="inline-flex justify-center mb-4">
                  <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                    {copy.STOREFRONT_OFFER.TAG}
                  </span>
                </div>
                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-white">
                  {copy.STOREFRONT_OFFER.OFFER_TITLE}
                </h3>
                <p className="text-sm md:text-base text-slate-300 font-light max-w-2xl mx-auto">
                  {copy.STOREFRONT_OFFER.DESC}
                </p>
              </div>
              
              {/* THE TIERS (NOW SIDE-BY-SIDE WITH BULLETS) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                {copy.STOREFRONT_OFFER.TIERS.map((tier: any, idx: number) => (
                  <div key={idx} className="bg-white/5 border border-white/10 hover:border-cyan-400/30 rounded-2xl p-6 md:p-8 flex flex-col text-left transition-colors duration-300">
                    <div className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-teal-400 font-black text-3xl mb-2">
                      {tier.price}
                    </div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10">
                      {tier.name}
                    </div>
                    
                    {/* BULLET POINTS */}
                    <ul className="space-y-4 flex-1">
                      {tier.perks.map((perk: string, pIdx: number) => (
                        <li key={pIdx} className="text-sm text-slate-300 flex items-start gap-3 font-light leading-snug">
                          <Zap size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* ACTION BUTTON */}
              <div className="mt-auto max-w-md mx-auto w-full">
                <Link href={copy.STOREFRONT_OFFER.LINK} className="flex items-center justify-center gap-3 w-full py-5 text-sm font-black font-mono uppercase tracking-widest rounded-xl bg-linear-to-r from-cyan-400 to-teal-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_40px_rgba(34,211,238,0.6)] hover:scale-[1.02] transition-all duration-300">
                  {copy.STOREFRONT_OFFER.BTN_TEXT} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: THE VISUAL PROTOTYPES */}
        <section className="animate-in fade-in duration-1000 delay-300">
          <LivePrototypes />
        </section>

      </div>
    </main>
  );
}