import React from 'react';
import { Activity } from 'lucide-react';

export default function EditorEdibleData({ updatedItem, setUpdatedItem }: any) {
  return (
    <div className="bg-zinc-950/50 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)] rounded-2xl p-5 md:p-6">
       <div className="flex items-center gap-2 mb-5 border-b border-zinc-800/80 pb-3">
          <Activity size={16} className="text-emerald-400" />
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Smart Edibles Data</span>
       </div>
       
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Total Container Amount</label>
             <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                <input type="text" value={updatedItem.descFact || ''} onChange={(e) => setUpdatedItem({...updatedItem, descFact: e.target.value})} placeholder="e.g. 100mg THC" className="flex-1 bg-transparent p-3 text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-600 min-w-0" />
                <div className="bg-zinc-950 border-l border-zinc-800 flex items-center px-3 shrink-0">
                   <span className="text-[9px] text-zinc-600 font-black uppercase mr-2 tracking-widest">PER</span>
                   <select value={updatedItem.ediblePackageType || 'Package'} onChange={(e) => setUpdatedItem({...updatedItem, ediblePackageType: e.target.value})} className="bg-transparent text-emerald-400 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-none">
                      {['Package', 'Bottle', 'Box', 'Tin', 'Jar', 'Pouch', 'Can'].map(t => <option key={t} value={t} className="bg-zinc-900 text-zinc-300">{t}</option>)}
                   </select>
                </div>
             </div>
          </div>
          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Individual Dose Amount</label>
             <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                <input type="text" value={updatedItem.descUses || ''} onChange={(e) => setUpdatedItem({...updatedItem, descUses: e.target.value})} placeholder="e.g. 10mg THC" className="flex-1 bg-transparent p-3 text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-600 min-w-0" />
                <div className="bg-zinc-950 border-l border-zinc-800 flex items-center px-3 shrink-0">
                   <span className="text-[9px] text-zinc-600 font-black uppercase mr-2 tracking-widest">PER</span>
                   <select value={updatedItem.edibleServingType || 'Serving'} onChange={(e) => setUpdatedItem({...updatedItem, edibleServingType: e.target.value})} className="bg-transparent text-emerald-400 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-none">
                      {['Serving', 'Piece', 'Gummy', 'Bite', 'Ounce', 'Square', 'Drop', 'Capful', 'G', 'mL'].map(t => <option key={t} value={t} className="bg-zinc-900 text-zinc-300">{t}</option>)}
                   </select>
                </div>
             </div>
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Flavor Profile</label>
             <input type="text" value={updatedItem.descTaste || ''} onChange={(e) => setUpdatedItem({...updatedItem, descTaste: e.target.value})} placeholder="e.g. Sour Watermelon" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
          </div>
          <div>
             <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Expected Effect</label>
             <input type="text" value={updatedItem.descFeels || ''} onChange={(e) => setUpdatedItem({...updatedItem, descFeels: e.target.value})} placeholder="e.g. Heavy couch-lock" className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
          </div>
       </div>
    </div>
  );
}