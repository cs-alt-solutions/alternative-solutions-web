'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Send, Copy, AlertTriangle, CheckCircle2, Loader2, Mail, Clock, ShieldAlert, CheckCircle, Wrench } from 'lucide-react';
import { dispatchStagingReview } from '@/app/actions/storefronts';

export default function DispatchCannon({ formData, setFormData }: { formData: any, setFormData: any }) {
  const router = useRouter();
  const [isDispatching, setIsDispatching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [clientAudits, setClientAudits] = useState<any[]>([]);
  
  const targetEmail = formData.contact_email || formData.applicant_email;
  const stagingUrl = `https://${formData.custom_domain || `storefronts.alternativesolutions.io/${formData.slug}`}`;
  const systemLogs = formData.staging_logs || [];

  useEffect(() => {
    const fetchAudits = async () => {
      if (!formData?.slug) return;
      const { data } = await supabase.from('storefront_audits').select('*').eq('storefront_slug', formData.slug);
      if (data) setClientAudits(data);
    };
    fetchAudits();
  }, [formData?.slug]);

  const unifiedLogs = [
    ...systemLogs.map((l: any) => ({ ...l, logType: 'DISPATCH', sortTime: new Date(l.timestamp).getTime() })),
    ...clientAudits.map((a: any) => {
      const isApproved = a.status === 'APPROVED' || a.status === 'APPROVED_PENDING_BILLING';
      const isResolved = a.status === 'RESOLVED';
      
      let message = 'Client submitted adjustment notes.';
      if (isApproved) message = 'Client signed off and approved build for launch.';
      if (isResolved) message = 'Architect resolved previous feedback notes.';

      return {
        id: `audit-${a.id}`,
        action: isApproved ? 'BUILD APPROVED' : isResolved ? 'REVISIONS FIXED' : 'CHANGES REQUESTED',
        message: message,
        actor: a.client_email || 'Client',
        timestamp: a.created_at,
        logType: 'FEEDBACK',
        sortTime: new Date(a.created_at).getTime()
      };
    })
  ].sort((a, b) => b.sortTime - a.sortTime);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${stagingUrl}?mode=review`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendForReview = async () => {
    if (!targetEmail) { alert("Missing client email."); return; }
    if (!window.confirm(`Transmit interactive staging link to ${targetEmail}?`)) return;
    
    setIsDispatching(true);
    setStatusMessage('SYNCING DATABASE...');
    
    try {
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'REVIEW DISPATCHED',
        message: `Review link successfully sent to ${targetEmail}`,
        actor: 'System Admin'
      };
      
      const updatedLogs = [newLog, ...systemLogs];
      const updatedStatus = 'IN REVIEW';
      
      const { error } = await supabase.from('storefronts').update({
        ...formData,
        status: updatedStatus,
        staging_logs: updatedLogs
      }).eq('id', formData.id);
      
      if (error) throw error;
      
      setFormData((prev: any) => ({ ...prev, status: updatedStatus, staging_logs: updatedLogs }));
      
      setStatusMessage('TRANSMITTING TO CLIENT...');
      await dispatchStagingReview(formData.id, formData.slug, formData.business_name, targetEmail, formData.plan_tier || 'Standard Starter');
      
      setStatusMessage('TRANSMISSION SUCCESSFUL');
      router.refresh();
      setTimeout(() => setStatusMessage(''), 4000);
    } catch (err: any) {
      console.error("Dispatch error:", err);
      alert(`Transmission failed: ${err.message}`);
      setStatusMessage('TRANSMISSION FAILED');
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 shadow-xl flex flex-col h-full space-y-8">
      <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-6 shrink-0">
        <div className="p-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
          <Send size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Interactive Staging</h2>
          <p className="text-zinc-400 text-sm font-light mt-1">Dispatch the interactive review layer to the client.</p>
        </div>
      </div>

      <div className="space-y-6 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-1.5"><Mail size={12} className="text-cyan-400" /> Target Routing</span>
            {targetEmail ? <span className="text-white font-bold tracking-wider truncate">{targetEmail}</span> : <span className="text-rose-400 font-bold tracking-wider flex items-center gap-2"><AlertTriangle size={14} /> Missing Email</span>}
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Current Status</span>
            <span className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{formData.status || 'BUILDING'}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={handleSendForReview} disabled={isDispatching || !targetEmail} className="flex-1 flex items-center justify-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(192,38,213,0.3)] disabled:opacity-50 cursor-pointer">
            {isDispatching ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isDispatching ? 'TRANSMITTING...' : 'DISPATCH REVIEW LINK'}
          </button>
          <button onClick={handleCopyLink} className="flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-500 text-zinc-300 hover:text-cyan-400 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer">
            {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? 'COPIED TO CLIPBOARD' : 'COPY MANUAL LINK'}
          </button>
        </div>
        
        {statusMessage && (
          <div className="text-center"><span className="text-fuchsia-400 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse">{statusMessage}</span></div>
        )}
      </div>

      <div className="flex-1 flex flex-col border-t border-zinc-800/80 pt-6 mt-2 overflow-hidden">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 shrink-0"><ShieldAlert size={12} className="text-zinc-400" /> Transmission Logs</h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {unifiedLogs.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-zinc-800 bg-zinc-950/50 rounded-xl text-zinc-600 font-mono text-xs uppercase tracking-widest">No staging history recorded.</div>
          ) : (
            unifiedLogs.map((log: any) => (
              <div key={log.id} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 flex flex-col gap-2 shadow-sm">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${log.logType === 'FEEDBACK' ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' : 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'}`}>
                      {log.action}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1"><Clock size={10} />{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-xs text-zinc-300 font-light">{log.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}