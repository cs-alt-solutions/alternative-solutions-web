'use client';

import React from 'react';
import { ArrowLeft, CheckSquare, Square, ChevronDown, ChevronUp, Globe, Zap, Loader2 } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';

interface Step4Props {
  plans: any[];
  selectedPlan: string;
  setSelectedPlan: (plan: string) => void;
  expandedPlan: string | null;
  setExpandedPlan: (plan: string | null) => void;
  wantsCustom: boolean;
  setWantsCustom: (val: boolean) => void;
  existingDomain: string;
  setExistingDomain: (val: string) => void;
  priorityQueue: boolean;
  setPriorityQueue: (val: boolean) => void;
  isSubmitting: boolean;
  onPrev: () => void;
  onSubmit: (e: any) => void;
}

export default function Step4Scope({
  plans,
  selectedPlan,
  setSelectedPlan,
  expandedPlan,
  setExpandedPlan,
  wantsCustom,
  setWantsCustom,
  existingDomain,
  setExistingDomain,
  priorityQueue,
  setPriorityQueue,
  isSubmitting,
  onPrev,
  onSubmit
}: Step4Props) {

  const copy = WIZARD_COPY.STEP_4;
  const isSubmissionDisabled = isSubmitting || (wantsCustom && !existingDomain.trim());

  // FIXED: Intercept and auto-sort the plans. Strip all non-numeric chars before parsing.
  const sortedPlans = plans ? [...plans].sort((a, b) => {
    const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return priceA - priceB;
  }) : [];

  // Helper to ensure we don't get double $$ if the database already includes it
  const formatPrice = (price: any) => {
    if (price === null || price === undefined || price === '') return null;
    const cleanPrice = String(price).replace('$', '');
    return `$${cleanPrice}`;
  };

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-cyan-500">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          {copy.SUBTITLE_START}<span className="text-teal-400 font-medium">{copy.SUBTITLE_HIGHLIGHT}</span>{copy.SUBTITLE_END}
        </p>
      </div>

      <div className="space-y-4">
        {sortedPlans.length === 0 ? (
          <div className="text-center text-zinc-500 py-8 border-2 border-dashed border-zinc-800 bg-zinc-900/50 rounded-xl font-mono uppercase tracking-widest text-sm">
            {copy.EMPTY_PLANS}
          </div>
        ) : (
          sortedPlans.map((plan, idx) => {
            const isSelected = selectedPlan === plan.id;
            const isExpanded = expandedPlan === plan.id;
            const displayPrice = formatPrice(plan.price);
            const displayName = plan.name || `Plan Option ${idx + 1}`;

            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'border-teal-500 bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(20,184,166,1)]'
                    : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  
                  {/* Left Side: Checkbox & Name */}
                  <div className="flex items-start sm:items-center gap-4">
                    <div className="mt-1 sm:mt-0 shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-6 h-6 text-teal-400" />
                      ) : (
                        <Square className="w-6 h-6 text-zinc-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
                        {displayName}
                      </h3>
                      <p className="text-zinc-400 text-sm mt-1 max-w-md">
                        {plan.description || copy.PLAN.FALLBACK_DESC}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Price */}
                  {displayPrice && (
                    <div className="pl-10 sm:pl-0 text-left sm:text-right shrink-0">
                      <div className="text-3xl font-black text-white">
                        {displayPrice}<span className="text-lg text-zinc-500 font-medium">/mo</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pl-10 mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedPlan(isExpanded ? null : plan.id);
                    }}
                    className={`text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors ${isSelected ? 'text-teal-400 hover:text-teal-300' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {isExpanded ? copy.PLAN.HIDE_DETAILS : copy.PLAN.VIEW_SCOPE}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-6 ml-10 p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 animate-in slide-in-from-top-2">
                    {(plan.features || []).map((feature: string, fIdx: number) => (
                      <div key={fIdx} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
                        <span className="text-sm text-zinc-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="p-6 rounded-xl bg-zinc-950 border-2 border-zinc-800 space-y-4 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-zinc-400" />
          <h3 className="font-bold text-white uppercase tracking-wider">{copy.DOMAIN.TITLE}</h3>
        </div>
        
        <label className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
          <input
            type="checkbox"
            checked={wantsCustom}
            onChange={(e) => {
              setWantsCustom(e.target.checked);
              if (!e.target.checked) setExistingDomain('');
            }}
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-teal-500 focus:ring-teal-500 focus:ring-offset-zinc-900"
          />
          <span className="text-sm text-zinc-300 font-medium">{copy.DOMAIN.CHECKBOX}</span>
        </label>

        {wantsCustom && (
          <div className="animate-in slide-in-from-top-2 pt-2">
            <input
              type="text"
              placeholder={copy.DOMAIN.PLACEHOLDER}
              value={existingDomain}
              onChange={(e) => setExistingDomain(e.target.value)}
              className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors font-mono"
            />
          </div>
        )}
      </div>

      <div className="relative flex items-start gap-4 p-6 rounded-xl bg-zinc-950 border-2 border-zinc-800/50 opacity-50 cursor-not-allowed transition-all">
        <div className="absolute top-4 right-6 bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">
          {copy.PRIORITY.BADGE}
        </div>

        <input
          type="checkbox"
          checked={false} 
          disabled 
          onChange={() => {}}
          className="w-5 h-5 mt-1 rounded border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed"
        />
        <div className="pr-20">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider">{copy.PRIORITY.TITLE}</h3>
            <Zap className="w-4 h-4 text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-500">{copy.PRIORITY.DESC}</p>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-zinc-800/50">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="px-6 py-5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 bg-zinc-900 border-2 border-zinc-800 text-white hover:bg-zinc-800 transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmissionDisabled}
            className={`relative flex-1 overflow-hidden py-5 rounded-xl font-bold tracking-wide uppercase flex items-center justify-center gap-3 transition-all border-2 ${
              isSubmissionDisabled
                ? 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed' 
                : 'bg-zinc-900 border-teal-500 text-white hover:bg-zinc-800 shadow-[4px_4px_0px_0px_rgba(20,184,166,1)] active:translate-y-1 active:translate-x-1 active:shadow-none'
            }`}
          >
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> {copy.ACTIONS.SUBMIT_LOADING}</>
              ) : (
                copy.ACTIONS.SUBMIT
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}