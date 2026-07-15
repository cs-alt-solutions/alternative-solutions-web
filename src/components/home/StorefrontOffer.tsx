/* src/components/home/StorefrontOffer.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function StorefrontOffer() {
  const { STOREFRONT_OFFER, HEADER } = WEBSITE_COPY.STOREFRONTS;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-24 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white mb-4">
          {HEADER.TITLE_1} <span className="text-cyan-400">{HEADER.TITLE_2}</span>
        </h2>
        <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-widest text-white/80 mb-4">
          {STOREFRONT_OFFER.TITLE}
        </h3>
        <p className="text-lg text-slate-400 font-light max-w-2xl mx-auto">
          {STOREFRONT_OFFER.SUBTITLE}
        </p>
      </div>

      {/* Pricing Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {STOREFRONT_OFFER.TIERS.map((tier: any, index: number) => (
          <div key={index} className="bg-black/40 border border-white/10 hover:border-cyan-500/50 rounded-3xl p-8 backdrop-blur-sm transition-all shadow-xl flex flex-col group">
            <div className="mb-6 border-b border-white/10 pb-6 group-hover:border-cyan-500/30 transition-colors">
              <span className="text-4xl font-black text-white">{tier.price}</span>
              <h4 className="text-xl font-bold text-cyan-400 uppercase tracking-widest mt-2">{tier.name}</h4>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {tier.perks.map((perk: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                  <CheckCircle2 size={18} className="text-cyan-500 shrink-0 mt-0.5" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 flex justify-center">
        <Link href={STOREFRONT_OFFER.LINK} className="btn-brand flex items-center gap-3 px-10 py-5 text-sm font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform">
          {STOREFRONT_OFFER.BTN_TEXT} <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}