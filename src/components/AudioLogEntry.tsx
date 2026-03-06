/* src/components/AudioLogEntry.tsx */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Mic2, RotateCcw, Image as ImageIcon, Video } from 'lucide-react';
import { WEBSITE_COPY } from '@/utils/glossary';

/**
 * AUDIO LOG ENTRY (MULTI-MEDIA VERSION)
 * Architecture: Renders a unified transmission entry containing visual assets and audio controls.
 * Style: Industrial Dark with human-centric formatting (italicized quotes for descriptions).
 */
export default function AudioLogEntry({ log }: { log: any }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const playerCopy = WEBSITE_COPY.JOIN_PAGE.HYPE.AUDIO_PLAYER;

  // Standardized human-readable date formatting
  const formattedDate = new Date(log.date || log.created_at).toLocaleDateString('en-US', {
    month: 'long', 
    day: 'numeric', 
    year: 'numeric'
  });

  // --- AUDIO ENGINE LOGIC ---
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className={`group bg-bg-surface-200/50 border transition-all duration-300 p-5 rounded-xl ${
      isPlaying ? 'border-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-brand-primary/30'
    }`}>
      
      {/* VISUAL ASSET CONTAINER: Detects and renders video or image assets */}
      {log.media_url && (
        <div className="mb-6 rounded-lg overflow-hidden border border-white/5 bg-black/40 relative shadow-inner group-hover:border-brand-primary/30 transition-colors">
           {log.media_type === 'video' ? (
             <video 
               src={log.media_url} 
               controls 
               className="w-full aspect-video object-cover" 
             />
           ) : (
             <img 
               src={log.media_url} 
               alt={log.title} 
               className="w-full object-cover max-h-80" 
             />
           )}
           {/* Visual Type Indicator Overlay */}
           <div className="absolute top-3 right-3 p-1.5 rounded bg-black/60 backdrop-blur-md border border-white/10 text-white/60">
             {log.media_type === 'video' ? <Video size={14} /> : <ImageIcon size={14} />}
           </div>
        </div>
      )}

      {/* HEADER: Metadata and human-centric messaging */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mic2 size={12} className={`text-brand-primary ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">
              {playerCopy.PREFIX} {formattedDate}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">
            {log.title}
          </h4>
          <p className="text-xs text-text-muted leading-relaxed font-light italic">
            "{log.description}"
          </p>
        </div>
      </div>
      
      {/* AUDIO ENGINE: Optional scrubber and playback controls */}
      {log.audio_url && (
        <>
          <audio 
            ref={audioRef} 
            src={log.audio_url} 
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            controlsList="nodownload" 
          />
          
          <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
            {/* Custom Range Input (Scrubber) */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleScrub}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary outline-none hover:h-1.5 transition-all"
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Play/Pause Toggle */}
                <button 
                  onClick={togglePlay}
                  className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-black transition-all"
                >
                  {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
                </button>
                
                {/* Restart Switch */}
                <button 
                  onClick={handleReplay}
                  className="text-white/40 hover:text-brand-primary transition-colors"
                  title="Restart Transmission"
                >
                  <RotateCcw size={14} />
                </button>

                {/* Duration Display */}
                <div className="text-[10px] font-mono text-text-muted">
                  <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
                </div>
              </div>

              {/* Status Signal */}
              <span className="text-[10px] font-mono uppercase opacity-50 font-bold text-brand-primary tracking-widest">
                {isPlaying ? playerCopy.STREAMING : playerCopy.ENCRYPTED}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}