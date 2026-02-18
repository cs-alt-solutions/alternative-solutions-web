/* src/app/architect/page.tsx */
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Mic, Activity, Rocket, Zap } from 'lucide-react';

export default function ArchitectPage() {
  const { ARCHITECT_PAGE } = WEBSITE_COPY;
  const { HERO, MANIFESTO, CATEGORIES, TRACKER } = ARCHITECT_PAGE;

  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white">
      <Navbar />
      
      <section className="pt-40 pb-20 px-6 relative border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#06b6d415_0%,transparent_70%)] pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center p-4 rounded-full bg-brand-primary/10 mb-8 border border-brand-primary/20">
            <Mic size={32} className="text-brand-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight uppercase mb-6">
            {HERO.TITLE}
          </h1>
          <p className="text-xl font-mono text-brand-secondary tracking-widest uppercase">
            {HERO.SUBTITLE}
          </p>
        </div>
      </section>

      <section className="py-24 px-6 bg-black/40 border-b border-white/5 relative">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-12 h-1 bg-brand-primary rounded-full" />
            <h2 className="text-3xl font-black uppercase tracking-widest">{MANIFESTO.TITLE}</h2>
          </div>
          
          <div className="space-y-8 text-text-muted text-lg leading-relaxed font-light">
            {MANIFESTO.PARAGRAPHS.map((paragraph: string, index: number) => (
              <p key={index} className={index === 2 ? "pl-6 border-l-2 border-brand-primary/50 text-white/90 italic" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 flex-grow relative">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-white/10 pb-8">
            <div>
              <h3 className="text-3xl font-black uppercase tracking-widest mb-2">{TRACKER.TITLE}</h3>
              <p className="text-text-muted font-mono text-sm uppercase tracking-widest">{TRACKER.SUBTITLE}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 rounded-full border border-brand-primary text-brand-primary text-xs font-mono uppercase tracking-widest bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors">
                {TRACKER.FILTERS.ALL}
              </button>
              <button className="px-4 py-2 rounded-full border border-white/10 text-text-muted hover:text-white text-xs font-mono uppercase tracking-widest hover:border-white/30 transition-colors flex items-center gap-2">
                <Rocket size={14} /> {CATEGORIES.BUILD}
              </button>
              <button className="px-4 py-2 rounded-full border border-white/10 text-text-muted hover:text-white text-xs font-mono uppercase tracking-widest hover:border-white/30 transition-colors flex items-center gap-2">
                <Zap size={14} /> {CATEGORIES.HUSTLE}
              </button>
              <button className="px-4 py-2 rounded-full border border-white/10 text-text-muted hover:text-white text-xs font-mono uppercase tracking-widest hover:border-white/30 transition-colors flex items-center gap-2">
                <Activity size={14} /> {CATEGORIES.EVOLUTION}
              </button>
            </div>
          </div>

          <div className="space-y-8 relative">
            <div className="absolute top-0 bottom-0 left-[23px] w-px bg-white/10 hidden md:block" />

            <div className="relative pl-0 md:pl-16">
              <div className="absolute left-[-5px] md:left-[19px] top-6 w-3 h-3 rounded-full bg-brand-primary shadow-[0_0_10px_rgba(6,182,212,0.5)] hidden md:block" />
              
              <div className="bg-white/5 border border-white/10 rounded-xl p-8 backdrop-blur-sm animate-pulse">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xs font-mono text-brand-primary uppercase tracking-widest bg-brand-primary/10 px-3 py-1 rounded-full">{TRACKER.PLACEHOLDER.TAG}</span>
                  <span className="text-xs font-mono text-text-muted">{TRACKER.PLACEHOLDER.DATE}</span>
                </div>
                <h4 className="text-xl font-bold uppercase tracking-tight mb-3 text-white/50">{TRACKER.PLACEHOLDER.TITLE}</h4>
                <p className="text-text-muted leading-relaxed">{TRACKER.PLACEHOLDER.DESC}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}