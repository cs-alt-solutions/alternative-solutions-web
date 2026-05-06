'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// WE NEED THIS LINE BACK! This connects us to the secure browser client.
import { supabase } from '@/utils/supabase'; 
import { ShieldCheck, Lock, Loader2 } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fixed path: Looking specifically inside DASHBOARD for ONBOARDING
  const copy = WEBSITE_COPY.DASHBOARD?.ONBOARDING?.UPDATE_PASSWORD || {
    TITLE: "Initialize Account", SUBTITLE: "Set your secure password.",
    FIELDS: { NEW_PASSWORD: "New Password", CONFIRM_PASSWORD: "Confirm" },
    ACTIONS: { SUBMIT: "Save & Enter", SAVING: "Encrypting..." }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters for security clearance.");
      return;
    }

    setIsSubmitting(true);

    // 1. Update the password in the Secure Vault
    const { error: passwordError } = await supabase.auth.updateUser({ password: password });

    if (passwordError) {
      setErrorMsg(passwordError.message);
      setIsSubmitting(false);
      return;
    }

    // 2. Fetch the newly logged-in user to grab their metadata
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      // 3. Mark their public profile as ACTIVE 
      const { error: updateError } = await supabase.from('profiles')
        .update({ status: 'ACTIVE' })
        .eq('id', user.id);
        
      if (updateError) {
        console.error("Status update blocked:", updateError);
      }

      // 4. THE SMART ROUTER: Read their metadata and send them to the right portal
      const workspaceId = user.user_metadata?.workspace_id;
      const role = user.user_metadata?.role;
      
      let nextRoute = '/dashboard'; // Default fallback

      if (workspaceId === 'luckystrike') {
        nextRoute = '/sandbox/luckystrike';
      } else if (workspaceId === 'division') {
        nextRoute = '/division/hq'; 
      } else if (role === 'CLIENT_OWNER' && workspaceId && workspaceId !== 'NONE') {
        nextRoute = `/sandbox/${workspaceId}`;
      } else if (role === 'ADMIN' || role === 'STAFF') {
        nextRoute = '/dashboard';
      }

      // Execute the route!
      router.push(nextRoute);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-bg-surface-100 border border-white/10 rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">{copy.TITLE}</h1>
          <p className="text-xs font-mono text-slate-400 mt-2">{copy.SUBTITLE}</p>
        </div>

        <form onSubmit={handleUpdatePassword} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs font-mono text-center">
              {errorMsg}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Lock size={12} className="text-cyan-400" /> {copy.FIELDS.NEW_PASSWORD}
            </label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
              <Lock size={12} className="text-slate-500" /> {copy.FIELDS.CONFIRM_PASSWORD}
            </label>
            <input 
              type="password" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-brand-primary text-slate-900 hover:bg-cyan-400 font-black uppercase tracking-widest text-xs px-4 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)] mt-4"
          >
            {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {isSubmitting ? copy.ACTIONS.SAVING : copy.ACTIONS.SUBMIT}
          </button>
        </form>
      </div>
    </div>
  );
}