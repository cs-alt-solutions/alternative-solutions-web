/* src/components/Hero.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const { HERO } = WEBSITE_COPY;

  return (
    <section className="relative w-full py-12">
      {/* Glowing Orb - Toned down for the split layout */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-brand-accent mb-4">
          <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
          System Operational
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
          {HERO.TITLE}
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed max-w-lg">
          {HERO.SUBHEAD}
        </p>

        <div className="flex items-center gap-4 pt-4">
           <Link href="/#services" className="btn-brand px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3 w-fit">
             {HERO.CTA_SECONDARY} <ArrowRight size={16} />
           </Link>
        </div>
      </div>
    </section>
  );
}