/* src/components/storefronts/wizard/Step4Scope.tsx */
'use client';
import React from 'react';
import { ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, Globe, Zap } from 'lucide-react';
import { submitStorefrontApplication } from '@/app/actions/storefront_applications';

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
  plans, selectedPlan, setSelectedPlan, expandedPlan, setExpandedPlan,
  wantsCustom, setWantsCustom, existingDomain, setExistingDomain,
  priorityQueue, setPriorityQueue, isSubmitting, onPrev, onSubmit
}: Step4Props) {
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

      {/* Plans Container - No outer background, fully transparent */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            onClick={() => {
              setSelectedPlan(plan.id);
              setExpandedPlan(plan.id);
            }}
            className={`border-2 rounded-2xl transition-all duration-300 overflow-hidden ${selectedPlan === plan.id ? 'bg-fuchsia-500/10 border-fuchsia-500' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
          >
            <div className="p-6 flex items-center cursor-pointer">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-5 shrink-0 ${selectedPlan === plan.id ? 'border-fuchsia-500' : 'border-white/20'}`}>
                {selectedPlan === plan.id && <div className="w-3 h-3 bg-fuchsia-500 rounded-full"></div>}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-white text-xl">{plan.title}</h4>
              </div>
              <div className="text-right ml-4 mr-5">
                <span className="font-bold text-2xl text-white">{plan.price}</span>
                <span className="text-sm text-zinc-500">{plan.interval}</span>
              </div>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedPlan(expandedPlan === plan.id ? null : plan.id);
                }}
                className="p-2 text-zinc-400 hover:text-white transition-colors bg-white/5 rounded-full"
              >
                {expandedPlan === plan.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            {expandedPlan === plan.id && (
              <div className="px-6 pb-6 pt-2 border-t border-white/5 ml-15">
                <p className="text-base text-zinc-300 mb-4">{plan.desc}</p>
                <ul className="space-y-3">
                  {plan.features.map((feature: string, idx: number) => (
                    <li key={idx} className="flex items-start text-base text-zinc-400">
                      <CheckCircle2 className="w-5 h-5 text-fuchsia-500 mr-3 shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10"></div>

      {/* Custom Request - Transparent background */}
      <div className="p-6 bg-black/20 border border-white/5 rounded-2xl">
        <label className="flex items-center gap-4 cursor-pointer group">
          <div className="relative flex items-center justify-center w-6 h-6 shrink-0">
            <input 
              type="checkbox" 
              checked={wantsCustom} 
              onChange={(e) => setWantsCustom(e.target.checked)} 
              className="appearance-none w-6 h-6 border-2 border-white/20 rounded bg-transparent checked:bg-fuchsia-500 checked:border-fuchsia-500 cursor-pointer transition-colors" 
            />
            {wantsCustom && <CheckCircle2 className="absolute text-white w-4 h-4 pointer-events-none" />}
          </div>
          <div>
            <span className="font-bold text-white text-lg block group-hover:text-fuchsia-400 transition-colors">I need a Custom Build</span>
            <span className="text-sm text-zinc-500">E-commerce, booking systems, integrations, or specific tools.</span>
          </div>
        </label>
        
        {wantsCustom && (
          <div className="mt-6 pl-10 border-l-2 border-white/10 ml-3 space-y-4">
            {selectedPlan === 'foundation' ? (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <p className="text-sm text-zinc-400 mb-3">
                  Custom builds require a dedicated domain. Provide your existing professional domain URL below.
                </p>
                <div className="relative">
                  <Globe className="absolute left-4 top-4 w-5 h-5 text-zinc-500" />
                  <input 
                    type="url" 
                    placeholder="https://yourwebsite.com" 
                    value={existingDomain}
                    onChange={(e) => setExistingDomain(e.target.value)}
                    required={wantsCustom && selectedPlan === 'foundation'}
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-fuchsia-500 transition-all text-lg" 
                  />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300 flex items-start gap-3 text-base text-fuchsia-300 bg-fuchsia-500/10 p-5 rounded-xl border border-fuchsia-500/20">
                <CheckCircle2 className="w-6 h-6 shrink-0" />
                <p>Professional Tier selected. You're set up for a custom build. I'll draft a specific quote for you inside your portal.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Priority Checkbox - Transparent */}
      <div className={`p-6 rounded-2xl border transition-all duration-300 ${priorityQueue ? 'bg-pink-500/10 border-pink-500/50' : 'bg-black/20 border-white/5 hover:border-white/10'}`}>
         <label className="flex items-start gap-4 cursor-pointer group">
           <div className="relative flex items-center justify-center w-6 h-6 shrink-0 mt-1">
             <input 
               type="checkbox" 
               checked={priorityQueue} 
               onChange={(e) => setPriorityQueue(e.target.checked)} 
               className="appearance-none w-6 h-6 border-2 border-white/20 rounded bg-transparent checked:bg-pink-500 checked:border-pink-500 cursor-pointer transition-colors" 
             />
             {priorityQueue && <CheckCircle2 className="absolute text-white w-4 h-4 pointer-events-none" />}
           </div>
           <div>
              <span className="font-bold text-white text-lg flex items-center gap-2 group-hover:text-pink-400 transition-colors">
                <Zap className="w-5 h-5 text-pink-500" />
                Fast-Track My Application ($1)
              </span>
              <p className="text-sm text-zinc-400 leading-relaxed mt-2">
                Checking this box adds a $1 retainer to your application. It proves you're serious and bumps you straight to the front of my queue for review.
              </p>
           </div>
         </label>
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex gap-4">
          <button 
            type="button" 
            onClick={onPrev}
            className="px-6 py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-2 bg-white/5 border border-white/5 text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting || (wantsCustom && selectedPlan === 'foundation' && !existingDomain)}
            className={`relative flex-1 overflow-hidden py-5 rounded-2xl font-bold tracking-wide flex items-center justify-center gap-3 transition-all ${isSubmitting || (wantsCustom && selectedPlan === 'foundation' && !existingDomain) ? 'bg-zinc-900 border border-white/5 text-zinc-600 cursor-not-allowed' : 'text-white hover:scale-[1.02] shadow-[0_0_30px_rgba(236,72,153,0.3)]'}`}
          >
            {!(isSubmitting || (wantsCustom && selectedPlan === 'foundation' && !existingDomain)) && (
              <div className="absolute left-0 top-0 h-full w-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 opacity-90 transition-all"></div>
            )}
            <span className="relative z-10 flex items-center gap-2">
              {isSubmitting ? 'Sending...' : priorityQueue ? 'Fast-Track This Build ($1) ⚡' : 'Send It 🚀'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}