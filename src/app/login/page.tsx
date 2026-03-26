/* src/app/login/page.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY, SANDBOX_CLIENTS } from '@/utils/glossary';
import { Globe, Users, Shield, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GatewayPage() {
  const [authMode, setAuthMode] = useState<'lobby' | 'client_auth' | 'master_auth'>('lobby');
  const [clientCode, setClientCode] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const copy = WEBSITE_COPY.GATEWAY;
  const router = useRouter();

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const code = clientCode.trim().toLowerCase();

    // Find the client by ID or Access Code
    const foundClient = Object.values(SANDBOX_CLIENTS).find(
      (client: any) => client.accessCode.toLowerCase() === code || client.id.toLowerCase() === code
    );

    if (foundClient) {
      if (foundClient.security.pin === pinCode) {
        // Fast-Pass Token: Skip the gatekeeper on the next screen
        localStorage.setItem(`sandbox_auth_${foundClient.id}`, 'true');
        router.push(`/sandbox/${foundClient.id}`);
      } else {
        setErrorMsg('Invalid Security PIN');
      }
    } else {
      setErrorMsg('Invalid Workspace Code');
    }
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
          <div className="bg-zinc-900 p-4 rounded-2xl mb-6 shadow-[0_0_20px_rgba(34,211,238,0.15)] border border-zinc-800 flex items-center justify-center relative">
            <Users size={40} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] relative z-10" />
            <Lock size={16} className="text-zinc-500 absolute -bottom-2 -right-2 bg-zinc-900 rounded-full" />
          </div>
          <h1 className="text-2xl font-black tracking-widest mb-1 text-center text-zinc-100 uppercase">CLIENT ACCESS</h1>
          <p className="text-zinc-500 text-sm font-semibold tracking-wide mb-8 uppercase text-center">Enter your Credentials</p>

          <form onSubmit={handleClientSubmit} className="w-full flex flex-col items-center gap-4">
            <input 
              type="text" 
              placeholder="WORKSPACE CODE"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value.toUpperCase())}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-center font-black tracking-widest text-lg text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 uppercase placeholder:text-zinc-600 placeholder:text-sm placeholder:font-bold"
              autoFocus
            />
            <input 
              type="password" 
              inputMode="numeric"
              placeholder="4-DIGIT PIN"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
              maxLength={4}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-center font-black tracking-widest text-2xl text-cyan-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 placeholder:text-zinc-600 placeholder:text-sm placeholder:font-bold placeholder:tracking-widest"
            />
            
            {errorMsg && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mt-2">{errorMsg}</p>}

            <button 
              type="submit" 
              disabled={!clientCode.trim() || pinCode.length < 4} 
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] disabled:shadow-none mt-4 transition-all"
            >
              Access Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PATH B: MASTER COMMAND (PLACEHOLDER)
  // ==========================================
  if (authMode === 'master_auth') {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
        <button onClick={() => setAuthMode('lobby')} className="absolute top-6 left-6 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
          <ArrowLeft size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Gateway</span>
        </button>
        <div className="animate-pulse text-amber-400 font-bold uppercase tracking-widest">Master Command Loading...</div>
      </div>
    );
  }

  // ==========================================
  // THE LOBBY VIEW
  // ==========================================
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative overflow-hidden selection:bg-white/10">
      <div className="absolute inset-0 bg-linear-to-b from-cyan-900/10 via-fuchsia-900/10 to-emerald-900/10 pointer-events-none"></div>
      
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-zinc-900 border-2 border-zinc-700 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Globe size={40} className="text-zinc-100" />
        </div>
        
        <h1 className="text-2xl font-black tracking-widest text-center text-zinc-100 mb-2 uppercase">
          {copy.TITLE}
        </h1>
        <p className="text-zinc-400 text-xs font-bold tracking-widest mb-12 uppercase bg-zinc-900 border border-zinc-800 px-4 py-1.5 rounded-full">
          {copy.SUBTITLE}
        </p>

        <div className="w-full space-y-4">
          <button 
            onClick={() => setAuthMode('client_auth')}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-cyan-500/50 p-5 rounded-3xl text-left group transition-all shadow-lg hover:shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl group-hover:border-cyan-500/50 transition-colors">
                <Users size={24} className="text-cyan-400" />
              </div>
              <div>
                <h2 className="font-black text-zinc-100 tracking-tight">{copy.CLIENT.TITLE}</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{copy.CLIENT.DESC}</p>
              </div>
            </div>
          </button>

          <button 
            onClick={() => setAuthMode('master_auth')}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 p-5 rounded-3xl text-left group transition-all shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] relative overflow-hidden"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl group-hover:border-amber-500/50 transition-colors">
                <Shield size={24} className="text-amber-400" />
              </div>
              <div>
                <h2 className="font-black text-zinc-100 tracking-tight">{copy.MASTER.TITLE}</h2>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{copy.MASTER.DESC}</p>
              </div>
            </div>
          </button>
        </div>

        <Link href="/" className="mt-8 text-xs font-bold text-zinc-500 hover:text-white uppercase tracking-widest transition-colors">
          Return to Website
        </Link>
      </div>
    </div>
  );
}