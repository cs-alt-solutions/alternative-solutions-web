/* src/app/page.tsx */
import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import Mission from '@/components/Mission';
import HowWeWork from '@/components/HowWeWork';
import ServiceCard from '@/components/ServiceCard';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { HERO, SERVICES_PAGE } = WEBSITE_COPY;
  const tiers = SERVICES_PAGE.TIERS;

  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 md:px-12 flex flex-col items-center justify-center text-center min-h-[80vh]">
        {/* Background Grid Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
        
        {/* Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono uppercase tracking-widest text-brand-accent mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse"></span>
            System Operational
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
            {HERO.TITLE}
          </h1>
          
          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            {HERO.SUBHEAD}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
             <Link href="/dashboard/waitlist" className="btn-brand px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-3">
               {HERO.CTA_PRIMARY} <ArrowRight size={16} />
             </Link>
             <Link href="#services" className="px-8 py-4 rounded border border-white/10 hover:bg-white/5 text-xs font-bold uppercase tracking-[0.2em] transition-colors text-white">
               {HERO.CTA_SECONDARY}
             </Link>
          </div>
        </div>
      </section>

      {/* --- MISSION --- */}
      <Mission />

      {/* --- HOW WE WORK --- */}
      <HowWeWork />

      {/* --- SERVICES --- */}
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

      {/* --- FOOTER --- */}
      <footer className="py-12 px-6 border-t border-white/5 bg-black/20 text-center">
        <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
          © {new Date().getFullYear()} Alternative Solutions. Built by Humans.
        </p>
      </footer>

    </main>
  );
}