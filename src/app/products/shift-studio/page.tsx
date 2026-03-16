/* src/app/products/shift-studio/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap } from 'lucide-react';
import CommandCenterTabs from '@/components/shift-studio/xlg/CommandCenterTabs';
import BottomCta from '@/components/shift-studio/BottomCta';

export default function ShiftStudioPage() {
  const { PRODUCT_NAME, HERO, STATUS } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE;

  return (
    <main className="min-h-screen bg-bg-app font-sans text-white relative pt-32 pb-24 overflow-x-hidden">
      <div className="fixed inset-0 bg-stardust pointer-events-none opacity-20" />
      
      {/* Ambient Color Glows to match the brand */}
      <div className="absolute top-[10%] right-[5%] w-125 h-125 bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[5%] w-150 h-150 bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-400 mx-auto px-6 w-full flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section className="text-center max-w-5xl mx-auto mb-16 pt-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/30 text-[10px] font-mono uppercase tracking-widest text-brand-primary mb-8 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
                <Zap size={12} className="animate-pulse" />
                {STATUS}
            </div>
            
            <h1 className="text-6xl md:text-[8rem] font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 uppercase leading-none mb-6 drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                {PRODUCT_NAME}
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold tracking-widest text-brand-primary uppercase mb-6">
                {HERO.TITLE}
            </h2>
            
            <p className="text-lg md:text-xl text-text-muted font-light max-w-3xl mx-auto leading-relaxed">
                {HERO.SUBHEAD}
            </p>
        </section>

        {/* THE COMMAND CENTER TABS */}
        <div className="mb-24 w-full">
          <CommandCenterTabs />
        </div>
        
        {/* THE UNIVERSAL CHECKOUT (Always visible at the bottom) */}
        <div className="mt-16 w-full max-w-4xl mx-auto">
          <BottomCta />
        </div>
        
      </div>
    </main>
  );
}