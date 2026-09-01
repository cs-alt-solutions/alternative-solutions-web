/* src/components/dashboard/analytics/LiveTrafficModule.tsx */
'use client';

import React from 'react';
import { Activity, ExternalLink, BarChart3, Users, MousePointerClick } from 'lucide-react';

export default function LiveTrafficModule() {
  // 🚀 Hardwired directly to your specific Vercel project analytics
  const VERCEL_URL = "https://vercel.com/courtney-sulenskis-projects/alternative-solutions-web/analytics?period=30d"; 

  return (
    <div className="w-full max-w-4xl">
      <div className="bg-zinc-950 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl flex flex-col items-center text-center">
        
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
        
        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner relative z-10">
          <Activity size={28} className="text-cyan-400" />
        </div>
        
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 relative z-10">
          Vercel Edge Telemetry
        </h2>
        
        <p className="text-sm text-zinc-400 max-w-lg leading-relaxed mb-8 relative z-10">
          Your live traffic, visitor analytics, and geographic routing data are actively being tracked at the edge by Vercel. Connect to the external telemetry dashboard to view your charts.
        </p>

        {/* The Data Preview Metrics (Static UI to look good) */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-lg mb-10 relative z-10">
          <div className="bg-black/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center">
            <Users size={16} className="text-zinc-500 mb-2" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Visitors</span>
          </div>
          <div className="bg-black/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center">
            <BarChart3 size={16} className="text-zinc-500 mb-2" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Page Views</span>
          </div>
          <div className="bg-black/50 border border-zinc-800/80 rounded-xl p-4 flex flex-col items-center">
            <MousePointerClick size={16} className="text-zinc-500 mb-2" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Referrers</span>
          </div>
        </div>

        {/* The Gateway Button */}
        <a 
          href={VERCEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 w-full sm:w-auto bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
        >
          Open Live Analytics <ExternalLink size={16} />
        </a>

      </div>
    </div>
  );
}