/* src/components/dashboard/broadcast/StudioPreviewModal.tsx */
'use client';

import React, { useEffect, useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { X, Mic, Send, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface StudioPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  episodeId: string | null;
  episodeTitle: string;
}

// Media Parser to render images in the timeline
function parseMedia(content: string) {
  const imageRegex = /!\[([^\]]*)\]\((.*?)\)/;
  const match = content.match(imageRegex);
  if (match) {
    return { isImage: true, url: match[2], text: content.replace(imageRegex, '').trim() };
  }
  return { isImage: false, url: null, text: content.trim() };
}

export default function StudioPreviewModal({ isOpen, onClose, episodeId, episodeTitle }: StudioPreviewModalProps) {
  const copy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB.STUDIO;
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    async function fetchNotes() {
      if (!episodeId) return;
      const { data } = await supabase
        .from('transmissions')
        .select('*')
        .eq('episode_id', episodeId)
        .order('created_at', { ascending: true }); // Oldest to newest for a story flow
      
      if (data) setNotes(data);
    }
    if (isOpen) fetchNotes();
  }, [isOpen, episodeId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-bg-app border border-white/10 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <header className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div>
            <h2 className="text-lg font-black uppercase text-white tracking-widest">{copy.TITLE}</h2>
            <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-1 block">
              {episodeTitle}
            </span>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-black/40 space-y-8 custom-scrollbar">
          {notes.length === 0 ? (
             <div className="text-center py-12 text-[10px] font-mono text-white/30 uppercase tracking-widest border border-dashed border-white/10 rounded-xl">
               {copy.NO_NOTES}
             </div>
          ) : (
            <div className="relative border-l border-white/10 ml-4 space-y-8">
              {notes.map((note) => {
                const parsed = parseMedia(note.content);
                return (
                  <div key={note.id} className="relative pl-8">
                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-2">
                      {new Date(note.created_at).toLocaleString()}
                    </span>
                    {parsed.text && <p className="text-sm text-white/80 font-light leading-relaxed mb-3">{parsed.text}</p>}
                    {parsed.isImage && (
                       <img src={parsed.url!} alt="Snapshot" className="rounded-lg border border-white/10 max-w-full hover:border-brand-primary/50 transition-colors" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <footer className="p-6 border-t border-white/5 bg-white/2 flex items-center justify-between">
           <button className="flex items-center gap-2 px-5 py-2.5 rounded text-[10px] font-mono uppercase font-bold text-white/50 border border-white/10 hover:text-white transition-all">
             <Mic size={14} /> ATTACH AUDIO
           </button>
           <button className="flex items-center gap-2 px-8 py-3 rounded-full text-xs font-mono uppercase font-black text-black bg-brand-primary hover:bg-brand-primary/90 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
             {copy.BTN_PUBLISH} <Send size={14} />
           </button>
        </footer>
      </div>
    </div>
  );
}