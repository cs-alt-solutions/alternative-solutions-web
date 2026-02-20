import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function WaitlistManagementPage() {
  const copy = WEBSITE_COPY.DASHBOARD?.WAITLIST;

  if (!copy) {
    return <div className="p-8 text-red-500 font-mono">ERROR: WAITLIST_COPY_UNDEFINED</div>;
  }

  return (
    <div className="p-8 animate-in fade-in duration-500">
      <header className="mb-8 border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black tracking-tighter uppercase text-white">
          {copy.TITLE}
        </h1>
        <p className="text-xs font-mono text-cyan-400 mt-2">
          {copy.LEAD_COUNT} // SYSTEM_READY
        </p>
      </header>
      
      <div className="bg-[#111] border border-white/5 p-12 rounded-sm text-center">
        <p className="text-sm opacity-50 font-mono italic">
          Waitlist Client Component loading sequence initiated...
        </p>
      </div>
    </div>
  );
}