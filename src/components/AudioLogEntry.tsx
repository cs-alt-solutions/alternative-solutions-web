/* src/components/AudioLogEntry.tsx */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Mic2, RotateCcw } from 'lucide-react';

export default function AudioLogEntry({ log }: { log: any }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- THE DATE FORMATTER ---
  const formattedDate = new Date(log.date || log.created_at).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });

  // --- AUDIO CONTROLLERS ---
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

  // Sync internal state with the actual audio file
  const handleTimeUpdate = () => {
    if (audioRef.current) setCurrentTime(audioRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) setDuration(audioRef.current.duration);
  };

  // Format seconds into MM:SS
  const formatTime = (time: number) => {
    if (isNaN(time)) return "00:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Auto-reset when the track finishes
  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0); // Reset scrubber to the beginning
    };
    
    if (audio) {
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, []);

  return (
    <div className={`group bg-bg-surface-200/50 border transition-all duration-300 p-5 rounded-xl ${isPlaying ? 'border-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'border-white/5 hover:border-brand-primary/30'}`}>
      
      {/* HEADER: Title & Description */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Mic2 size={12} className={`text-brand-primary ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-tighter">
              LOG // {formattedDate}
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-1 group-hover:text-brand-primary transition-colors">
            {log.title}
          </h4>
          <p className="text-xs text-text-muted leading-relaxed">
            {log.description}
          </p>
        </div>
      </div>
      
      {/* THE HIDDEN ENGINE: No native controls = no download button */}
      <audio 
        ref={audioRef} 
        src={log.audio_url} 
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        controlsList="nodownload" 
      />
      
      {/* THE MEDIA BAR */}
      <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
        
        {/* The YouTube-Style Scrubber */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleScrub}
          className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-primary outline-none focus:ring-1 focus:ring-brand-primary/50 hover:h-1.5 transition-all"
        />
        
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-4">
            {/* Play/Pause Button */}
            <button 
              onClick={togglePlay}
              className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-black transition-all"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" className="ml-0.5" />}
            </button>
            
            {/* Replay Button */}
            <button 
              onClick={handleReplay}
              className="text-white/40 hover:text-brand-primary transition-colors"
              title="Restart Transmission"
            >
              <RotateCcw size={14} />
            </button>

            {/* Live Timestamps */}
            <div className="text-[10px] font-mono text-text-muted">
              <span className="text-white">{formatTime(currentTime)}</span> / {formatTime(duration)}
            </div>
          </div>

          {/* Status Indicator */}
          <span className="text-[10px] font-mono uppercase opacity-50 font-bold text-brand-primary tracking-widest">
            {isPlaying ? 'STREAMING...' : 'ENCRYPTED'}
          </span>
          
        </div>
      </div>
    </div>
  );
}