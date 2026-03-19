/* src/components/dashboard/broadcast/BroadcastTabs.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Mic2, Share2, Mail } from 'lucide-react';

import AudioTab from './AudioTab';
import SocialTab from './SocialTab';
import CampaignsTab from './CampaignsTab';

export default function BroadcastTabs({ episodes, activeCount }: { episodes: any[], activeCount: number }) {
  // Pure client-side state for instant switching
  const [activeTab, setActiveTab] = useState<'audio' | 'social' | 'campaigns'>('audio');
  const hubCopy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB;

  const getTabClass = (tabName: string) => {
    return activeTab === tabName 
      ? "pb-4 border-b-2 border-brand-primary text-brand-primary font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono transition-all cursor-pointer"
      : "pb-4 text-text-muted hover:text-white flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono transition-colors cursor-pointer hover:text-brand-primary/80";
  };

  return (
    <>
      <nav className="flex gap-8 mb-8 border-b border-white/5">
        <button onClick={() => setActiveTab('audio')} className={getTabClass('audio')}>
          <Mic2 size={16} /> {hubCopy.TABS.AUDIO}
        </button>
        <button onClick={() => setActiveTab('social')} className={getTabClass('social')}>
          <Share2 size={16} /> {hubCopy.TABS.SOCIAL}
        </button>
        <button onClick={() => setActiveTab('campaigns')} className={getTabClass('campaigns')}>
          <Mail size={16} /> {hubCopy.TABS.CAMPAIGNS}
        </button>
      </nav>

      {/* TAB CONTENT ROUTING */}
      {activeTab === 'audio' && <AudioTab activeCount={activeCount} episodes={episodes} />}
      {activeTab === 'social' && <SocialTab />}
      {activeTab === 'campaigns' && <CampaignsTab />}
    </>
  );
}