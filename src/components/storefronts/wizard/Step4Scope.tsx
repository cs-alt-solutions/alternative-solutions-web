'use client';

import React, { useState } from 'react';
import { ArrowLeft, CheckSquare, Square, ChevronDown, ChevronUp, Globe, Zap, Loader2, MessageSquare } from 'lucide-react';
import { WIZARD_COPY, SUBSCRIPTION_PLANS } from '@/utils/glossary';
import PledgeAgreement from './PledgeAgreement';

const PlanCard = ({ plan, idx, isSelected, isExpanded, onSelect, onToggleExpand, copy }: any) => {
  const formatPrice = (price: any) => {
    if (price === null || price === undefined || price === '') return null;
    const cleanPrice = String(price).replace(copy.PLAN.CURRENCY_SYMBOL, '');
    return `${copy.PLAN.CURRENCY_SYMBOL}${cleanPrice}`;
  };

  const displayPrice = formatPrice(plan.price);
  const displayName = plan.name || `${copy.PLAN.FALLBACK_NAME} ${idx + 1}`;

  return (
    <div
      onClick={() => onSelect(plan.id)}
      className={`relative p-6 rounded-xl border-2 transition-all cursor-pointer overflow-hidden ${
        isSelected
          ? 'border-teal-500 bg-zinc-900 shadow-brutal-teal scale-[1.01]'
          : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600 hover:bg-zinc-900'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-4">
          <div className="mt-1 sm:mt-0 shrink-0">
            {isSelected ? (
              <CheckSquare className="w-6 h-6 text-teal-400 animate-in zoom-in-50 duration-200" />
            ) : (
              <Square className="w-6 h-6 text-zinc-600" />
            )}
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-wider">
              {displayName}
            </h3>
            <p className="text-zinc-400 text-sm mt-1 max-w-md font-light">
              {plan.description || copy.PLAN.FALLBACK_DESC}
            </p>
          </div>
        </div>
        {displayPrice && (
          <div className="pl-10 sm:pl-0 text-left sm:text-right shrink-0">
            <div className="text-3xl font-black text-white">
              {displayPrice}
              <span className="text-lg text-zinc-500 font-medium">{copy.PLAN.MONTHLY_SUFFIX}</span>
            </div>
          </div>
        )}
      </div>

      <div className="pl-10 mt-4 flex items-center justify-between border-t border-zinc-800/50 pt-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand(plan.id);
          }}
          className={`text-xs font-bold tracking-wider uppercase flex items-center gap-1 transition-colors cursor-pointer ${
            isSelected ? 'text-teal-400 hover:text-teal-300' : 'text-zinc-500 hover:text-white'
          }`}
        >
          {isExpanded ? copy.PLAN.HIDE_DETAILS : copy.PLAN.VIEW_SCOPE}
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-6 ml-10 p-4 bg-zinc-950 border border-zinc-800 rounded-lg space-y-3 animate-in slide-in-from-top-2 duration-200">
          {(plan.features || []).map((feature: string, fIdx: number) => (
            <div key={fIdx} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-1.5" />
              <span className="text-sm text-zinc-300 font-light">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface Step4Props {
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
  description?: string;
  setDescription?: (val: string) => void;
  formData?: any;
  setFormData?: (val: any) => void;
}

export default function Step4Scope({
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
  onSubmit,
  description,
  setDescription,
  formData,
  setFormData
}: Step4Props) {
  const copy = WIZARD_COPY.STEP_4;
  const [isPledged, setIsPledged] = useState(false);

  // Safe resolver for the textarea binding
  const currentNotes = description ?? formData?.description ?? '';
  const handleNotesChange = (val: string) => {
    if (setDescription) setDescription(val);
    else if (setFormData && formData) setFormData({ ...formData, description: val });
  };

  const isSubmissionDisabled = isSubmitting || !isPledged || (wantsCustom && !existingDomain.trim());

  const sortedPlans = SUBSCRIPTION_PLANS ? [...SUBSCRIPTION_PLANS].sort((a, b) => {
    const priceA = parseFloat(String(a.price || '0').replace(/[^0-9.]/g, '')) || 0;
    const priceB = parseFloat(String(b.price || '0').replace(/[^0-9.]/g, '')) || 0;
    return priceA - priceB;
  }) : [];

  return (
    <div className="animate-in fade-in duration-500 space-y-10">
      
      {/* HEADER */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-cyan-500">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
          {copy.SUBTITLE_START}<span className="text-teal-400 font-medium">{copy.SUBTITLE_HIGHLIGHT}</span>{copy.SUBTITLE_END}
        </p>
      </div>

      {/* THE FOUNDER'S PLEDGE ACCORDION */}
      <PledgeAgreement 
        copy={copy.LEGACY_PLEDGE} 
        isPledged={isPledged} 
        setIsPledged={setIsPledged} 
      />

      {/* PLAN SELECTION */}
      <div className="space-y-4">
        {sortedPlans.length === 0 ? (
          <div className="text-center text-zinc-500 py-8 border-2 border-dashed border-zinc-800 bg-zinc-900/50 rounded-xl font-mono uppercase tracking-widest text-sm">
            {copy.EMPTY_PLANS}
          </div>
        ) : (
          sortedPlans.map((plan, idx) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              idx={idx}
              isSelected={selectedPlan === plan.id}
              isExpanded={expandedPlan === plan.id}
              onSelect={setSelectedPlan}
              onToggleExpand={(id: string) => setExpandedPlan(expandedPlan === id ? null : id)}
              copy={copy}
            />
          ))
        )}
      </div>

      {/* DOMAIN CONNECTION */}
      <div className="p-6 rounded-xl bg-zinc-950 border-2 border-zinc-800 space-y-4 transition-all shadow-md">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-white uppercase tracking-wider text-sm">{copy.DOMAIN.TITLE}</h3>
        </div>
        
        <label className="flex items-center gap-4 p-4 rounded-lg bg-zinc-900 border border-zinc-800 cursor-pointer hover:border-zinc-700 transition-colors">
          <input
            type="checkbox"
            checked={wantsCustom}
            onChange={(e) => {
              setWantsCustom(e.target.checked);
              if (!e.target.checked) setExistingDomain('');
            }}
            className="w-5 h-5 rounded border-zinc-700 bg-zinc-950 text-teal-500 focus:ring-teal-500 focus:ring-offset-zinc-900 cursor-pointer"
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
              className="w-full bg-zinc-900 border-2 border-zinc-700 rounded-lg px-4 py-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-teal-500 transition-colors font-mono text-sm shadow-inner"
            />
          </div>
        )}
      </div>

      {/* FINAL BRAIN-DUMP */}
      {copy.FINAL_NOTES && (
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-6 md:p-8 relative overflow-hidden group focus-within:border-teal-500/50 transition-colors shadow-xl space-y-4">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-teal-500/0 via-teal-500/0 to-teal-500/0 group-focus-within:via-teal-500/50 transition-all duration-700" />
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-zinc-800/80 pb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 shrink-0 shadow-inner">
              <MessageSquare className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-black text-white tracking-wide uppercase">{copy.FINAL_NOTES.TITLE}</h3>
              <p className="text-xs text-zinc-400 font-light">{copy.FINAL_NOTES.SUBTITLE}</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="text-xs font-mono font-bold text-teal-400 uppercase tracking-widest block pl-1">
              {copy.FINAL_NOTES.LABEL}
            </label>
            <textarea 
              rows={3}
              value={currentNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="w-full bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-4 text-white focus:outline-none focus:border-teal-500 text-sm font-light placeholder:text-zinc-600 resize-none leading-relaxed transition-all shadow-inner" 
              placeholder={copy.FINAL_NOTES.PLACEHOLDER} 
            />
          </div>
        </div>
      )}

      {/* PRIORITY QUEUE (Disabled style) */}
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
            <h3 className="font-bold text-zinc-400 uppercase tracking-wider text-sm">{copy.PRIORITY.TITLE}</h3>
            <Zap className="w-4 h-4 text-zinc-600" />
          </div>
          <p className="text-xs text-zinc-500 font-light">{copy.PRIORITY.DESC}</p>
        </div>
      </div>

      {/* SUBMIT ACTIONS */}
      <div className="space-y-6 pt-4 border-t border-zinc-800/50">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="px-6 py-5 rounded-xl font-bold tracking-wide flex items-center justify-center gap-2 bg-zinc-900 border-2 border-zinc-800 text-white hover:bg-zinc-800 transition-all disabled:opacity-50 cursor-pointer"
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
                : 'bg-zinc-900 border-teal-500 text-white hover:bg-zinc-800 shadow-brutal-teal active:translate-y-1 active:translate-x-1 active:shadow-none cursor-pointer'
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