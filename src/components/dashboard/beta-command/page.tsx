'use client';

import React from 'react';
import BetaCommandTabs from '@/components/dashboard/beta-command/BetaCommandTabs';
import { TestTube } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function BetaCommandPage() {
  // Pulling directly from our Single Source of Truth
  const { TITLE, SUBTITLE } = WEBSITE_COPY.DASHBOARD.BETA_COMMAND;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      {/* THE COMMAND HEADER */}
      <div className="mb-8 border-b border-white/5 pb-6">
        <div className="flex items-center gap-3 mb-2">
           <div className="p-2 bg-brand-primary/10 rounded-lg text-brand-primary">
              <TestTube size={20} />
           </div>
           <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tight">
             {TITLE}
           </h1>
        </div>
        <p className="text-sm font-mono text-cyan-400 mt-2 pl-12">
          {SUBTITLE}
        </p>
      </div>

      {/* THE CLIENT-SIDE TAB CONTROLLER */}
      <BetaCommandTabs />
    </div>
  );
}