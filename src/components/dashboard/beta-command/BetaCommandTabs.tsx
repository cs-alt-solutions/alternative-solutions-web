'use client';

import React, { useState } from 'react';
import { Activity, Vote } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

import FeedbackFeedTab from './FeedbackFeedTab';
import RoadmapPollingTab from './RoadmapPollingTab';

export default function BetaCommandTabs() {
  const [activeTab, setActiveTab] = useState<'feedback' | 'roadmap'>('feedback');
  
  // Bring in the tab labels from the config
  const { TABS } = WEBSITE_COPY.DASHBOARD.BETA_COMMAND;

  return (
    <div className="space-y-6">
      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'feedback'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
              : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Activity size={16} /> {TABS.FEEDBACK}
        </button>
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
              : 'text-slate-500 hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Vote size={16} /> {TABS.POLLING}
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="pt-4">
        {activeTab === 'feedback' && <FeedbackFeedTab />}
        {activeTab === 'roadmap' && <RoadmapPollingTab />}
      </div>
    </div>
  );
}