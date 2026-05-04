/* src/components/dashboard/beta-command/SandboxManagerTab.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, SANDBOX_CLIENTS } from '@/utils/glossary';
import { Terminal, Key, ShieldAlert, Edit2, Users, ExternalLink, FolderOpen, Briefcase, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import EditSandboxModal from './EditSandboxModal';

export default function SandboxManagerTab() {
  const [clients, setClients] = useState<any[]>(Object.values(SANDBOX_CLIENTS));
  const [revealedCredentials, setRevealedCredentials] = useState<string | null>(null);
  
  const [editingClient, setEditingClient] = useState<any | null>(null);
  const [managingAccessFor, setManagingAccessFor] = useState<any | null>(null);

  const toggleReveal = (clientId: string) => {
    setRevealedCredentials(prev => prev === clientId ? null : clientId);
  };

  const handleSaveClient = (updatedClient: any) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    setEditingClient(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between">
        <div className="bg-brand-primary/10 border border-brand-primary/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <Briefcase className="text-brand-primary" size={18} />
          <h3 className="text-brand-primary font-bold uppercase tracking-widest text-xs">Active Client Roster</h3>
        </div>
        <button className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">
          + New Client
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {clients.map((client) => {
          const isRevealed = revealedCredentials === client.id;
          // Temporary mock data until we update the DB schema
          const industry = client.id === 'luckystrike' ? 'Custom Fabrication' : client.id === 'division' ? 'E-Commerce / Retail' : 'Automotive Service';
          
          return (
            <div key={client.id} className="bg-bg-surface-100 border border-white/5 hover:border-brand-primary/30 transition-colors rounded-2xl p-6 group flex flex-col relative overflow-hidden">
              
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl group-hover:bg-brand-primary/10 transition-all pointer-events-none"></div>

              {/* CLIENT IDENTITY */}
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-white/10 text-white px-2 py-0.5 rounded-sm">
                      {industry}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h4 className="text-xl font-black text-white uppercase tracking-tight">{client.agencyName}</h4>
                  <p className="text-xs text-slate-500 font-mono mt-1">{client.appTitle}</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-bg-surface-200 border border-white/10 flex items-center justify-center text-slate-400">
                  <Terminal size={20} />
                </div>
              </div>

              {/* SECURED CREDENTIALS */}
              <div className="bg-black/50 border border-white/5 rounded-xl p-4 mb-6 relative z-10 flex items-center justify-between">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1">
                      <Key size={10} /> Workspace Code
                    </p>
                    <p className="text-brand-primary font-bold font-mono tracking-widest">
                      {isRevealed ? client.accessCode : '••••••••'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mb-1 flex items-center gap-1">
                      <ShieldAlert size={10} /> Master PIN
                    </p>
                    <p className="text-amber-400 font-bold font-mono tracking-widest">
                      {isRevealed ? client.security.pin : '••••'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => toggleReveal(client.id)}
                  className="text-slate-500 hover:text-white transition-colors bg-white/5 p-2 rounded-lg"
                  title={isRevealed ? "Hide Credentials" : "Reveal Credentials"}
                >
                  {isRevealed ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* COMMAND ACTIONS */}
              <div className="flex flex-col sm:flex-row gap-3 mt-auto relative z-10 pt-4 border-t border-white/5">
                  <Link 
                    href={`/dashboard/clients/${client.id}`}
                    className="flex-2 py-3 bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-bg-surface-100 border border-brand-primary/30 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    <FolderOpen size={14} /> Open Client HQ
                  </Link>
                  
                  <Link 
                    href={`/sandbox/${client.id}`}
                    target="_blank"
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                  >
                    Portal <ExternalLink size={14} />
                  </Link>

                  <button 
                    onClick={() => setEditingClient(client)}
                    className="py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODALS */}
      {editingClient && (
        <EditSandboxModal client={editingClient} onClose={() => setEditingClient(null)} onSave={handleSaveClient} />
      )}
    </div>
  );
}