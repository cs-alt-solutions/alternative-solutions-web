/* src/app/dashboard/ecosystem/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { PackageOpen } from 'lucide-react';
import EcosystemGrid from '@/components/dashboard/ecosystem/EcosystemGrid';

export default function EcosystemPage() {
  const copy = WEBSITE_COPY.DASHBOARD.ECOSYSTEM_MANAGER;

  return (
    <div className="p-8 relative max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* THE COMMAND HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <PackageOpen className="text-cyan-400 animate-pulse-subtle" size={16} />
            <span className="text-xs font-mono tracking-[0.2em] text-cyan-400 uppercase">
              {copy.SUBTITLE}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase drop-shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {copy.TITLE}
          </h1>
        </div>
        
        <div className="px-4 py-2 border border-cyan-500/30 bg-cyan-500/10 rounded-lg flex items-center gap-3 shadow-[0_0_20px_rgba(34,211,238,0.1)]">
           <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping" />
           <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
             {copy.STATUS}
           </span>
        </div>
      </header>

      {/* THE MASTER GRID COMPONENT */}
      <EcosystemGrid />
    </div>
  );
}