/* src/components/dashboard/storefronts/editor/staging/StagingTab.tsx */
'use client';

import React, { useState } from 'react';
import { ShieldCheck, ExternalLink, RefreshCw, CheckCircle2, AlertTriangle, Send } from 'lucide-react';

interface StagingTabProps {
  store: {
    id?: string;
    slug?: string;
    status?: string;
    business_name?: string;
    contact_email?: string;
    [key: string]: unknown;
  };
  onUpdate: (fields: Record<string, unknown>) => void;
}

export default function StagingTab({ store, onUpdate }: StagingTabProps) {
  const [isSaving, setIsSaving] = useState(false);
  const stagingUrl = `https://alternativesolutions.io/${store.slug || ''}`;
  const currentStatus = (store.status as string) || 'DRAFT';

  const handleStatusChange = async (newStatus: string) => {
    setIsSaving(true);
    try {
      onUpdate({ status: newStatus });
      // Simulate save delay for feedback loop
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h3 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <ShieldCheck className="text-cyan-400" size={22} />
            Staging &amp; Client Review Portal
          </h3>
          <p className="text-xs text-zinc-400 mt-1 font-light">
            Manage staging link visibility, client QA audit checkpoints, and launch approvals for {store.business_name || 'this storefront'}.
          </p>
        </div>

        <a
          href={stagingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-cyan-400 text-zinc-950 hover:bg-cyan-300 transition shadow-[0_0_15px_rgba(34,211,238,0.3)] shrink-0"
        >
          <span>Preview Live Staging</span>
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Status Management Card */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-widest">Storefront Lifecycle Status</h4>
            <p className="text-xs text-zinc-400 mt-1">Controls whether the client sees the floating Staging QA Review overlay.</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border ${
            currentStatus === 'APPROVED' || currentStatus === 'LIVE' 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : currentStatus === 'IN_REVIEW' 
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' 
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
          }`}>
            {currentStatus}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            type="button"
            onClick={() => handleStatusChange('DRAFT')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentStatus === 'DRAFT' ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1">Draft Mode</div>
            <div className="text-[11px] font-light text-zinc-500">Internal work in progress. No QA overlay.</div>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('IN_REVIEW')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentStatus === 'IN_REVIEW' ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-300' : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1">In Review (Staging)</div>
            <div className="text-[11px] font-light text-zinc-500">Mounts the client QA audit floating card.</div>
          </button>

          <button
            type="button"
            onClick={() => handleStatusChange('APPROVED')}
            className={`p-4 rounded-2xl border text-left transition-all ${
              currentStatus === 'APPROVED' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300' : 'bg-zinc-950/50 border-zinc-800/80 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1">Approved &amp; Live</div>
            <div className="text-[11px] font-light text-zinc-500">Signed off and routed to checkout/portal.</div>
          </button>
        </div>
      </div>

      {/* Staging URL & Dispatch Info */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-4">
        <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Send size={16} className="text-cyan-400" />
          Client Review Handover
        </h4>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Send this secure link to the client ({store.contact_email || 'No email set'}) so they can review their build and complete the interactive staging checklist:
        </p>

        <div className="flex items-center gap-3 p-3.5 bg-black/60 border border-zinc-800 rounded-xl font-mono text-xs text-cyan-400 select-all">
          <span className="truncate flex-1">{stagingUrl}</span>
        </div>
      </div>

    </div>
  );
}