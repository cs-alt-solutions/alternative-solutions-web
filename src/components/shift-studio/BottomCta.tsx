/* src/components/shift-studio/BottomCta.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import JoinForm from '@/components/JoinForm';

export default function BottomCta() {
  const { BOTTOM_CTA } = WEBSITE_COPY.SHIFT_STUDIO_PAGE;

  return (
    <div className="p-8 md:p-12 w-full max-w-3xl mx-auto bg-bg-surface-100/50 border border-border-subtle rounded-2xl backdrop-blur-md flex flex-col items-center text-center">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-4">{BOTTOM_CTA.TITLE}</h2>
      <p className="text-sm text-text-muted mb-8 max-w-md">
        {BOTTOM_CTA.DESC}
      </p>
      <JoinForm source="Shift Studio" />
    </div>
  );
}