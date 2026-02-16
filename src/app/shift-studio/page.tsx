/* src/app/shift-studio/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';
import { Settings, BarChart3, Rocket } from 'lucide-react';

export default function ShiftStudioPage() {
  const { SHIFT_STUDIO_PAGE } = WEBSITE_COPY;
  const { ROADMAP, HERO, STATUS } = SHIFT_STUDIO_PAGE;

  return (
    <main className="min-h-screen flex flex-col bg-bg-app font-sans text-white overflow-x-hidden relative">
      {/* Industrial Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] pointer-events-none" />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-96 bg-brand-primary/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-32 w-full flex flex-col items-center text-center space-y-12">
        
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-mono uppercase tracking-widest text-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <Settings size={12} className="animate-spin-slow" />
          {STATUS}
        </div>

        {/* Hero Section */}
        <div className="space-y-6 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
            {HERO.TITLE}
          </h1>
          <p className="text-lg text-text-muted font-light leading-relaxed">
            {HERO.SUBHEAD}
          </p>
        </div>

        {/* Roadmap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mt-12 text-left">
          {/* Phase 1 Card */}
          <div className="p-8 rounded-xl bg-bg-surface-100 border border-border-subtle hover:border-brand-primary/50 transition-colors group relative overflow-hidden">
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-primary/5 blur-2xl rounded-full group-hover:bg-brand-primary/10 transition-colors" />
             <BarChart3 size={24} className="text-brand-primary mb-6" />
             <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
               {ROADMAP.PHASE_1_TITLE}
             </h3>
             <p className="text-sm text-text-muted leading-relaxed">
               {ROADMAP.PHASE_1_DESC}
             </p>
          </div>

          {/* Phase 2 Card */}
          <div className="p-8 rounded-xl bg-bg-surface-100 border border-border-subtle hover:border-brand-secondary/50 transition-colors group relative overflow-hidden">
             <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-secondary/5 blur-2xl rounded-full group-hover:bg-brand-secondary/10 transition-colors" />
             <Rocket size={24} className="text-brand-secondary mb-6" />
             <h3 className="text-xl font-bold uppercase tracking-tight mb-2 text-white">
               {ROADMAP.PHASE_2_TITLE}
             </h3>
             <p className="text-sm text-text-muted leading-relaxed">
               {ROADMAP.PHASE_2_DESC}
             </p>
          </div>
        </div>

        {/* Lead Capture Module */}
        <div className="mt-20 p-8 md:p-12 w-full max-w-3xl bg-black/40 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col items-center text-center">
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Request Private Access</h2>
          <p className="text-sm text-text-muted mb-8 max-w-md">
            The command center is currently in closed beta. Join the waitlist to secure your spot for the Phase 1 rollout.
          </p>
          <JoinForm source="Shift Studio" />
        </div>

      </div>
    </main>
  );
}