'use client';

import React, { useState } from 'react';
import { Activity, Send, CreditCard, Mail, CheckCircle2, AlertTriangle, RefreshCw, Globe, Unlock, PlayCircle, ImageIcon, PauseCircle } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { dispatchStagingReview, quickUpdateStorefrontStatus } from '@/app/actions/storefronts';

export default function LifecyclePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  const currentStatus = (formData.status as string) || 'PENDING_BUILD';
  const currentPlan = formData.plan_tier || formData.selected_plan || 'FOUNDATION';
  const [isSendingCheckout, setIsSendingCheckout] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);

  const config = STOREFRONT_LIFECYCLE[currentStatus as StorefrontStatus] || STOREFRONT_LIFECYCLE['PENDING_BUILD'];

  // --- DATABASE HANDSHAKE + AUDIT LOGGER ---
  const handleStatusChange = async (newStatus: StorefrontStatus, customMessage?: string) => {
    if (window.confirm(`Update project status to ${newStatus}?`)) {
      const logType = newStatus === 'ACTIVE' ? 'ACTIVE' : newStatus;
      const logEntry = {
        type: logType,
        message: customMessage || `Project status updated to ${newStatus}.`,
        timestamp: new Date().toISOString()
      };

      setFormData({ 
        ...formData, 
        status: newStatus,
        audit_notes: [...(formData.audit_notes || []), logEntry]
      });
      
      try {
        const result = await quickUpdateStorefrontStatus(formData.id, newStatus, logEntry);
        if (!result || !result.success) throw new Error("Failed to update status");
      } catch (err: any) {
        console.error("Database sync failed:", err);
        alert("Failed to save status to database. Please refresh and try again.");
      }
    }
  };

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
         const transmitLog = {
           type: 'REVIEW_DISPATCHED',
           message: 'Staging architecture link securely transmitted to client for verification.',
           timestamp: new Date().toISOString()
         };
         setFormData({ 
           ...formData, 
           status: 'IN_REVIEW',
           audit_notes: [...(formData.audit_notes || []), transmitLog]
         });
         await quickUpdateStorefrontStatus(formData.id, 'IN_REVIEW', transmitLog);
      }
      
      try {
        await dispatchStagingReview(
          formData.id, 
          formData.slug, 
          formData.business_name || 'Your Storefront', 
          formData.contact_email,
          formData.plan_tier || 'Foundation Plan',
          formData.contact_name || formData.applicant_name || 'there'
        );
        alert("Review Email Successfully Dispatched!");
      } catch (err: any) {
        console.error("Dispatch Error:", err);
        alert("Failed to send email. Check the logs.");
        if (!isResend) {
          setFormData({ ...formData, status: 'BUILDING_CORE' });
          await quickUpdateStorefrontStatus(formData.id, 'BUILDING_CORE');
        }
      } finally {
        setIsSendingReview(false);
      }
    }
  };

  // --- BULLETPROOF PIPELINE DEFINITION ---
  const pipelineSteps = [
    { id: 'BUILDING_CORE', label: 'Design & Build' },
    { id: 'IN_REVIEW', label: 'Client Verification' },
    { id: 'CONTENT_ASSEMBLY', label: 'Content Assembly' },
    { id: 'ACTIVE', label: 'Live Edge Network' }
  ];

  let visualStatus = currentStatus;
  if (['AWAITING_PAYMENT', 'PENDING_BUILD'].includes(currentStatus)) visualStatus = 'BUILDING_CORE';
  if (['MAINTENANCE', 'HIDDEN'].includes(currentStatus)) visualStatus = 'ACTIVE';

  const currentIndex = pipelineSteps.findIndex(s => s.id === visualStatus);
  const isPaused = currentStatus === 'AWAITING_PAYMENT' || currentStatus === 'PENDING_BUILD';

  return (
    <div className="bg-zinc-900/60 border rounded-xl backdrop-blur-md transition-all duration-500 border-zinc-800 flex flex-col h-full max-h-150">
      
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

      {/* PIPELINE BODY (Scrollable Area) */}
      <div className="p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          
          {/* STEP 1: DESIGN & BUILD */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 0 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${
              isPaused ? 'bg-zinc-950 border-amber-500 text-amber-500' :
              currentIndex > 0 ? 'bg-cyan-500 border-cyan-500 text-black' : 
              currentIndex === 0 ? 'bg-zinc-950 border-cyan-500 text-cyan-500' : 
              'bg-zinc-950 border-zinc-800 text-zinc-600'
            }`}>
              {isPaused ? <PauseCircle size={14} /> : currentIndex > 0 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">1</span>}
            </div>
            
            <div className={`w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border shadow-sm flex flex-col gap-3 transition-all ${
              isPaused ? 'border-amber-500/30 bg-amber-500/5' : 'border-zinc-800 bg-black/50'
            }`}>
              <div className="flex flex-col gap-1">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 0 ? 'text-white' : 'text-zinc-500'}`}>
                  Core Architecture
                </span>
                {isPaused && (
                  <span className="text-[10px] font-mono text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle size={10} /> {config.label}
                  </span>
                )}
              </div>
              
              {currentIndex === 0 && (
                <div className="flex flex-col gap-3">
                  {!isPaused && (
                    <button onClick={() => handleTransmitReview(false)} disabled={isSendingReview || isPaused} className="w-full flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 disabled:grayscale">
                      {isSendingReview ? 'Transmitting...' : 'Transmit Review Link'} {!isSendingReview && <Send size={12} />}
                    </button>
                  )}

                  <div className={`flex items-center gap-2 ${!isPaused ? 'pt-2 border-t border-zinc-800/80' : ''}`}>
                    <button onClick={() => handleStatusChange('BUILDING_CORE', 'Project build initiated.')} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded border border-zinc-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 text-[9px] font-mono text-zinc-400 hover:text-emerald-400 transition-colors uppercase tracking-widest cursor-pointer">
                      <PlayCircle size={10} /> Set Building Core
                    </button>
                  </div>
                </div>
              )}

              {currentIndex > 0 && (
                <div className="pt-2 mt-1 border-t border-zinc-800/80">
                  <button 
                    onClick={() => handleStatusChange('BUILDING_CORE', 'Canvas manually unlocked for architectural edits.')} 
                    className="flex items-center gap-1.5 text-[9px] text-zinc-500 hover:text-amber-400 font-mono uppercase tracking-widest transition-colors cursor-pointer"
                    title="Unlock the Canvas to make edits"
                  >
                    <Unlock size={10} /> Unlock Canvas & Edit
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: IN REVIEW */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 1 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 1 ? 'bg-fuchsia-500 border-fuchsia-500 text-black' : currentIndex === 1 ? 'bg-zinc-950 border-fuchsia-500 text-fuchsia-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 1 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">2</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 1 ? 'text-white' : 'text-zinc-500'}`}>Client Review</span>
              </div>
              
              {currentIndex === 1 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-3">
                     <p className="text-[10px] text-zinc-400 font-medium italic">Staging link sent. Awaiting client sign-off...</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <button 
                      onClick={() => handleTransmitReview(true)} 
                      disabled={isSendingReview}
                      className="text-[9px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={10} className={isSendingReview ? "animate-spin" : ""} /> Resend Link
                    </button>

                    <button 
                      onClick={() => handleStatusChange('CONTENT_ASSEMBLY', 'Moved to Content Assembly.')} 
                      className="text-[9px] font-mono text-zinc-600 hover:text-fuchsia-400 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                    >
                      <AlertTriangle size={10}/> Advance to Assembly
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* STEP 3: CONTENT ASSEMBLY */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 2 ? 'bg-emerald-500 border-emerald-500 text-black' : currentIndex === 2 ? 'bg-zinc-950 border-emerald-500 text-emerald-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 2 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">3</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 2 ? 'text-white' : 'text-zinc-500'}`}>Content Assembly</span>
              </div>
              {currentIndex === 2 && (
                <button onClick={() => handleStatusChange('ACTIVE', 'Project moved to Live Production.')} className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
                  Make Live Production <CheckCircle2 size={12} />
                </button>
              )}
              {currentIndex < 2 && (
                <div className="text-[10px] text-zinc-600 font-mono italic">Locked pending review sign-off</div>
              )}
            </div>
          </div>

          {/* STEP 4: LIVE PRODUCTION */}
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex >= 3 ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              <Globe size={14} />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 3 ? 'text-white' : 'text-zinc-500'}`}>Live Production</span>
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