'use client';
import React, { useState } from 'react';
import { X, Mail, Shield, Briefcase, Loader2, Send, UserPlus } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newProfile: any) => void;
  workspaces: any[]; 
}

export default function InviteMemberModal({ isOpen, onClose, onSuccess, workspaces = [] }: InviteMemberModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CLIENT_OWNER');
  const [workspace, setWorkspace] = useState('NONE');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName, role, workspace })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invite');
      }

      // THE FIX: Provide both name mapping variants to guarantee instant UI rendering
      const newProfile = {
        id: data.user?.id || crypto.randomUUID(), 
        email: email,
        name: fullName, 
        full_name: fullName,
        role: role,
        workspace_id: workspace === 'NONE' ? null : workspace,
        status: 'INVITED', 
        created_at: new Date().toISOString()
      };

      // Fire it up to the parent table immediately
      if (onSuccess) {
        onSuccess(newProfile);
      }

      setSuccessMsg('Transmission successful: Magic Link dispatched.');
      
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
        setEmail('');
        setFullName('');
        setRole('CLIENT_OWNER');
        setWorkspace('NONE');
      }, 2000);

    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800/80 bg-zinc-900/50">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight uppercase">Grant Access</h2>
            <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mt-1">Initialize New Operator</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 text-zinc-500 hover:text-white rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {successMsg ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 mb-2">
                <Send size={20} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Link Sent</h3>
              <p className="text-xs font-mono text-zinc-400">The magic link is en route.</p>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="space-y-5">
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@domain.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-cyan-500 flex items-center gap-2">
                  <UserPlus size={12} /> Full Name
                </label>
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Shield size={12} /> System Role
                  </label>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="CLIENT_OWNER">Client</option>
                    <option value="BETA">Beta</option>
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                    <Briefcase size={12} /> Workspace
                  </label>
                  <select 
                    value={workspace}
                    onChange={(e) => setWorkspace(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-xs font-mono text-zinc-300 focus:outline-none focus:border-cyan-500 uppercase"
                  >
                    <option value="NONE">Unassigned</option>
                    
                    {/* DYNAMIC DATABASE RENDER */}
                    <optgroup label="Active Client Portals" className="bg-slate-800 text-emerald-400 font-bold">
                      {workspaces.filter(w => w.type === 'CLIENT').map(w => (
                        <option key={w.id} value={w.id} className="text-slate-200 bg-zinc-900">{w.title || w.name}</option>
                      ))}
                    </optgroup>

                    <optgroup label="Beta Test Labs" className="bg-slate-800 text-purple-400 font-bold">
                      {workspaces.filter(w => w.type === 'PROTOTYPE').map(w => (
                        <option key={w.id} value={w.id} className="text-slate-200 bg-zinc-900">{w.title || w.name}</option>
                      ))}
                    </optgroup>

                    <optgroup label="Internal Staff" className="bg-slate-800 text-amber-400 font-bold">
                      {workspaces.filter(w => w.type === 'INTERNAL').map(w => (
                        <option key={w.id} value={w.id} className="text-slate-200 bg-zinc-900">{w.title || w.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] font-mono text-rose-400 uppercase tracking-widest">
                  {errorMsg}
                </div>
              )}

              <div className="pt-4 border-t border-zinc-800/80">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] disabled:opacity-50"
                >
                  {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {isLoading ? 'Transmitting...' : 'Send Magic Link'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}