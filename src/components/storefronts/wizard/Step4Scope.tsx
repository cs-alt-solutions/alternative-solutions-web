'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, Zap, ShieldCheck, Lock } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';
import { useWizard } from './core/WizardContext';

// 🚀 Explicit typing to satisfy the TS Linter
type PlanItem = {
  id: string;
  name: string;
  price: string;
  suffix: string;
  description: string;
  features: string[];
  available: boolean;
  recommended?: boolean;
  comingSoonText?: string;
};

export default function Step4Scope() {
  const { formData, updateForm, nextStep, prevStep } = useWizard();
  const copy = WIZARD_COPY.STEP_4;

  const [selectedPlanId, setSelectedPlanId] = useState<string>(formData.targetPlan || 'standard');
  const [hasCustomDomain, setHasCustomDomain] = useState(Boolean(formData.customDomain));
  const [priorityQueue, setPriorityQueue] = useState(Boolean(formData.priorityQueue));

  const handleNext = () => {
    updateForm({
      targetPlan: selectedPlanId,
      customDomain: selectedPlanId === 'professional' && hasCustomDomain ? formData.customDomain : '',
      priorityQueue: selectedPlanId === 'professional' ? priorityQueue : false
    });
    nextStep();
  };

  const canProceed = () => {
    return selectedPlanId !== '';
  };

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500 flex flex-col space-y-10 pb-12">
      
      {/* HEADER */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.TITLE_MAIN}
          <span className="text-cyan-400">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mx-auto font-normal leading-relaxed">
          {copy.SUBTITLE_START}
          <span className="text-white font-semibold">{copy.SUBTITLE_HIGHLIGHT}</span>
          {copy.SUBTITLE_END}
        </p>
      </div>

      <div className="space-y-8 w-full">
        
        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 max-w-3xl mx-auto">
          {copy.PLANS.map((plan: PlanItem) => {
            const isSelected = selectedPlanId === plan.id;
            const isAvailable = plan.available !== false;
            
            return (
              <div 
                key={plan.id}
                onClick={() => isAvailable && setSelectedPlanId(plan.id)}
                className={`relative flex flex-col rounded-2xl p-6 transition-all duration-300 ${
                  !isAvailable 
                    ? 'bg-zinc-950/40 border border-zinc-800/50 opacity-60 cursor-not-allowed grayscale' 
                    : isSelected 
                      ? 'bg-zinc-900 border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)] scale-[1.02] z-10 cursor-pointer' 
                      : 'bg-zinc-950/80 border border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50 cursor-pointer'
                }`}
              >
                {/* Recommended Badge */}
                {plan.recommended && isAvailable && (
                  <div className="absolute -top-3 inset-x-0 flex justify-center z-20">
                    <span className="bg-cyan-400 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Selection Ring */}
                {isSelected && (
                  <div className="absolute top-4 right-4 text-cyan-400 animate-in zoom-in duration-200">
                    <CheckCircle2 className="w-6 h-6 fill-cyan-400/20" />
                  </div>
                )}

                {/* Lock Icon for Unavailable */}
                {!isAvailable && (
                  <div className="absolute top-4 right-4 text-zinc-600">
                    <Lock className="w-5 h-5" />
                  </div>
                )}

                <div className="mb-6">
                  <h3 className={`text-xl font-black uppercase tracking-wide ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                    {plan.name}
                  </h3>
                  
                  {/* PRICE DISPLAY */}
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className={`text-4xl font-black ${
                      !isAvailable ? 'text-zinc-500' 
                      : isSelected ? 'text-cyan-400' 
                      : 'text-white'
                    }`}>
                      {plan.price}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium uppercase tracking-widest">
                      {plan.suffix}
                    </span>
                  </div>

                  {/* UNDER CONSTRUCTION BADGE */}
                  {!isAvailable && (
                    <div className="mt-3">
                      <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20">
                        {plan.comingSoonText}
                      </span>
                    </div>
                  )}

                  {/* DESCRIPTION */}
                  <p className={`text-xs mt-4 leading-relaxed h-10 ${!isAvailable ? 'text-fuchsia-400 font-bold' : 'text-zinc-400'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* FEATURES LIST */}
                <div className="flex-1 space-y-3 pt-6 border-t border-zinc-800/60">
                  {plan.features.map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-300">
                      <ShieldCheck className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-zinc-600'}`} />
                      <span className="leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* CONDITIONAL PRO FEATURES */}
        {selectedPlanId === 'professional' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* DOMAIN CONNECTION */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white flex items-center gap-2 cursor-pointer">
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>{copy.DOMAIN.TITLE}</span>
                </label>
                <input 
                  type="checkbox"
                  checked={hasCustomDomain}
                  onChange={(e) => setHasCustomDomain(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-cyan-400 focus:ring-cyan-400 cursor-pointer"
                />
              </div>

              {hasCustomDomain && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-2">
                  <input 
                    type="text"
                    value={formData.customDomain || ''}
                    onChange={(e) => updateForm({ customDomain: e.target.value })}
                    placeholder={copy.DOMAIN.PLACEHOLDER}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-cyan-400 rounded-xl px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-zinc-600 font-mono"
                  />
                </div>
              )}
            </div>

            {/* PRIORITY BUILD QUEUE OPTION */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6 flex items-center justify-between">
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <h4 className="text-sm font-bold text-white">{copy.PRIORITY.TITLE}</h4>
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
                    {copy.PRIORITY.BADGE}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                  {copy.PRIORITY.DESC}
                </p>
              </div>
              <input 
                type="checkbox"
                checked={priorityQueue}
                onChange={(e) => setPriorityQueue(e.target.checked)}
                className="w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-cyan-400 focus:ring-cyan-400 cursor-pointer shrink-0"
              />
            </div>
          </div>
        )}

      </div>

      {/* FOOTER ACTIONS */}
      <div className="w-full flex items-center justify-between pt-6 mt-auto border-t border-zinc-800/60 shrink-0">
        <button 
          type="button" 
          onClick={prevStep}
          className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 text-zinc-500 hover:text-white cursor-pointer transition-colors duration-300"
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
          <span>{copy.ACTIONS.NEXT}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}