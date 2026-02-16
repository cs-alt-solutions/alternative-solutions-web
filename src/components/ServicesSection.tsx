/* src/components/ServicesSection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import ServiceCard from '@/components/ServiceCard';

export default function ServicesSection() {
  const { SERVICES_PAGE } = WEBSITE_COPY;
  const tiers = SERVICES_PAGE.TIERS;

  return (
    <section id="services" className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center md:text-left">
          <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em] mb-4">
             {SERVICES_PAGE.STORY.TITLE}
          </h2>
          <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase max-w-2xl">
             {SERVICES_PAGE.HERO.TITLE}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <ServiceCard 
            TITLE={tiers.ONE.TITLE}
            PRICE={tiers.ONE.PRICE}
            DESC={tiers.ONE.DESC}
            FEATURES={tiers.ONE.FEATURES}
            accent="teal"
          />
          <ServiceCard 
            TITLE={tiers.TWO.TITLE}
            PRICE={tiers.TWO.PRICE}
            DESC={tiers.TWO.DESC}
            FEATURES={tiers.TWO.FEATURES}
            accent="blue"
          />
          <ServiceCard 
            TITLE={tiers.THREE.TITLE}
            PRICE={tiers.THREE.PRICE}
            DESC={tiers.THREE.DESC}
            FEATURES={tiers.THREE.FEATURES}
            accent="purple"
          />
        </div>
      </div>
    </section>
  );
}