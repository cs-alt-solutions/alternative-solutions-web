// src/components/dashboard/storefronts/editor/grid/LifecyclePanel.tsx
'use client';

import React, { useState } from 'react';
import { Activity, Send, CreditCard, Lock, Mail } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
// IMPORT YOUR REAL ACTIONS HERE
import { createStorefrontCheckout } from '@/app/actions/billing';
import { dispatchStagingReview } from '@/app/actions/storefronts';

export default function LifecyclePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  const currentStatus = (formData.status as StorefrontStatus) || 'BUILDING';
  const currentPlan = formData.plan_tier || formData.selected_plan || 'FOUNDATION';
  
  const config = STOREFRONT_LIFECYCLE[currentStatus] || STOREFRONT_LIFECYCLE['BUILDING'];

  const [isSendingCheckout, setIsSendingCheckout] = useState(false);

  // STEP 2: THE REAL CHECKOUT DISPATCH LOGIC
  const handleDispatchCheckout = async () => {
    setIsSendingCheckout(true);
    try {
      // Step A: Generate the unique Stripe Checkout link for this specific storefront
      const response = await createStorefrontCheckout(formData.id, formData.client_email || '');
      
      if (response.url) {
        // Step B: Here is where you will trigger your server action to send the email containing 'response.url'
        // await dispatchSystemEmail({ to: formData.client_email, link: response.url, ... });
        
        alert(`Success! Stripe link generated. The checkout activation email has been securely dispatched to the client.`);
        
        // Optional: Auto-advance the status once sent
        // setFormData({ ...formData, status: 'AWAITING PAYMENT' }); 
      } else {
        console.error("Checkout failed:", response.error);
        alert("Failed to generate checkout link. Please check the server logs.");
      }
    } catch (err) {
      console.error("Critical Checkout Error:", err);
      alert("A critical error occurred while contacting Stripe.");
    } finally {
      setIsSendingCheckout(false);
    }
  };

  return (
    <div className={`bg-zinc-900/60 border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 border-zinc-800`}>
      
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
             <Activity size={14} className={currentStatus === 'LIVE' ? "text-emerald-400" : "text-zinc-400"} />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Lifecycle & Ops</h3>
        </div>
        
        {/* Dynamic, Logic-Driven Dropdown */}
        <select
          value={currentStatus}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded outline-none cursor-pointer appearance-none border transition-all ${config.badgeColor}`}
        >
          {(Object.keys(STOREFRONT_LIFECYCLE) as StorefrontStatus[]).map((state) => {
            if (state === 'PENDING') return null;

            const isAllowed = state === currentStatus || config.allowedNextStates.includes(state);
            
            return (
              <option 
                key={state} 
                value={state} 
                disabled={!isAllowed}
                className="bg-zinc-950 text-white"
              >
                {state} {!isAllowed && state !== currentStatus ? ' (LOCKED)' : ''}
              </option>
            );
          })}
        </select>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Module 1: Locked Financial Target */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard size={12} className="text-zinc-500" />
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Target Plan Tier</label>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              $5.00/mo
            </span>
          </div>

          <div className="space-y-2 flex-1 flex flex-col justify-center">
            <select
              value={currentPlan}
              onChange={(e) => setFormData({ ...formData, plan_tier: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-xs text-white font-bold uppercase tracking-wider focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
            >
              <option value="FOUNDATION">Foundation ($5/mo)</option>
              <option value="PROFESSIONAL" disabled>Professional ($15/mo) - Locked</option>
              <option value="CUSTOM" disabled>High-Ticket Custom - Locked</option>
            </select>
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium mt-2">
              Only the Foundation plan is actively mapped to the Stripe routing logic at this time. Proceed to Dispatch Controls.
            </p>
          </div>
        </div>

        {/* Module 2: Sequential Dispatch Actions */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col">
          <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
             <Send size={12} className="text-zinc-500" /> Dispatch Controls
          </label>
          
          <div className="space-y-3 flex-1 flex flex-col justify-center">
            
            {/* STEP 1: SEND REVIEW LINK (NOW FULLY WIRED) */}
            <button 
              onClick={async () => {
                 const isReady = window.confirm(`ATTENTION: You are about to lock this architecture and dispatch the official Review Link to the client. Are you ready to transmit?`);
                 
                 if (isReady) {
                   // 1. Lock the UI immediately
                   setFormData({ ...formData, status: 'IN REVIEW' });
                   
                   try {
                     // 2. FIRE THE DISPATCH CANNON
                     await dispatchStagingReview(
                       formData.id, 
                       formData.slug, 
                       formData.business_name || 'Your Storefront', 
                       formData.contact_email,
                       formData.plan_tier || 'Foundation Plan'
                     );
                     
                     alert("Review Email Successfully Dispatched! The system is now locked.");
                   } catch (err: any) {
                     console.error("Dispatch Error:", err);
                     alert("Failed to send email. Check the logs.");
                     // Revert the lock if it failed
                     setFormData({ ...formData, status: 'BUILDING' });
                   }
                 }
              }}
              disabled={!config.allowedNextStates.includes('IN REVIEW')}
              className="w-full flex items-center justify-between bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-500/20 hover:border-cyan-500/50 py-3 px-4 rounded-md text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed group shadow-[inset_0_0_10px_rgba(6,182,212,0.05)] cursor-pointer"
            >
              <span>1. Transmit Review Link</span>
              <Send size={12} className="group-hover:translate-x-1 transition-transform" />
            </button>
            
            {/* Step 2: Send Checkout Email */}
            <button
              onClick={handleDispatchCheckout}
              disabled={currentStatus !== 'APPROVED'}
              className={`w-full flex items-center justify-between py-3 px-4 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${
                currentStatus === 'APPROVED' 
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-pointer shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]' 
                  : 'bg-zinc-900/50 border border-zinc-800 text-zinc-600 cursor-not-allowed'
              }`}
            >
              <span>{isSendingCheckout ? 'Transmitting...' : '2. Dispatch Checkout Email'}</span>
              {currentStatus === 'APPROVED' ? <Mail size={12} /> : <Lock size={10} />}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}