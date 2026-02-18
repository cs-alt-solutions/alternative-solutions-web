/* src/components/Hero.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function Hero() {
  const { HERO } = WEBSITE_COPY;

  return (
    <div className="relative z-10 w-full flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in duration-1000 slide-in-from-bottom-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-brand-primary/20 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
          {HERO.TITLE}
        </h1>
        
        <p className="text-lg md:text-xl text-text-muted font-light leading-relaxed max-w-2xl mx-auto">
          {HERO.SUBHEAD}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link href="#services" className="btn-brand px-8 py-4 rounded-lg w-full sm:w-auto uppercase tracking-widest text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all">
            {HERO.CTA_PRIMARY}
          </Link>
          <Link href="#origin" className="px-8 py-4 rounded-lg w-full sm:w-auto uppercase tracking-widest text-sm font-bold text-white border border-white/10 hover:bg-white/5 transition-all">
            {HERO.CTA_SECONDARY}
          </Link>
        </div>
      </div>
    </div>
  );
}