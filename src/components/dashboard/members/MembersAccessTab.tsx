'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase'; 
import { Search, UserCircle, Mail, Calendar, BadgeCheck, ChevronDown, ChevronUp, ShieldAlert, Loader2, Save, UserPlus, RefreshCw } from 'lucide-react';
import InviteMemberModal from './InviteMemberModal';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function MembersAccessTab({ initialProfiles }: { initialProfiles: any[] }) {
  // LIVE DATABASE STATE 
  const [profiles, setProfiles] = useState<any[]>(initialProfiles);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // LISTENER: Sync the UI instantly when Next.js fetches new server data
  useEffect(() => {
    setProfiles(initialProfiles);
  }, [initialProfiles]);
  
  // EDIT & ACTION STATE
  const [editingRole, setEditingRole] = useState<{ [key: string]: string }>({});
  const [editingWorkspace, setEditingWorkspace] = useState<{ [key: string]: string }>({});
  const [isSaving, setIsSaving] = useState<string | null>(null);
  const [isResending, setIsResending] = useState<string | null>(null);

  // Fallback copy just in case the config isn't fully synced
  const copy = WEBSITE_COPY.DASHBOARD?.MEMBERS?.ACCESS_TAB || {
    STATUS_ACTIVE: "Active", STATUS_PENDING: "Pending", BTN_RESEND: "Resend Invite", BTN_RESENDING: "Sending..."
  };

  const handleUpdateAccess = async (userId: string) => {
    setIsSaving(userId);
    const updates: any = {};
    if (editingRole[userId]) updates.role = editingRole[userId];
    if (editingWorkspace[userId]) updates.workspace_id = editingWorkspace[userId] === 'NONE' ? null : editingWorkspace[userId];

    const { error } = await supabase.from('profiles').update(updates).eq('id', userId);
    
    if (!error) {
      setProfiles(prev => prev.map(p => p.id === userId ? { ...p, ...updates } : p));
      setEditingRole(prev => ({ ...prev, [userId]: '' }));
      setEditingWorkspace(prev => ({ ...prev, [userId]: '' }));
    }
    setIsSaving(null);
  };

  // THE NEW RESEND PROTOCOL
  const handleResendInvite = async (userId: string, email: string) => {
    setIsResending(userId);
    try {
      const response = await fetch('/api/invites/resend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Failed to resend');
      alert("Transmission successful: New invite sent.");
      
    } catch (error) {
      console.error("Resend failed:", error);
      alert("Failed to resend invite. Check console.");
    } finally {
      setIsResending(null);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-black/40 border border-white/5 p-4 rounded-xl gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50" size={16} />
          <input 
            type="text" 
            placeholder="Search members..."
            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>
        
        <button 
          onClick={() => setIsInviteModalOpen(true)}
          className="flex items-center gap-2 bg-brand-primary text-slate-900 hover:bg-cyan-400 font-black uppercase tracking-widest text-[10px] px-4 py-2 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] shrink-0"
        >
          <UserPlus size={14} /> Invite Member
        </button>
      </div>

      <InviteMemberModal 
        isOpen={isInviteModalOpen} 
        onClose={() => setIsInviteModalOpen(false)} 
      />

      <div className="bg-bg-surface-200/30 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
          <div className="col-span-1">ID</div>
          <div className="col-span-5">Member</div>
          <div className="col-span-4">Access Level</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {profiles.length === 0 && (
          <div className="p-12 text-center text-slate-500 font-mono text-xs uppercase tracking-widest flex flex-col items-center">
             <ShieldAlert size={32} className="mb-3 opacity-50" />
             No members registered yet.
          </div>
        )}

        <div className="divide-y divide-white/5">
          {profiles.map((user, index) => {
            const isExpanded = expandedRow === user.id;
            const isAdmin = user.role === 'ADMIN';
            const isPending = user.status !== 'ACTIVE';
            const roleColor = isAdmin ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 
                              user.role === 'CLIENT_OWNER' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                              'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';

            return (
              <div key={user.id} className="flex flex-col">
                <div onClick={() => toggleRow(user.id)} className={`grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center cursor-pointer transition-colors group ${isExpanded ? 'bg-white/5' : 'hover:bg-white/5'}`}>
                  
                  <div className="col-span-1 flex items-center gap-2">
                    <span className="text-sm font-mono text-slate-500 font-bold">#{index + 1}</span>
                  </div>
                  
                  <div className="col-span-1 md:col-span-5 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center shrink-0 ${isAdmin ? 'text-amber-400' : 'text-slate-400'}`}>
                      <UserCircle size={18} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-sm font-bold text-slate-200 flex items-center gap-2">
                          {user.full_name || 'Pending User'}
                          {isAdmin && <BadgeCheck size={14} className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />}
                       </span>
                       <span className="text-[10px] font-mono text-slate-500">{user.email}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-1 md:col-span-4 flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-1 rounded text-[9px] font-black tracking-widest uppercase border ${roleColor}`}>
                      {user.role === 'CLIENT_OWNER' ? 'Client' : user.role || 'Observer'}
                    </span>
                    {user.workspace_id && (
                      <span className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-1 rounded border border-white/10 uppercase">
                         {user.workspace_id}
                      </span>
                    )}
                  </div>
                  
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${!isPending ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]' : 'bg-slate-600'}`} />
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {!isPending ? copy.STATUS_ACTIVE : copy.STATUS_PENDING}
                      </span>
                    </div>
                    <div className="text-white/20 group-hover:text-cyan-400 transition-colors">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>
                </div>

                <div className={`overflow-hidden transition-all duration-300 ease-in-out bg-black/40 border-t border-white/5 ${isExpanded ? 'max-h-125 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* User Details & Resend Button */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">User Details</h4>
                      <div className="bg-black/50 border border-white/5 rounded-xl p-5 space-y-3 shadow-inner h-full">
                        <div className="text-lg font-black text-white">{user.full_name || 'Awaiting Setup'}</div>
                        <div className="flex flex-col gap-3 pt-3 border-t border-white/5">
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-400"><Mail size={12} className="text-brand-primary" /> {user.email}</div>
                          <div className="flex items-center gap-3 text-xs font-mono text-slate-400"><Calendar size={12} className="text-brand-primary" /> Added: {new Date(user.created_at).toLocaleDateString()}</div>
                          
                          {/* RESEND INVITE BUTTON (Only shows if they aren't active) */}
                          {isPending && (
                            <div className="pt-2">
                              <button 
                                onClick={() => handleResendInvite(user.id, user.email)}
                                disabled={isResending === user.id}
                                className="flex items-center gap-2 bg-slate-800 border border-white/10 hover:bg-slate-700 hover:text-white text-slate-400 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all w-fit"
                              >
                                {isResending === user.id ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
                                {isResending === user.id ? copy.BTN_RESENDING : copy.BTN_RESEND}
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>

                    {/* Access Control Manager */}
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">Edit Access & Role</h4>
                      <div className="bg-black/50 border border-white/5 rounded-xl p-5 shadow-inner flex flex-col gap-4">
                        
                        <div className="space-y-2">
                           <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">System Role</label>
                           <select 
                             value={editingRole[user.id] !== undefined ? editingRole[user.id] : user.role}
                             onChange={(e) => setEditingRole(prev => ({ ...prev, [user.id]: e.target.value }))}
                             className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                           >
                             <option value="OBSERVER">Observer (View Only)</option>
                             <option value="CLIENT_OWNER">Client Owner</option>
                             <option value="STAFF">Internal Staff</option>
                             <option value="ADMIN">Super Admin</option>
                           </select>
                        </div>

                        <div className="space-y-2">
                           <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Assign to Workspace</label>
                           <select 
                             value={editingWorkspace[user.id] !== undefined ? editingWorkspace[user.id] : (user.workspace_id || 'NONE')}
                             onChange={(e) => setEditingWorkspace(prev => ({ ...prev, [user.id]: e.target.value }))}
                             className="w-full bg-zinc-900 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500 uppercase"
                           >
                             <option value="NONE">Unassigned</option>
                             <option value="luckystrike">LUCKYSTRIKE</option>
                             <option value="division">DIVISION</option>
                             <option value="internal">INTERNAL_HQ</option>
                           </select>
                        </div>

                        {(editingRole[user.id] || editingWorkspace[user.id]) && (
                           <button 
                             onClick={() => handleUpdateAccess(user.id)}
                             disabled={isSaving === user.id}
                             className="mt-2 w-full flex items-center justify-center gap-2 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500 hover:text-slate-900 text-cyan-400 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all"
                           >
                             {isSaving === user.id ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
                             Save Changes
                           </button>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}