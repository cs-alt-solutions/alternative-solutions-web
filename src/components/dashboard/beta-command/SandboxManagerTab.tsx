/* src/components/dashboard/beta-command/SandboxManagerTab.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, SANDBOX_CLIENTS } from '@/utils/glossary';
import { Terminal, Key, ShieldAlert, Edit2, Users, ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import EditSandboxModal from './EditSandboxModal';

export default function SandboxManagerTab() {
  const [clients, setClients] = useState<any[]>(Object.values(SANDBOX_CLIENTS));
  const copy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND.SANDBOXES;
  
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [managingAccessFor, setManagingAccessFor] = useState<any | null>(null);

  const handleSaveClient = (updatedClient: any) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditingClient(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex items-start gap-4">
        <ShieldAlert className="text-amber-400 shrink-0 mt-1" size={24} />
        <div>
          <h3 className="text-amber-400 font-bold uppercase tracking-widest text-sm mb-2">{copy.INFO_TITLE}</h3>
          <p className="text-amber-500/70 text-xs font-mono leading-relaxed">{copy.INFO_DESC}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map((client) => (
          <div key={client.id} className="bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-colors rounded-2xl p-6 group flex flex-col relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-all pointer-events-none"></div>

            <div className="flex items-start justify-between mb-6 relative z-10">
              <div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight">{client.agencyName}</h4>
                <p className="text-xs text-slate-500 font-mono mt-1">{client.appTitle}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Terminal size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
              <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1">
                  <Key size={10} /> {copy.LBL_ACCESS_CODE}
                </p>
                <p className="text-cyan-400 font-bold font-mono tracking-widest">{client.accessCode}</p>
              </div>
              
              <div className="bg-black/50 border border-white/5 rounded-xl p-3">
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1">
                  <ShieldAlert size={10} /> {copy.LBL_MASTER_PIN}
                </p>
                <p className="text-amber-400 font-bold font-mono tracking-widest">{client.security.pin}</p>
              </div>
            </div>
            
            <div className="mb-6 pt-4 border-t border-white/5 relative z-10 flex-1">
                <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Users size={10} /> {copy.LBL_PRIMARY_CONTACT}
                </p>
                <p className="text-sm font-bold text-white">{client.primaryContact || "Unassigned"}</p>
            </div>

            <div className="flex flex-col gap-3 mt-auto relative z-10">
                <div className="flex gap-3">
                  <button 
                    onClick={() => setEditingClient(client)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Edit2 size={14} /> {copy.BTN_EDIT}
                  </button>
                  <button 
                    onClick={() => setManagingAccessFor(client)}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-colors"
                  >
                    <Users size={14} /> {copy.BTN_MANAGE}
                  </button>
                </div>
                
                <Link 
                  href={`/sandbox/${client.id}`}
                  target="_blank"
                  className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.1)]"
                >
                  {copy.BTN_PORTAL} <ExternalLink size={14} />
                </Link>
            </div>
          </div>
        ))}
      </div>

      {editingClient && (
        <EditSandboxModal 
          client={editingClient} 
          onClose={() => setEditingClient(null)} 
          onSave={handleSaveClient} 
        />
      )}

      {managingAccessFor && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl text-center">
                  <p className="text-fuchsia-400 animate-pulse font-mono text-sm uppercase tracking-widest">Access Control Matrix Initializing...</p>
                  <button onClick={() => setManagingAccessFor(null)} className="mt-4 text-xs text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
              </div>
          </div>
      )}

    </div>
  );
}