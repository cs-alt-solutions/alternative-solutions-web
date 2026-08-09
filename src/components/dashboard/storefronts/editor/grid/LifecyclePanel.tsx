'use client';

import React from 'react';
import { Activity, Send, CreditCard } from 'lucide-react';
import CheckoutButton from '../CheckoutButton';

export default function LifecyclePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  const currentStatus = formData.status || 'BUILDING';
  const isCustomPlan = formData.plan_tier === 'CUSTOM' || formData.selected_plan === 'CUSTOM';
  const isLive = currentStatus === 'ACTIVE' || currentStatus === 'LIVE';

  const statusColor = 
    isLive ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
    currentStatus === 'APPROVED' ? 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/30' :
    currentStatus === 'IN REVIEW' ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' :
    currentStatus === 'HIDDEN' ? 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30' :
    currentStatus === 'CANCELED' ? 'text-red-400 bg-red-500/10 border-red-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      {/* HEADER: High-Contrast Status Strip */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
             <Activity size={14} className="text-zinc-400" />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Lifecycle & Operations</h3>
        </div>
        
        <select
          value={currentStatus}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded outline-none cursor-pointer appearance-none border transition-all ${statusColor}`}
        >
          <option value="BUILDING" className="bg-black text-amber-400">BUILDING</option>
          <option value="IN REVIEW" className="bg-black text-cyan-400">IN REVIEW</option>
          <option value="APPROVED" className="bg-black text-fuchsia-400">APPROVED</option>
          <option value="ACTIVE" className="bg-black text-emerald-400">ACTIVE</option>
          <option value="HIDDEN" className="bg-black text-zinc-400">HIDDEN (MAINTENANCE)</option>
          <option value="CANCELED" className="bg-black text-red-400">CANCELED</option>
        </select>
      </div>

      {/* BODY: Tight Bento Grid */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Module 1: Financial Target */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 mb-1">
             <CreditCard size={12} className="text-zinc-500" />
             <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Target Plan Tier</label>
          </div>
          <select
            value={formData.plan_tier || formData.selected_plan || 'FOUNDATION'}
            onChange={(e) => setFormData({ ...formData, plan_tier: e.target.value })}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-xs text-white font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="FOUNDATION">Foundation ($5/mo)</option>
            <option value="PROFESSIONAL">Professional ($15/mo)</option>
            <option value="CUSTOM">High-Ticket Custom</option>
          </select>

          {isCustomPlan && (
            <div className="animate-in fade-in slide-in-from-top-2 pt-2 border-t border-zinc-800/80">
              <input
                type="url"
                value={formData.stripe_payment_url || ''}
                onChange={(e) => setFormData({ ...formData, stripe_payment_url: e.target.value })}
                placeholder="Stripe Payment Link URL..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-[10px] text-cyan-400 font-mono focus:outline-none focus:border-cyan-500 transition-colors placeholder:text-zinc-600"
              />
            </div>
          )}
        </div>

        {/* Module 2: Dispatch Actions */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 space-y-3">
          <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
             <Send size={12} className="text-zinc-500" /> Dispatch Controls
          </label>
          
          <button 
            onClick={() => {
               setFormData({ ...formData, status: 'IN REVIEW' });
               alert("Review Email Dispatched! (Status updated to IN REVIEW)");
            }}
            className="w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 py-2.5 px-4 rounded-md text-[10px] font-black uppercase tracking-widest transition-all shadow-[inset_0_0_10px_rgba(6,182,212,0.05)]"
          >
            <span>Transmit Review Link</span>
            <Send size={12} />
          </button>
          
          <div className={`transition-opacity duration-300 ${currentStatus === 'APPROVED' || isLive ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
            <CheckoutButton 
              storefrontId={formData.id} 
              clientEmail={formData.contact_email} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}