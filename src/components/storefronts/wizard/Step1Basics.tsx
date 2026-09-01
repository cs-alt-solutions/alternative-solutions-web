/* src/components/storefronts/wizard/Step1Basics.tsx */
'use client';

import React from 'react';
import { ArrowRight, User, Mail, Building2, Phone } from 'lucide-react';
import { useWizard } from './core/WizardContext';
import { WIZARD_COPY } from '@/config/wizard';

export default function Step1Basics() {
  const { formData, updateForm, nextStep } = useWizard();
  const copy = WIZARD_COPY.STEP_1;

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

  const phoneDigits = (formData.phone || '').replace(/\D/g, '');
  
  const isStepValid =
    formData.name?.trim() !== '' &&
    formData.email?.trim() !== '' &&
    phoneDigits.length === 10 &&
    formData.businessName?.trim() !== '';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 min-h-100 flex flex-col justify-center max-w-2xl mx-auto">
      
      <div className="space-y-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.HEADER.TITLE_MAIN}<span className="text-cyan-400">{copy.HEADER.TITLE_PUNCT}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
          {copy.HEADER.SUBTITLE}
        </p>
      </div>

      <div className="space-y-6 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              <User className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS.NAME}
            </label>
            <input
              type="text" required
              value={formData.name || ''}
              onChange={(e) => updateForm({ name: e.target.value })}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
              placeholder={copy.PLACEHOLDERS.NAME}
              autoFocus
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              <Mail className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS.EMAIL}
            </label>
            <input
              type="email" required
              value={formData.email || ''}
              onChange={(e) => updateForm({ email: e.target.value })}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
              placeholder={copy.PLACEHOLDERS.EMAIL}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              <Phone className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS.PHONE}
            </label>
            <input
              type="tel" required
              value={formData.phone || ''}
              onChange={(e) => updateForm({ phone: formatPhoneNumber(e.target.value) })}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
              placeholder={copy.PLACEHOLDERS.PHONE}
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              <Building2 className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS.BUSINESS}
            </label>
            <input
              type="text" required
              value={formData.businessName || ''}
              onChange={(e) => updateForm({ businessName: e.target.value })}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
              placeholder={copy.PLACEHOLDERS.BUSINESS}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 mt-auto border-t border-zinc-800/60 flex justify-end shrink-0">
        <button
          onClick={nextStep}
          disabled={!isStepValid}
          className="flex items-center justify-center w-full sm:w-auto gap-3 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black tracking-widest text-xs uppercase px-10 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:bg-zinc-900 disabled:border disabled:border-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed group cursor-pointer"
        >
          {copy.ACTIONS.NEXT} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}