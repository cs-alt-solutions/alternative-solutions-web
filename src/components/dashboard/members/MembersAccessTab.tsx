'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; 
import { UserCircle, Shield, Users, Beaker, Building2, UserPlus } from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';
import ResponsiveTable from '@/components/core/ResponsiveTable';

type FilterTab = 'ALL' | 'STAFF' | 'CLIENT' | 'BETA';

const Badge = ({ status }: { status: string }) => {
  const isActive = status === 'ACTIVE' || status === 'LIVE';
  const isPending = status === 'PENDING' || status === 'INVITED';
  
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
    const fetchData = async () => {
      // 1. Fetch internal workspaces for the modal
      const { data: projectData } = await supabase.from('projects').select('id, name, title, type');
      if (projectData) setWorkspaces(projectData);

      // 2. Fetch active storefront clients directly from the source of truth
      const { data: storefronts } = await supabase
        .from('storefronts')
        .select('id, contact_name, contact_email, business_name, status')
        .in('status', ['ACTIVE', 'LIVE'])
        .not('stripe_subscription_id', 'is', null);

      // 3. Merge Staff/Beta users with real Storefront Clients
      const staffAndBeta = initialProfiles.filter(p => p.role !== 'CLIENT_OWNER');
      
      const activeClients = (storefronts || []).map(store => ({
        id: store.id,
        full_name: store.contact_name || 'Unknown Client',
        email: store.contact_email || 'No Email',
        role: 'CLIENT_OWNER',
        business_name: store.business_name,
        status: store.status
      }));

      setProfiles([...staffAndBeta, ...activeClients]);
    };
    
    fetchData();
  }, [initialProfiles]);

  // Define columns for the ResponsiveTable component
  const columns = [
    { 
      header: 'Member', 
      accessor: (u: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center shrink-0">
            <UserCircle size={18} className="text-slate-400" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">{u.full_name || u.email?.split('@')[0]}</div>
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
      header: 'Connected Storefront', 
      accessor: (u: any) => (
        u.role === 'CLIENT_OWNER' && u.business_name ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-md border border-brand-primary/20">
            <Building2 size={12} /> {u.business_name}
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Internal Platform</span>
        )
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
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveTab('ALL')} className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'ALL' ? 'bg-cyan-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>All</button>
          <button onClick={() => setActiveTab('STAFF')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'STAFF' ? 'bg-amber-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}><Shield size={14} /> Staff</button>
          <button onClick={() => setActiveTab('CLIENT')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'CLIENT' ? 'bg-emerald-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}><Users size={14} /> Clients</button>
          <button onClick={() => setActiveTab('BETA')} className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'BETA' ? 'bg-purple-500 text-zinc-950' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}><Beaker size={14} /> Beta</button>
        </div>

        {/* 
          Disabled per your request to not implement invite functionality right now. 
          Uncomment this block when you are ready to expand the portal to secondary client users.
        */}
        {/* 
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-brand-primary text-slate-900 hover:bg-cyan-400 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-lg transition-all"
        >
          <UserPlus size={14} /> Invite Member
        </button>
        */}
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