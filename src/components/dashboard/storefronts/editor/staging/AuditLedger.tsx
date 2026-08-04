'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  ClipboardCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Check,
  CreditCard,
  ArrowUpCircle,
  ReceiptText
} from 'lucide-react';

const CHECKPOINT_TITLES: Record<string, string> = {
  '0': 'First Impression & Hero',
  '1': 'Your Story & Background',
  '2': 'Services & Offerings',
  '3': 'Lead Routing Verification'
};

export default function AuditLedger({ formData }: { formData: any }) {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResolving, setIsResolving] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudits = async () => {
      if (!formData?.slug) return;
      const { data } = await supabase
        .from('storefront_audits')
        .select('*')
        .eq('storefront_slug', formData.slug)
        .order('created_at', { ascending: false });
        
      if (data) setAuditLogs(data);
      setIsLoading(false);
    };
    fetchAudits();
  }, [formData?.slug]);

  const handleResolve = async (auditId: string) => {
    if (!window.confirm("Mark these revisions as complete?")) return;
    setIsResolving(auditId);
    
    try {
      // 1. Mark specific log as resolved
      const { error: auditError } = await supabase
        .from('storefront_audits')
        .update({ status: 'RESOLVED' })
        .eq('id', auditId);
      if (auditError) throw auditError;

      // 2. Clear the master storefront flag back to In Review
      const { error: storeError } = await supabase
        .from('storefronts')
        .update({ status: 'IN REVIEW' })
        .eq('id', formData.id);
      if (storeError) throw storeError;

      setAuditLogs(prev => prev.map(log => log.id === auditId ? { ...log, status: 'RESOLVED' } : log));
      alert('Updates logged! Next up: Transmit the updated link to the client.');
      
    } catch (err) {
      console.error(err);
      alert('Failed to resolve log.');
    } finally {
      setIsResolving(null);
    }
  };

  // Helper to determine the visual styling of the ledger entry
  const getLedgerConfig = (status: string) => {
    switch(status) {
      case 'APPROVED':
      case 'APPROVED_PENDING_BILLING':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', icon: CheckCircle2, label: 'Sign-Off Complete' };
      case 'RESOLVED':
        return { bg: 'bg-zinc-800', border: 'border-zinc-700', text: 'text-zinc-400', icon: Check, label: 'Fixed & Resolved' };
      case 'CHANGES_REQUESTED':
        return { bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400', icon: AlertCircle, label: 'Tweaks Requested' };
      case 'SUBSCRIPTION_STARTED':
        return { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: CreditCard, label: 'Hosting Activated ($5)' };
      case 'SUBSCRIPTION_UPGRADED':
        return { bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', text: 'text-fuchsia-400', icon: ArrowUpCircle, label: 'Tier Upgraded ($15)' };
      case 'PAYMENT_SUCCESS':
        return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', icon: ReceiptText, label: 'Payment Receipt' };
      default:
        return { bg: 'bg-zinc-800', border: 'border-zinc-700', text: 'text-zinc-400', icon: AlertCircle, label: status };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-zinc-800 rounded-2xl">
        <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-8 shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-6 mb-6">
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <ClipboardCheck size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Telemetry Ledger</h2>
          <p className="text-zinc-400 text-sm font-light mt-1">Lifecycle tracking: Audits, approvals, and financial receipts.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {auditLogs.length === 0 ? (
          <div className="text-center p-8 border border-zinc-800 bg-zinc-950/50 rounded-xl text-zinc-600 font-mono text-xs uppercase tracking-widest">
            No telemetry logged yet.
          </div>
        ) : (
          auditLogs.map((log) => {
            const config = getLedgerConfig(log.status);
            const isFinancial = ['SUBSCRIPTION_STARTED', 'SUBSCRIPTION_UPGRADED', 'PAYMENT_SUCCESS'].includes(log.status);
            const isResolved = log.status === 'RESOLVED';
            
            const parsedNotes = typeof log.audit_notes === 'string' ? JSON.parse(log.audit_notes) : log.audit_notes || {};
            const clientNotes = parsedNotes.client_notes || {};
            const hasActionableNotes = Object.keys(clientNotes).length > 0;

            return (
              <div key={log.id} className={`p-5 rounded-2xl border transition-all ${isResolved ? 'bg-zinc-950 border-zinc-800/50 opacity-60' : 'bg-zinc-900 border-zinc-700 shadow-lg'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 w-fit ${config.bg} ${config.border} ${config.text}`}>
                      <config.icon size={12} />
                      {config.label}
                    </span>
                    <p className="text-[10px] text-zinc-500 font-mono mt-2">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                  
                  {/* Action Button for Unresolved Audit Notes */}
                  {log.status === 'CHANGES_REQUESTED' && (
                    <button 
                      onClick={() => handleResolve(log.id)}
                      disabled={isResolving === log.id}
                      className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      {isResolving === log.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Resolve & Ping
                    </button>
                  )}
                </div>

                {/* Content Block: Financial Receipt OR Audit Notes */}
                {isFinancial ? (
                  <div className="mt-4 border-t border-zinc-800 pt-4">
                    <div className="bg-black/40 border border-zinc-800/80 rounded-lg p-3">
                      <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest block mb-1">
                        System Payload
                      </span>
                      <p className="text-sm text-zinc-300 font-mono">
                        {log.audit_notes || 'Transaction verified via Stripe.'}
                      </p>
                    </div>
                  </div>
                ) : hasActionableNotes ? (
                  <div className="space-y-3 mt-4 border-t border-zinc-800 pt-4">
                    {Object.entries(clientNotes).map(([stepIdx, text]) => (
                      <div key={stepIdx} className="bg-black/40 border border-zinc-800/80 rounded-lg p-3">
                        <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest block mb-1">
                          Section: {CHECKPOINT_TITLES[stepIdx] || 'General'}
                        </span>
                        <p className={`text-sm leading-relaxed ${isResolved ? 'text-zinc-500 line-through' : 'text-zinc-300'}`}>
                          &ldquo;{String(text)}&rdquo;
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}