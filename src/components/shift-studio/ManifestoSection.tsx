/* src/components/shift-studio/ManifestoSection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function ManifestoSection() {
  const { SHIFT_STUDIO_PAGE, JOIN_PAGE } = WEBSITE_COPY;
  const { SECTIONS } = SHIFT_STUDIO_PAGE;
  const { MANIFESTO } = JOIN_PAGE.HYPE;

  return (
    <div className="mb-32 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-sm font-mono text-brand-secondary uppercase tracking-[0.3em]">{SECTIONS.PHILOSOPHY}</h2>
        <h3 className="text-3xl md:text-5xl font-black uppercase leading-tight">
            {MANIFESTO.TITLE}
        </h3>
        <p className="text-xl text-text-muted font-light leading-relaxed">
            "{MANIFESTO.TEXT}"
        </p>
    </div>
  );
}