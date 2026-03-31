import React from 'react';
import { X, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const BetaAlertModal = ({ onClose, onAcknowledge, isCheckingOut }: any) => (
  <div className="min-h-dvh bg-zinc-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-zinc-100 z-100 fixed inset-0">
     <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400"><X size={20} /></button>
        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
          <Info size={24} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 mb-3">Secure Payload</h2>
        <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
          We are currently working on a seamless native checkout experience. 
          <br/><br/>
          For now, this portal calculates your totals and builds a secure order payload. Just copy the payload at the end and paste it into your secure channel to complete the order!
        </p>
        <button 
          onClick={onAcknowledge} 
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest transition-colors shadow-lg active:scale-95"
        >
          Got It
        </button>
     </div>
  </div>
);

export const PoliciesModal = ({ storePolicies, deliveryZones, onClose }: any) => (
  <div className="min-h-dvh bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-6 text-zinc-100 z-100 fixed inset-0">
     <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        <button onClick={onClose} className="absolute top-5 right-5 text-zinc-500 hover:text-rose-400 z-10 bg-zinc-950 p-2 rounded-full border border-zinc-800"><X size={20} /></button>
        
        {/* HEADER SECTION (Static) */}
        <div className="shrink-0 mb-6 mt-2">
          <h2 className="text-2xl font-black uppercase tracking-widest text-white mb-5 flex items-center gap-3">
            <Info size={28} className="text-cyan-400" /> Welcome
          </h2>
          
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl shadow-inner relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-bl-full blur-xl pointer-events-none" />
            <h3 className="text-amber-400 font-black uppercase tracking-widest text-[11px] mb-2 flex items-center gap-2">
              <AlertTriangle size={14} /> Pardon Our Dust!
            </h3>
            <p className="text-xs text-amber-500/80 font-bold leading-relaxed">
              This platform is currently an active work-in-progress. If things feel a little clunky or you run into any issues, please let us know so we can fix them ASAP. We hear you and are working hard to perfect the experience!
            </p>
          </div>
        </div>

        {/* SCROLLABLE POLICIES SECTION */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4 space-y-6">
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800 pb-2">Store Rules</h3>
            <ul className="space-y-3">
              {storePolicies.map((policy: string, idx: number) => (
                <li key={idx} className="flex gap-3 text-xs md:text-sm text-zinc-300 bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-sm">
                  <div className="mt-1 shrink-0"><div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]" /></div>
                  <p className="leading-relaxed font-medium">{policy}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-3 border-b border-zinc-800 pb-2">Delivery Minimums</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-400">
              {deliveryZones.map((z: any) => (
                <div key={z.id || z.name} className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800 shadow-sm">
                  <span className="truncate pr-2 font-sans font-bold text-zinc-300">{z.name}</span>
                  <span className="text-cyan-400 font-black text-sm">${z.minimum}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTION (Static) */}
        <div className="shrink-0 pt-4 mt-2 border-t border-zinc-800">
          <button onClick={onClose} className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 py-4 rounded-xl font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(34,211,238,0.3)] active:scale-95 flex items-center justify-center gap-2">
            <CheckCircle2 size={18} /> I Understand & Agree
          </button>
        </div>

     </div>
  </div>
);