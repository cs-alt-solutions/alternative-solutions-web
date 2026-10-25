/* src/components/dashboard/strategy/FailsafeRadar.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { AlertTriangle, ChevronDown, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const BYPASS_REASONS = [
  "Live Testing / Prototype",
  "Manual Enterprise Entry",
  "E-Commerce Only Build",
  "Pre-Existing External Strategy",
  "Other / Administrative"
];

export default function FailsafeRadar({ missingClients }: { missingClients: any[] }) {
  const router = useRouter();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  if (!missingClients || missingClients.length === 0) return null;

  const handleBypass = async (clientId: string, clientName: string, reason: string) => {
    setIsProcessing(clientId);
    try {
      // Create an ARCHIVED board just to satisfy the system and leave a paper trail
      const { error } = await supabase.from('ideas_ledger').insert({
        storefront_id: clientId,
        title: `[BYPASSED] ${reason}`,
        type: 'CLIENT_RESEARCH',
        classification: 'STRATEGY',
        status: 'ARCHIVED',
        phases: { 
          bypass_reason: reason, 
          notes: `Manually bypassed from Failsafe Radar by system admin.` 
        }
      });

      if (error) throw error;
      
      // Refresh the page so the server fetches the new list and the radar clears
      setActiveDropdown(null);
      router.refresh();
      
    } catch (err) {
      console.error("Failed to bypass client:", err);
      alert("Failed to process bypass.");
    } finally {
      setIsProcessing(null);
    }
  };

  return (
    <div className="mb-10 bg-red-950/20 border border-red-500/30 rounded-2xl p-6 shadow-xl relative overflow-visible">
      <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] rounded-l-2xl" />
      
      <div className="flex items-center gap-3 mb-4">
        <AlertTriangle className="text-red-400" size={20} />
        <h2 className="text-sm font-black text-red-400 uppercase tracking-widest">Action Required: Missing Discovery Boards</h2>
      </div>
      
      <p className="text-xs text-zinc-400 mb-6 font-mono max-w-3xl">
        The following active clients bypassed the automation trigger and do not have a Discovery Board attached to their account. Generate one manually, or bypass them with a logged reason.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missingClients.map(client => (
          <div key={client.id} className="bg-black/60 border border-red-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider truncate">
                {client.business_name}
              </h3>
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest mt-1 block">
                Status: {client.status}
              </span>
            </div>

            <div className="relative shrink-0 flex items-center justify-end">
              {isProcessing === client.id ? (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-400 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                  <Loader2 size={14} className="animate-spin" /> Processing
                </div>
              ) : activeDropdown === client.id ? (
                // THE BYPASS DROPDOWN REASONS
                <div className="absolute right-0 top-0 mt-0 w-64 bg-zinc-950 border border-red-500/40 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="bg-red-950/40 px-3 py-2 border-b border-red-500/20 flex items-center justify-between">
                    <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Select Reason</span>
                    <button onClick={() => setActiveDropdown(null)} className="text-zinc-500 hover:text-white"><ShieldAlert size={12} /></button>
                  </div>
                  <div className="flex flex-col max-h-48 overflow-y-auto custom-scrollbar">
                    {BYPASS_REASONS.map(reason => (
                      <button
                        key={reason}
                        onClick={() => handleBypass(client.id, client.business_name, reason)}
                        className="text-left px-3 py-2.5 text-[10px] font-bold text-zinc-300 hover:bg-red-500/10 hover:text-red-400 border-b border-zinc-800/50 last:border-0 transition-colors flex items-center justify-between group"
                      >
                        {reason} <CheckCircle2 size={12} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                // DEFAULT ACTIONS
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveDropdown(client.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 transition-colors text-[10px] font-black uppercase tracking-widest"
                  >
                    Bypass <ChevronDown size={12} />
                  </button>
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}