/* src/components/ServicesSection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import ServiceCard from '@/components/ServiceCard';
import JoinForm from '@/components/JoinForm';
import { HardHat, Construction } from 'lucide-react';

export default function ServicesSection() {
  const { SERVICES_PAGE, ACCESS_HOOK } = WEBSITE_COPY;
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

        {/* THE POPPY CONSTRUCTION GATEKEEPER */}
        <div className="mt-32 text-center flex flex-col items-center max-w-3xl mx-auto p-12 rounded-2xl border-2 border-brand-primary/20 bg-black/60 backdrop-blur-xl relative overflow-hidden group shadow-[0_0_50px_rgba(6,182,212,0.1)]">
           
           {/* Industrial Corner Brackets */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-primary opacity-40" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-primary opacity-40" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-primary opacity-40" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-primary opacity-40" />
           
           {/* Top "Caution" Glow Line */}
           <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
           
           <div className="relative mb-6">
              <HardHat size={40} className="text-brand-primary mb-2 animate-bounce" />
              <Construction size={20} className="text-brand-primary/40 absolute -right-4 -bottom-1" />
           </div>
           
           <h4 className="text-3xl font-black uppercase tracking-widest text-white mb-4 italic">
             {ACCESS_HOOK.TITLE}
           </h4>
           
           <p className="text-sm text-text-muted mb-10 leading-relaxed max-w-xl mx-auto font-mono uppercase tracking-tight">
             {ACCESS_HOOK.SUBHEAD}
           </p>
           
           <div className="w-full relative z-20">
             <JoinForm source="Restricted Access" />
           </div>

           {/* Animated Background Mesh */}
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#06b6d405_0%,transparent_70%)] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}