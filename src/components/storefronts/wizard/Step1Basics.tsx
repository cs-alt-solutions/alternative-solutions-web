'use client';

import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';
import { useWizard } from './core/WizardContext';
import { WIZARD_COPY } from '@/config/wizard';

export default function Step1Basics() {
  const { formData, updateForm, nextStep } = useWizard();
  const copy = WIZARD_COPY.STEP_1;

  const [internalStep, setInternalStep] = useState(1);
  const totalInternalSteps = 5;

  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const canProceed = () => {
    switch (internalStep) {
      case 1: 
        return formData.name?.trim() !== '';
      case 2: 
        return formData.businessName?.trim() !== '';
      case 3: 
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || '');
        const phoneDigits = (formData.phone || '').replace(/\D/g, '');
        const isValidPhone = phoneDigits.length === 10;
        return isValidEmail && isValidPhone; // 🚀 Removed preferredContact dependency
      case 4: 
        return formData.description?.trim() !== '';
      case 5: 
        return formData.headlineMode !== null && (formData.headlineMode === 'delegate' || (formData.headlineMode === 'custom' && formData.tagline?.trim() !== ''));
      default: 
        return false;
    }
  };

  const handleNext = () => {
    if (internalStep < totalInternalSteps) {
      setInternalStep(prev => prev + 1);
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (internalStep > 1) {
      setInternalStep(prev => prev - 1);
    }
  };

  const currentFlow = copy.CONVERSATION.STEPS[internalStep - 1];
  const firstName = formData.name ? formData.name.split(' ')[0] : 'there';
  const dynamicSubtitle = currentFlow.SUBTITLE.replace('{name}', firstName);

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500 min-h-125 flex flex-col">

      {/* FORCES EVERYTHING DEAD CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-12 w-full py-8 my-auto text-center">
        
        {/* DYNAMIC HEADER */}
        <div className="space-y-4 w-full">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
            {currentFlow.TITLE}
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
            {dynamicSubtitle}
          </p>
        </div>

        {/* THE INPUT AREA */}
        <div className="w-full relative flex justify-center">

          {internalStep === 1 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full max-w-lg">
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => updateForm({ name: e.target.value })}
                className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-cyan-400 text-center text-3xl md:text-4xl text-white outline-none transition-all pb-3 placeholder:text-zinc-700"
                placeholder={copy.PLACEHOLDERS.NAME}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
              />
            </div>
          )}

          {internalStep === 2 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full max-w-lg">
              <input
                type="text"
                required
                value={formData.businessName || ''}
                onChange={(e) => updateForm({ businessName: e.target.value })}
                className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-cyan-400 text-center text-3xl md:text-4xl text-white outline-none transition-all pb-3 placeholder:text-zinc-700"
                placeholder={copy.PLACEHOLDERS.BUSINESS}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
              />
            </div>
          )}

          {/* SIMPLIFIED COMMS SECTION */}
          {internalStep === 3 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full flex flex-col sm:flex-row gap-8">
              <div className="w-full">
                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 block">{copy.LABELS.EMAIL}</label>
                <input
                  type="email"
                  required
                  value={formData.email || ''}
                  onChange={(e) => updateForm({ email: e.target.value })}
                  className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-cyan-400 text-center text-xl md:text-2xl text-white outline-none transition-all pb-3 placeholder:text-zinc-700"
                  placeholder={copy.PLACEHOLDERS.EMAIL}
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && formData.email && formData.phone ? handleNext() : null}
                />
              </div>
              <div className="w-full">
                <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-2 block">{copy.LABELS.PHONE}</label>
                <input
                  type="tel"
                  required
                  value={formData.phone || ''}
                  onChange={(e) => updateForm({ phone: formatPhoneNumber(e.target.value) })}
                  className="w-full bg-transparent border-b-2 border-zinc-800 focus:border-cyan-400 text-center text-xl md:text-2xl text-white outline-none transition-all pb-3 placeholder:text-zinc-700"
                  placeholder={copy.PLACEHOLDERS.PHONE}
                  onKeyDown={(e) => e.key === 'Enter' && canProceed() && handleNext()}
                />
              </div>
            </div>
          )}

          {internalStep === 4 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full">
              <textarea
                required
                value={formData.description || ''}
                onChange={(e) => updateForm({ description: e.target.value })}
                className="w-full h-48 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl px-6 py-6 text-lg md:text-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner resize-none placeholder:text-zinc-700 text-center leading-relaxed"
                placeholder={copy.STORY.PLACEHOLDER}
                autoFocus
              />
            </div>
          )}

          {/* THE HOOK CHOICE - WITH TEXTAREA FOR TAGLINE */}
          {internalStep === 5 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => updateForm({ headlineMode: 'custom' })}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer group ${
                    formData.headlineMode === 'custom' || formData.headlineMode == null
                      ? 'bg-zinc-900/80 border-cyan-400/80 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                      : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-base font-black uppercase tracking-widest text-white group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                    {copy.HOOK_TOGGLE.BTN_YES_LABEL}
                    {(formData.headlineMode === 'custom' || formData.headlineMode == null) && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                  </span>
                  <p className="text-xs text-zinc-400 font-normal max-w-50">
                    {copy.HOOK_TOGGLE.BTN_YES_DESC}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => updateForm({ headlineMode: 'delegate', tagline: '', subtext: '' })}
                  className={`p-6 rounded-2xl border transition-all flex flex-col items-center justify-center text-center gap-3 cursor-pointer group ${
                    formData.headlineMode === 'delegate'
                      ? 'bg-zinc-900/80 border-fuchsia-400/80 shadow-[0_0_20px_rgba(232,121,249,0.15)]'
                      : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <span className="text-base font-black uppercase tracking-widest text-white group-hover:text-fuchsia-400 transition-colors flex items-center gap-2">
                    {copy.HOOK_TOGGLE.BTN_NO_LABEL}
                    {formData.headlineMode === 'delegate' && <CheckCircle2 className="w-4 h-4 text-fuchsia-400" />}
                  </span>
                  <p className="text-xs text-zinc-400 font-normal max-w-50">
                    {copy.HOOK_TOGGLE.BTN_NO_DESC}
                  </p>
                </button>
              </div>

              {formData.headlineMode === 'delegate' && (
                <div className="p-4 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-300 text-sm font-normal flex flex-col sm:flex-row items-center justify-center text-center gap-3 animate-in fade-in zoom-in duration-300">
                  <Sparkles className="w-5 h-5 text-fuchsia-400 shrink-0 animate-pulse" />
                  <span>{copy.HOOK_TOGGLE.DELEGATED_BADGE}</span>
                </div>
              )}

              {(formData.headlineMode === 'custom' || formData.headlineMode == null) && (
                <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300 w-full">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block">{copy.LABELS.TAGLINE} *</label>
                    {/* 🚀 Changed to a textarea for the elevator pitch */}
                    <textarea
                      required
                      value={formData.tagline || ''}
                      onChange={(e) => updateForm({ tagline: e.target.value })}
                      className="w-full h-32 bg-zinc-900/40 border border-zinc-800/80 rounded-2xl px-6 py-4 text-base text-white focus:outline-none focus:border-cyan-500/50 transition-all shadow-inner resize-none placeholder:text-zinc-700 text-center leading-relaxed"
                      placeholder={copy.PLACEHOLDERS.TAGLINE}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS - Locked to the bottom */}
      <div className="w-full flex items-center justify-between pt-6 mt-auto border-t border-zinc-800/60 shrink-0">
        <button
          type="button"
          onClick={handleBack}
          className={`text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-colors duration-300 ${
            internalStep === 1 ? 'text-zinc-700 cursor-not-allowed opacity-0' : 'text-zinc-500 hover:text-white cursor-pointer opacity-100'
          }`}
          disabled={internalStep === 1}
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!canProceed()}
          className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            canProceed()
              ? 'text-zinc-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:scale-[1.05] cursor-pointer'
              : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <span>{internalStep === totalInternalSteps ? 'Lock It In' : 'Continue'}</span>
          {internalStep === totalInternalSteps ? <ArrowRight className="w-4 h-4" /> : null}
        </button>
      </div>

    </div>
  );
}