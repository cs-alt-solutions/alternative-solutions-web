/* src/components/home/Methodology.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Search, GitBranch, Rocket } from 'lucide-react';

export default function Methodology() {
  const { METHODOLOGY } = WEBSITE_COPY.PUBLIC_SITE.HOME;
  const icons = [Search, GitBranch, Rocket];

  return (
    <section className="mb-32 px-6 relative max-w-7xl mx-auto z-10">
      <div className="text-center mb-16">
        <div className="inline-block px-4 py-1.5 rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-xs font-mono text-fuchsia-400 uppercase tracking-[0.3em] mb-6 shadow-[0_0_15px_rgba(232,121,249,0.15)]">
          {METHODOLOGY.TAG}
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
          {METHODOLOGY.TITLE}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* FIX 3: bg-linear-to-r */}
        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-linear-to-r from-transparent via-white/10 to-transparent z-0" />
        
        {METHODOLOGY.STEPS.map((step: any, index: number) => {
          const Icon = icons[index];
          return (
            <div key={index} className="relative z-10 bg-bg-surface-200/50 border border-white/5 p-8 rounded-2xl backdrop-blur-sm group hover:border-brand-primary/30 transition-all shadow-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-black/80 border border-white/10 rounded-full flex items-center justify-center mb-6 group-hover:text-brand-primary transition-colors shadow-inner">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-tight mb-4 group-hover:text-brand-primary transition-colors">
                {step.title}
              </h3>
              <p className="text-sm text-text-muted font-light leading-relaxed">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}