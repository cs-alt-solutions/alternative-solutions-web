/* src/components/planner/InitializeWeekModule.tsx */
'use client';

import React, { useState } from 'react';
import { Play, Sparkles, Loader2 } from 'lucide-react';
import { startDraftEpisode } from '@/app/actions';

interface InitializeWeekModuleProps {
  copy: any;
  onInitialized: (draft: any) => void;
}

export default function InitializeWeekModule({ copy, onInitialized }: InitializeWeekModuleProps) {
  const [isStarting, setIsStarting] = useState(false);

  async function handleStart() {
    setIsStarting(true);
    const formData = new FormData();
    const result = await startDraftEpisode(formData);
    
    // INSTANT HANDOFF: We snag the new draft and push it straight to the UI
    if (result && result.success) {
      onInitialized(result.draft);
    } else {
      console.error("CRITICAL: Initialization Failed", result?.message);
      alert(`Database Check: Failed to initialize. ${result?.message || 'Check Server Console.'}`);
    }
    
    setIsStarting(false);
  }

  return (
    <div className="flex flex-col items-center justify-center py-24 bg-bg-surface-200/20 border border-white/5 rounded-2xl text-center h-full">
      <Sparkles size={48} className="text-brand-primary mb-6 animate-pulse" />
      <h2 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
        {copy.TITLE}
      </h2>
      <p className="text-sm text-text-muted font-light max-w-md mb-8">
        {copy.DESCRIPTION}
      </p>
      <button 
        onClick={handleStart}
        disabled={isStarting}
        className="flex items-center gap-2 px-8 py-4 rounded-lg font-bold text-black bg-brand-primary hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:scale-100 disabled:hover:scale-100"
      >
        {isStarting ? <Loader2 className="animate-spin" size={18} /> : <Play size={18} />} 
        {copy.BTN_START}
      </button>
    </div>
  );
}