'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, ROUTES } from '@/utils/glossary';
import { Globe, ArrowLeft, Mail, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';

export default function GatewayPage() {
  const [email, setEmail] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const copy = WEBSITE_COPY.GATEWAY;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoggingIn(true);

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: false, // <-- KILLS OPEN REGISTRATION
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setIsLoggingIn(false);
    } else {
      setIsSuccess(true);
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden selection:bg-cyan-500/30">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[60vh] bg-cyan-900/20 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 relative">
        <div className="absolute -top-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl w-full shadow-[0_0_40px_rgba(34,211,238,0.05)] relative overflow-hidden">
          <div className="flex flex-col items-center text-center mb-8 relative z-10">
            <div className="bg-zinc-950 p-4 rounded-2xl mb-4 border border-zinc-800 text-cyan-400 shadow-inner flex items-center justify-center relative group">
              <Globe size={28} className="relative z-10" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy?.TITLE || "GATEWAY"}</h1>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Secure Access Protocol</p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center text-center space-y-4 py-4 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-2">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest">Link Sent</h3>
              <p className="text-xs font-mono text-zinc-400">Check your inbox for the secure access link. You can close this window.</p>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-5 w-full relative z-10">
              <div>
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 font-bold focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>

              {errorMsg && (
                <div className="text-rose-400 text-[10px] font-black uppercase tracking-widest text-center bg-rose-500/10 py-3 rounded-xl border border-rose-500/20 animate-in shake">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] flex justify-center items-center gap-2 disabled:opacity-50 mt-2"
              >
                {isLoggingIn ? <><Loader2 size={16} className="animate-spin" /> Transmitting...</> : <>Request Access <ArrowRight size={16} /></>}
              </button>
            </form>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link href={ROUTES.PUBLIC.HOME} className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800">
            <ArrowLeft size={12} /> Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}