'use client';

import React, { useState } from 'react';
import { Users, Briefcase, LineChart } from 'lucide-react';
import ExternalFuelTab from '@/components/dashboard/ledger/ExternalFuelTab';
import RosterTab from '@/components/dashboard/ledger/RosterTab';
import ProjectionEngineTab from '@/components/dashboard/ledger/ProjectionEngineTab'; // NEW

export default function LedgerPage() {
  const [activeTab, setActiveTab] = useState<'external' | 'roster' | 'projection'>('projection'); // Defaulting to the new tab so you can see it

  const tabs = [
    { id: 'external', label: 'External Fuel', icon: Briefcase },
    { id: 'roster', label: 'Platform Backers', icon: Users },
    { id: 'projection', label: 'Projection Engine', icon: LineChart } // NEW TAB
  ] as const;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Dynamic Header */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">The Ledger</h1>
        <p className="text-slate-400 font-mono text-sm">Your financial command center. Track side income and platform runway.</p>
      </div>

      {/* Dynamic Tab Navigation (Money Green / Purple Theme) */}
      <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'external' | 'roster' | 'projection')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono tracking-widest uppercase transition-all ${
              activeTab === tab.id 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' 
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
        {activeTab === 'external' && <ExternalFuelTab />}
        {activeTab === 'roster' && <RosterTab />}
        {activeTab === 'projection' && <ProjectionEngineTab />}
      </div>
      
    </div>
  );
}