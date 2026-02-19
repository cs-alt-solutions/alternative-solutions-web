/* src/components/dashboard/broadcast/EpisodeManager.tsx */
'use client';

import React, { useState } from 'react';
import { Edit3, Archive, Eye, EyeOff, Radio, Image as ImageIcon, MessageSquare, Mic, PlayCircle } from 'lucide-react';
import StudioPreviewModal from './StudioPreviewModal';

const CHANNEL_THEMES = {
  BUILD: "border-brand-primary text-brand-primary bg-brand-primary/10",
  HUSTLE: "border-brand-secondary text-brand-secondary bg-brand-secondary/10",
  EVOLUTION: "border-purple-500 text-purple-500 bg-purple-500/10",
  "REAL TALK": "border-amber-500 text-amber-500 bg-amber-500/10",
  MINDSET: "border-blue-500 text-blue-500 bg-blue-500/10"
};

function parseMedia(description: string) {
  if (!description) return { text: '', type: 'TEXT', imageUrl: null, imageAlt: null };
  const imageRegex = /!\[([^\]]*)\]\((.*?)\)/;
  const match = description.match(imageRegex);
  if (match) {
    return { type: 'IMAGE', imageUrl: match[2], imageAlt: match[1], text: description.replace(imageRegex, '').trim() };
  }
  return { type: 'TEXT', text: description.trim(), imageUrl: null, imageAlt: null };
}

export default function EpisodeManager({ initialEpisodes, copy }: { initialEpisodes: any[], copy: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState<{id: string, title: string} | null>(null);

  const openStudio = (id: string, title: string) => {
    setSelectedEpisode({ id, title });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {initialEpisodes.map((episode) => {
        const theme = CHANNEL_THEMES[episode.category as keyof typeof CHANNEL_THEMES] || "border-white/10 text-white/40";
        const media = parseMedia(episode.description);
        const isDraft = episode.status === 'DRAFT';

        return (
          <div key={episode.id} className="group relative bg-bg-surface-200/20 border border-white/5 rounded-xl p-5 hover:border-brand-primary/30 transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div 
                className="flex items-start gap-5 flex-1 cursor-pointer" 
                onClick={() => openStudio(episode.id, episode.title)}
              >
                <div className="shrink-0">
                  {media.type === 'IMAGE' && media.imageUrl && !isDraft ? (
                     <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10 relative group-hover:border-brand-primary/50 transition-colors">
                        <img src={media.imageUrl} alt={media.imageAlt || "Snapshot"} className="w-full h-full object-cover" />
                        <div className="absolute top-1 right-1 bg-black/60 p-1 rounded backdrop-blur-sm">
                           <ImageIcon size={10} className="text-white" />
                        </div>
                     </div>
                  ) : (
                     <div className="w-20 h-20 rounded-lg bg-black/40 border border-white/5 flex items-center justify-center text-white/20">
                        {isDraft ? <Radio className="animate-pulse text-amber-500/50" size={24} /> : (media.type === 'TEXT' ? <MessageSquare size={24} /> : <Mic size={24} />)}
                     </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-widest ${theme}`}>
                      {episode.category}
                    </span>
                    {isDraft && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded border border-amber-500/50 text-amber-500 bg-amber-500/10 uppercase tracking-widest animate-pulse">
                        ACTIVE DRAFT
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-text-muted uppercase">
                      {new Date(episode.date || episode.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-primary transition-colors">
                    {episode.title}
                  </h3>
                  <p className="text-sm text-text-muted line-clamp-2 mt-1 font-light">
                    {isDraft ? "Collecting incoming Transmissions..." : (media.text || "Visual asset attached. No text transmitted.")}
                  </p>
                </div>
              </div>

              {/* CONTROL INTERFACE */}
              <div className="flex items-center gap-2 bg-black/20 p-2 rounded-lg border border-white/5 self-end md:self-center shrink-0">
                <button 
                  onClick={() => openStudio(episode.id, episode.title)}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 transition-all font-mono text-[10px] uppercase font-bold border border-brand-primary/20"
                >
                  <PlayCircle size={14} /> STUDIO
                </button>
                <div className="w-px h-6 bg-white/10 mx-1" />
                <button className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded text-white/40 hover:text-brand-primary transition-all">
                  <Edit3 size={16} />
                </button>
                <button className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded text-white/40 hover:text-brand-primary transition-all">
                  {episode.status === 'ACTIVE' ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>
            
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

      <StudioPreviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        episodeId={selectedEpisode?.id || null}
        episodeTitle={selectedEpisode?.title || ''}
      />
    </div>
  );
}