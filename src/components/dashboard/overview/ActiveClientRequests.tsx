/* src/components/dashboard/overview/ActiveClientRequests.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Clock, AlertCircle, CheckCircle2, FileUp } from 'lucide-react';
import { OVERVIEW_COPY } from '@/config/dashboard/overview';

export default function ActiveClientRequests({ requests }: { requests: any[] }) {
  const now = new Date().getTime();
  const msIn48Hours = 48 * 60 * 60 * 1000;
  const copy = OVERVIEW_COPY.REQUESTS;

  const mediaTickets = requests.filter(t => t.category === 'System Alert');
  const supportTickets = requests.filter(t => t.category !== 'System Alert');

  const recentSupport = supportTickets.filter(t => (now - new Date(t.created_at).getTime()) <= msIn48Hours).length;
  const agingSupport = supportTickets.filter(t => (now - new Date(t.created_at).getTime()) > msIn48Hours).length;
  const pendingMedia = mediaTickets.length;

  return (
    <div className="p-5">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/5">
        <MessageSquare size={16} className="text-amber-500" />
        <h2 className="text-xs font-black text-white uppercase tracking-widest">{copy.TITLE}</h2>
        <span className="ml-auto bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest">
          {requests.length} {copy.PENDING_SUFFIX}
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="flex items-center justify-center gap-2.5 py-4 px-4 text-zinc-500 border border-dashed border-zinc-800/60 rounded-xl bg-black/20 mb-4">
          <CheckCircle2 size={16} className="text-emerald-500/70 shrink-0" />
          <p className="text-[10px] font-mono uppercase tracking-widest">{copy.INBOX_ZERO}</p>
        </div>
      ) : (
        <div className="space-y-3 mb-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-black/40 border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center text-center">
              <Clock size={16} className="text-cyan-500 mb-1.5" />
              <span className="text-xl font-black text-white">{recentSupport}</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{copy.RECENT_LABEL}</span>
            </div>
            
            <div className={`bg-black/40 border rounded-xl p-3 flex flex-col items-center justify-center text-center transition-colors ${agingSupport > 0 ? 'border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.1)]' : 'border-white/5'}`}>
              <AlertCircle size={16} className={`${agingSupport > 0 ? "text-rose-500 animate-pulse" : "text-zinc-600"} mb-1.5`} />
              <span className="text-xl font-black text-white">{agingSupport}</span>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{copy.AGING_LABEL}</span>
            </div>
          </div>

          <div className={`bg-black/40 border rounded-xl p-3 flex items-center justify-between transition-colors ${pendingMedia > 0 ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.05)]' : 'border-white/5'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${pendingMedia > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-zinc-900 text-zinc-600'}`}>
                <FileUp size={14} />
              </div>
              <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{copy.VAULT_DROPS_LABEL}</span>
            </div>
            <span className={`text-lg font-black ${pendingMedia > 0 ? 'text-amber-500' : 'text-zinc-600'}`}>
              {pendingMedia}
            </span>
          </div>
        </div>
      )}

      <Link 
        href="/dashboard/support-desk"
        className="flex items-center justify-center gap-2 w-full bg-zinc-900 hover:bg-amber-500 hover:text-amber-950 text-white border border-white/5 hover:border-amber-500 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group cursor-pointer"
      >
        {copy.BTN_OPEN_DESK} <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}