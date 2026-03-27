/* src/components/home/FlagshipFeature.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { ArrowRight, Zap, Database } from 'lucide-react';

export default function FlagshipFeature() {
  const { FLAGSHIP } =  WEBSITE_COPY.HOME;

  return (
    <section className="mb-24 px-6 animate-in fade-in duration-1000 delay-300">
      <Link 
        href={FLAGSHIP.LINK}
        className="block relative bg-brand-primary/10 border border-brand-primary/40 hover:border-brand-primary/70 rounded-3xl p-10 md:p-16 overflow-hidden transition-all duration-500 group shadow-[inset_0_0_40px_rgba(6,182,212,0.1),0_0_40px_rgba(6,182,212,0.15)] hover:shadow-[inset_0_0_80px_rgba(6,182,212,0.2),0_0_80px_rgba(6,182,212,0.4)]"
      >
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/30 rounded-full blur-[120px] group-hover:bg-brand-primary/40 transition-colors duration-700 pointer-events-none" />
        
        {/* Background Watermark Icon */}
        <Database 
          size={350} 
          className="absolute -right-10 -bottom-20 text-brand-primary/10 group-hover:text-brand-primary/20 transition-all duration-700 transform -rotate-12 pointer-events-none" 
        />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-brand-primary/20 text-[10px] font-mono font-bold text-brand-primary uppercase tracking-widest mb-6 border border-brand-primary/50 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Zap size={14} className="animate-pulse" /> {FLAGSHIP.TAG}
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
              {FLAGSHIP.TITLE}
            </h2>
            <p className="text-lg text-slate-300 font-light max-w-xl relative z-20">
              {FLAGSHIP.DESC}
            </p>
          </div>
          
          <div className="shrink-0 relative z-20">
            <div className="btn-brand flex items-center gap-3 px-8 py-4 text-xs shadow-[0_0_30px_rgba(6,182,212,0.5)]">
              {FLAGSHIP.CTA} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}