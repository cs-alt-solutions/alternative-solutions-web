/* src/components/dashboard/beta-command/BetaCommandTabs.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Network, Activity, Vote } from 'lucide-react';

import AccessMatrixTab from './AccessMatrixTab';
import FeedbackFeedTab from './FeedbackFeedTab';
import RoadmapPollingTab from './RoadmapPollingTab';

export default function BetaCommandTabs() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'feedback' | 'roadmap'>('matrix');

  return (
    <div className="space-y-6">
      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
              : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Network size={16} /> Access Matrix
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
              : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Activity size={16} /> Feedback Feed
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
              : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Vote size={16} /> Roadmap Polling
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="pt-4">
        {activeTab === 'matrix' && <AccessMatrixTab />}
        {activeTab === 'feedback' && <FeedbackFeedTab />}
        {activeTab === 'roadmap' && <RoadmapPollingTab />}
      </div>
    </div>
  );
}