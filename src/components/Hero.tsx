/* src/components/Hero.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { HERO } = WEBSITE_COPY;

  return (
    <section className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center min-h-[80vh]">
      {/* Stardust Background */}
      <div className="absolute inset-0 bg-stardust pointer-events-none" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-brand-accent mb-4">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          System Operational
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
          {HERO.TITLE}
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
          {HERO.SUBHEAD}
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
           {/* UPDATED: Route to Services to keep the Agency funnel pure */}
           <Link href="/#services" className="btn-brand px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
             {HERO.CTA_SECONDARY} <ArrowRight size={16} />
           </Link>
        </div>
      </div>
    </section>
  );
}