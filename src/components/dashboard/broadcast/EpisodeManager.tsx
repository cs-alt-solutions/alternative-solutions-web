/* src/components/dashboard/broadcast/EpisodeManager.tsx */
'use client';

import React from 'react';
import { Edit3, Archive, Eye, EyeOff, Radio } from 'lucide-react';

const CHANNEL_THEMES = {
  BUILD: "border-brand-primary text-brand-primary bg-brand-primary/10",
  HUSTLE: "border-brand-secondary text-brand-secondary bg-brand-secondary/10",
  EVOLUTION: "border-purple-500 text-purple-500 bg-purple-500/10",
  "REAL TALK": "border-amber-500 text-amber-500 bg-amber-500/10"
};

export default function EpisodeManager({ initialEpisodes, copy }: { initialEpisodes: any[], copy: any }) {
  return (
    <div className="space-y-4">
      {initialEpisodes.map((episode) => {
        const theme = CHANNEL_THEMES[episode.category as keyof typeof CHANNEL_THEMES] || "border-white/10 text-white/40";

        return (
          <div key={episode.id} className="group relative bg-bg-surface-200/20 border border-white/5 rounded-xl p-5 hover:border-brand-primary/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              {/* BROADCAST METADATA & CHANNEL BADGE */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${theme}`}>
                    {episode.category}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    {new Date(episode.date || episode.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                  {episode.title}
                </h3>
                <p className="text-sm text-text-muted line-clamp-2 mt-1 font-light">
                  {episode.description}
                </p>
              </div>

              {/* CONTROL INTERFACE */}
              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5 self-end md:self-center">
                <button className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded text-white/40 hover:text-brand-primary transition-all" title={copy.ACTIONS.EDIT}>
                  <Edit3 size={16} />
                </button>
                <button className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded text-white/40 hover:text-brand-primary transition-all" title={copy.ACTIONS.TOGGLE_VIS}>
                  {episode.status === 'ACTIVE' ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded text-white/40 hover:text-red-400 transition-all" title={copy.ACTIONS.ARCHIVE}>
                  <Archive size={16} />
                </button>
              </div>
            </div>
            
            {/* LIVE INDICATOR */}
            {episode.status === 'ACTIVE' && (
              <div className="absolute top-0 right-0 p-2">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
              </div>
            )}
          </div>
        );
      })}

      {initialEpisodes.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-2xl">
          <Radio className="mx-auto text-white/10 mb-4" size={48} />
          <p className="text-text-muted font-mono text-xs uppercase tracking-widest">
            {copy.COMING_SOON || "NO TRANSMISSIONS DETECTED"}
          </p>
        </div>
      )}
    </div>
  );
}