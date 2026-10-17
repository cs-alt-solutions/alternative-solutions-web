'use client';

import React from 'react';
import { ArrowRight, User, Mail, Building2 } from 'lucide-react';
import { useWizard } from './core/WizardContext';
import { WIZARD_COPY } from '@/config/wizard';

export default function Step1Basics() {
  const { formData, updateForm, nextStep } = useWizard();
  const copy = WIZARD_COPY.STEP_1;

  // Strict Validation: Just the core 3 inputs now
  const isStepValid =
    formData.name?.trim() !== '' &&
    formData.email?.trim() !== '' &&
    formData.businessName?.trim() !== '';

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 py-8 min-h-[400px] flex flex-col justify-center max-w-2xl mx-auto">
      
      {/* HEADER */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.HEADER?.TITLE_MAIN || "Let's Build"}<span className="text-cyan-400">{copy.HEADER?.TITLE_PUNCT || "."}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
          {copy.HEADER?.SUBTITLE || "First things first—I just need a few basic details to see where you're at, and then I'll take it from there."}
        </p>
      </div>

      <div className="space-y-6 w-full">
        {/* ROW 1: NAME & EMAIL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              <User className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS?.NAME || 'Name'}
            </label>
            <input
              type="text" required
              value={formData.name || ''}
              onChange={(e) => updateForm({ name: e.target.value })}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
              placeholder={copy.PLACEHOLDERS?.NAME || 'John Doe'}
              autoFocus
            />
          </div>

          <div className="space-y-2 text-left">
            <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              <Mail className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS?.EMAIL || 'Email'}
            </label>
            <input
              type="email" required
              value={formData.email || ''}
              onChange={(e) => updateForm({ email: e.target.value })}
              className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
              placeholder={copy.PLACEHOLDERS?.EMAIL || 'john@example.com'}
            />
          </div>
        </div>

        {/* ROW 2: BUSINESS NAME */}
        <div className="space-y-2 text-left">
          <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block pl-1">
            <Building2 className="w-3 h-3 inline mr-1 mb-0.5" /> {copy.LABELS?.BUSINESS || 'Business Name'}
          </label>
          <input
            type="text" required
            value={formData.businessName || ''}
            onChange={(e) => updateForm({ businessName: e.target.value })}
            className="w-full bg-zinc-900/40 border border-zinc-800/80 rounded-xl px-4 py-4 text-white focus:border-cyan-500/50 outline-none transition-all shadow-inner text-lg"
            placeholder={copy.PLACEHOLDERS?.BUSINESS || 'e.g. Acme Corp'}
          />
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="pt-6 mt-auto border-t border-zinc-800/60 flex justify-end shrink-0">
        <button
          onClick={nextStep}
          disabled={!isStepValid}
          className="flex items-center justify-center w-full sm:w-auto gap-3 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-black tracking-widest text-xs uppercase px-10 py-4 rounded-full transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] disabled:bg-zinc-900 disabled:border disabled:border-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed group cursor-pointer"
        >
          {copy.ACTIONS?.NEXT || 'Continue'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}