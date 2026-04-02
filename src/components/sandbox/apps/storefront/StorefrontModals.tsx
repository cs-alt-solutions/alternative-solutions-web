import React from 'react';
import { X, Info, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PoliciesModal = ({ storePolicies, onClose }: any) => {
  return (
    <div className="min-h-dvh bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 text-zinc-100 z-100 fixed inset-0">
       <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[95vh] overflow-y-auto scrollbar-hide">
          <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-rose-400 z-10 bg-zinc-950 p-2 rounded-full border border-zinc-800 transition-colors"><X size={20} /></button>
          
          <div className="mb-6 mt-2 space-y-4">
            <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white flex items-start gap-3">
              <Info size={28} className="text-cyan-400 shrink-0 mt-0.5" /> 
              <span>Welcome to the Doobie Division Member Market</span>
            </h2>
            
            <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full blur-xl pointer-events-none" />
              <h3 className="text-amber-400 font-black uppercase tracking-widest text-[11px] mb-1.5 flex items-center gap-2 relative z-10">
                <AlertTriangle size={14} /> Pardon Our Dust!
              </h3>
              <p className="text-xs text-amber-500/80 font-bold leading-relaxed relative z-10">
                This platform is currently an active work-in-progress. If things feel a little clunky, please let us know so we can fix it ASAP!
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-rose-500/10 border border-rose-500/30 p-5 rounded-2xl shadow-inner relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-bl-full blur-2xl pointer-events-none" />
              <h3 className="text-rose-400 font-black uppercase tracking-widest text-[11px] mb-3 flex items-center gap-2 relative z-10">
                <ShieldAlert size={16} /> Community Protection & Standards
              </h3>
              
              <div className="space-y-4 relative z-10">
                <p className="text-xs text-rose-300 font-medium leading-relaxed">
                  Access codes are strictly for verified members. <strong>Sharing codes with unverified individuals will result in permanent removal.</strong>
                </p>
                
                <div className="pt-3 border-t border-rose-500/20">
                  <ul className="space-y-2.5">
                    {storePolicies.map((policy: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-xs text-zinc-300 items-start">
                        <div className="mt-1 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" /></div>
                        <p className="leading-relaxed font-medium">{policy}</p>
                      </li>
                    ))}
                    {/* Fixed UI Inconsistency: Changed to match the red/rose theme */}
                    <li className="flex gap-3 text-xs text-zinc-300 items-start">
                        <div className="mt-1 shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]" /></div>
                        <p className="leading-relaxed font-medium">Minimum order requirements apply based on your location. The system will notify you during checkout if your requirements haven't been met.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 pt-6 mt-6 border-t border-zinc-800">
            <button onClick={onClose} className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> I Understand & Agree
            </button>
          </div>
       </div>
    </div>
  );
};