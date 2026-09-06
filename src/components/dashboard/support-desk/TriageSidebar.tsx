/* src/components/dashboard/support-desk/TriageSidebar.tsx */
import React from 'react';
import { Store } from 'lucide-react';

interface TriageSidebarProps {
  sortedClients: string[];
  tickets: any[];
  selectedClientId: string | null;
  setSelectedClientId: (id: string) => void;
  setExpandedTicketId: (id: string | null) => void;
}

export default function TriageSidebar({ sortedClients, tickets, selectedClientId, setSelectedClientId, setExpandedTicketId }: TriageSidebarProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-2">
      <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 pl-2">Active Workspaces</h3>
      
      <div className="flex items-center gap-3 px-2 mb-3">
         <div className="flex items-center gap-1.5" title="You need to reply">
           <div className="w-2 h-2 rounded-full bg-rose-500 border border-rose-500/50" />
           <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Needs Action</span>
         </div>
         <div className="flex items-center gap-1.5" title="Waiting on client">
           <div className="w-2 h-2 rounded-full bg-cyan-400 border border-cyan-500/50" />
           <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Pending</span>
         </div>
         <div className="flex items-center gap-1.5" title="Issue closed">
           <div className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-500/50" />
           <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Closed</span>
         </div>
      </div>

      {sortedClients.map(clientId => {
        const clientName = tickets.find(t => t.storefront_id === clientId)?.business_name;
        
        const clientTickets = tickets.filter(t => t.storefront_id === clientId);
        const needsActionCount = clientTickets.filter(t => t.status === 'OPEN' && !t.admin_reply).length;
        const pendingCount = clientTickets.filter(t => t.status === 'OPEN' && !!t.admin_reply).length;
        const resolvedCount = clientTickets.filter(t => t.status === 'RESOLVED').length;
        
        return (
          <button
            key={clientId}
            onClick={() => { setSelectedClientId(clientId); setExpandedTicketId(null); }}
            className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
              selectedClientId === clientId 
                ? 'bg-zinc-900 border-zinc-700 shadow-md' 
                : 'bg-black/40 border-white/5 hover:border-white/10 hover:bg-black/60'
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <Store size={16} className={selectedClientId === clientId ? 'text-white' : 'text-zinc-600'} />
              <span className={`text-sm font-bold truncate ${selectedClientId === clientId ? 'text-white' : 'text-zinc-400'}`}>
                {clientName}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              {needsActionCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500/20 text-rose-500 text-[9px] font-black border border-rose-500/30" title={`${needsActionCount} Needs Action`}>
                  {needsActionCount}
                </span>
              )}
              {pendingCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-cyan-500/20 text-cyan-400 text-[9px] font-black border border-cyan-500/30" title={`${pendingCount} Pending`}>
                  {pendingCount}
                </span>
              )}
              {resolvedCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black border border-emerald-500/20" title={`${resolvedCount} Closed`}>
                  {resolvedCount}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}