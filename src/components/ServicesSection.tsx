/* src/components/ServicesSection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import ServiceCard from '@/components/ServiceCard';
import JoinForm from '@/components/JoinForm'; // Ensure this is imported
import { Lock } from 'lucide-react';

export default function ServicesSection() {
  const { SERVICES_PAGE, ACCESS_HOOK } = WEBSITE_COPY; // Correctly pulling ACCESS_HOOK
  const tiers = SERVICES_PAGE.TIERS;

  return (
    <section id="services" className="py-32 px-6 relative border-t border-white/5 bg-bg-app">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-24 md:flex md:items-end md:justify-between gap-12 text-center md:text-left">
          <div className="max-w-3xl">
            <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em] mb-4">
               {SERVICES_PAGE.STORY.TITLE}
            </h2>
            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-6">
               {SERVICES_PAGE.HERO.TITLE}
            </h3>
            <p className="text-lg text-text-muted font-light leading-relaxed">
               {SERVICES_PAGE.STORY.DESC}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ServiceCard TITLE={tiers.ONE.TITLE} PRICE={tiers.ONE.PRICE} DESC={tiers.ONE.DESC} FEATURES={tiers.ONE.FEATURES} index="01" />
          <ServiceCard TITLE={tiers.TWO.TITLE} PRICE={tiers.TWO.PRICE} DESC={tiers.TWO.DESC} FEATURES={tiers.TWO.FEATURES} index="02" />
          <ServiceCard TITLE={tiers.THREE.TITLE} PRICE={tiers.THREE.PRICE} DESC={tiers.THREE.DESC} FEATURES={tiers.THREE.FEATURES} index="03" />
        </div>

        {/* THE NEW GATEKEEPER - Using "ACCESS_HOOK" */}
        <div className="mt-32 text-center flex flex-col items-center max-w-3xl mx-auto p-12 rounded-2xl border border-white/5 bg-black/40 backdrop-blur-sm relative overflow-hidden group shadow-2xl">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-brand-primary/50 blur-sm group-hover:bg-brand-primary transition-colors duration-500" />
           
           <Lock size={32} className="text-brand-primary/50 mb-6 group-hover:text-brand-primary transition-colors duration-300" />
           
           <h4 className="text-2xl font-black uppercase tracking-widest text-white mb-4">
             {ACCESS_HOOK.TITLE}
           </h4>
           
           <p className="text-sm text-text-muted mb-10 leading-relaxed max-w-xl mx-auto">
             {ACCESS_HOOK.SUBHEAD}
           </p>
           
           <div className="w-full relative z-20">
             {/* Using the updated JoinForm with 'Restricted Access' source */}
             <JoinForm source="Restricted Access" />
           </div>
        </div>
      </div>
    </section>
  );
}