/* src/components/portal/core/PortalOverview.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { MessageSquare, FileUp, Box, Activity, ArrowRight } from 'lucide-react';

interface PortalOverviewProps {
  clientId: string;
}

export default function PortalOverview({ clientId }: PortalOverviewProps) {
  const copy = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="bg-black/40 border border-white/5 rounded-3xl p-8 lg:p-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Activity size={16} className="text-cyan-500" />
            {/* CHANGED: Removed the UUID and replaced with a clean brand string */}
            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
              {WEBSITE_COPY.NAV.BRAND} // SECURE WORKSPACE
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            {copy.WELCOME_TITLE}
          </h1>
          <p className="text-sm md:text-base text-slate-400 font-light max-w-2xl leading-relaxed">
            {copy.WELCOME_DESC}
          </p>
        </div>
      </div>

      {/* BENTO GRID COMMAND CENTER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* Direct Messages */}
        <div className="md:col-span-8 bg-slate-900/30 border border-slate-800 rounded-3xl p-8 flex flex-col min-h-75 group hover:border-cyan-500/30 transition-all shadow-lg">
          <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
            <MessageSquare size={18} className="text-cyan-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-widest">
              {copy.MODULES.MESSAGES_TITLE}
            </h3>
          </div>
          <div className="flex-1 flex items-center justify-center border border-dashed border-slate-800 rounded-2xl bg-black/20">
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              {copy.MODULES.MESSAGES_EMPTY}
            </p>
          </div>
        </div>

        {/* Right Column Stack */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <Link 
            href={`/portal/${clientId}/transfer`} 
            className="flex-1 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col group hover:border-cyan-500/50 hover:bg-slate-900/50 transition-all shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform">
                <FileUp size={18} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                {copy.MODULES.TRANSFERS_TITLE}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
              {copy.MODULES.TRANSFERS_DESC}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-cyan-500 font-bold uppercase tracking-widest">
              Initiate Transfer <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link 
            href={`/portal/${clientId}/prototypes`} 
            className="flex-1 bg-slate-900/30 border border-slate-800 rounded-3xl p-6 flex flex-col group hover:border-fuchsia-500/50 hover:bg-slate-900/50 transition-all shadow-lg"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 group-hover:scale-110 transition-transform">
                <Box size={18} />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                {copy.MODULES.PROTOTYPES_TITLE}
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6 flex-1">
              {copy.MODULES.PROTOTYPES_DESC}
            </p>
            <div className="flex items-center gap-2 text-[10px] font-mono text-fuchsia-400 font-bold uppercase tracking-widest">
              View Deployments <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}