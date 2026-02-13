/* src/app/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import Mission from '@/components/Mission';
import HowWeWork from '@/components/HowWeWork';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen relative">
      
      {/* --- BACKGROUND FX --- */}
      <div className="absolute inset-0 h-200 pointer-events-none overflow-hidden">
         <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[50px_50px] mask-[linear-gradient(to_bottom,black_40%,transparent_100%)]" />
         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-200 h-125 bg-brand-primary opacity-[0.12] blur-[120px] rounded-full" />
      </div>

      {/* --- NAVBAR --- */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border-subtle bg-bg-app/80">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-brand-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span className="font-bold text-lg tracking-tight text-white uppercase">{WEBSITE_COPY.NAV.BRAND}</span>
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/services" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">{WEBSITE_COPY.NAV.SERVICES}</Link>
            <Link href="/shift-studio" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">{WEBSITE_COPY.NAV.SHIFT_STUDIO}</Link>
          </div>
          <Link href="/login" className="px-5 py-2 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors uppercase tracking-wide">
            {WEBSITE_COPY.NAV.LOGIN}
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 text-center z-10">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
              SMARTER <br />
              <span className="text-gradient-cyan">BUSINESS SYSTEMS.</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-14 leading-relaxed font-light">
              {WEBSITE_COPY.HERO.SUBHEAD}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/shift-studio" className="btn-brand">{WEBSITE_COPY.HERO.CTA_PRIMARY}</Link>
              <Link href="/services" className="btn-secondary">{WEBSITE_COPY.HERO.CTA_SECONDARY}</Link>
            </div>
        </div>
      </section>

      {/* --- MISSION STATEMENT --- */}
      <Mission />

      {/* --- HYBRID PROCESS --- */}
      <HowWeWork />

      {/* --- THE SERVICE BENTO GRID --- */}
      <section className="px-6 py-32 z-10 relative">
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* TIER 3: Custom Software (The Flagship) */}
              <div className="md:col-span-7 card-bento group min-h-100 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono border border-brand-primary/30 px-2 py-1 rounded text-brand-accent uppercase mb-4 inline-block">
                    {WEBSITE_COPY.SERVICES.TIER_3.TAG}
                  </span>
                  <h3 className="text-3xl font-bold mb-3 text-white">{WEBSITE_COPY.SERVICES.TIER_3.TITLE}</h3>
                  <p className="text-text-muted text-lg max-w-md">{WEBSITE_COPY.SERVICES.TIER_3.DESC}</p>
                </div>
                <div className="absolute inset-0 bg-linear-to-tr from-brand-primary/5 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* TIER 2: App Connections */}
              <div className="md:col-span-5 card-bento flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-3 text-white">{WEBSITE_COPY.SERVICES.TIER_2.TITLE}</h3>
                  <p className="text-text-muted mb-6">{WEBSITE_COPY.SERVICES.TIER_2.DESC}</p>
                  <span className="text-xs font-mono text-brand-secondary uppercase tracking-widest">{WEBSITE_COPY.SERVICES.TIER_2.TAG}</span>
              </div>

              {/* TIER 1: Quick Fixes */}
              <div className="md:col-span-6 card-bento">
                 <span className="text-[10px] font-mono border border-border-subtle px-2 py-1 rounded text-text-muted uppercase mb-4 inline-block">
                    {WEBSITE_COPY.SERVICES.TIER_1.TAG}
                 </span>
                 <h4 className="text-xl font-bold text-white mb-2">{WEBSITE_COPY.SERVICES.TIER_1.TITLE}</h4>
                 <p className="text-text-muted text-sm">{WEBSITE_COPY.SERVICES.TIER_1.DESC}</p>
              </div>

              {/* PLACEHOLDER: Closing the Grid */}
              <div className="md:col-span-6 card-bento flex items-center justify-center border-dashed border-white/10 bg-transparent">
                 <Link href="/services" className="text-text-muted hover:text-brand-accent transition-colors font-mono text-xs uppercase tracking-widest">
                    View Full Capabilities →
                 </Link>
              </div>

            </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="border-t border-border-subtle py-12 text-center bg-bg-app z-10 relative">
        <p className="text-text-muted text-xs font-mono uppercase tracking-widest opacity-60">
            © 2026 Alternative Solutions // Est. Virginia
        </p>
      </footer>
    </main>
  );
}