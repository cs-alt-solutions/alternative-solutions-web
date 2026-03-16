/* src/components/shift-studio/xlg/CommandCenterTabs.tsx */
'use client';

import React, { useState } from 'react';
import { Calculator, LayoutGrid, MonitorPlay } from 'lucide-react';
import RoiCalculator from './RoiCalculator';
import CompetitorMatrix from './CompetitorMatrix';
import SystemCapture from './SystemCapture';

export default function CommandCenterTabs() {
  const [activeTab, setActiveTab] = useState<'audit' | 'matrix' | 'capture'>('audit');

  // MODIFIED: Changed label to THE SAVINGS ENGINE
  const tabs = [
    { id: 'audit', label: 'THE SAVINGS ENGINE', icon: Calculator },
    { id: 'matrix', label: 'THE DIFFERENCE', icon: LayoutGrid },
    { id: 'capture', label: 'LIVE SYSTEM CAPTURE', icon: MonitorPlay }
  ] as const;

  const getTabStyles = (tabId: string, isActive: boolean) => {
    const base = "flex items-center gap-2 md:gap-3 px-6 py-4 rounded-2xl text-xs md:text-sm font-mono uppercase tracking-widest font-bold transition-all duration-500 border";
    
    if (tabId === 'audit') {
      return isActive 
        ? `${base} bg-brand-primary/20 border-brand-primary/80 text-brand-primary drop-shadow-[0_0_10px_rgba(6,182,212,0.8)] shadow-[inset_0_0_20px_rgba(6,182,212,0.3),0_0_30px_rgba(6,182,212,0.4)] backdrop-blur-md scale-[1.02]`
        : `${base} bg-brand-primary/5 border-brand-primary/30 text-brand-primary/60 hover:bg-brand-primary/10 hover:text-brand-primary/90 hover:border-brand-primary/50`;
    }
    if (tabId === 'matrix') {
      return isActive 
        ? `${base} bg-fuchsia-500/20 border-fuchsia-400/80 text-fuchsia-400 drop-shadow-[0_0_10px_rgba(232,121,249,0.8)] shadow-[inset_0_0_20px_rgba(232,121,249,0.3),0_0_30px_rgba(232,121,249,0.4)] backdrop-blur-md scale-[1.02]`
        : `${base} bg-fuchsia-500/5 border-fuchsia-500/30 text-fuchsia-400/60 hover:bg-fuchsia-500/10 hover:text-fuchsia-400/90 hover:border-fuchsia-400/50`;
    }
    if (tabId === 'capture') {
      return isActive 
        ? `${base} bg-emerald-500/20 border-emerald-400/80 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)] shadow-[inset_0_0_20px_rgba(52,211,153,0.3),0_0_30px_rgba(52,211,153,0.4)] backdrop-blur-md scale-[1.02]`
        : `${base} bg-emerald-500/5 border-emerald-500/30 text-emerald-400/60 hover:bg-emerald-500/10 hover:text-emerald-400/90 hover:border-emerald-400/50`;
    }
    return base;
  };

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 z-20 relative">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={getTabStyles(tab.id, activeTab === tab.id)}
          >
            <tab.icon size={18} className={activeTab === tab.id ? 'animate-pulse' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="w-full min-h-[800px] relative z-10 max-w-6xl mx-auto">
        {activeTab === 'audit' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
            <RoiCalculator />
          </div>
        )}
        {activeTab === 'matrix' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
            <CompetitorMatrix />
          </div>
        )}
        {activeTab === 'capture' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full">
            <SystemCapture />
          </div>
        )}
      </div>
    </div>
  );
}