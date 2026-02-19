/* src/components/shift-studio/FaqSection.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { CheckCircle2 } from 'lucide-react';

export default function FaqSection() {
  const { SECTIONS } = WEBSITE_COPY.SHIFT_STUDIO_PAGE;
  const { FAQ } = WEBSITE_COPY.JOIN_PAGE.HYPE;

  return (
    <div className="max-w-2xl mx-auto space-y-8 mb-32">
        <h2 className="text-center text-xl font-bold uppercase tracking-widest text-text-muted">{SECTIONS.FAQ}</h2>
        <div className="space-y-4">
            {FAQ.map((item: any, i: number) => (
                <div key={i} className="bg-bg-surface-100 border border-border-subtle p-6 rounded-lg">
                    <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                         <CheckCircle2 size={16} className="text-brand-primary" /> {item.q}
                    </h4>
                    <p className="text-sm text-text-muted pl-6">{item.a}</p>
                </div>
            ))}
        </div>
    </div>
  );
}