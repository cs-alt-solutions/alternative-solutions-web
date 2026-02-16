/* src/components/AgencyHook.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';

export default function AgencyHook() {
  const { AGENCY_HOOK } = WEBSITE_COPY;

  return (
    <section className="py-32 px-6 relative flex justify-center">
      <div className="w-full max-w-5xl bg-bg-surface-100 border border-brand-primary/20 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
        
        {/* Core Glow FX */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-full bg-brand-primary/5 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 space-y-6 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            {AGENCY_HOOK.TITLE}
          </h2>
          <p className="text-lg text-text-muted max-w-2xl mx-auto font-light leading-relaxed">
            {AGENCY_HOOK.SUBHEAD}
          </p>
          
          <div className="pt-8 w-full max-w-md">
            {/* The Magic: We route this specific form to flag as an Agency Inquiry */}
            <JoinForm source="Agency Inquiry" />
          </div>
        </div>
        
      </div>
    </section>
  );
}