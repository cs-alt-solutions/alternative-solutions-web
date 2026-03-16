/* src/components/shift-studio/BottomCta.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import PricingCard from '@/components/core/PricingCard';

export default function BottomCta() {
  const { FOUNDING_MEMBER } = WEBSITE_COPY;

  return (
    <div className="p-8 md:p-12 w-full max-w-3xl mx-auto bg-brand-primary/5 border border-brand-primary/20 rounded-2xl backdrop-blur-md flex flex-col items-center text-center shadow-[0_0_30px_rgba(6,182,212,0.05)]">
      <h2 className="text-2xl font-black uppercase tracking-tight mb-4 text-white">
        {FOUNDING_MEMBER.TITLE}
      </h2>
      <p className="text-sm text-text-muted mb-8 max-w-md leading-relaxed">
        {FOUNDING_MEMBER.DESC}
      </p>
      
      {/* We removed the warningText prop here! */}
      <PricingCard 
        minAmount={5}
        stripeLink={FOUNDING_MEMBER.STRIPE_LINK}
        btnText={FOUNDING_MEMBER.BTN_TEXT}
      />
      
    </div>
  );
}