'use client';

import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function Gatekeeper({ onUnlock, appTitle, pin, lockedMessage }: any) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input === pin) {
      onUnlock();
    } else {
      setError('Invalid Security PIN');
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-120 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="z-10 w-full max-w-xs flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-zinc-900 p-5 rounded-3xl mb-6 border border-zinc-800">
          <Lock size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
        <h1 className="text-2xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase">{appTitle}</h1>
        <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-10 uppercase text-center">{lockedMessage || 'Authorized Personnel Only'}</p>

        <form onSubmit={handleSubmit} className="w-full">
          <input 
            type="password" 
            inputMode="numeric"
            maxLength={4}
            autoFocus
            value={input} 
            onChange={(e) => { setError(''); setInput(e.target.value); }} 
            placeholder="ENTER PIN" 
            className="w-full bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-center font-black tracking-widest text-2xl text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 placeholder:text-zinc-600 placeholder:text-sm placeholder:font-bold" 
          />
          {error && <p className="text-rose-500 text-xs font-bold uppercase tracking-widest mt-2 text-center">{error}</p>}

          <button 
            type="submit" 
            disabled={input.length < 4}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_15px_rgba(52,211,153,0.3)] disabled:shadow-none mt-6 transition-all flex items-center justify-center gap-2 group"
          >
            Unlock <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}