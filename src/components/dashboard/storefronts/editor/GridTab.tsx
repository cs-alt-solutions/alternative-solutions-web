'use client';

import React from 'react';
import { CreditCard, Globe, ShieldAlert } from 'lucide-react';
import DangerZoneCard from './DangerZoneCard';

export default function GridTab({ formData, setFormData, onTerminate }: { formData: any, setFormData: any, onTerminate: () => void }) {
  const isCustomPlan = formData.plan_tier === 'CUSTOM' || formData.selected_plan === 'CUSTOM';

  return (
    <div className="w-full h-full overflow-y-auto p-4 md:p-8 custom-scrollbar bg-black">
      <div className="max-w-5xl mx-auto flex flex-col gap-12 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12">
        
        {/* Row 1: Billing & Plan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[250px] shadow-lg">
            <CreditCard size={48} className="text-emerald-400 mb-6" />
            <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold uppercase tracking-widest text-xs shadow-inner">
              {formData.status === 'LIVE' ? 'Subscription Active' : 'Pending Checkout'}
            </span>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Financial Engine</h3>
            <p className="text-zinc-400 leading-relaxed font-light">
              Active recurring plan and payment status.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-inner mt-4">
              <div>
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 pl-1">Plan Tier</span>
                <select
                  value={formData.plan_tier || formData.selected_plan || 'FOUNDATION'}
                  onChange={(e) => setFormData({ ...formData, plan_tier: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="FOUNDATION">Foundation ($5/mo)</option>
                  <option value="PROFESSIONAL">Professional ($15/mo)</option>
                  <option value="CUSTOM">High-Ticket Custom</option>
                </select>
              </div>
              
              {/* CONDITIONAL STRIPE LINK */}
              {isCustomPlan && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 pl-1">Custom Stripe Payment URL</span>
                  <input
                    type="url"
                    value={formData.stripe_payment_url || ''}
                    onChange={(e) => setFormData({ ...formData, stripe_payment_url: e.target.value })}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Custom DNS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center mt-4">
          <div className="space-y-4 md:order-1 order-2">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Domain Routing</h3>
            <p className="text-zinc-400 leading-relaxed font-light">
              Wire up their professional .com address directly into the edge network.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-inner mt-4">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1 pl-1">Target Address</span>
              <div className="relative">
                <input
                  type="text"
                  value={formData.custom_domain || ''}
                  onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                  placeholder="e.g. luckystrikedesigns.com"
                  className="w-full bg-black border border-zinc-800 rounded-lg px-4 py-3 text-sm text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                {!formData.custom_domain && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-zinc-600 uppercase tracking-widest pointer-events-none">
                    Awaiting DNS
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[250px] shadow-lg md:order-2 order-1">
            <Globe size={48} className="text-cyan-400 mb-6" />
            <button className="bg-cyan-500 hover:bg-cyan-400 text-zinc-950 px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105 cursor-pointer">
              Configure DNS
            </button>
          </div>
        </div>

        {/* Row 3: System Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center mt-4">
          <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[250px] shadow-lg">
            <label className="flex flex-col items-center gap-4 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={formData.is_template || false}
                  onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
                />
                <div className={`block w-16 h-8 rounded-full transition-colors ${formData.is_template ? 'bg-fuchsia-500' : 'bg-zinc-800 border border-zinc-700'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.is_template ? 'translate-x-8' : ''}`}></div>
              </div>
              <span className="text-white font-black uppercase tracking-widest text-xs group-hover:text-cyan-400 transition-colors">
                {formData.is_template ? 'Public Prototype' : 'Private Tenant'}
              </span>
            </label>
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">System Classification</h3>
            <p className="text-zinc-400 leading-relaxed font-light">
              Toggle this setting to designate whether this build is a live customer tenant or a public prototype template intended for the main gallery.
            </p>
          </div>
        </div>
        
        {/* Danger Zone */}
        <div className="border-t border-zinc-800/80 pt-12 mt-4">
          <DangerZoneCard businessName={formData.business_name} onDelete={onTerminate} />
        </div>

      </div>
    </div>
  );
}