/* src/app/services/page.tsx */
import React from 'react';
/* FIXED: Up two levels to reach src/utils/ */
import { WEBSITE_COPY } from '../../utils/glossary'; 
/* FIXED: Up two levels to reach src/components/ */
import ServiceCard from '../../components/ServiceCard'; 
import { ShieldCheck, Zap, Globe, MessageSquare } from 'lucide-react';

export default function ServicesPage() {
  const tiers = [
    { ...WEBSITE_COPY.SERVICES_PAGE.TIERS.ONE, accent: "teal", Icon: Zap },
    { ...WEBSITE_COPY.SERVICES_PAGE.TIERS.TWO, accent: "blue", Icon: Globe },
    { ...WEBSITE_COPY.SERVICES_PAGE.TIERS.THREE, accent: "purple", Icon: ShieldCheck },
  ];

  return (
    <main className="min-h-screen bg-bg-app">
      {/* --- HERO SECTION --- */}
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase leading-tight">
            {WEBSITE_COPY.SERVICES_PAGE.HERO.TITLE}
          </h1>
          <p className="text-xl text-text-muted max-w-2xl leading-relaxed font-light">
            {WEBSITE_COPY.SERVICES_PAGE.HERO.SUBTITLE}
          </p>
        </div>
      </section>

      {/* --- THE STORY SECTION --- */}
      <section className="py-24 px-6 border-y border-border-subtle bg-white/2">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
             <h2 className="text-xs font-mono text-brand-accent uppercase tracking-[0.4em] mb-6">
               {WEBSITE_COPY.SERVICES_PAGE.STORY.TITLE}
             </h2>
             <p className="text-lg text-text-muted font-light leading-loose italic border-l-2 border-brand-primary pl-8">
               &ldquo;{WEBSITE_COPY.SERVICES_PAGE.STORY.DESC}&rdquo;
             </p>
          </div>
          <div className="aspect-video bg-linear-to-br from-brand-primary/20 to-brand-accent/20 rounded-2xl border border-white/10 flex items-center justify-center relative group overflow-hidden">
             <div className="absolute inset-0 bg-size-[24px_24px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)]" />
             <div className="relative z-10 text-center text-white/40 font-mono text-[10px] uppercase tracking-[0.5em]">
                Architecture Optimization v4.0
             </div>
          </div>
        </div>
      </section>

      {/* --- SERVICES GRID --- */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <div key={idx} className="relative group">
                <ServiceCard 
                  TITLE={tier.TITLE} 
                  PRICE={tier.PRICE} 
                  DESC={tier.DESC} 
                  accent={tier.accent} 
                />
                <div className="absolute top-6 right-6 text-white/5 group-hover:text-brand-primary/20 transition-colors">
                  <tier.Icon size={48} strokeWidth={1} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section className="py-32 px-6 bg-white/2 border-t border-border-subtle">
        <div className="max-w-3xl mx-auto text-center">
          <MessageSquare className="mx-auto text-brand-primary mb-6" size={40} />
          <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-tight">Ready to build your alternative?</h3>
          <p className="text-text-muted mb-10 font-light">Stop fighting with spreadsheets. Let's build a foundation that scales with your vision.</p>
          <button className="btn-brand text-lg px-12 py-4">Schedule a Strategy Session</button>
        </div>
      </section>
    </main>
  );
}