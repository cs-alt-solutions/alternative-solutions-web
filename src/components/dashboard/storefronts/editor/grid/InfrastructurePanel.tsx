/* src/components/dashboard/storefronts/editor/grid/InfrastructurePanel.tsx */
'use client';

import React from 'react';
import { Globe, Server, Code, Eye, Layers } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';

export default function InfrastructurePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  const copy = EDITOR_WORKSPACE_COPY.GRID_TAB.INFRASTRUCTURE;
  const hubCopy = EDITOR_WORKSPACE_COPY.COMMAND_HUB;
  const engineMode = formData.engine_mode || 'core';

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md h-full flex flex-col">
      
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner"> 
            <Server size={14} className="text-zinc-400" />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{copy.TITLE}</h3>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-start gap-4 overflow-y-auto">
        
        {/* Module 1: Domain Routing */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-center shrink-0">
          <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3"> 
            <Globe size={12} className="text-zinc-500" /> {copy.DOMAIN_LABEL}
          </label>
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600 text-xs font-mono pointer-events-none">
              {copy.DOMAIN_PREFIX}
            </span>
            <input
              type="text"
              value={formData.custom_domain || ''}
              onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
              placeholder={copy.DOMAIN_PLACEHOLDER}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-16 pr-3 py-2 text-[11px] text-cyan-400 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Module 2: Architecture Tier */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-center shrink-0">
          <div className="flex items-center justify-between w-full gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-md border transition-colors ${engineMode === 'hub' ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'}`}>
                <Layers size={14} />
              </div>
              <div>
                <span className="block text-[11px] font-black text-white uppercase tracking-wider mb-0.5">{copy.ARCH_TITLE}</span>
                <span className="block text-[9px] font-mono text-zinc-500 uppercase">{copy.ARCH_SUBTITLE}</span>
              </div>
            </div>

            <select
              value={engineMode}
              onChange={(e) => setFormData({ ...formData, engine_mode: e.target.value })}
              className={`bg-zinc-900 border border-zinc-700 rounded-md px-3 py-1.5 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer ${
                engineMode === 'hub' ? 'text-indigo-400 border-indigo-500/40' : 'text-cyan-400'
              }`}
            >
              <option value="core" className="bg-zinc-900 text-white">{hubCopy.TIER_CORE}</option>
              <option value="hub" className="bg-zinc-900 text-indigo-400">{hubCopy.TIER_HUB}</option>
            </select>
          </div>
        </div>

        {/* Module 3: System Classification (Template Engine Toggle) */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-center shrink-0">
           <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-md border transition-colors ${formData.is_template ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-500'}`}>
                    <Code size={14} />
                 </div>
                 <div>
                    <span className="block text-[11px] font-black text-white uppercase tracking-wider mb-0.5">{copy.TEMPLATE_TITLE}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">{copy.TEMPLATE_SUBTITLE}</span>
                 </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_template || false}
                  onChange={(e) => setFormData({ ...formData, is_template: e.target.checked })}
                />
                <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-zinc-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-fuchsia-500/20 peer-checked:border-fuchsia-500/50 peer-checked:after:bg-fuchsia-400 border border-zinc-700 group-hover:border-zinc-500"></div>
              </label>
           </div>
        </div>

        {/* Module 4: Directory Visibility (The Kill Switch) */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-center shrink-0">
           <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-md border transition-colors ${formData.is_published ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-500'}`}>
                    <Eye size={14} />
                 </div>
                 <div>
                    <span className="block text-[11px] font-black text-white uppercase tracking-wider mb-0.5">{copy.DIRECTORY_TITLE}</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">{copy.DIRECTORY_SUBTITLE}</span>
                 </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={formData.is_published || false}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                />
                <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-zinc-400 after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500/20 peer-checked:border-emerald-500/50 peer-checked:after:bg-emerald-400 border border-zinc-700 group-hover:border-zinc-500"></div>
              </label>
           </div>
        </div>

      </div>
    </div>
  );
}