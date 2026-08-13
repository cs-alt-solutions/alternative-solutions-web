'use client';

import React, { useState } from 'react';
import { Activity, Send, CreditCard, Mail, CheckCircle2, AlertTriangle, RefreshCw, Globe } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { dispatchStagingReview } from '@/app/actions/storefronts';

export default function LifecyclePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  const currentStatus = (formData.status as string) || 'BUILDING';
  const currentPlan = formData.plan_tier || formData.selected_plan || 'FOUNDATION';
  const [isSendingCheckout, setIsSendingCheckout] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);

  // Safe config fallback using type casting
  const config = STOREFRONT_LIFECYCLE[currentStatus as StorefrontStatus] || STOREFRONT_LIFECYCLE['BUILDING'];

  // --- AUTOMATION ACTIONS ---
  const handleDispatchCheckout = async () => {
    setIsSendingCheckout(true);
    try {
      const response = await createStorefrontCheckout(formData.id, formData.contact_email || '');
      if (response.url) {
        alert(`Success! Stripe link generated. The checkout activation email has been securely dispatched to the client.`);
      } else {
        alert("Failed to generate checkout link. Please check the server logs.");
      }
    } catch (err) {
      console.error("Critical Checkout Error:", err);
      alert("A critical error occurred while contacting Stripe.");
    } finally {
      setIsSendingCheckout(false);
    }
  };

  const handleTransmitReview = async (isResend = false) => {
    const msg = isResend 
      ? `Resend the Staging Review email to ${formData.contact_email}?`
      : `ATTENTION: You are about to lock this architecture and dispatch the official Review Link to the client. Are you ready to transmit?`;

    const isReady = window.confirm(msg);
    
    if (isReady) {
      setIsSendingReview(true);
      if (!isResend) {
         setFormData({ ...formData, status: 'IN REVIEW' });
      }
      
      try {
        await dispatchStagingReview(
          formData.id, 
          formData.slug, 
          formData.business_name || 'Your Storefront', 
          formData.contact_email,
          formData.plan_tier || 'Foundation Plan'
        );
        alert("Review Email Successfully Dispatched!");
      } catch (err: any) {
        console.error("Dispatch Error:", err);
        alert("Failed to send email. Check the logs.");
        if (!isResend) setFormData({ ...formData, status: 'BUILDING' });
      } finally {
        setIsSendingReview(false);
      }
    }
  };

  // --- BULLETPROOF PIPELINE DEFINITION ---
  const pipelineSteps = [
    { id: 'BUILDING', label: 'Architecture & Build' },
    { id: 'IN REVIEW', label: 'Client Verification' },
    { id: 'APPROVED', label: 'Subscription Gate' },
    { id: 'ACTIVE', label: 'Live Edge Network' }
  ];

  // Robust mapping so the UI never crashes on an unmapped string
  let visualStatus = currentStatus;
  if (['CHANGES_REQUESTED'].includes(currentStatus)) visualStatus = 'IN REVIEW';
  if (['APPROVED_PENDING_BILLING'].includes(currentStatus)) visualStatus = 'APPROVED';
  if (['ACTIVE', 'LIVE', 'MAINTENANCE', 'HIDDEN'].includes(currentStatus)) visualStatus = 'ACTIVE';

  const currentIndex = pipelineSteps.findIndex(s => s.id === visualStatus);

  return (
    <div className="bg-zinc-900/60 border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 border-zinc-800 flex flex-col">
      
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
             <Activity size={14} className={currentIndex >= 3 ? "text-emerald-400" : "text-cyan-400"} />
          </div>
          <div>
            <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Deployment Pipeline</h3>
          </div>
        </div>
        
        <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 px-3 py-1.5 rounded-full">
          <CreditCard size={10} className="text-zinc-500" />
          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{currentPlan} TIER</span>
        </div>
      </div>

      {/* PIPELINE BODY */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          
          {/* STEP 1: BUILDING */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 0 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 0 ? 'bg-cyan-500 border-cyan-500 text-black' : currentIndex === 0 ? 'bg-zinc-950 border-cyan-500 text-cyan-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 0 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">1</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 0 ? 'text-white' : 'text-zinc-500'}`}>Architecture</span>
              </div>
              {currentIndex === 0 && (
                <button onClick={() => handleTransmitReview(false)} disabled={isSendingReview} className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50">
                  {isSendingReview ? 'Transmitting...' : 'Transmit Review Link'} {!isSendingReview && <Send size={12} />}
                </button>
              )}
            </div>
          </div>

          {/* STEP 2: IN REVIEW / CHANGES REQUESTED */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 1 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 1 ? 'bg-fuchsia-500 border-fuchsia-500 text-black' : currentIndex === 1 ? 'bg-zinc-950 border-fuchsia-500 text-fuchsia-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 1 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">2</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 1 ? 'text-white' : 'text-zinc-500'}`}>Client Verification</span>
                {currentStatus === 'CHANGES_REQUESTED' && (
                  <span className="px-2 py-0.5 rounded text-[8px] font-black bg-rose-500/10 text-rose-400 uppercase tracking-widest border border-rose-500/20">Tweaks Needed</span>
                )}
              </div>
              
              {currentIndex === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-3">
                    {currentStatus === 'CHANGES_REQUESTED' ? (
                       <p className="text-[10px] text-zinc-300 font-medium leading-relaxed">
                         Client has submitted revision notes. Please check the Audit Ledger, make changes, and resend the link.
                       </p>
                    ) : (
                       <p className="text-[10px] text-zinc-400 font-medium italic">Awaiting client sign-off or revision notes...</p>
                    )}
                  </div>
                  
                  {/* Action Bar */}
                  <div className="flex items-center justify-between mt-1">
                    <button 
                      onClick={() => handleTransmitReview(true)} 
                      disabled={isSendingReview}
                      className="text-[9px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={10} className={isSendingReview ? "animate-spin" : ""} /> Resend Link
                    </button>

                    <button 
                      onClick={() => {
                         if(window.confirm("Force override to APPROVED state?")) {
                            setFormData({...formData, status: 'APPROVED'});
                         }
                      }} 
                      className="text-[9px] font-mono text-zinc-600 hover:text-fuchsia-400 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle size={10}/> Force Approve
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: FINANCIAL HANDSHAKE */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 2 ? 'bg-emerald-500 border-emerald-500 text-black' : currentIndex === 2 ? 'bg-zinc-950 border-emerald-500 text-emerald-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 2 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">3</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 2 ? 'text-white' : 'text-zinc-500'}`}>Subscription Gate</span>
              </div>
              {currentIndex === 2 && (
                <button onClick={handleDispatchCheckout} disabled={isSendingCheckout} className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
                  {isSendingCheckout ? 'Generating...' : 'Resend Checkout'} <Mail size={12} />
                </button>
              )}
              {currentIndex < 2 && (
                <div className="text-[10px] text-zinc-600 font-mono italic">Locked pending approval</div>
              )}
            </div>
          </div>

          {/* STEP 4: LIVE EDGE NETWORK */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex >= 3 ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              <Globe size={14} />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 3 ? 'text-white' : 'text-zinc-500'}`}>Live Edge Network</span>
              </div>
              {currentIndex >= 3 && (
                 <p className="text-[10px] text-emerald-400 font-medium leading-relaxed">
                   Storefront is active. Payment link verified and infrastructure is online.
                 </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}