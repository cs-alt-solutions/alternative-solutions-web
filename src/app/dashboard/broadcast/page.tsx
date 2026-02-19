/* src/app/dashboard/broadcast/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Radio, Mic2, Share2, Mail, Plus } from 'lucide-react';
import EpisodeManager from '@/components/dashboard/broadcast/EpisodeManager';

export default async function BroadcastHub() {
  const hubCopy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB;
  
  // --- DATA PIPELINE: FETCHING ALL EPISODES ---
  const { data: episodes } = await supabase
    .from('audio_logs')
    .select('*')
    .order('date', { ascending: false });

  const activeCount = episodes?.filter(e => e.status === 'ACTIVE').length || 0;

  return (
    <div className="p-8 relative">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
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

        <button className="flex items-center gap-2 bg-brand-primary text-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
          <Plus size={18} strokeWidth={3} />
          <span>NEW TRANSMISSION</span>
        </button>
      </header>

      {/* TABS: AUDIO / SOCIAL / CAMPAIGNS */}
      <nav className="flex gap-8 mb-8 border-b border-white/5">
        <button className="pb-4 border-b-2 border-brand-primary text-brand-primary font-bold flex items-center gap-2">
          <Mic2 size={16} /> {hubCopy.TABS.AUDIO}
        </button>
        <button className="pb-4 text-text-muted hover:text-white transition-colors flex items-center gap-2">
          <Share2 size={16} /> {hubCopy.TABS.SOCIAL}
        </button>
        <button className="pb-4 text-text-muted hover:text-white transition-colors flex items-center gap-2">
          <Mail size={16} /> {hubCopy.TABS.CAMPAIGNS}
        </button>
      </nav>

      {/* EPISODE MANAGEMENT MODULE */}
      <section className="bg-bg-surface-200/30 border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-sm font-mono text-text-muted uppercase tracking-widest">
            {hubCopy.AUDIO_MODULE.LEAD_COUNT} <span className="text-white">{activeCount}</span>
          </h2>
        </div>
        
        <EpisodeManager 
          initialEpisodes={episodes || []} 
          copy={hubCopy.AUDIO_MODULE} 
        />
      </section>
    </div>
  );
}