/* src/components/dashboard/client-hq/ClientAccessModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
// Added Mail icon for the resend button
import { Users, Send, Loader2, ShieldAlert, CheckCircle2, UserCircle, Mail } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface ClientAccessModuleProps {
  clientId: string;
  clientName: string;
}

export default function ClientAccessModule({ clientId, clientName }: ClientAccessModuleProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [operators, setOperators] = useState<any[]>([]);
  const [isLoadingOperators, setIsLoadingOperators] = useState(true);
  
  // New state to track which specific user we are resending to
  const [resendingId, setResendingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperators = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('workspace_id', clientId)
        .order('created_at', { ascending: false });
        
      if (data) setOperators(data);
      setIsLoadingOperators(false);
    };
    fetchOperators();
  }, [clientId]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setStatus('idle');
    setErrorMsg('');

    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fullName: name, role: 'CLIENT_OWNER', workspace: clientId })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send invite');
      
      const newProfile = {
        id: data.user?.id || crypto.randomUUID(), 
        email: email,
        full_name: name,
        role: 'CLIENT_OWNER',
        workspace_id: clientId,
        status: 'INVITED',
        created_at: new Date().toISOString()
      };

      setOperators(prev => [newProfile, ...prev]);
      setStatus('success');
      setEmail('');
      setName('');
    } catch (error: any) {
      setStatus('error');
      setErrorMsg(error.message);
    } finally {
      setIsSending(false);
      setTimeout(() => { setStatus('idle'); setErrorMsg(''); }, 4000);
    }
  };

  // NEW FUNCTION: Handle resending to an existing operator
  const handleResend = async (operator: any) => {
    setResendingId(operator.id);
    try {
      const response = await fetch('/api/invites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: operator.email, 
          fullName: operator.full_name, 
          role: operator.role, 
          workspace: clientId 
        })
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to resend');
      }
      
      // Update the local state briefly to show success
      setOperators(prev => prev.map(op => 
        op.id === operator.id ? { ...op, status: 'RESENT' } : op
      ));
      
      setTimeout(() => {
        setOperators(prev => prev.map(op => 
          op.id === operator.id ? { ...op, status: 'INVITED' } : op
        ));
      }, 3000);

    } catch (error) {
      console.error(error);
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-3xl p-6 shadow-lg flex flex-col gap-6">
      
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <h2 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
          <Users size={16} className="text-cyan-500" /> Hub Access
        </h2>
        <span className="text-[9px] font-mono text-cyan-500 uppercase tracking-widest bg-cyan-500/10 px-2 py-1 rounded border border-cyan-500/20 truncate max-w-30">
          {clientName}
        </span>
      </div>

      <form onSubmit={handleInvite} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">User Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daryl Owens"
              required
              className="w-full bg-bg-surface-200 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="daryl@collisioncorrection.com"
              required
              className="w-full bg-bg-surface-200 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] font-mono text-rose-400 uppercase tracking-widest">
            {errorMsg}
          </div>
        )}

        <button 
          type="submit"
          disabled={isSending || !email || !name}
          className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest bg-cyan-500 text-slate-900 py-3 mt-4 rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:shadow-none"
        >
          {isSending ? <Loader2 size={16} className="animate-spin" /> : status === 'success' ? <CheckCircle2 size={16} /> : status === 'error' ? <ShieldAlert size={16} /> : <Send size={16} />}
          {isSending ? 'Deploying...' : status === 'success' ? 'Invite Deployed' : 'Issue Secure Invite'}
        </button>
      </form>

      <div className="pt-6 border-t border-white/5">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          Provisioned Operators
        </h3>
        
        {isLoadingOperators ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 size={16} className="text-cyan-500 animate-spin" />
          </div>
        ) : operators.length === 0 ? (
          <div className="bg-black/20 border border-white/5 rounded-xl p-4 text-center">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">No operators assigned.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {operators.map((op) => (
              <div key={op.id} className="bg-bg-surface-200 border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-cyan-500/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-400">
                    <UserCircle size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-white leading-tight">{op.full_name || op.email.split('@')[0]}</span>
                    <span className="text-[9px] font-mono text-slate-500 leading-tight">{op.email}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${op.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : op.status === 'RESENT' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                    {op.status || 'INVITED'}
                  </span>
                  
                  {/* NEW RESEND BUTTON */}
                  <button 
                    onClick={() => handleResend(op)}
                    disabled={resendingId === op.id || op.status === 'ACTIVE'}
                    title="Resend Transmission"
                    className="p-1.5 rounded-md text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-500"
                  >
                    {resendingId === op.id ? <Loader2 size={14} className="animate-spin text-cyan-400" /> : <Mail size={14} />}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}