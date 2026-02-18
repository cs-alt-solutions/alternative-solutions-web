/* src/components/HowWeWork.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Search, Zap, Cuboid } from 'lucide-react';

export default function HowWeWork() {
  const { HOW_IT_WORKS } = WEBSITE_COPY;
  
  return (
    <section className="py-32 px-6 bg-bg-app relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em] mb-4">
            {HOW_IT_WORKS.SUBTITLE}
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            {HOW_IT_WORKS.TITLE}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-[1px] bg-linear-to-r from-transparent via-brand-primary/30 to-transparent" />

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500">
              <Search size={32} className="text-brand-primary/60 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-4">{HOW_IT_WORKS.STEP_1.TITLE}</h4>
            <p className="text-text-muted leading-relaxed max-w-sm">{HOW_IT_WORKS.STEP_1.DESC}</p>
          </div>

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500">
              <Zap size={32} className="text-brand-primary/60 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-4">{HOW_IT_WORKS.STEP_2.TITLE}</h4>
            <p className="text-text-muted leading-relaxed max-w-sm">{HOW_IT_WORKS.STEP_2.DESC}</p>
          </div>

          <div className="relative flex flex-col items-center text-center group">
            <div className="w-24 h-24 rounded-full bg-black border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:border-brand-primary/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] transition-all duration-500">
              <Cuboid size={32} className="text-brand-primary/60 group-hover:text-brand-primary transition-colors" />
            </div>
            <h4 className="text-xl font-bold text-white uppercase tracking-wider mb-4">{HOW_IT_WORKS.STEP_3.TITLE}</h4>
            <p className="text-text-muted leading-relaxed max-w-sm">{HOW_IT_WORKS.STEP_3.DESC}</p>
          </div>
        </div>
      </div>
    </section>
  );
}