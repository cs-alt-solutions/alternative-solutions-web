'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { Send, Copy, AlertTriangle, CheckCircle2, Loader2, Mail, Clock, ShieldAlert, CheckCircle, Wrench } from 'lucide-react';
import { dispatchStagingReview } from '@/app/actions/storefronts';
import { DASHBOARD_COPY } from '@/config/dashboard';

export default function DispatchCannon({ formData, setFormData }: { formData: any, setFormData: any }) {
  const router = useRouter();
  const [isDispatching, setIsDispatching] = useState(false);
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [clientAudits, setClientAudits] = useState<any[]>([]);
  
  const copy = DASHBOARD_COPY.STAGING;
  const targetEmail = formData.contact_email || formData.applicant_email;
  const stagingUrl = `https://${formData.custom_domain || `storefronts.alternativesolutions.io/${formData.slug}`}`;
  const systemLogs = formData.staging_logs || [];

  // Fetch client audits so we can blend them into the unified log stream
  useEffect(() => {
    const fetchAudits = async () => {
      if (!formData?.slug) return;
      const { data } = await supabase
        .from('storefront_audits')
        .select('*')
        .eq('storefront_slug', formData.slug);
      if (data) setClientAudits(data);
    };
    fetchAudits();
  }, [formData?.slug]);

  // Merge system dispatches and client feedback into one sorted chronological feed
  const unifiedLogs = [
    ...systemLogs.map((l: any) => ({ ...l, logType: 'DISPATCH', sortTime: new Date(l.timestamp).getTime() })),
    ...clientAudits.map((a: any) => {
      let notes: Record<string, any> = {};
      try { 
        notes = typeof a.audit_notes === 'string' ? JSON.parse(a.audit_notes) : (a.audit_notes || {}); 
      } catch(e) {
        notes = {};
      }
      
      const loggedTime = notes.logged_at || a.created_at;

      return {
        id: `audit-${a.id}`,
        action: a.status === 'APPROVED_PENDING_BILLING' ? 'BUILD APPROVED' : 'CHANGES REQUESTED',
        message: a.status === 'APPROVED_PENDING_BILLING' ? 'Client signed off and approved build for launch.' : 'Client submitted structural feedback and adjustment notes.',
        actor: notes.contact_name || a.client_email,
        timestamp: loggedTime,
        logType: 'FEEDBACK',
        sortTime: new Date(loggedTime).getTime()
      };
    })
  ].sort((a, b) => b.sortTime - a.sortTime);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${stagingUrl}?mode=staging`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendForReview = async () => {
    if (!targetEmail) {
      alert("Missing client email. Please add an email in the Content tab first.");
      return;
    }
    if (!window.confirm(`Transmit interactive staging link to ${targetEmail}? This will save the current layout and update the project status.`)) return;
         
    setIsDispatching(true);
    setStatusMessage('SYNCING DATABASE...');
         
    try {
      const newLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        action: 'REVIEW DISPATCHED',
        message: `${copy.LOG_SUCCESS_MSG} ${targetEmail}`,
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
      setFormData((prev: any) => ({
        ...prev,
        status: updatedStatus,
        staging_logs: updatedLogs
      }));
             
      setStatusMessage('TRANSMITTING TO CLIENT...');
      await dispatchStagingReview(
        formData.id,
        formData.slug,
        formData.business_name,
        targetEmail,
        formData.plan_tier || 'Standard Starter'
      );
             
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
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full space-y-8">
             
      <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-6 shrink-0">
        <div className="p-4 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400">
          <Send size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{copy.TITLE}</h2>
          <p className="text-zinc-400 text-sm font-light mt-1">{copy.DESC}</p>
        </div>
      </div>

      <div className="space-y-6 shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-1.5">
              <Mail size={12} className="text-cyan-400" /> {copy.ROUTING_LABEL}
            </span>
            {targetEmail ? (
              <span className="text-white font-bold tracking-wider text-xs md:text-sm truncate" title={targetEmail}>{targetEmail}</span>
            ) : (
              <span className="text-rose-400 font-bold tracking-wider flex items-center gap-2 text-xs">
                <AlertTriangle size={14} /> {copy.MISSING_EMAIL}
              </span>
            )}
          </div>
                     
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col justify-center">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">{copy.STATUS_LABEL}</span>
            <span className="text-emerald-400 font-black uppercase tracking-widest text-xs flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {formData.status || 'BUILDING'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleSendForReview}
            disabled={isDispatching || !targetEmail}
            className="w-full flex items-center justify-center gap-3 bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(192,38,213,0.3)] disabled:opacity-50 cursor-pointer"
          >
            {isDispatching ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
            {isDispatching ? copy.BTN_DISPATCHING : copy.BTN_DISPATCH}
          </button>
                     
          <button 
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 bg-zinc-950 hover:bg-zinc-900 border border-zinc-700 hover:border-cyan-400 text-zinc-300 hover:text-cyan-400 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
          >
            {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
            {copied ? copy.BTN_COPIED : copy.BTN_COPY}
          </button>
        </div>

        {statusMessage && (
          <div className="text-center">
            <span className="text-fuchsia-400 text-[10px] font-mono font-bold tracking-widest uppercase animate-pulse">
              {statusMessage}
            </span>
          </div>
        )}
      </div>

      {/* UNIFIED TRANSMISSION & FEEDBACK LOGS */}
      <div className="flex-1 flex flex-col border-t border-zinc-800/80 pt-6 mt-2 overflow-hidden">
        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 shrink-0">
          <ShieldAlert size={12} className="text-zinc-400" /> Transmission & Feedback Logs
        </h3>
                 
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
          {unifiedLogs.length === 0 ? (
            <div className="text-center p-6 border border-dashed border-zinc-800 bg-zinc-950/50 rounded-xl text-zinc-600 font-mono text-xs uppercase tracking-widest">
              {copy.LOGS_EMPTY}
            </div>
          ) : (
            unifiedLogs.map((log: any) => {
              const isFeedback = log.logType === 'FEEDBACK';
              return (
                <div key={log.id} className={`bg-zinc-950 border rounded-xl p-4 flex flex-col gap-2 shadow-sm ${
                  isFeedback ? 'border-cyan-500/30 bg-cyan-950/10' : 'border-zinc-800/80'
                }`}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${
                        isFeedback 
                          ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                          : 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'
                      }`}>
                        {log.action}
                      </span>
                      <span className="text-[9px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300 font-light">{log.message}</p>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                      {isFeedback ? <CheckCircle size={10} className="text-cyan-400" /> : <Wrench size={10} />}
                      Response from {log.actor}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}