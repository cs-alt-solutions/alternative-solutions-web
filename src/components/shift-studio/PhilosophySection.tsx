/* src/components/shift-studio/PhilosophySection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function PhilosophySection() {
  const { PHILOSOPHY } = WEBSITE_COPY.PUBLIC_SITE.SHIFT_STUDIO_PAGE.SECTORS;

  return (
    <div className="mb-32 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em]">{PHILOSOPHY.TAG}</h2>
        <h3 className="text-3xl md:text-5xl font-black uppercase leading-tight text-white">
            {PHILOSOPHY.TITLE}
        </h3>
        <p className="text-xl text-text-muted font-light leading-relaxed">
            "{PHILOSOPHY.DESC}"
        </p>
    </div>
  );
}