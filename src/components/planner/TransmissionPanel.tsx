/* src/components/planner/TransmissionPanel.tsx */
'use client';

import React, { useState } from 'react';
import { MessageCircle, Mic, Share2, Loader2, Radio, Sparkles } from 'lucide-react';
import { createTextBroadcast, uploadMedia } from '@/app/actions';

interface TransmissionPanelProps {
  copy: any;
  draftTitle: string;
}

/**
 * TRANSMISSION PANEL
 * Architect's internal comms hub for logging daily progress.
 * Logic: Transmissions are saved to the current weekly draft for review, not public broadcast.
 */
export default function TransmissionPanel({ copy, draftTitle }: TransmissionPanelProps) {
  const [transmissionText, setTransmissionText] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [pastedImages, setPastedImages] = useState<string[]>([]);

  // Handles saving the text/images to the weekly internal log
  async function handleLogTransmission() {
    if (!transmissionText.trim()) return;
    
    setIsBroadcasting(true);
    const formData = new FormData();
    // We send the text and the context (the current weekly draft title)
    formData.append('description', transmissionText);
    formData.append('target_draft', draftTitle);
    formData.append('is_internal', 'true'); // Flagging this as a non-public log

    try {
      const result = await createTextBroadcast(formData);
      if (result.success) {
        setTransmissionText('');
        setPastedImages([]); 
      }
    } catch (error) {
      console.error("TRANSMISSION_FAILURE:", error);
    } finally {
      setIsBroadcasting(false);
    }
  }

  // Intercepts clipboard images for visual logging
  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData.items;
    const imageItem = Array.from(items).find(item => item.type.startsWith('image/'));

    if (imageItem) {
      e.preventDefault();
      
      const caption = window.prompt("Enter a caption for this snapshot:", "System Update");
      if (caption === null) return; 

      const file = imageItem.getAsFile();
      if (!file) return;

      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const result = await uploadMedia(formData);
        
        if (result.success && result.url) {
          const imageMarkdown = `\n![${caption}](${result.url})\n`;
          setTransmissionText(prev => prev + imageMarkdown);
          setPastedImages(prev => [...prev, result.url]);
        }
      } catch (err) {
        console.error("MEDIA_INTERCEPT_CRITICAL_FAIL");
      } finally {
        setIsUploadingMedia(false);
      }
    }
  }

  return (
    <section className="h-full flex flex-col">
        {/* Header Area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
            <MessageCircle size={12} /> {copy.SECTIONS.TRANSMISSION}
          </h3>
          
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[8px] font-mono text-brand-primary uppercase tracking-widest">
            <Radio size={10} className="animate-pulse" /> {copy.LOGGING_INDICATOR} {draftTitle}
          </div>
        </div>
        
        {/* Input Terminal */}
        <div className="bg-black/30 border border-white/5 rounded-xl p-6 flex-1 flex flex-col relative overflow-hidden">
           {/* Upload Overlay */}
           {isUploadingMedia && (
             <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in">
               <Loader2 size={24} className="text-brand-primary animate-spin" />
               <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">
                 {copy.PLACEHOLDERS.UPLOADING_MEDIA}
               </span>
             </div>
           )}

           <textarea 
            value={transmissionText}
            onChange={(e) => setTransmissionText(e.target.value)}
            onPaste={handlePaste}
            disabled={isBroadcasting || isUploadingMedia}
            placeholder={copy.PLACEHOLDERS.MINDSET}
            className="flex-1 bg-transparent border-none outline-none text-sm text-white/60 font-light leading-relaxed resize-none custom-scrollbar relative z-0"
           />

           {/* Preview of pasted snapshots */}
           {pastedImages.length > 0 && (
             <div className="flex gap-2 overflow-x-auto py-4 border-t border-white/5 mt-4 relative z-0">
               {pastedImages.map((url, idx) => (
                 <div key={idx} className="relative shrink-0 group">
                   <img 
                     src={url} 
                     alt="Pasted content" 
                     className="w-16 h-16 rounded object-cover border border-white/10 hover:border-brand-primary/50 transition-all" 
                   />
                   <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded" />
                 </div>
               ))}
             </div>
           )}
           
           {/* Action Bar */}
           <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-end gap-3 relative z-0">
              {/* Audio Placeholder - Future AI Summarization Entry */}
              <button disabled className="flex items-center gap-2 px-4 py-2 rounded bg-white/5 text-white/20 text-[10px] font-mono uppercase tracking-widest border border-white/5 cursor-not-allowed group">
                <Mic size={12} /> {copy.ACTIONS.AUDIO}
                <span className="hidden group-hover:inline ml-1 text-[8px] text-white/40">(AI PROCESSING PENDING)</span>
              </button>

              {/* Primary Action: Log to internal draft */}
              <button 
                onClick={handleLogTransmission}
                disabled={isBroadcasting || !transmissionText.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-mono uppercase tracking-widest border border-brand-primary/20 hover:bg-brand-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(6,182,212,0.1)]"
              >
                {isBroadcasting ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                {isBroadcasting ? 'LOGGING...' : 'LOG TO DRAFT'}
              </button>
           </div>
        </div>
     </section>
  );
}