/* src/components/dashboard/storefronts/editor/GridTab.tsx */
'use client';

import React from 'react';
import { CreditCard, Globe, Server, Activity, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import DangerZoneCard from './DangerZoneCard';

export default function GridTab({ formData, setFormData, onTerminate }: { formData: any, setFormData: any, onTerminate: () => void }) {
  const isCustomPlan = formData.plan_tier === 'CUSTOM' || formData.selected_plan === 'CUSTOM';
  const currentStatus = formData.status || 'BUILDING';
  const isLive = currentStatus === 'LIVE';

  return (
    <div className="w-full h-full overflow-y-auto p-6 md:p-8 custom-scrollbar bg-black">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300 pb-12 pt-2">
        
        {/* ========================================================
            ROW 1: HIGH-DENSITY TELEMETRY (BENTO BOX) 
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Telemetry 1: Lifecycle Status */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${isLive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                <Activity size={20} />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">System Status</span>
                <span className={`text-sm font-bold uppercase tracking-wider ${isLive ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {currentStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry 2: Edge Network */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Globe size={20} />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">Assigned Domain</span>
                <span className="text-sm font-bold text-white tracking-wide truncate max-w-[150px] block">
                  {formData.custom_domain || 'Awaiting DNS'}
                </span>
              </div>
            </div>
          </div>

          {/* Telemetry 3: System Classification */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-fuchsia-500/10 text-fuchsia-400">
                <Server size={20} />
              </div>
              <div>
                <span className="block text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-0.5">Architecture</span>
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  {formData.is_template ? 'Public Prototype' : 'Private Tenant'}
                </span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={formData.is_template || false}
                onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-500"></div>
            </label>
          </div>
        </div>

        {/* ========================================================
            ROW 2: SUBSCRIPTION & ROUTING HUB
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* LEFT COLUMN: Subscription Setup */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <CreditCard className="text-emerald-400" size={24} />
                Subscription Configuration
              </h3>
              <p className="text-zinc-400 text-sm mt-1">Assign a recurring plan and dispatch the final checkout link.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-inner space-y-5">
              
              <div>
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 pl-1">Target Plan Tier</span>
                <select
                  value={formData.plan_tier || formData.selected_plan || 'FOUNDATION'}
                  onChange={(e) => setFormData({ ...formData, plan_tier: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-white font-bold uppercase tracking-wider focus:outline-none focus:border-emerald-500/50 transition-colors appearance-none cursor-pointer"
                >
                  <option value="FOUNDATION">Foundation ($5/mo)</option>
                  <option value="PROFESSIONAL">Professional ($15/mo)</option>
                  <option value="CUSTOM">High-Ticket Custom</option>
                </select>
              </div>

              {isCustomPlan && (
                <div className="animate-in fade-in slide-in-from-top-2">
                  <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 pl-1">Custom Stripe Payment URL</span>
                  <input
                    type="url"
                    value={formData.stripe_payment_url || ''}
                    onChange={(e) => setFormData({ ...formData, stripe_payment_url: e.target.value })}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500/50 transition-colors"
                  />
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  Email Subscription Link
                  <ArrowUpRight size={14} />
                </button>
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: Domain Routing */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                <Globe className="text-cyan-400" size={24} />
                Domain Routing
              </h3>
              <p className="text-zinc-400 text-sm mt-1">Wire up their professional .com address directly into the edge network.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-inner space-y-5">
              <div>
                <span className="block text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-2 pl-1">Custom Domain Target</span>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.custom_domain || ''}
                    onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                    placeholder="luckystrikedesigns.com"
                    className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-cyan-400 font-mono focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                  <button className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 px-6 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                    Link DNS
                  </button>
                </div>
              </div>

              {/* Status Verification */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                <div className="p-2 bg-black rounded-lg border border-zinc-800">
                    <CheckCircle2 size={16} className={isLive ? "text-emerald-500" : "text-zinc-700"} />
                </div>
                <span className="text-sm font-mono text-zinc-400">
                    {isLive ? 'Subscription verified. Domain routing active.' : 'Awaiting subscription verification to lock routing.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            ROW 3: DANGER ZONE
            ======================================================== */}
        <div className="border-t border-zinc-800/80 pt-10 mt-4">
          <DangerZoneCard businessName={formData.business_name} onDelete={onTerminate} />
        </div>

      </div>
    </div>
  );
}