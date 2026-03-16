/* src/components/core/PricingCard.tsx */
'use client';

import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap, ArrowRight } from 'lucide-react';

interface PricingCardProps {
  minAmount: number;
  stripeLink: string;
  btnText: string;
}

export default function PricingCard({
  minAmount,
  stripeLink,
  btnText,
}: PricingCardProps) {
  const { FOUNDING_MEMBER } = WEBSITE_COPY;

  const handleJoin = () => {
    window.location.href = `${stripeLink}?prefilled_amount=${minAmount * 100}`;
  };

  return (
    <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 text-left">
        
        <div className="flex flex-col items-center justify-center pt-2 pb-1 border-b border-white/5">
          <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-1">
            {FOUNDING_MEMBER.FUTURE_LABEL}
          </span>
          <span className="text-xl font-mono text-white/30 line-through decoration-red-500/50">
            {FOUNDING_MEMBER.FUTURE_PRICE} / month
          </span>
        </div>

        <div className="space-y-1.5 mt-2">
          <label className="text-[10px] font-mono text-brand-primary uppercase tracking-widest pl-2">
            YOUR LOCKED LEGACY RATE
          </label>
          
          <div className="w-full bg-black/50 border border-brand-primary/40 rounded-lg py-6 text-center shadow-[inset_0_0_20px_rgba(6,182,212,0.05)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50"></div>
            <span className="text-5xl font-black text-white">${minAmount}</span>
            <span className="text-sm font-mono text-brand-primary uppercase tracking-widest ml-2">/ month</span>
          </div>
        </div>

        <button 
          onClick={handleJoin}
          className="btn-brand flex items-center justify-center gap-3 py-4 rounded-lg w-full mt-4 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all group"
        >
          <Zap size={16} className="text-brand-primary group-hover:animate-pulse" />
          {btnText} 
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}