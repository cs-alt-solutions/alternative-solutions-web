/* src/components/dashboard/storefronts/editor/staging/StagingTab.tsx */
'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2, Copy, ExternalLink, History, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function StagingTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [copied, setCopied] = useState(false);
  
  // Status Logic mapped from our new system
  const currentStatus = formData.status || 'BUILDING';
  const isApproved = currentStatus === 'PENDING_PAYMENT' || currentStatus === 'LIVE';
  const hasBeenSent = currentStatus !== 'BUILDING';

  // Construct the staging URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://storefronts.alternativesolutions.io';
  const stagingUrl = `${baseUrl}/${formData.slug || 'preview'}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(stagingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = () => {
    // In production, this will trigger the PortalInviteEmail via your API
    setFormData({ ...formData, status: 'PROTOTYPE_SENT' });
    alert('Review link dispatched to client!');
  };

  const toggleApproval = () => {
    const newStatus = isApproved ? 'PROTOTYPE_SENT' : 'PENDING_PAYMENT';
    setFormData({ ...formData, status: newStatus });
  };

  return (
    <div className="w-full h-full p-6 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar bg-black">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header */}
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Staging & Approval</h2>
          <p className="text-zinc-400 mt-2 text-sm leading-relaxed">
            Generate the preview link, dispatch it to the client for review, and mark the build as approved once they give the green light.
          </p>
        </div>

        {/* STEP 1: The Preview Link */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="bg-zinc-800 text-zinc-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">1</span>
            Staging URL
          </h3>
          <div className="flex gap-3">
            <div className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 flex items-center overflow-hidden">
              <span className="text-sm text-zinc-300 font-mono truncate">{stagingUrl}</span>
            </div>
            <button 
              onClick={handleCopy}
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
              title="Copy to Clipboard"
            >
              {copied ? <CheckCircle2 size={18} className="text-emerald-400" /> : <Copy size={18} />}
            </button>
            <a 
              href={stagingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-3 rounded-xl transition-colors flex items-center justify-center"
              title="Open in New Tab"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>

        {/* STEP 2: Dispatch Review */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="bg-zinc-800 text-zinc-400 w-5 h-5 rounded-full flex items-center justify-center text-[10px]">2</span>
              Dispatch Link
            </h3>
            {hasBeenSent && (
              <span className="text-[10px] text-cyan-400 font-mono border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 rounded">
                DISPATCHED
              </span>
            )}
          </div>
          <p className="text-sm text-zinc-400 mb-6">
            Send an automated email to <strong className="text-zinc-200">{formData.contact_email || 'the client'}</strong> with instructions on how to review their new staging environment.
          </p>
          <button 
            onClick={handleDispatch}
            className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 px-4 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
          >
            <Send size={16} />
            Shoot Review Email
          </button>
        </div>

        {/* STEP 3: Client Approval */}
        <div className={`border rounded-2xl p-6 shadow-sm transition-colors duration-500 ${isApproved ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-zinc-900 border-zinc-800'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-1">
                <span className={`${isApproved ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-800 text-zinc-400'} w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors`}>3</span>
                Client Sign-Off
              </h3>
              <p className="text-sm text-zinc-400 pl-7">
                Did they approve the build? Mark as approved to unlock the final subscription handoff on the Grid tab.
              </p>
            </div>

            {/* Giant Toggle */}
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isApproved}
                onChange={toggleApproval}
              />
              <div className="w-14 h-8 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-zinc-300 after:border-zinc-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* Transmission Log (Simplified Audit Ledger) */}
        <div className="pt-8 border-t border-zinc-800/80">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <History size={16} className="text-zinc-500" />
            Transmission Logs
          </h3>
          <div className="bg-black border border-zinc-800 rounded-xl p-4 space-y-4">
            
            {/* Log 1: Creation */}
            <div className="flex gap-4">
              <div className="mt-0.5">
                <CheckCircle2 size={16} className="text-zinc-600" />
              </div>
              <div>
                <p className="text-sm text-zinc-300 font-medium">Staging Environment Initialized</p>
                <p className="text-xs text-zinc-600 font-mono mt-0.5">System • Logged</p>
              </div>
            </div>

            {/* Log 2: Sent */}
            {hasBeenSent && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                <div className="mt-0.5">
                  <ArrowRight size={16} className="text-cyan-500" />
                </div>
                <div>
                  <p className="text-sm text-cyan-400 font-medium">Review Link Dispatched to Client</p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">Admin • Logged</p>
                </div>
              </div>
            )}

            {/* Log 3: Approved */}
            {isApproved && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                <div className="mt-0.5">
                  <ShieldCheck size={16} className="text-emerald-500" />
                </div>
                <div>
                  <p className="text-sm text-emerald-400 font-medium">Build Approved by Client</p>
                  <p className="text-xs text-zinc-600 font-mono mt-0.5">Admin Override • Logged</p>
                </div>
              </div>
            )}

            {/* Pending State */}
            {!isApproved && (
              <div className="flex gap-4">
                <div className="mt-0.5">
                  <Clock size={16} className="text-zinc-700" />
                </div>
                <div>
                  <p className="text-sm text-zinc-500 italic font-medium">Awaiting final approval...</p>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}