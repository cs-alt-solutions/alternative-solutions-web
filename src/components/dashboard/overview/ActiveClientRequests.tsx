/* src/components/dashboard/overview/ActiveClientRequests.tsx */
import React from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight, Clock, CheckCircle2 } from 'lucide-react';

export default function ActiveClientRequests({ requests }: { requests: any[] }) {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <MessageSquare size={18} className="text-amber-500" />
        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Active Client Requests</h2>
        <span className="ml-auto bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest">
          {requests.length} PENDING
        </span>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-500 border border-dashed border-zinc-800/50 rounded-2xl bg-black/20">
          <CheckCircle2 size={32} className="mb-3 text-zinc-700" />
          <p className="text-xs font-mono uppercase tracking-widest">Inbox Zero</p>
          <p className="text-[10px] uppercase tracking-widest mt-1 opacity-50">No pending client requests.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((ticket) => (
            <Link 
              key={ticket.id}
              href={`/dashboard/storefronts/${ticket.storefront_id}`}
              className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-amber-500/30 transition-colors group"
            >
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-500">
                    {ticket.category}
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                    <Clock size={10} /> {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-bold text-white truncate">{ticket.storefronts?.business_name || 'Client Workspace'}</p>
                <p className="text-xs text-zinc-400 truncate mt-0.5">{ticket.topic}</p>
              </div>
              <div className="shrink-0 p-2 bg-zinc-900 rounded-lg text-zinc-500 group-hover:text-amber-400 group-hover:bg-amber-500/10 transition-colors">
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}