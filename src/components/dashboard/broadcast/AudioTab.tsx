/* src/components/dashboard/broadcast/AudioTab.tsx */
import React from 'react';
import EpisodeManager from './EpisodeManager';

interface AudioTabProps {
  activeCount: number;
  episodes: any[];
}

export default function AudioTab({ activeCount, episodes }: AudioTabProps) {
  return (
    <section className="bg-bg-surface-200/30 border border-white/5 rounded-2xl p-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          ACTIVE FEEDS: <span className="text-white">{activeCount}</span>
        </h2>
      </div>
      <EpisodeManager initialEpisodes={episodes || []} copy={{}} />
    </section>
  );
}