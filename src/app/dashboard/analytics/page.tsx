/* src/app/dashboard/analytics/page.tsx */
import React from 'react';
import { Activity } from 'lucide-react';
import LiveTrafficModule from '@/components/dashboard/analytics/LiveTrafficModule';

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500 h-[calc(100vh-4rem)] flex flex-col">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10 shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <Activity className="text-cyan-400" />
            Live Traffic
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">
            Vercel Edge Analytics & Telemetry
          </p>
        </div>
      </div>

      {/* The UI Component */}
      <LiveTrafficModule />

    </div>
  );
}