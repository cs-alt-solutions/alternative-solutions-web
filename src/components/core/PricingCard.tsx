/* src/components/core/PricingCard.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Zap, ArrowRight, AlertTriangle, X, Check } from 'lucide-react';

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
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  
  // Dynamically create the correct number of false states based on the glossary
  const totalPoints = FOUNDING_MEMBER.DISCLAIMER.POINTS.length;
  const [agreements, setAgreements] = useState<boolean[]>(new Array(totalPoints).fill(false));

  const handleOpenModal = () => {
    setAgreements(new Array(totalPoints).fill(false));
    setShowDisclaimer(true);
  };
  
  const handleCloseModal = () => setShowDisclaimer(false);

  const toggleAgreement = (index: number) => {
    const newAgreements = [...agreements];
    newAgreements[index] = !newAgreements[index];
    setAgreements(newAgreements);
  };

  const allChecked = agreements.length > 0 && agreements.every(Boolean);

  const handleConfirmAndJoin = () => {
    if (!allChecked) return;
    window.location.href = `${stripeLink}?prefilled_amount=${minAmount * 100}`;
  };

  return (
    <>
      {/* THE PRICING CARD */}
      <div className="w-full max-w-sm mx-auto animate-in fade-in duration-500 relative z-10">
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

          {/* FIX: Replaced solid 'btn-brand' with the transparent-to-solid hover class logic */}
          <button 
            onClick={handleOpenModal}
            className="flex items-center justify-center gap-2 w-full py-4 mt-4 text-xs font-bold font-mono uppercase tracking-widest rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary hover:text-black hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all group"
          >
            <Zap size={16} className="group-hover:text-black transition-colors group-hover:animate-pulse" />
            {btnText} 
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>

        </div>
      </div>

      {/* THE BLACKOUT MODAL */}
      {showDisclaimer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-10 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
          
          {/* Main Modal Container */}
          <div className="bg-black/60 border border-fuchsia-500/30 w-full max-w-2xl rounded-3xl shadow-[0_0_80px_rgba(232,121,249,0.2)] overflow-hidden flex flex-col relative max-h-[90vh]">
            
            {/* Ambient Background Glows inside the modal */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
            
            {/* Progress Top Bar */}
            <div className="h-1.5 w-full bg-linear-to-r from-fuchsia-500 via-brand-primary to-fuchsia-500 shrink-0" />

            <header className="p-8 pb-6 border-b border-white/5 flex items-center justify-between bg-black/30 shrink-0 relative z-10">
              <div className="flex items-center gap-5">
                <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                  <AlertTriangle size={26} />
                </div>
                <h2 className="text-3xl font-black uppercase text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  {FOUNDING_MEMBER.DISCLAIMER.TITLE}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="text-white/20 hover:text-white hover:rotate-90 transition-all duration-300">
                <X size={24} />
              </button>
            </header>

            <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar relative z-10 flex-1">
              <p className="text-base text-slate-300 font-light leading-relaxed max-w-2xl">
                {FOUNDING_MEMBER.DISCLAIMER.DESC}
              </p>
              
              <div className="space-y-4">
                {FOUNDING_MEMBER.DISCLAIMER.POINTS.map((point: string, idx: number) => (
                  <label 
                    key={idx} 
                    className={`flex items-start gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                      agreements[idx] 
                        ? 'bg-fuchsia-950/20 border-fuchsia-500/40 shadow-[inset_0_0_20px_rgba(232,121,249,0.1)]' 
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }`}
                  >
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={agreements[idx]} 
                      onChange={() => toggleAgreement(idx)} 
                    />
                    
                    <div className={`shrink-0 mt-0.5 w-6 h-6 rounded-md flex items-center justify-center border transition-all duration-300 ${
                      agreements[idx] 
                        ? 'bg-linear-to-br from-fuchsia-400 to-fuchsia-600 border-fuchsia-400 text-black shadow-[0_0_15px_rgba(232,121,249,0.6)]' 
                        : 'bg-black/50 border-white/20 group-hover:border-white/40'
                    }`}>
                      <Check size={16} strokeWidth={3} className={`transition-transform duration-300 ${agreements[idx] ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`} />
                    </div>

                    <p className={`text-[15px] font-medium leading-snug transition-colors duration-300 ${
                      agreements[idx] ? 'text-white' : 'text-white/60 group-hover:text-white/80'
                    }`}>
                      {point}
                    </p>
                  </label>
                ))}
              </div>
            </div>

            <footer className="p-8 border-t border-white/5 bg-black/40 flex flex-col sm:flex-row gap-4 shrink-0 relative z-10">
              <button 
                onClick={handleCloseModal} 
                className="flex-1 py-4 text-xs font-mono font-bold text-white/50 border border-white/10 rounded-xl hover:text-white hover:bg-white/5 hover:border-white/20 transition-all uppercase tracking-widest"
              >
                {FOUNDING_MEMBER.DISCLAIMER.BTN_CANCEL}
              </button>
              <button 
                onClick={handleConfirmAndJoin} 
                disabled={!allChecked}
                className={`flex-1 py-4 text-xs font-mono font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group ${
                  allChecked 
                    ? 'bg-linear-to-r from-fuchsia-400 via-brand-primary to-fuchsia-400 text-black shadow-[0_0_30px_rgba(232,121,249,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] cursor-pointer' 
                    : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                }`}
              >
                {FOUNDING_MEMBER.DISCLAIMER.BTN_CONFIRM} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
}