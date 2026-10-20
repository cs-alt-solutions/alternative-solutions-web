/* src/components/dashboard/storefronts/editor/grid/LifecyclePanel.tsx */
'use client';

import React, { useState } from 'react';
import { Activity, Send, CreditCard, Mail, CheckCircle2, AlertTriangle, RefreshCw, Globe, PlayCircle, Clock, BellRing } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { createStorefrontCheckout } from '@/app/actions/billing';
import { dispatchStagingReview, quickUpdateStorefrontStatus } from '@/app/actions/storefronts';

export default function LifecyclePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  const currentStatus = (formData.status as string) || 'PENDING_BUILD';
  const currentPlan = formData.plan_tier || formData.selected_plan || 'STANDARD';
  const [isSendingCheckout, setIsSendingCheckout] = useState(false);
  const [isSendingReview, setIsSendingReview] = useState(false);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  const handleStatusChange = async (newStatus: StorefrontStatus, customMessage?: string) => {
    if (window.confirm(`Update project status to ${newStatus}?`)) {
      const logEntry = {
        type: newStatus,
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

  const handleDispatchCheckout = async () => {
    setIsSendingCheckout(true);
    try {
      const response = await createStorefrontCheckout(formData.id, formData.contact_email || '');
      if (response.url) {
        alert(`Success! Stripe link generated.`);
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
      : `ATTENTION: You are about to dispatch the official Review Link to the client. Are you ready to transmit?`;

    if (window.confirm(msg)) {
      setIsSendingReview(true);
      if (!isResend) setFormData({ ...formData, status: 'IN_REVIEW' });
      
      try {
        await dispatchStagingReview(
          formData.id, 
          formData.slug, 
          formData.business_name || 'Your Storefront', 
          formData.primary_contact || 'Founder',
          formData.contact_email,
          formData.plan_tier || 'Standard'
        );
        alert("Review Email Successfully Dispatched!");
      } catch (err: any) {
        console.error("Dispatch Error:", err);
        alert("Failed to send email. Check the logs.");
        if (!isResend) setFormData({ ...formData, status: 'BUILDING_CORE' });
      } finally {
        setIsSendingReview(false);
      }
    }
  };

  const handleSendAssetReminder = async () => {
    if (window.confirm(`Send an asset reminder email to ${formData.contact_email}?`)) {
      setIsSendingReminder(true);
      try {
        // TODO: Wire this to your server action that triggers AssetReminderEmail.tsx
        // await dispatchAssetReminder(formData.contact_email, formData.primary_contact, formData.id);
        
        // Simulating the network request for now
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert("Reminder successfully dispatched to client.");
      } catch (err) {
        alert("Failed to send reminder.");
      } finally {
        setIsSendingReminder(false);
      }
    }
  };

  const pipelineSteps = [
    { id: 'QUEUE', label: 'Queue & Payment' },
    { id: 'BUILDING_CORE', label: 'Architecture Build' },
    { id: 'IN_REVIEW', label: 'Client Verification' },
    { id: 'CONTENT_ASSEMBLY', label: 'Content Assembly' },
    { id: 'ACTIVE', label: 'Live Edge Network' }
  ];

  let visualStatus = currentStatus;
  if (['AWAITING_PAYMENT', 'PENDING_BUILD'].includes(currentStatus)) visualStatus = 'QUEUE';
  if (['ACTIVE', 'MAINTENANCE', 'HIDDEN'].includes(currentStatus)) visualStatus = 'ACTIVE';
  if (currentStatus === 'AWAITING_ASSETS') visualStatus = 'CONTENT_ASSEMBLY';

  const currentIndex = pipelineSteps.findIndex(s => s.id === visualStatus);

  return (
    <div className="bg-zinc-900/60 border rounded-xl overflow-hidden backdrop-blur-md transition-all duration-500 border-zinc-800 flex flex-col h-full max-h-150">
      
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
             <Activity size={14} className={currentIndex >= 4 ? "text-emerald-400" : "text-cyan-400"} />
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

      <div className="p-6 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-3.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-zinc-800 before:to-transparent">
          
          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 0 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 0 ? 'bg-amber-500 border-amber-500 text-black' : currentIndex === 0 ? 'bg-zinc-950 border-amber-500 text-amber-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 0 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">1</span>}
            </div>
            
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 0 ? 'text-white' : 'text-zinc-500'}`}>Queue & Payment</span>
              
              {currentIndex === 0 && (
                <div className="flex flex-col gap-3">
                  {currentStatus === 'AWAITING_PAYMENT' ? (
                    <button onClick={handleDispatchCheckout} disabled={isSendingCheckout} className="w-full flex items-center justify-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
                      {isSendingCheckout ? 'Generating...' : 'Resend Checkout Link'} <Mail size={12} />
                    </button>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] text-zinc-400 font-medium italic">Payment cleared. Awaiting build trigger.</p>
                      <button onClick={() => handleStatusChange('BUILDING_CORE', 'Build manually initialized.')} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded bg-amber-500/10 border border-amber-500/50 hover:bg-amber-500/20 text-[9px] font-mono text-amber-400 transition-colors uppercase tracking-widest cursor-pointer">
                        <PlayCircle size={10} /> Initialize Build
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 1 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 1 ? 'bg-fuchsia-500 border-fuchsia-500 text-black' : currentIndex === 1 ? 'bg-zinc-950 border-fuchsia-500 text-fuchsia-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 1 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">2</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 1 ? 'text-white' : 'text-zinc-500'}`}>Core Architecture</span>
              {currentIndex === 1 && (
                <button onClick={() => handleTransmitReview(false)} disabled={isSendingReview} className="w-full flex items-center justify-center gap-2 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50">
                  {isSendingReview ? 'Transmitting...' : 'Transmit Review Link'} {!isSendingReview && <Send size={12} />}
                </button>
              )}
            </div>
          </div>

          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 2 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 2 ? 'bg-cyan-500 border-cyan-500 text-black' : currentIndex === 2 ? 'bg-zinc-950 border-cyan-500 text-cyan-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 2 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">3</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 2 ? 'text-white' : 'text-zinc-500'}`}>Client Verification</span>
              </div>
              
              {currentIndex === 2 && (
                <div className="flex flex-col gap-3">
                  <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-lg p-3">
                    <p className="text-[10px] text-zinc-400 font-medium italic">Awaiting client sign-off or revision notes...</p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-1">
                    <button onClick={() => handleTransmitReview(true)} disabled={isSendingReview} className="text-[9px] font-mono text-cyan-500 hover:text-cyan-400 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer disabled:opacity-50">
                      <RefreshCw size={10} className={isSendingReview ? "animate-spin" : ""} /> Resend Link
                    </button>
                    <button onClick={() => handleStatusChange('CONTENT_ASSEMBLY', 'Client verified architecture. Proceeding to Content Assembly.')} className="text-[9px] font-mono text-zinc-600 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-1 cursor-pointer">
                      <AlertTriangle size={10}/> Force Assemble
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 3 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex > 3 ? 'bg-indigo-500 border-indigo-500 text-black' : currentIndex === 3 ? 'bg-zinc-950 border-indigo-500 text-indigo-500' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              {currentIndex > 3 ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-black">4</span>}
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 3 ? 'text-white' : 'text-zinc-500'}`}>Content Assembly</span>
              </div>
              {currentIndex === 3 && (
                <div className="flex flex-col gap-3">
                  {currentStatus === 'AWAITING_ASSETS' ? (
                    <>
                      <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-3">
                        <p className="text-[10px] text-violet-400 font-medium italic">Project paused. Awaiting client assets.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button onClick={handleSendAssetReminder} disabled={isSendingReminder} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer">
                           {isSendingReminder ? 'Sending...' : 'Send Nudge'} {!isSendingReminder && <BellRing size={12} />}
                        </button>
                        <button onClick={() => handleStatusChange('CONTENT_ASSEMBLY', 'Assets received. Resuming assembly.')} className="flex items-center justify-center gap-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer">
                          Resume <PlayCircle size={12} />
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] text-zinc-400 font-medium italic">Injecting vault data, copy, and media.</p>
                      <button onClick={() => handleStatusChange('AWAITING_ASSETS', 'Architecture built. Awaiting client assets.')} className="w-full flex items-center justify-center gap-2 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
                        Wait for Client Assets <Clock size={12} />
                      </button>
                      <button onClick={() => handleStatusChange('ACTIVE', 'Assembly complete. Site deployed to production.')} className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
                        Publish & Go Live <Globe size={12} />
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={`relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group transition-opacity duration-300 ${currentIndex >= 4 ? 'opacity-100' : 'opacity-40'}`}>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${currentIndex >= 4 ? 'bg-emerald-500 border-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-zinc-950 border-zinc-800 text-zinc-600'}`}>
              <Globe size={14} />
            </div>
            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-1.5rem)] p-4 rounded-xl border border-zinc-800 bg-black/50 shadow-sm flex flex-col gap-3">
              <span className={`text-[10px] font-black uppercase tracking-widest ${currentIndex >= 4 ? 'text-white' : 'text-zinc-500'}`}>Live Production</span>
              {currentIndex >= 4 && (
                 <p className="text-[10px] text-emerald-400 font-medium leading-relaxed">
                   Storefront is active on the network.
                 </p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}