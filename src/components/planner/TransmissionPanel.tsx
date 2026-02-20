/* src/components/planner/TransmissionPanel.tsx */
'use client';

import React, { useState } from 'react';
import { MessageCircle, Mic, Share2, Loader2, Radio } from 'lucide-react';
import { createTextBroadcast, uploadMedia } from '@/app/actions';

interface TransmissionPanelProps {
  copy: any;
  draftTitle: string;
}

export default function TransmissionPanel({ copy, draftTitle }: TransmissionPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [content, setContent] = useState('');

  const handleBroadcast = async () => {
    if (!content) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('description', content);
    await createTextBroadcast(formData);
    setContent('');
    setIsUploading(false);
  };

  return (
    <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Radio size={16} className={isUploading ? 'animate-pulse' : ''} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest">{copy.TRANSMISSION}</h3>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">{draftTitle}</p>
          </div>
        </div>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Today's mindset, thoughts, or roadblocks..."
        className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-white focus:outline-none focus:border-brand-primary/30 transition-all resize-none h-32 mb-4"
      />

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
            <Mic size={16} />
          </button>
          <button className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors">
            <Share2 size={16} />
          </button>
        </div>
        <button
          onClick={handleBroadcast}
          disabled={isUploading || !content}
          className="bg-brand-primary text-black px-6 py-2 rounded-lg font-bold text-[10px] font-mono uppercase flex items-center gap-2 hover:bg-brand-primary/90 disabled:opacity-50 transition-all"
        >
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <MessageCircle size={14} />}
          {copy.BROADCAST}
        </button>
      </div>
    </div>
  );
}