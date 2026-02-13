/* src/app/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

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
        <div className="max-w-350 mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-brand-primary rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
            <span className="font-bold text-lg tracking-tight text-white">ALTERNATIVE SOLUTIONS</span>
          </div>
          <div className="hidden md:flex gap-8">
            <Link href="/consulting" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">Services</Link>
            <Link href="/shift-studio" className="text-xs font-mono text-text-muted hover:text-brand-accent transition-colors uppercase tracking-widest">Shift Studio</Link>
          </div>
          <Link href="/login" className="px-5 py-2 rounded-full text-xs font-bold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors uppercase tracking-wide">
            Client Portal
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 text-center z-10">
        <div className="max-w-7xl mx-auto">
            
            {/* Softened Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-brand-primary/20 bg-brand-primary/5 mb-10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_#06b6d4]" />
              <span className="text-xs text-brand-accent font-mono tracking-[0.2em] uppercase">Now Available</span>
            </div>

            {/* Clear, Big Headline */}
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
              SMARTER <br />
              <span className="text-gradient-cyan">BUSINESS SYSTEMS.</span>
            </h1>

            {/* Human Subhead */}
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-14 leading-relaxed font-light">
              {WEBSITE_COPY.HERO.SUBHEAD}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/shift-studio" className="btn-brand">
                {WEBSITE_COPY.HERO.CTA_PRIMARY}
              </Link>
              <Link href="/consulting" className="btn-secondary">
                {WEBSITE_COPY.HERO.CTA_SECONDARY}
              </Link>
            </div>
        </div>
      </section>

      {/* --- THE SERVICE BENTO GRID --- */}
      <section className="px-6 pb-32 z-10 relative">
        <div className="max-w-350 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(250px,auto)]">
              
              {/* 1. SHIFT STUDIO (Flagship) */}
              <div className="md:col-span-7 card-bento group flex flex-col justify-between min-h-112.5">
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-3 text-white">Shift Studio</h3>
                  <p className="text-text-muted text-lg max-w-md">
                    The simple operating system for makers. Track inventory, manage recipes, and see your profit in one place.
                  </p>
                </div>
                {/* Visual UI */}
                <div className="mt-12 relative w-full h-64 bg-bg-app border-t border-l border-border-subtle rounded-tl-xl overflow-hidden opacity-90 group-hover:opacity-100 transition-opacity ml-8 translate-x-4 shadow-2xl">
                   <div className="absolute top-0 left-0 w-full h-10 bg-bg-surface-200 border-b border-border-subtle flex items-center px-4 gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                   </div>
                   <div className="p-6 grid grid-cols-3 gap-4 mt-10">
                      <div className="h-20 bg-brand-primary/10 rounded border border-brand-primary/20" />
                      <div className="h-20 bg-bg-surface-200 rounded" />
                      <div className="h-20 bg-bg-surface-200 rounded" />
                   </div>
                </div>
                <div className="absolute inset-0 bg-linear-to-tr from-brand-primary/5 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* 2. CUSTOM SOFTWARE (Full Build) */}
              <div className="md:col-span-5 card-bento group relative overflow-hidden flex flex-col justify-center">
                 <div className="relative z-10">
                    <div className="w-12 h-12 rounded-lg bg-bg-surface-200 flex items-center justify-center mb-6 text-brand-secondary border border-border-subtle">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                    </div>
                    <h3 className="text-3xl font-bold mb-3 text-white">{WEBSITE_COPY.SERVICES.TIER_3.TITLE}</h3>
                    <p className="text-text-muted text-lg mb-8">
                      {WEBSITE_COPY.SERVICES.TIER_3.DESC}
                    </p>
                    <Link href="/consulting" className="inline-flex items-center text-white text-sm font-bold uppercase tracking-widest hover:text-brand-accent transition-colors border-b border-transparent hover:border-brand-accent pb-1">
                      Start Project <span className="ml-2">→</span>
                    </Link>
                 </div>
                 <div className="absolute top-0 right-0 w-full h-full bg-linear-to-bl from-brand-secondary/5 to-transparent pointer-events-none" />
              </div>

              {/* 3. TIME-SAVING TOOLS (Small Jobs) */}
              <div className="md:col-span-6 card-bento group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-surface-200 flex items-center justify-center text-brand-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <span className="text-[10px] font-mono border border-border-subtle px-2 py-1 rounded text-text-muted uppercase">
                        {WEBSITE_COPY.SERVICES.TIER_1.TAG}
                    </span>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2">{WEBSITE_COPY.SERVICES.TIER_1.TITLE}</h4>
                 <p className="text-text-muted text-sm leading-relaxed">
                    {WEBSITE_COPY.SERVICES.TIER_1.DESC}
                 </p>
              </div>

              {/* 4. CONNECTING APPS (Integrations) */}
              <div className="md:col-span-6 card-bento group">
                 <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-lg bg-bg-surface-200 flex items-center justify-center text-brand-secondary">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </div>
                    <span className="text-[10px] font-mono border border-border-subtle px-2 py-1 rounded text-text-muted uppercase">
                        {WEBSITE_COPY.SERVICES.TIER_2.TAG}
                    </span>
                 </div>
                 <h4 className="text-xl font-bold text-white mb-2">{WEBSITE_COPY.SERVICES.TIER_2.TITLE}</h4>
                 <p className="text-text-muted text-sm leading-relaxed">
                    {WEBSITE_COPY.SERVICES.TIER_2.DESC}
                 </p>
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