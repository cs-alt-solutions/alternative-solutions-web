'use client';

import React from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Globe, Zap, Loader2 } from 'lucide-react';

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

  // Safety check: Don't allow submission if they checked "Custom Domain" but left the input empty
  const isSubmissionDisabled = isSubmitting || (wantsCustom && !existingDomain.trim());

  return (
    <div className="animate-in fade-in duration-500 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white capitalize">
          Lock it <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 to-pink-500">In.</span>
        </h1>
        <p className="text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Last step! Pick the foundation plan that fits your current setup. <span className="text-fuchsia-400 font-medium">No worries—there is absolutely no payment due right now</span> to get your file started.
        </p>
      </div>

      <div className="space-y-4">
        {(!plans || plans.length === 0) ? (
          <div className="text-center text-zinc-500 py-8 border-2 border-dashed border-zinc-800 rounded-3xl">
            No active plans found in the database.
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-6 rounded-3xl border-2 transition-all cursor-pointer overflow-hidden ${
                selectedPlan === plan.id
                  ? 'border-fuchsia-500 bg-fuchsia-500/5'
                  : 'border-white/5 bg-zinc-900/50 hover:border-white/10 hover:bg-zinc-900'
              }`}
            >
              {selectedPlan === plan.id && (
                <div className="absolute top-6 right-6">
                  <CheckCircle2 className="w-6 h-6 text-fuchsia-400" />
                </div>
              )}

              <div className="pr-12">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  {/* PRICING RESTORED HERE */}
                  {(plan.price !== undefined && plan.price !== null) && (
                    <span className="px-3 py-1 rounded-full bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 text-sm font-bold tracking-wide">
                      ${plan.price}/mo
                    </span>
                  )}
                </div>
                
                {/* FALLBACK ADDED IN CASE DB DESCRIPTION IS EMPTY */}
                <p className="text-zinc-400 text-sm mb-4">
                  {plan.description || "Solid foundation for your brand architecture."}
                </p>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandedPlan(expandedPlan === plan.id ? null : plan.id);
                  }}
                  className="text-xs font-bold tracking-wider text-zinc-500 hover:text-white uppercase flex items-center gap-1 transition-colors"
                >
                  {expandedPlan === plan.id ? 'Hide Details' : 'View Scope'}
                  {expandedPlan === plan.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {expandedPlan === plan.id && (
                <div className="mt-6 pt-6 border-t border-white/5 space-y-3 animate-in slide-in-from-top-2">
                  {(plan.features || []).map((feature: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-fuchsia-500/70 shrink-0 mt-0.5" />
                      <span className="text-sm text-zinc-300">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Domain Connection Toggle */}
      <div className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 space-y-4 transition-all">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-5 h-5 text-zinc-400" />
          <h3 className="font-bold text-white">Domain Connection</h3>
        </div>
        
        <label className="flex items-center gap-3 p-4 rounded-2xl bg-zinc-950 border border-white/5 cursor-pointer hover:border-white/10 transition-colors">
          <input
            type="checkbox"
            checked={wantsCustom}
            onChange={(e) => {
              setWantsCustom(e.target.checked);
              if (!e.target.checked) setExistingDomain(''); // Clear input if unchecked
            }}
            className="w-5 h-5 rounded border-zinc-800 bg-zinc-900 text-fuchsia-500 focus:ring-fuchsia-500 focus:ring-offset-zinc-950"
          />
          <span className="text-sm text-zinc-300 font-medium">I already have a custom domain</span>
        </label>

        {wantsCustom && (
          <div className="animate-in slide-in-from-top-2 pt-2">
            <input
              type="text"
              placeholder="e.g., myawesomebrand.com"
              value={existingDomain}
              onChange={(e) => setExistingDomain(e.target.value)}
              className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-fuchsia-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* DISABLED PRIORITY QUEUE */}
      <div className="relative flex items-start gap-4 p-6 rounded-3xl bg-zinc-950/50 border border-white/5 opacity-50 cursor-not-allowed transition-all">
        {/* Not Needed Badge */}
        <div className="absolute top-4 right-6 bg-zinc-800/80 text-zinc-400 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border border-white/5">
          Not Needed
        </div>

        <input
          type="checkbox"
          checked={false} // Forced off
          disabled // Locked
          onChange={() => {}}
          className="w-5 h-5 mt-1 rounded border-zinc-800 bg-zinc-900 text-zinc-500 cursor-not-allowed"
        />
        <div className="pr-20">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-zinc-400">Priority Build Queue</h3>
            <Zap className="w-4 h-4 text-zinc-600" />
          </div>
          <p className="text-sm text-zinc-500">Fast-track your setup for just $1. We will jump your file to the front of the line.</p>
        </div>
      </div>

      <div className="space-y-6 pt-4 border-t border-white/5">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="px-6 py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <button
            type="button"
            onClick={onSubmit}
            disabled={isSubmissionDisabled}
            className={`relative flex-1 overflow-hidden py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${
              isSubmissionDisabled
                ? 'bg-zinc-900 border border-white/5 text-zinc-600 cursor-not-allowed' 
                : 'text-white hover:scale-[1.02] shadow-[0_0_30px_rgba(236,72,153,0.3)]'
            }`}
          >
            {!isSubmissionDisabled && (
              <div className="absolute left-0 top-0 h-full w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-90 transition-all"></div>
            )}
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Transmitting...</>
              ) : (
                'Send It'
              )}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}