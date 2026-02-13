/* src/app/shift-studio/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap, BarChart3, PenTool } from 'lucide-react';

export default function ShiftStudio() {
  const features = [
    { ...WEBSITE_COPY.SHIFT_STUDIO_PAGE.FEATURES.ONE, Icon: Zap, color: "text-brand-primary" },
    { ...WEBSITE_COPY.SHIFT_STUDIO_PAGE.FEATURES.TWO, Icon: BarChart3, color: "text-brand-accent" },
    { ...WEBSITE_COPY.SHIFT_STUDIO_PAGE.FEATURES.THREE, Icon: PenTool, color: "text-brand-secondary" },
  ];

  return (
    <main className="min-h-screen bg-bg-app">
      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden text-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-[10px] font-mono text-brand-accent border border-brand-accent/30 px-3 py-1 rounded-sm uppercase tracking-[0.3em] mb-8 inline-block">
            Status: Private Beta
          </span>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-8 uppercase leading-[0.85]">
            {WEBSITE_COPY.SHIFT_STUDIO_PAGE.HERO.TITLE}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed mb-12">
            {WEBSITE_COPY.SHIFT_STUDIO_PAGE.HERO.SUBHEAD}
          </p>
          <button className="btn-brand">Initialize Early Access</button>
        </div>
      </section>

      {/* --- FEATURES GRID --- */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div key={idx} className="p-10 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 transition-all duration-500 group">
              <div className={`mb-8 ${feature.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                <feature.Icon size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xs font-mono text-white mb-4 uppercase tracking-[0.2em]">{feature.TITLE}</h3>
              <p className="text-text-muted font-light leading-loose text-sm italic">&ldquo;{feature.DESC}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}