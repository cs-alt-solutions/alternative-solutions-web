import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, ShieldCheck, Sparkles, MapPin } from 'lucide-react';

export const PoliciesModal = ({ storePolicies, onClose }: any) => {
  return (
    <div className="min-h-dvh bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 text-zinc-100 z-100 fixed inset-0">
       <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[95vh] overflow-y-auto scrollbar-hide">
          
          {/* Ambient Top Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[60px] pointer-events-none rounded-full" />
          
          {/* STYLIZED HEADER */}
          <div className="mb-8 mt-2 text-center relative z-10">
            <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <ShieldCheck size={12} /> Verified Access Granted
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-white mb-2 leading-none">
              Doobie <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-cyan-400">Division</span>
            </h2>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2 mt-3">
              <Sparkles size={12} className="text-emerald-500/50" /> Exclusive Member Market <Sparkles size={12} className="text-emerald-500/50" />
            </p>
          </div>

          <div className="space-y-4 relative z-10">
            
            {/* BETA STATUS CARD */}
            <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl shadow-inner relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/20 transition-colors" />
              <h3 className="text-amber-400 font-black uppercase tracking-widest text-[11px] mb-2 flex items-center gap-2 relative z-10">
                <AlertTriangle size={14} /> Market Beta Status
              </h3>
              <p className="text-xs text-amber-500/80 font-bold leading-relaxed relative z-10">
                This platform is currently an active work-in-progress. If things feel a little clunky or you hit a snag, let the team know so we can patch it up!
              </p>
            </div>

            {/* THE VAULT RULES CARD */}
            <div className="bg-zinc-950/50 border border-rose-500/20 p-5 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
              <h3 className="text-rose-400 font-black uppercase tracking-widest text-[11px] mb-4 flex items-center gap-2 relative z-10">
                <ShieldAlert size={14} /> The Vault Rules
              </h3>
              
              <div className="space-y-4 relative z-10">
                <p className="text-[11px] text-rose-300 font-bold leading-relaxed bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                  Access codes are strictly for verified members. <span className="text-white">Sharing codes with unverified individuals will result in permanent removal.</span>
                </p>
                
                <ul className="space-y-3 pt-2">
                  {storePolicies.map((policy: string, idx: number) => (
                    <li key={idx} className="flex gap-3 text-xs text-zinc-300 items-start">
                      <div className="mt-1 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-rose-500/50 shadow-[0_0_8px_rgba(244,63,94,0.5)]" /></div>
                      <p className="leading-relaxed font-medium">{policy}</p>
                    </li>
                  ))}
                  <li className="flex gap-3 text-xs text-zinc-300 items-start">
                      <div className="mt-1.5 shrink-0"><MapPin size={12} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" /></div>
                      <p className="leading-relaxed font-medium">Minimum order requirements apply based on your location. The system will notify you during checkout.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ACTION FOOTER */}
          <div className="shrink-0 pt-6 mt-6 border-t border-zinc-800">
            <button onClick={onClose} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Enter The Market
            </button>
          </div>
       </div>
    </div>
  );
};