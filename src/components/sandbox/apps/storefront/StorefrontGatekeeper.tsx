import React from 'react';
import { Lock, ArrowRight } from 'lucide-react';

export default function StorefrontGatekeeper({ clientConfig, codeInput, setCodeInput, error, setError, handleAuth }: any) {
  return (
    <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 relative">
      <div className="z-10 w-full max-w-sm flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-zinc-900 p-5 rounded-3xl mb-6 border border-zinc-800">
          <Lock size={32} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
        <h1 className="text-3xl font-black tracking-widest mb-2 text-center text-zinc-100 uppercase">{clientConfig.appTitle}</h1>
        <p className="text-zinc-500 text-[10px] font-black tracking-[0.2em] mb-10 uppercase text-center">Authorized Entry Only</p>
        
        <form onSubmit={handleAuth} className="w-full">
          <div className="relative mb-4">
            <input 
              type="text" 
              autoFocus 
              value={codeInput} 
              onChange={(e) => { setError(""); setCodeInput(e.target.value.toUpperCase()); }} 
              placeholder="ENTER ACCESS CODE" 
              className={`w-full bg-zinc-900 border-2 rounded-2xl p-5 text-center text-xl tracking-[0.2em] font-black outline-none transition-all shadow-inner placeholder:text-zinc-700 placeholder:text-sm placeholder:font-bold ${error ? 'border-rose-500 text-rose-500 bg-rose-500/5 animate-shake' : 'border-zinc-800 text-emerald-400 focus:border-emerald-500/50'}`} 
              maxLength={20} 
            />
            {error && <p className="absolute -bottom-6 left-0 right-0 text-center text-rose-500 text-[10px] font-bold uppercase tracking-widest leading-tight mt-2">{error}</p>}
          </div>
          <button type="submit" disabled={!codeInput.trim()} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 group mt-6">
            Enter Market <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </div>
    </div>
  );
}