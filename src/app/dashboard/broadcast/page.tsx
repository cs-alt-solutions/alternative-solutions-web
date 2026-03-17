/* src/app/dashboard/broadcast/page.tsx */
import React from 'react';
import Link from 'next/link';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Radio, Mic2, Share2, Mail } from 'lucide-react';

// Import our newly extracted atomic components
import AudioTab from '@/components/dashboard/broadcast/AudioTab';
import SocialTab from '@/components/dashboard/broadcast/SocialTab';
import CampaignsTab from '@/components/dashboard/broadcast/CampaignsTab';

export const revalidate = 0;

export default async function BroadcastHub({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const hubCopy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB;
  
  const resolvedSearchParams = await searchParams;
  const activeTab = resolvedSearchParams.tab || 'audio';
  
  // Data fetching specific to the Audio Tab (we fetch it here so it happens server-side)
  const { data: episodes } = await supabase
    .from('audio_logs')
    .select('*')
    .order('created_at', { ascending: false });

  const activeCount = episodes?.filter(e => e.status === 'ACTIVE').length || 0;

  // Active Tab Styling Logic
  const getTabClass = (tabName: string) => {
    return activeTab === tabName 
      ? "pb-4 border-b-2 border-brand-primary text-brand-primary font-bold flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono transition-all"
      : "pb-4 text-text-muted hover:text-white flex items-center gap-2 uppercase tracking-widest text-[10px] font-mono transition-colors";
  };

  return (
    <div className="p-8 relative max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="text-brand-primary animate-pulse" size={16} />
            <span className="text-xs font-mono tracking-[0.2em] text-brand-primary uppercase">
              {hubCopy.SUBTITLE}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            {hubCopy.TITLE}
          </h1>
        </div>
      </header>

      {/* DYNAMIC NAVIGATION TABS */}
      <nav className="flex gap-8 mb-8 border-b border-white/5">
        <Link href="?tab=audio" className={getTabClass('audio')}>
          <Mic2 size={16} /> {hubCopy.TABS.AUDIO}
        </Link>
        <Link href="?tab=social" className={getTabClass('social')}>
          <Share2 size={16} /> {hubCopy.TABS.SOCIAL}
        </Link>
        <Link href="?tab=campaigns" className={getTabClass('campaigns')}>
          <Mail size={16} /> {hubCopy.TABS.CAMPAIGNS}
        </Link>
      </nav>

      {/* TAB CONTENT ROUTING */}
      {activeTab === 'audio' && <AudioTab activeCount={activeCount} episodes={episodes || []} />}
      {activeTab === 'social' && <SocialTab />}
      {activeTab === 'campaigns' && <CampaignsTab />}
      
    </div>
  );
}