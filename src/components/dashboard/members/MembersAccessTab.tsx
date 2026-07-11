'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; 
import { Search, UserCircle, Mail, Calendar, BadgeCheck, ShieldAlert, Loader2, Save, UserPlus, RefreshCw, Users, Shield, Beaker } from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';
import { WEBSITE_COPY } from '@/utils/glossary';
import ResponsiveTable from '@/components/core/ResponsiveTable';

type FilterTab = 'ALL' | 'STAFF' | 'CLIENT' | 'BETA';

const Badge = ({ status }: { status: string }) => {
  const isActive = status === 'ACTIVE';
  const isPending = status === 'PENDING';
  
  return (
    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
      isActive ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 
      isPending ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
      'bg-slate-800 text-slate-400 border-slate-700'
    }`}>
      {status}
    </span>
  );
};

export default function MembersAccessTab({ initialProfiles }: { initialProfiles: any[] }) {
  const [profiles, setProfiles] = useState<any[]>(initialProfiles);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<FilterTab>('ALL');

  useEffect(() => {
    setProfiles(initialProfiles);
    const fetchWorkspaces = async () => {
      const { data } = await supabase.from('projects').select('id, name, title, type');
      if (data) setWorkspaces(data);
    };
    fetchWorkspaces();
  }, [initialProfiles]);

  const copy = WEBSITE_COPY.DASHBOARD?.HUMAN_MANAGEMENT?.ACCESS_TAB || {
    STATUS_ACTIVE: "Active", STATUS_PENDING: "Pending", BTN_RESEND: "Resend Invite", BTN_RESENDING: "Sending..."
  };

  // Define columns for the ResponsiveTable component
  const columns = [
    { 
      header: 'Member', 
      accessor: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center">
            <UserCircle size={18} className="text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">{u.full_name || u.email.split('@')[0]}</div>
            <div className="text-[10px] font-mono text-slate-500">{u.email}</div>
          </div>
        </div>
      ) 
    },
    { 
      header: 'Role', 
      accessor: (u: any) => (
        <span className="px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-white/10 bg-white/5">
          {u.role}
        </span>
      ) 
    },
    { 
      header: 'Status', 
      accessor: (u: any) => <Badge status={u.status} /> 
    }
  ];

  const filteredProfiles = profiles.filter(user => {
    if (activeTab === 'STAFF') return user.role === 'ADMIN' || user.role === 'STAFF';
    if (activeTab === 'CLIENT') return user.role === 'CLIENT_OWNER';
    if (activeTab === 'BETA') return user.role === 'BETA';
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>All</button>
        <button onClick={() => setActiveTab('STAFF')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STAFF' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}><Shield size={14} /> Staff</button>
        <button onClick={() => setActiveTab('CLIENT')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'CLIENT' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}><Users size={14} /> Clients</button>
        <button onClick={() => setActiveTab('BETA')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'BETA' ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}><Beaker size={14} /> Beta</button>
      </div>

      <div className="flex items-center justify-end">
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-brand-primary text-slate-900 hover:bg-cyan-400 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-lg transition-all"
        >
          <UserPlus size={14} /> Invite Member
        </button>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
        onSuccess={(newProfile) => setProfiles(prev => [newProfile, ...prev])}
        workspaces={workspaces}
      />

      <div className="bg-bg-surface-200/30 border border-white/5 rounded-2xl p-4">
        <ResponsiveTable data={filteredProfiles} columns={columns} />
      </div>
    </div>
  );
}