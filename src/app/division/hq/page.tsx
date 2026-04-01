'use client';

import React, { useState, Suspense } from 'react';
import AdminTerminal from '@/components/sandbox/apps/admin/AdminTerminal';
import { divisionConfig } from '@/config/clients/division';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { verifyCommandPin } from './actions';

export default function DivisionHQPage() {
  const [isVerified, setIsVerified] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // This calls the secure server file so the PIN never exposes in the browser
    const isValid = await verifyCommandPin(pin);

    if (isValid) {
      setIsVerified(true);
    } else {
      setError('UNAUTHORIZED ACCESS LOGGED');
      setPin('');
    }
    setIsLoading(false);
  };

  if (!isVerified) {
    return (
      <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <div className="bg-zinc-900 p-5 rounded-3xl mb-6 border border-zinc-800 shadow-xl">
            <ShieldAlert size={32} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>
          <h1 className="text-3xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase">Command Center</h1>
          <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-10 uppercase text-center">Division HQ Secured Entry</p>
          
          <form onSubmit={handleAuth} className="w-full">
            <div className="relative mb-4">
              <input 
                type="password" 
                autoFocus 
                value={pin} 
                onChange={(e) => { setError(""); setPin(e.target.value); }} 
                placeholder="ENTER SECURE PIN" 
                className={`w-full bg-zinc-900 border-2 rounded-2xl p-5 text-center text-xl tracking-[0.2em] font-black outline-none transition-all shadow-inner placeholder:text-zinc-700 placeholder:text-sm placeholder:font-bold ${error ? 'border-rose-500 text-rose-500 bg-rose-500/5 animate-shake' : 'border-zinc-800 text-cyan-400 focus:border-cyan-500/50'}`} 
                maxLength={6} 
                disabled={isLoading}
              />
              {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-rose-500 text-[10px] font-bold uppercase tracking-widest leading-tight mt-2">{error}</p>}
            </div>
            <button 
              type="submit" 
              disabled={!pin.trim() || isLoading} 
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-6"
            >
              {isLoading ? 'Verifying...' : 'Initialize Secure Link'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="min-h-dvh bg-zinc-950 flex items-center justify-center text-cyan-500 font-black tracking-widest uppercase">Loading Command Center...</div>}>
      <AdminTerminal 
        clientConfig={divisionConfig} 
        onExit={() => window.location.href = '/'} 
      />
    </Suspense>
  );
}