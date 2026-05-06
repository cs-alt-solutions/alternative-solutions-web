'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, SANDBOX_CLIENTS } from '@/utils/glossary';
import { Globe, Users, Shield, ArrowLeft, Lock, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabase';
import { loginAdmin } from '@/app/actions';

export default function GatewayPage() {
  const [authMode, setAuthMode] = useState<'lobby' | 'client_auth' | 'master_auth'>('lobby');
  const [clientCode, setClientCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // States for Admin Login
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const copy = WEBSITE_COPY.GATEWAY;
  const router = useRouter();

  const handleClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoggingIn(true);
    
    const code = clientCode.trim().toUpperCase();
    const localCode = clientCode.trim().toLowerCase();

    try {
      const { data: dbClient, error } = await supabase
        .from('clients')
        .select('*')
        .or(`workspace_code.eq.${code},id.eq.${localCode}`)
        .maybeSingle();

      if (error) {
         console.error("Database query anomaly:", error);
      } else if (dbClient) {
        if (dbClient.master_pin?.toString() === pinCode.trim()) {
          localStorage.setItem(`sandbox_auth_${dbClient.id}`, 'true');
          router.push(`/sandbox/${dbClient.id}`);
          return;
        } else {
          setErrorMsg('Invalid Security Credentials');
          setIsLoggingIn(false);
          return;
        }
      }
    } catch (err) {
      console.error("DB connection interrupted, failing over to local configs.", err);
    }

    const foundClient = Object.values(SANDBOX_CLIENTS).find(
      (client: any) => client.accessCode?.toLowerCase() === localCode || client.id?.toLowerCase() === localCode
    );

    if (foundClient) {
      if (foundClient.security.pin === pinCode.trim()) {
        localStorage.setItem(`sandbox_auth_${foundClient.id}`, 'true');
        router.push(`/sandbox/${foundClient.id}`);
      } else {
        setErrorMsg('Invalid Security Credentials');
      }
    } else {
      setErrorMsg('Unrecognized Workspace Code');
    }
    
    setIsLoggingIn(false);
  };

  // SECURE SERVER-SIDE HANDLER
  const handleAdminSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoggingIn(true);

    const formData = new FormData(e.currentTarget);
    const response = await loginAdmin(formData);

    // If we get a response back, it means the server blocked it
    if (response?.success === false) {
      setErrorMsg(response.message);
      setIsLoggingIn(false);
    }
    // If successful, the server action automatically fires redirect() so we don't need code here!
  };

  const resetState = () => {
    setAuthMode('lobby'); 
    setErrorMsg(''); 
    setClientCode(''); 
    setPinCode('');
    setAdminEmail('');
    setAdminPassword('');
    setIsLoggingIn(false);
  };

  if (authMode === 'client_auth') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden selection:bg-cyan-500/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[60vh] bg-cyan-900/20 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

         <button onClick={resetState} className="absolute top-6 left-6 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-50 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-zinc-800">
          <ArrowLeft size={16} /> <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>

        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 relative">
          <div className="absolute -top-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl w-full shadow-[0_0_40px_rgba(34,211,238,0.05)] relative overflow-hidden">
            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              <div className="bg-zinc-950 p-4 rounded-2xl mb-4 border border-zinc-800 text-cyan-400 shadow-inner flex items-center justify-center relative group">
                <Users size={28} className="relative z-10" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">Client Portal</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Log in to your workspace.</p>
            </div>

            <form onSubmit={handleClientSubmit} className="space-y-5 w-full relative z-10">
              <div>
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2">
                  <Globe size={12} /> Workspace Code
                </label>
                <input 
                  type="text" 
                  value={clientCode}
                  onChange={(e) => setClientCode(e.target.value)}
                  placeholder="e.g. LUK-992"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 font-bold focus:outline-none focus:border-cyan-500/50 transition-all uppercase placeholder:text-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-cyan-500 uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2">
                  <KeyRound size={12} /> PIN Code
                </label>
                <input 
                  type="password" 
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 font-black tracking-[0.5em] focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-zinc-700 placeholder:tracking-normal"
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
                {isLoggingIn ? <><Loader2 size={16} className="animate-spin" /> Loading...</> : <>Enter Portal <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (authMode === 'master_auth') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden selection:bg-brand-primary/30">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[60vh] bg-brand-primary/10 blur-[120px] pointer-events-none rounded-full"></div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>

         <button onClick={resetState} className="absolute top-6 left-6 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors z-50 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-zinc-800">
          <ArrowLeft size={16} /> <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>

        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 relative">
          <div className="absolute -top-12 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl w-full shadow-[0_0_40px_rgba(6,182,212,0.05)] relative overflow-hidden">
            <div className="flex flex-col items-center text-center mb-8 relative z-10">
              <div className="bg-zinc-950 p-4 rounded-2xl mb-4 border border-zinc-800 text-brand-primary shadow-inner flex items-center justify-center relative group">
                <Lock size={28} className="relative z-10" />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-white">Admin Access</h1>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Log in to your command center.</p>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-5 w-full relative z-10">
              <div>
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2">
                  Email Address
                </label>
                <input 
                  name="email"
                  type="email" 
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="name@alternativesolutions.io"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 font-bold focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-zinc-700"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest ml-1 mb-1.5 flex items-center gap-2">
                  Password
                </label>
                <input 
                  name="password"
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3.5 text-sm text-zinc-100 font-black tracking-[0.3em] focus:outline-none focus:border-brand-primary/50 transition-all placeholder:text-zinc-700 placeholder:tracking-normal"
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
                className="w-full bg-brand-primary hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.2)] flex justify-center items-center gap-2 mt-2 disabled:opacity-50"
              >
                {isLoggingIn ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : <>Enter Dashboard <ArrowRight size={16} /></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-screen h-[60vh] bg-zinc-800/10 blur-[120px] pointer-events-none rounded-full"></div>
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
        
        <div className="mb-12 text-center flex flex-col items-center relative">
          <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl relative overflow-hidden group">
             <Globe size={28} className="text-zinc-400 relative z-10" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-white mb-2">{copy?.TITLE || "GATEWAY"}</h1>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{copy?.SUBTITLE || "SECURE ACCESS"}</p>
        </div>

        <div className="w-full space-y-4">
          <button 
            onClick={() => setAuthMode('client_auth')}
            className="w-full group bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-cyan-500/50 hover:bg-zinc-900/80 rounded-2xl p-6 transition-all duration-300 flex items-center gap-5 text-left relative overflow-hidden"
          >
            <div className="p-3 bg-zinc-950 border border-zinc-800 text-cyan-400 rounded-xl group-hover:scale-110 group-hover:border-cyan-500/30 transition-all shadow-inner relative z-10">
              <Users size={20} />
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-white uppercase tracking-widest text-sm mb-1">{copy?.CLIENT?.TITLE || "Client Access"}</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{copy?.CLIENT?.DESC || "Enter secure portal"}</p>
            </div>
          </button>

          <button 
            onClick={() => setAuthMode('master_auth')}
            className="w-full group bg-zinc-900/40 backdrop-blur-md border border-zinc-800 hover:border-brand-primary/50 hover:bg-zinc-900/80 rounded-2xl p-6 transition-all duration-300 flex items-center gap-5 text-left relative overflow-hidden"
          >
            <div className="p-3 bg-zinc-950 border border-zinc-800 text-brand-primary rounded-xl group-hover:scale-110 group-hover:border-brand-primary/30 transition-all shadow-inner relative z-10">
              <Shield size={20} />
            </div>
            <div className="relative z-10">
              <h3 className="font-black text-white uppercase tracking-widest text-sm mb-1">Team Login</h3>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Access the main dashboard.</p>
            </div>
          </button>
        </div>
        
        <div className="mt-12 text-center">
          <Link href="/" className="text-[10px] font-black text-zinc-600 hover:text-white transition-colors uppercase tracking-widest flex items-center justify-center gap-2 bg-zinc-900/50 backdrop-blur-sm px-4 py-2 rounded-full border border-zinc-800">
            <ArrowLeft size={12} /> Return to Public Site
          </Link>
        </div>
      </div>
    </div>
  );
}