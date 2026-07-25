// src/components/dashboard/storefronts/editor/BillingTab.tsx
'use client';

import React from 'react';
import { Clock, CheckCircle2, Zap, Calendar, ArrowRight, DollarSign, ShieldCheck } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '@/utils/glossary';

export default function BillingTab({ formData, setFormData }: { formData: any; setFormData: any }) {
  // 1. SINGLE SOURCE OF TRUTH: Read their assigned plan from DB, fallback to 'standard'
  const currentPlan = (formData.plan_tier || formData.selected_plan || 'standard').toLowerCase();
  const currentStatus = (formData.billing_status || formData.status || 'BUILDING').toUpperCase();
  const trialDays = formData.trial_days || 10;

  // Find the matching plan object from our central config to access its features and Stripe link
  const activePlanDetails = SUBSCRIPTION_PLANS.find((p) => p.id.toLowerCase() === currentPlan) || SUBSCRIPTION_PLANS[0];

  const getTrialExpiration = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleStatusChange = (newStatus: string) => {
    setFormData((prev: any) => ({
      ...prev,
      billing_status: newStatus,
      status: newStatus,
    }));
  };

  const handlePlanChange = (planId: string) => {
    setFormData((prev: any) => ({
      ...prev,
      plan_tier: planId,
      selected_plan: planId,
    }));
  };

  const handleTrialChange = (days: number) => {
    setFormData((prev: any) => ({
      ...prev,
      trial_days: days,
      trial_ends_at: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString(),
    }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 pt-6 max-w-4xl">
      
      {/* SECTION 1: INDUSTRIAL LIFECYCLE TELEMETRY */}
      <div className="bg-zinc-900/80 border border-zinc-800 p-6 rounded-2xl shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-800/80 pb-6">
          
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Lifecycle Telemetry</span>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-bold text-white uppercase tracking-wider">Current Status:</span>
                <span className="px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-black tracking-widest uppercase">
                  {currentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Terminal Dropdown */}
          <div className="flex items-center gap-3 shrink-0">
            <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">Override:</label>
            <select
              value={currentStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 hover:border-cyan-500 text-white font-mono text-xs uppercase font-bold px-4 py-2.5 rounded-xl outline-none transition-colors cursor-pointer"
            >
              <option value="BUILDING">BUILDING // DEFAULT</option>
              <option value="TRIAL">TRIAL // 10-30 DAYS</option>
              <option value="ACTIVE">ACTIVE // PAID</option>
              <option value="PAST_DUE">PAST DUE // ALERT</option>
              <option value="UNPAID">UNPAID // RESTRICTED</option>
              <option value="COMPED">COMPED // INTERNAL</option>
            </select>
          </div>

        </div>

        {/* DYNAMIC TRIAL TIMER (Only renders in TRIAL mode) */}
        {currentStatus === 'TRIAL' && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 p-5 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Client Trial Window Active
              </span>
              <p className="text-xs text-zinc-300 mt-1">
                Client portal will display a countdown timer expiring on <strong className="text-white font-mono">{getTrialExpiration(trialDays)}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-zinc-950 p-1 rounded-lg border border-cyan-500/30 shrink-0">
              {[10, 14, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => handleTrialChange(days)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                    trialDays === days
                      ? 'bg-cyan-500 text-zinc-950 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: INFRASTRUCTURE TIER SELECTION (No more manual Stripe URL input!) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <DollarSign size={14} className="text-cyan-400" /> Assigned Infrastructure Plan
          </label>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            Intake Selection: <strong className="text-white">{currentPlan.toUpperCase()}</strong>
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SUBSCRIPTION_PLANS.map((plan) => {
            const isSelected = currentPlan === plan.id.toLowerCase();
            return (
              <div
                key={plan.id}
                onClick={() => handlePlanChange(plan.id)}
                className={`cursor-pointer p-6 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-zinc-900/90 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.15)]' 
                    : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-black text-white uppercase tracking-wider">{plan.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{plan.description}</p>
                    </div>
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      ${plan.price}<span className="text-xs text-zinc-500">/mo</span>
                    </span>
                  </div>
                  <ul className="space-y-2.5 my-6 border-t border-zinc-800/60 pt-4">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-zinc-300">
                        <CheckCircle2 size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`w-full py-2.5 rounded-xl font-mono text-[10px] font-bold uppercase tracking-widest text-center transition-colors ${
                  isSelected ? 'bg-cyan-500 text-zinc-950 shadow-md' : 'bg-zinc-900 text-zinc-400'
                }`}>
                  {isSelected ? 'Active Tier Assigned' : 'Select Tier'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: AUTOMATED PORTAL ROUTING TELEMETRY */}
      <div className="bg-zinc-950 border border-zinc-800/80 p-6 rounded-2xl flex items-center justify-between gap-6 shadow-inner">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Automated Portal Routing Active</h4>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-xl">
              Assigned to <strong className="text-white font-mono uppercase">{activePlanDetails.name}</strong>. Our engine automatically binds checkout routing to <span className="text-cyan-400 font-mono">{activePlanDetails.stripeLink}</span> when the client initiates payment in their portal.
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-cyan-400 font-bold uppercase shrink-0">
          <ShieldCheck className="w-4 h-4" /> <span>Registry Synced</span>
        </div>
      </div>

    </div>
  );
}