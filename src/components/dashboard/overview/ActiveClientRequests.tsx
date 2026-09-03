/* src/components/dashboard/overview/ActiveClientRequests.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ActiveClientRequests({ requests }: { requests: any[] }) {
  const now = new Date().getTime();
  
  // High-Level Triage Math
  const newLast24h = requests.filter(t => (now - new Date(t.created_at).getTime()) < 86400000).length;
  const olderTickets = requests.filter(t => (now - new Date(t.created_at).getTime()) > (7 * 86400000)).length;

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/5">
        <MessageSquare size={16} className="text-amber-500" />
        <h2 className="text-[11px] font-bold text-white uppercase tracking-widest">Client Request Radar</h2>
        <span className="ml-auto bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest">
          {requests.length} PENDING
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-zinc-500 border border-dashed border-zinc-800/50 rounded-xl bg-black/20 mb-4">
          <CheckCircle2 size={24} className="mb-2 text-zinc-700" />
          <p className="text-[10px] font-mono uppercase tracking-widest">Inbox Zero</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
            <Clock size={16} className="text-cyan-500 mb-1.5" />
            <span className="text-xl font-black text-white">{newLast24h}</span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">New (24hrs)</span>
          </div>
          
          <div className={`bg-black/40 border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-colors ${olderTickets > 0 ? 'border-rose-500/30' : 'border-white/5'}`}>
            {/* 🚀 FIXED: Tucked mb-1.5 safely inside the template literal */}
            <AlertCircle size={16} className={`${olderTickets > 0 ? "text-rose-500" : "text-zinc-600"} mb-1.5`} />
            <span className="text-xl font-black text-white">{olderTickets}</span>
            <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Older (7+ Days)</span>
          </div>
        </div>
      )}

      <Link 
        href="/dashboard/support-desk"
        className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-amber-500 hover:text-amber-950 text-white border border-white/5 hover:border-amber-500 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group cursor-pointer"
      >
        Open Support Desk <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}