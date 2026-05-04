/* src/app/login/page.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, SANDBOX_CLIENTS } from '@/utils/glossary';
import { Globe, Users, Shield, ArrowLeft, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { loginAdmin } from '@/app/actions';
import { supabase } from '@/utils/supabase';

export default function GatewayPage() {
  const [authMode, setAuthMode] = useState<'lobby' | 'client_auth' | 'master_auth'>('lobby');
  const [clientCode, setClientCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isCheckingClient, setIsCheckingClient] = useState(false);
  
  const copy = WEBSITE_COPY.GATEWAY;
  const router = useRouter();

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsCheckingClient(true);
    
    const code = clientCode.trim().toUpperCase();

    try {
      // 1. SINGLE SOURCE OF TRUTH: Query Supabase Database First
      const { data: dbClient, error } = await supabase
        .from('clients')
        .select('*')
        .or(`workspace_code.eq.${code},id.eq.${clientCode.trim().toLowerCase()}`)
        .single();

      if (dbClient) {
        if (dbClient.master_pin?.toString() === pinCode.trim()) {
          // Fast-Pass Token: Skip the gatekeeper on the next screen
          localStorage.setItem(`sandbox_auth_${dbClient.id}`, 'true');
          router.push(`/sandbox/${dbClient.id}`);
          return;
        } else {
          setErrorMsg('Invalid Security PIN');
          setIsCheckingClient(false);
          return;
        }
      }
    } catch (err) {
      console.error("DB check failed, falling back to local configs.", err);
    }

    // 2. FALLBACK: Local Config Check
    const localCode = clientCode.trim().toLowerCase();
    const foundClient = Object.values(SANDBOX_CLIENTS).find(
      (client: any) => client.accessCode?.toLowerCase() === localCode || client.id?.toLowerCase() === localCode
    );

    if (foundClient) {
      if (foundClient.security.pin === pinCode.trim()) {
        localStorage.setItem(`sandbox_auth_${foundClient.id}`, 'true');
        router.push(`/sandbox/${foundClient.id}`);
      } else {
        setErrorMsg('Invalid Security PIN');
      }
    } else {
      setErrorMsg('Invalid Workspace Code');
    }
    
    setIsCheckingClient(false);
  };

  // ==========================================
  // PATH A: CLIENT ACCESS ROUTER
  // ==========================================
  if (authMode === 'client_auth') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-cyan-900/10 via-fuchsia-900/10 to-emerald-900/10 pointer-events-none"></div>

         <button 
          onClick={() => { setAuthMode('lobby'); setErrorMsg(''); setClientCode(''); setPinCode(''); }} 
          className="absolute top-6 left-6 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-20"
        >
          <ArrowLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Gateway</span>
        </button>

        <div className="z-10 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(34,211,238,0.15)] border border-zinc-800 shrink-0 text-cyan-400">
            <Users size={32} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Client Login</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Enter your secure credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleClientSubmit} className="space-y-4 w-full">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Workspace Code</label>
              <input 
                type="text" 
                value={clientCode}
                onChange={(e) => setClientCode(e.target.value)}
                placeholder="e.g. LUK-992"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 font-bold focus:outline-none focus:border-cyan-500 transition-colors uppercase"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Security PIN</label>
              <input 
                type="password" 
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                placeholder="••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 font-bold tracking-[0.5em] focus:outline-none focus:border-cyan-500 transition-colors"
                required
              />
            </div>

            {errorMsg && (
              <div className="text-rose-400 text-xs font-bold text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit"
              disabled={isCheckingClient}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isCheckingClient ? <Loader2 size={16} className="animate-spin" /> : <>Enter Workspace <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PATH B: MASTER AUTH ROUTER (ADMIN)
  // ==========================================
  if (authMode === 'master_auth') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden">
        {/* FIX 3: Fixed Tailwind Syntax Error */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-brand-primary/10 via-zinc-950 to-zinc-950 pointer-events-none"></div>

         <button 
          onClick={() => { setAuthMode('lobby'); setErrorMsg(''); setClientCode(''); setPinCode(''); }} 
          className="absolute top-6 left-6 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-20"
        >
          <ArrowLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Gateway</span>
        </button>

        <div className="z-10 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(6,182,212,0.15)] border border-zinc-800 shrink-0 text-brand-primary">
            <Lock size={32} />
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2 text-white">Master Override</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">System Architect access required.</p>
          </div>

          {/* FIX 1: Wrapped the server action in an async handler for strict typing */}
          <form action={async (formData) => { await loginAdmin(formData); }} className="space-y-4 w-full">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Root Email</label>
              <input 
                name="email"
                type="email" 
                placeholder="architect@alternativesolutions.io"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 font-bold focus:outline-none focus:border-brand-primary transition-colors"
                required
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1 mb-1 block">Passphrase</label>
              <input 
                name="password"
                type="password" 
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-100 font-bold focus:outline-none focus:border-brand-primary transition-colors"
                required
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-primary hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] mt-2"
            >
              Initialize System
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PATH C: THE LOBBY
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="mb-12 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl">
             <Globe size={24} className="text-zinc-400" />
          </div>
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2">{copy.TITLE}</h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{copy.SUBTITLE}</p>
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={() => setAuthMode('client_auth')}
            className="w-full group bg-zinc-900/50 border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900 rounded-2xl p-6 transition-all duration-300 flex items-center gap-4 text-left"
          >
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
            <div>
              {/* FIX 2: Corrected the Glossary Object paths */}
              <h3 className="font-black text-white uppercase tracking-widest text-sm mb-1">{copy.CLIENT.TITLE}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{copy.CLIENT.DESC}</p>
            </div>
          </button>

          <button 
            onClick={() => setAuthMode('master_auth')}
            className="w-full group bg-zinc-900/50 border border-zinc-800 hover:border-brand-primary/50 hover:bg-zinc-900 rounded-2xl p-6 transition-all duration-300 flex items-center gap-4 text-left"
          >
            <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-xl group-hover:scale-110 transition-transform">
              <Shield size={20} />
            </div>
            <div>
              {/* FIX 2: Corrected the Glossary Object paths */}
              <h3 className="font-black text-white uppercase tracking-widest text-sm mb-1">{copy.MASTER.TITLE}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{copy.MASTER.DESC}</p>
            </div>
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-[10px] font-bold text-zinc-600 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
            <ArrowLeft size={12} /> Return to Public Site
          </Link>
        </div>

      </div>
    </div>
  );
}