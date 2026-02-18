/* src/components/ServicesSection.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import ServiceCard from '@/components/ServiceCard';
import { ArrowUpRight } from 'lucide-react';

export default function ServicesSection() {
  const { SERVICES_PAGE, PRODUCT_TEASER } = WEBSITE_COPY;
  const tiers = SERVICES_PAGE.TIERS;

  return (
    <section id="services" className="py-32 px-6 relative border-t border-white/5 bg-black/20">
      <div className="max-w-7xl mx-auto relative z-10">
        
        <div className="mb-20 text-center md:text-left max-w-3xl">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-32">
          <ServiceCard TITLE={tiers.ONE.TITLE} PRICE={tiers.ONE.PRICE} DESC={tiers.ONE.DESC} FEATURES={tiers.ONE.FEATURES} index="01" />
          <ServiceCard TITLE={tiers.TWO.TITLE} PRICE={tiers.TWO.PRICE} DESC={tiers.TWO.DESC} FEATURES={tiers.TWO.FEATURES} index="02" />
          <ServiceCard TITLE={tiers.THREE.TITLE} PRICE={tiers.THREE.PRICE} DESC={tiers.THREE.DESC} FEATURES={tiers.THREE.FEATURES} index="03" />
        </div>

        <div className="w-full bg-linear-to-r from-brand-primary/10 via-black to-transparent border border-white/10 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 rounded-full blur-[80px] group-hover:bg-brand-primary/20 transition-colors duration-700" />
          
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h4 className="text-sm font-mono text-brand-secondary uppercase tracking-widest mb-3">{PRODUCT_TEASER.TAG}</h4>
            <h5 className="text-3xl font-black text-white uppercase tracking-tight mb-4">{PRODUCT_TEASER.TITLE}</h5>
            <p className="text-text-muted leading-relaxed">{PRODUCT_TEASER.DESC}</p>
          </div>
          
          <div className="relative z-10 shrink-0">
            <Link href="/shift-studio" className="flex items-center gap-2 text-white hover:text-brand-primary transition-colors font-mono text-xs uppercase tracking-widest px-6 py-3 border border-white/20 hover:border-brand-primary/50 rounded-lg backdrop-blur-md">
              {PRODUCT_TEASER.LINK_TEXT}
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}