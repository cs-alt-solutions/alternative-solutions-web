'use client';

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';
import VibeGrid from './step3/VibeGrid';
import ColorSwatches from './step3/ColorSwatches';
import LayoutArchitecture from './step3/LayoutArchitecture';

interface Step3Props {
  selectedVibe: string | null;
  setSelectedVibe: (vibe: string) => void;
  onNext: () => void;
  onPrev: () => void;
  brandColor?: string;
  onBrandColorChange?: (val: string) => void;
  heroStructure?: string;
  onHeroStructureChange?: (val: string) => void;
  storyStructure?: string;
  onStoryStructureChange?: (val: string) => void;
  contentFlow?: string;
  onContentFlowChange?: (val: string) => void;
  formData?: any;
  setFormData?: (data: any) => void;
}

export default function Step3Vibe({ 
  selectedVibe, 
  setSelectedVibe, 
  onNext, 
  onPrev,
  brandColor,
  onBrandColorChange,
  heroStructure,
  onHeroStructureChange,
  storyStructure,
  onStoryStructureChange,
  contentFlow,
  onContentFlowChange,
  formData,
  setFormData
}: Step3Props) {
  const copy = WIZARD_COPY.STEP_3;

  // 🚀 LOCAL REACT STATE FALLBACKS: Guarantees clicks update instantly even if parent props aren't wired up yet!
  const [localColor, setLocalColor] = useState(() => brandColor ?? formData?.brandColor ?? 'cyan');
  const [localHero, setLocalHero] = useState(() => heroStructure ?? formData?.heroStructure ?? 'centered');
  const [localStory, setLocalStory] = useState(() => storyStructure ?? formData?.storyStructure ?? 'classic-split');
  const [localFlow, setLocalFlow] = useState(() => contentFlow ?? formData?.contentFlow ?? 'stacked');

  const handleColorUpdate = (val: string) => {
    setLocalColor(val);
    if (onBrandColorChange) onBrandColorChange(val);
    else if (setFormData && formData) setFormData({ ...formData, brandColor: val });
  };

  const handleHeroUpdate = (val: string) => {
    setLocalHero(val);
    if (onHeroStructureChange) onHeroStructureChange(val);
    else if (setFormData && formData) setFormData({ ...formData, heroStructure: val });
  };

  const handleStoryUpdate = (val: string) => {
    setLocalStory(val);
    if (onStoryStructureChange) onStoryStructureChange(val);
    else if (setFormData && formData) setFormData({ ...formData, storyStructure: val });
  };

  const handleFlowUpdate = (val: string) => {
    setLocalFlow(val);
    if (onContentFlowChange) onContentFlowChange(val);
    else if (setFormData && formData) setFormData({ ...formData, contentFlow: val });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 space-y-12">
      
      {/* HEADER */}
      <div className="space-y-2 mb-2">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
          {copy.TITLE_MAIN}<span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-fuchsia-400 to-pink-500 animate-text-gradient">{copy.TITLE_HIGHLIGHT}</span>
        </h1>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl leading-relaxed font-normal">
          {copy.SUBTITLE}
        </p>
      </div>
      
      <div className="space-y-10">
        <VibeGrid selectedVibe={selectedVibe} onSelect={setSelectedVibe} />
        
        {/* Now uses localColor so swatches toggle seamlessly! */}
        <ColorSwatches currentColor={localColor} onSelectColor={handleColorUpdate} />
        
        {/* Now uses local layout states! */}
        <LayoutArchitecture
          currentHero={localHero}
          currentStory={localStory}
          currentFlow={localFlow}
          onHeroUpdate={handleHeroUpdate}
          onStoryUpdate={handleStoryUpdate}
          onFlowUpdate={handleFlowUpdate}
        />
      </div>

      {/* FOOTER ACTIONS */}
      <div className="flex flex-col-reverse md:flex-row justify-between items-center pt-4 border-t border-zinc-800/60 gap-4">
        <button 
          type="button" 
          onClick={onPrev}
          className="text-xs font-semibold text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Step 2</span>
        </button>
        <button 
          type="button" 
          onClick={onNext}
          disabled={!selectedVibe}
          className={`w-full md:w-auto px-8 py-4 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer ${selectedVibe ? 'text-zinc-950 bg-fuchsia-400 hover:bg-fuchsia-300 shadow-[0_0_20px_rgba(232,121,249,0.3)] hover:scale-[1.01]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
        >
          <span>{copy.ACTIONS.NEXT}</span>
        </button>
      </div>
    </div>
  );
}