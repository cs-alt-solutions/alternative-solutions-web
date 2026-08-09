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
  ReceiptText,
  Clock
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

  // Clean, modern text colors based on the event status
  const getLedgerTheme = (status: string) => {
    switch(status) {
      case 'APPROVED':
      case 'APPROVED_PENDING_BILLING':
        return { text: 'text-emerald-400', icon: CheckCircle2, label: 'Client Approved' };
      case 'RESOLVED':
        return { text: 'text-zinc-500', icon: Check, label: 'Revisions Completed' };
      case 'CHANGES_REQUESTED':
        return { text: 'text-amber-400', icon: AlertCircle, label: 'Revisions Requested' };
      case 'SUBSCRIPTION_STARTED':
        return { text: 'text-cyan-400', icon: CreditCard, label: 'Foundation Plan Activated' };
      case 'SUBSCRIPTION_UPGRADED':
        return { text: 'text-fuchsia-400', icon: ArrowUpCircle, label: 'Plan Upgraded' };
      case 'PAYMENT_SUCCESS':
        return { text: 'text-emerald-400', icon: ReceiptText, label: 'Payment Received' };
      default:
        return { text: 'text-zinc-400', icon: Clock, label: status };
    }
  };

  // Format date to a clean, readable format (e.g., "Aug 14, 2:30 PM")
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col max-h-150">
      
      {/* HEADER: Matches the Lifecycle Panel style */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center gap-3 shrink-0">
        <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
           <ClipboardCheck size={14} className="text-zinc-400" />
        </div>
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Project Timeline</h3>
      </div>

      {/* BODY: Clean, readable log stream */}
      <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {auditLogs.length === 0 ? (
          <div className="text-center p-8 bg-black/30 border border-zinc-800/80 rounded-lg text-zinc-500 text-sm">
            No events logged yet.
          </div>
        ) : (
          auditLogs.map((log) => {
            const theme = getLedgerTheme(log.status);
            const isFinancial = ['SUBSCRIPTION_STARTED', 'SUBSCRIPTION_UPGRADED', 'PAYMENT_SUCCESS'].includes(log.status);
            const isResolved = log.status === 'RESOLVED';
            
            const parsedNotes = typeof log.audit_notes === 'string' ? JSON.parse(log.audit_notes) : log.audit_notes || {};
            const clientNotes = parsedNotes.client_notes || {};
            const hasActionableNotes = Object.keys(clientNotes).length > 0;

            return (
              <div 
                key={log.id} 
                className={`bg-black/50 border rounded-lg p-4 transition-all ${isResolved ? 'border-zinc-800/40 opacity-60' : 'border-zinc-800/80'}`}
              >
                {/* Event Title & Timestamp */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <theme.icon size={16} className={theme.text} />
                    <span className={`text-sm font-bold ${theme.text}`}>
                      {theme.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {formatDate(log.created_at)}
                  </span>
                </div>

                {/* Event Details */}
                {isFinancial ? (
                  <p className="text-sm text-zinc-300">
                    {log.audit_notes || 'Transaction processed securely via Stripe.'}
                  </p>
                ) : hasActionableNotes ? (
                  <div className="space-y-2 mt-1">
                    {Object.entries(clientNotes).map(([stepIdx, text]) => (
                      <div key={stepIdx} className="bg-zinc-900/50 rounded-md p-3 border border-zinc-800/50">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                          {CHECKPOINT_TITLES[stepIdx] || 'General Note'}
                        </span>
                        <p className={`text-sm ${isResolved ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                          "{String(text)}"
                        </p>
                      </div>
                    ))}
                  </div>
                ) : null}

                {/* Resolve Button (Only shows if changes are requested) */}
                {log.status === 'CHANGES_REQUESTED' && (
                  <button 
                    onClick={() => handleResolve(log.id)}
                    disabled={isResolving === log.id}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/20 py-2.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    {isResolving === log.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                    Mark Revisions as Complete
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}