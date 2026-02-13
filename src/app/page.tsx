/* src/app/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import Mission from '@/components/Mission';
import HowWeWork from '@/components/HowWeWork';
import ServiceCard from '@/components/ServiceCard';

export default function Home() {
  const tiers = [
    { ...WEBSITE_COPY.SERVICES_PAGE.TIERS.ONE, accent: "teal" },
    { ...WEBSITE_COPY.SERVICES_PAGE.TIERS.TWO, accent: "blue" },
    { ...WEBSITE_COPY.SERVICES_PAGE.TIERS.THREE, accent: "purple" },
  ];

  return (
    <main className="flex flex-col min-h-screen relative">
      <section className="relative pt-32 pb-24 px-6 text-center z-10">
        <div className="max-w-7xl mx-auto">
            <h1 className="text-6xl md:text-9xl font-black tracking-tighter mb-8 text-white leading-[0.9]">
              {WEBSITE_COPY.HERO.TITLE.split(' ')[0]} <br />
              <span className="text-gradient-cyan">{WEBSITE_COPY.HERO.TITLE.split(' ').slice(1).join(' ')}</span>
            </h1>
            <p className="text-xl md:text-2xl text-text-muted max-w-3xl mx-auto mb-14 leading-relaxed font-light">
              {WEBSITE_COPY.HERO.SUBHEAD}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/shift-studio" className="btn-brand">{WEBSITE_COPY.HERO.CTA_PRIMARY}</Link>
              <Link href="/services" className="btn-secondary">{WEBSITE_COPY.HERO.CTA_SECONDARY}</Link>
            </div>
        </div>
      </section>

      <Mission />

      <section className="py-32 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => (
              <ServiceCard key={idx} {...tier} />
            ))}
          </div>
        </div>
      </section>

      <HowWeWork />
    </main>
  );
}