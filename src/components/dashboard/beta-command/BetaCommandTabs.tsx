/* src/components/dashboard/beta-command/BetaCommandTabs.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Network, Activity, Vote } from 'lucide-react';

import AccessMatrixTab from './AccessMatrixTab';
import FeedbackFeedTab from './FeedbackFeedTab';
import RoadmapPollingTab from './RoadmapPollingTab';

export default function BetaCommandTabs() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'feedback' | 'polling'>('matrix');
  const copy = WEBSITE_COPY.DASHBOARD.BETA_COMMAND;

  const getTabClass = (tabName: string) => {
    return activeTab === tabName 
      ? "pb-4 border-b-2 border-cyan-400 text-cyan-400 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono transition-all cursor-pointer drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]"
      : "pb-4 text-white/40 hover:text-white flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono transition-colors cursor-pointer hover:text-cyan-400/50";
  };

  return (
    <>
      <nav className="flex gap-8 mb-8 border-b border-white/5">
        <button onClick={() => setActiveTab('matrix')} className={getTabClass('matrix')}>
          <Network size={16} /> {copy.TABS.MATRIX}
        </button>
        <button onClick={() => setActiveTab('feedback')} className={getTabClass('feedback')}>
          <Activity size={16} /> {copy.TABS.FEEDBACK}
        </button>
        <button onClick={() => setActiveTab('polling')} className={getTabClass('polling')}>
          <Vote size={16} /> {copy.TABS.POLLING}
        </button>
      </nav>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'matrix' && <AccessMatrixTab />}
        {activeTab === 'feedback' && <FeedbackFeedTab />}
        {activeTab === 'polling' && <RoadmapPollingTab />}
      </div>
    </>
  );
}