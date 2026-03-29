import React from 'react';
import { X, Info } from 'lucide-react';

export const BetaAlertModal = ({ onClose, onAcknowledge, isCheckingOut }: any) => (
  <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 z-50 fixed inset-0">
     <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-rose-400"><X size={20} /></button>
        <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <Info size={24} className="text-emerald-400" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-widest text-emerald-400 mb-3">Pardon Our Dust!</h2>
        <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-medium">
          Hey guys! We are working hard to build a seamless experience where you can checkout and pay directly on the site. 
          <br/><br/>
          For now, this checkout simply calculates your totals and generates your secure order payload. Just copy the payload and paste it into your secure channel to complete your order with the team!
        </p>
        <button 
          onClick={onAcknowledge} 
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors"
        >
          Got It
        </button>
     </div>
  </div>
);

export const PoliciesModal = ({ storePolicies, deliveryZones, onClose }: any) => (
  <div className="min-h-dvh bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100 z-50 fixed inset-0">
     <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl relative animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-6 right-6 text-zinc-500 hover:text-rose-400"><X size={24} /></button>
        <h2 className="text-2xl font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center gap-3"><Info size={24} /> Store Policies</h2>
        <ul className="space-y-4 mb-8">
          {storePolicies.map((policy: string, idx: number) => (
            <li key={idx} className="flex gap-3 text-sm text-zinc-300 bg-zinc-950/50 p-3 rounded-xl border border-zinc-800/50">
              <div className="mt-0.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /></div>
              <p>{policy}</p>
            </li>
          ))}
        </ul>
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-4 border-b border-zinc-800 pb-2">Delivery Minimums</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-zinc-400 max-h-40 overflow-y-auto pr-2">
          {deliveryZones.map((z: any) => (
            <div key={z.id} className="flex justify-between bg-zinc-950 p-2 rounded-lg border border-zinc-800">
              <span className="truncate pr-2">{z.name}</span>
              <span className="text-emerald-400 font-bold">${z.minimum}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 py-4 rounded-xl font-bold uppercase tracking-widest transition-colors">Acknowledge</button>
     </div>
  </div>
);