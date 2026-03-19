/* src/app/dashboard/foundation/page.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Users, Target, Code } from 'lucide-react';
import BuildsTab from '@/components/dashboard/foundation/BuildsTab'; 
import RosterTab from '@/components/dashboard/foundation/RosterTab';
import WidgetsTab from '@/components/dashboard/foundation/WidgetsTab';

export default function DraftingTablePage() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;
  
  const [activeTab, setActiveTab] = useState<'roster' | 'builds' | 'widgets'>('builds');

  const tabs = [
    { id: 'roster', label: copy.TABS.ROSTER, icon: Users },
    { id: 'builds', label: copy.BUILDS.TAB, icon: Target }, 
    { id: 'widgets', label: copy.TABS.WIDGETS, icon: Code }
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">{copy.TITLE}</h1>
        <p className="text-slate-400 font-mono text-sm">{copy.SUBTITLE}</p>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'roster' | 'builds' | 'widgets')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-widest uppercase transition-all ${
              activeTab === tab.id 
                ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30' 
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        {activeTab === 'roster' && <RosterTab />}
        {activeTab === 'builds' && <BuildsTab />}
        {activeTab === 'widgets' && <WidgetsTab />}
      </div>
      
    </div>
  );
}