/* src/app/dashboard/support-desk/page.tsx */
import React from 'react';
import { LifeBuoy } from 'lucide-react';
import GlobalTriage from '@/components/dashboard/support-desk/GlobalTriage';

export default async function SupportDeskPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest flex items-center gap-3">
            <LifeBuoy className="text-cyan-400" />
            Support Desk
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-widest">
            Global Triage & Client Requests
          </p>
        </div>
      </div>

      {/* 🚀 The Engine */}
      <GlobalTriage />

    </div>
  );
}