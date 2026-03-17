/* src/app/login/page.tsx */
'use client';

import React, { useState } from 'react';
import { TerminalSquare, Lock, AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { loginAdmin } from '@/app/actions';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  async function handleLogin(formData: FormData) {
    setIsLoggingIn(true);
    setError(null);
    
    const res = await loginAdmin(formData);
    
    if (res?.success === false) {
      setError(res.message);
      setIsLoggingIn(false);
    }
  }

  return (
    <main className="min-h-screen bg-bg-app flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-stardust opacity-20 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-brand-primary/10 border border-brand-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
             <Lock size={32} className="text-brand-primary" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">System Auth</h1>
          <p className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em]">Restricted Command Access</p>
        </div>

        <div className="bg-black/60 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-brand-primary to-transparent opacity-50" />

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs font-mono text-red-400 uppercase tracking-widest leading-relaxed">{error}</p>
            </div>
          )}

          <form action={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest pl-1">Admin Email</label>
              <div className="relative">
                <TerminalSquare size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50" />
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors"
                  placeholder="arch@alternativesolutions.io"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-mono text-white/50 uppercase tracking-widest pl-1">Passkey</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary/50" />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white font-mono placeholder:text-white/20 focus:outline-none focus:border-brand-primary/50 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full mt-4 bg-brand-primary text-black font-black uppercase tracking-widest text-[10px] py-4 rounded-xl flex items-center justify-center gap-3 hover:bg-brand-accent transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] disabled:opacity-50"
            >
              {isLoggingIn ? <Loader2 size={16} className="animate-spin" /> : <>Initialize Sequence <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}