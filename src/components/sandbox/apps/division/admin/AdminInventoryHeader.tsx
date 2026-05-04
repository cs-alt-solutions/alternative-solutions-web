import React from 'react';
import { Boxes, PackageSearch, Download, MapPinned, Plus } from 'lucide-react';

export default function AdminInventoryHeader({ onOpenAudit, onBackup, onManageCats, onAddProduct }: any) {
  return (
    <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8 border-b border-zinc-800/50 pb-8">
      <div className="flex items-center gap-4">
        <div className="bg-amber-500/10 p-4 rounded-3xl border border-amber-500/30 text-amber-400 shadow-lg">
          <Boxes size={32} />
        </div>
        <div>
          {/* UPDATED: Master Vault -> Master Warehouse */}
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Master Warehouse</h2>
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">
            Live Database <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {/* UPDATED: Audit & Reports -> Logistics Terminal */}
        <button onClick={onOpenAudit} className="bg-zinc-900 hover:bg-zinc-800 text-fuchsia-400 border border-fuchsia-900/50 font-black uppercase tracking-widest py-3 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-fuchsia-400/50 active:scale-95">
          <PackageSearch size={16} /> Logistics Terminal
        </button>
        
        <button onClick={onBackup} className="bg-zinc-900 hover:bg-zinc-800 text-cyan-400 border border-cyan-900/50 font-black uppercase tracking-widest py-3 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-cyan-400/50 active:scale-95">
          <Download size={16} /> Backup System
        </button>
        <button onClick={onManageCats} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800 font-black uppercase tracking-widest py-3 px-5 rounded-2xl text-[10px] transition-all flex items-center gap-2 shadow-lg hover:border-amber-500/30 hover:text-amber-400 active:scale-95">
          <MapPinned size={16} /> Map Settings
        </button>
        <button onClick={onAddProduct} className="bg-zinc-800 hover:bg-emerald-500 hover:text-zinc-950 text-emerald-400 border border-emerald-900/30 font-black uppercase tracking-widest py-3 px-6 rounded-2xl text-[11px] transition-all shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95">
          <Plus size={16} /> Add Product
        </button>
      </div>
    </div>
  );
}