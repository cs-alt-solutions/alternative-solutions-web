'use client';

import React from 'react';
import { Globe, Server, Code } from 'lucide-react';

export default function InfrastructurePanel({ formData, setFormData }: { formData: any, setFormData: any }) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur-md">
      
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center gap-3">
        <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700 shadow-inner">
           <Server size={14} className="text-zinc-400" />
        </div>
        <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Infrastructure</h3>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Module 1: Domain Routing */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-center">
          <label className="flex items-center gap-2 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
             <Globe size={12} className="text-zinc-500" /> Edge Network Domain
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-zinc-600 text-xs font-mono pointer-events-none">
                https://
              </span>
              <input
                type="text"
                value={formData.custom_domain || ''}
                onChange={(e) => setFormData({ ...formData, custom_domain: e.target.value })}
                placeholder="client-domain.com"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-md pl-16 pr-3 py-2 text-[11px] text-cyan-400 font-mono focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <button className="bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all">
              Link
            </button>
          </div>
        </div>

        {/* Module 2: System Classification (Template Engine Toggle) */}
        <div className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 flex flex-col justify-center">
           <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-md border transition-colors ${formData.is_template ? 'bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-500'}`}>
                    <Code size={14} />
                 </div>
                 <div>
                    <span className="block text-[11px] font-black text-white uppercase tracking-wider mb-0.5">Template Engine</span>
                    <span className="block text-[9px] font-mono text-zinc-500 uppercase">Public Directory Exposure</span>
                 </div>
              </div>
              
              {/* Sleek Toggle */}
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

      </div>
    </div>
  );
}