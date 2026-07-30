'use client';

import React, { useEffect, useState } from 'react';
import { ClipboardCheck, Search, Loader2, CheckCircle2, Wrench, MessageSquare, Clock, ChevronDown, ChevronUp, CheckCircle, Circle } from 'lucide-react';
import { DASHBOARD_COPY } from '@/config/dashboard';
import { supabase } from '@/utils/supabase';

// Local source of truth for the 4 review steps
const CHECKPOINT_TITLES: Record<string, string> = {
  '0': 'First Impression & Hero',
  '1': 'Your Story & Background',
  '2': 'Services & Offerings',
  '3': 'Final Review & Next Steps'
};

export default function AuditLedger({ formData }: { formData: any }) {
  const copy = DASHBOARD_COPY.STAGING;
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({});

  const toggleExpand = (id: string) => {
    setExpandedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const fetchAudits = async () => {
      if (!formData?.slug) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('storefront_audits')
        .select('*')
        .eq('storefront_slug', formData.slug)
        .order('id', { ascending: false });

      if (data) setAuditLogs(data);
      if (error) console.error("Ledger Sync Error:", error);
      setIsLoading(false);
    };

    fetchAudits();

    const channel = supabase.channel('audit-ledger-sync')
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'storefront_audits', 
          filter: `storefront_slug=eq.${formData?.slug}` 
        }, 
        (payload) => {
           setAuditLogs(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [formData?.slug]);

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col h-full">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 border-b border-zinc-800/80 pb-6 shrink-0">
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <ClipboardCheck size={24} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">{copy.AUDIT_TITLE}</h2>
          <p className="text-zinc-400 text-sm font-light mt-1">{copy.AUDIT_DESC}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col pt-6 overflow-hidden">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800 bg-zinc-950/30 rounded-xl p-8 text-center h-full min-h-64">
            <Loader2 size={32} className="text-cyan-400 animate-spin mb-4" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              Syncing Ledger...
            </span>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800 bg-zinc-950/30 rounded-xl p-8 text-center h-full min-h-64">
            <Search size={32} className="text-zinc-600 mb-4" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
              {copy.AUDIT_EMPTY}
            </span>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {auditLogs.map((log) => {
              let parsedNotes: any = {};
              try {
                parsedNotes = typeof log.audit_notes === 'string' ? JSON.parse(log.audit_notes) : log.audit_notes;
              } catch (e) {
                console.error("Failed to parse audit JSON", e);
              }

              const isApproved = log.status === 'APPROVED_PENDING_BILLING' || log.status === 'APPROVED';
              const clientNotes = parsedNotes.client_notes || {};
              const verifiedCheckpoints = parsedNotes.verified_checkpoints || [];
              const isExpanded = !!expandedCards[log.id];

              return (
                <div key={log.id} className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-5 flex flex-col gap-4 shadow-sm relative overflow-hidden transition-all">
                  
                  {/* TICKET STATUS HEADER & ACCORDION TOGGLE */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${
                      isApproved ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-fuchsia-500/10 border-fuchsia-500/20 text-fuchsia-400'
                    }`}>
                      {isApproved ? <CheckCircle2 size={12} /> : <Wrench size={12} />}
                      {isApproved ? 'Approved & Locked' : 'Adjustments Requested'}
                    </span>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
                        <Clock size={10} />
                        {parsedNotes.logged_at ? new Date(parsedNotes.logged_at).toLocaleString() : new Date(log.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider px-2"
                      >
                        <span>{isExpanded ? 'Collapse' : 'Inspect Log'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* SUMMARY PREVIEW */}
                  <div className="text-xs text-zinc-300 font-light flex items-center justify-between px-1">
                    <span>Signoff: <strong className="text-white">{parsedNotes.contact_name || log.client_email}</strong></span>
                    <span className="text-cyan-400 font-mono text-[10px]">
                      {parsedNotes.total_sections_verified || `${verifiedCheckpoints.length} Sections Verified`}
                    </span>
                  </div>

                  {/* EXPANDABLE ACCORDION CONTENT */}
                  {isExpanded && (
                    <div className="space-y-4 pt-3 border-t border-zinc-800/80 animate-in fade-in duration-200">
                      
                      {/* ROADMAP CHECKPOINT BREAKDOWN */}
                      <div className="space-y-3 bg-zinc-900/50 p-3.5 rounded-xl border border-zinc-800">
                        <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                          Roadmap Checkpoint Verification
                        </span>
                        
                        {Object.entries(CHECKPOINT_TITLES).map(([sIdxStr, stepTitle]) => {
                          const sIdx = Number(sIdxStr);
                          const isStepChecked = verifiedCheckpoints.includes(sIdx);
                          return (
                            <div key={sIdx} className="space-y-1.5 pt-2 first:pt-0 border-t border-zinc-800/40 first:border-0">
                              <div className="flex items-center gap-2">
                                {isStepChecked ? (
                                  <CheckCircle size={14} className="text-emerald-400 shrink-0" />
                                ) : (
                                  <Circle size={14} className="text-zinc-600 shrink-0" />
                                )}
                                <span className="text-xs font-bold text-white uppercase tracking-wider">{stepTitle}</span>
                              </div>
                              
                              {clientNotes[sIdx] && (
                                <div className="ml-6 bg-black/40 border border-zinc-800 p-2.5 rounded-lg">
                                  <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest block mb-1">Client Notes:</span>
                                  <p className="text-xs text-zinc-300 font-light italic">&ldquo;{clientNotes[sIdx]}&rdquo;</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}