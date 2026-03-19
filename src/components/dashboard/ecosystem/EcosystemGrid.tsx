/* src/components/dashboard/ecosystem/EcosystemGrid.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Search, Plus, Settings2, Box, Cpu, Workflow, Globe } from 'lucide-react';
import EcosystemModuleEditor from './EcosystemModuleEditor';

export default function EcosystemGrid() {
  const copy = WEBSITE_COPY.DASHBOARD.ECOSYSTEM_MANAGER;
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<any | null>(null);

  // Added isPublic flag to our mock data for the visual update
  const mockModules = [
    { id: 1, name: "Shift Studio", tagline: "The Commerce Engine", status: "BETA", betas: 45, icon: "Box", isPublic: true },
    { id: 2, name: "GlitchBot V2", tagline: "System Telemetry & Support", status: "ACTIVE", betas: 0, icon: "Cpu", isPublic: true },
    { id: 3, name: "API Gateway", tagline: "Universal Data Bridge", status: "CLASSIFIED", betas: 12, icon: "Workflow", isPublic: false }
  ];

  const handleOpenPanel = (mod: any = null) => {
    setEditingModule(mod);
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setEditingModule(null), 300);
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden animate-in fade-in duration-500">
      
      {/* TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-black/40 border border-white/5 p-4 rounded-xl mb-6 shrink-0">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/50" size={16} />
          <input 
            type="text" 
            placeholder={copy.SEARCH_PLACEHOLDER}
            className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
          />
        </div>
        
        <button 
          onClick={() => handleOpenPanel()}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
        >
          <Plus size={14} /> {copy.BTN_NEW_MODULE}
        </button>
      </div>

      {/* MASTER GRID */}
      <div className="bg-bg-surface-200/30 border border-white/5 rounded-2xl flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/5 bg-white/2 text-[10px] font-mono text-white/40 uppercase tracking-widest sticky top-0 backdrop-blur-md z-10">
          <div className="col-span-4">{copy.COLUMNS[0]}</div>
          <div className="col-span-3">{copy.COLUMNS[2]}</div>
          <div className="col-span-3">{copy.COLUMNS[3]}</div>
          <div className="col-span-2 text-right">{copy.COLUMNS[4]}</div>
        </div>

        <div className="divide-y divide-white/5">
          {mockModules.map((mod) => (
            <div key={mod.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-white/5 transition-colors group">
              <div className="col-span-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0 shadow-[inset_0_0_10px_rgba(34,211,238,0.05)]">
                  {mod.icon === 'Box' && <Box size={20} />}
                  {mod.icon === 'Cpu' && <Cpu size={20} />}
                  {mod.icon === 'Workflow' && <Workflow size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-bold text-white font-mono tracking-wide">{mod.name}</div>
                    {/* NEW: Public vs Internal Indicators */}
                    {mod.isPublic ? (
                      <span className="flex items-center gap-1 text-[8px] uppercase tracking-widest text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        <Globe size={8} /> {copy.BADGES.PUBLIC}
                      </span>
                    ) : (
                      <span className="text-[8px] uppercase tracking-widest text-white/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                        {copy.BADGES.INTERNAL}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] font-mono text-white/40 uppercase tracking-widest mt-1">{mod.tagline}</div>
                </div>
              </div>

              <div className="col-span-3 flex items-center">
                <span className={`px-2 py-1 rounded text-[9px] font-mono tracking-widest uppercase border ${
                  mod.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 
                  mod.status === 'BETA' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 
                  'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30'
                }`}>
                  {mod.status}
                </span>
              </div>

              <div className="col-span-3 flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-cyan-400 font-bold">{mod.betas}</span> Nodes Connected
              </div>

              <div className="col-span-2 flex justify-end">
                <button 
                  onClick={() => handleOpenPanel(mod)}
                  className="p-2 text-white/20 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all"
                >
                  <Settings2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* EXTRACTED SLIDE-OUT PANEL COMPONENT */}
      <EcosystemModuleEditor 
        isOpen={isPanelOpen} 
        onClose={closePanel} 
        module={editingModule} 
      />
    </div>
  );
}