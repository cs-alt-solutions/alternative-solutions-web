'use client';

import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard,
  Clock,
  Activity,
  Info,
  X,
  Send
} from 'lucide-react';

export default function AuditLedger({ formData }: { formData: any }) {
  const [showLegend, setShowLegend] = useState(false);
  
  // THE FIX: Looking at the correct JSONB column
  const auditLogs = formData?.audit_notes || [];

  // THE FIX: Mapping to our exact Backend Event Types
  const getLedgerTheme = (type: string) => {
    switch(type) {
      case 'APPROVED':
        return { text: 'text-emerald-400', icon: CheckCircle2 };
      case 'PAYMENT_CLEARED':
        return { text: 'text-fuchsia-400', icon: CreditCard };
      case 'CHANGES_REQUESTED':
        return { text: 'text-amber-400', icon: AlertCircle };
      case 'REVIEW_DISPATCHED':
        return { text: 'text-blue-400', icon: Send };
      case 'BUILD_INITIALIZED':
        return { text: 'text-cyan-400', icon: Activity };
      case 'APPLICATION_RECEIVED':
      default:
        return { text: 'text-zinc-400', icon: Clock };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md flex flex-col max-h-150 relative">
      
      {/* HEADER WITH INFO BUTTON */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
             <ClipboardCheck size={14} className="text-zinc-400" />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Project Timeline</h3>
        </div>
        
        <button 
          onClick={() => setShowLegend(true)}
          className="p-1.5 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors"
          title="Timeline Legend"
        >
          <Info size={14} />
        </button>
      </div>

      {/* BODY */}
      <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {auditLogs.length === 0 ? (
          <div className="text-center p-8 bg-black/30 border border-zinc-800/80 rounded-lg text-zinc-500 text-sm">
            No events logged yet.
          </div>
        ) : (
          [...auditLogs].reverse().map((log: any, idx: number) => {
            const theme = getLedgerTheme(log.type);

            return (
              <div 
                key={idx} 
                className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <theme.icon size={16} className={theme.text} />
                    <span className={`text-[11px] uppercase tracking-wider font-bold ${theme.text}`}>
                      {log.type.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {formatDate(log.timestamp)}
                  </span>
                </div>

                {log.message && (
                  <p className="text-sm text-zinc-300 ml-6 leading-relaxed">
                    {log.message}
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* THE LEGEND MODAL OVERLAY */}
      {showLegend && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
            
            <button 
              onClick={() => setShowLegend(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-6">Status Legend</h4>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-400">Approved</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Client verified architecture.</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-amber-400">Changes Requested</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Client revisions logged and pending.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard size={16} className="text-fuchsia-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-fuchsia-400">Payment Cleared</div>
                  <div className="text-xs text-zinc-500 mt-0.5">Subscription active. System Live.</div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}