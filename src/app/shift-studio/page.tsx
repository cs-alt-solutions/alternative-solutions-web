/* src/app/shift-studio/page.tsx */
import React from 'react';
/* FIXED: Up two levels to reach src/utils/ */
import { WEBSITE_COPY } from '../../utils/glossary'; 
import { Timer, Rocket, Lock, Mail } from 'lucide-react';

export default function ShiftStudioInfo() {
  return (
    <main className="min-h-screen bg-bg-app flex flex-col items-center justify-center py-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-brand-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl w-full text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-mono mb-8 uppercase tracking-widest">
          <Lock size={12} /> {WEBSITE_COPY.SHIFT_STUDIO_PAGE.STATUS}
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter mb-6 uppercase leading-[0.9]">
          {WEBSITE_COPY.SHIFT_STUDIO_PAGE.HERO.TITLE}
        </h1>
        
        <p className="text-xl text-text-muted mb-16 max-w-2xl mx-auto leading-relaxed font-light">
          {WEBSITE_COPY.SHIFT_STUDIO_PAGE.HERO.SUBHEAD}
        </p>

        {/* Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20 text-left">
           <div className="p-8 rounded-xl border border-white/5 bg-white/2 group hover:border-brand-primary/30 transition-colors">
              <Rocket className="text-brand-accent mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Phase 1: Foundation</h3>
              <p className="text-sm text-text-muted leading-relaxed">Finalizing core SEO and Inventory engines. Release: Q2 2026.</p>
           </div>
           <div className="p-8 rounded-xl border border-white/5 bg-white/2 group hover:border-brand-secondary/30 transition-colors">
              <Timer className="text-brand-secondary mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-bold text-white mb-2 uppercase tracking-tight">Phase 2: AI Integration</h3>
              <p className="text-sm text-text-muted leading-relaxed">Connecting the generative copy engine for your unique voice.</p>
           </div>
        </div>

        {/* Waitlist */}
        <div className="bg-linear-to-b from-white/5 to-transparent p-12 rounded-3xl border border-white/10">
          <Mail className="mx-auto text-brand-primary mb-4" size={32} />
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tight font-mono">Secure Your Beta Spot</h2>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mt-8">
            <input 
              type="email" 
              placeholder="ENTER EMAIL ADDRESS" 
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-6 py-4 text-white font-mono text-xs focus:outline-none focus:border-brand-primary transition-colors"
            />
            <button className="btn-brand whitespace-nowrap">Join Waitlist</button>
          </div>
        </div>
      </div>
    </main>
  );
}