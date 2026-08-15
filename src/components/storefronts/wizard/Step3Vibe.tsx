// src/components/storefronts/wizard/Step3Vibe.tsx
'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard'; 
import { useWizard } from './core/WizardContext'; 

import VibeGrid from './step3/VibeGrid';
import ColorSwatches from './step3/ColorSwatches';
import LayoutArchitecture from './step3/LayoutArchitecture';

export default function Step3Vibe() {
  const { formData, updateForm, nextStep, prevStep } = useWizard();
  const copy = WIZARD_COPY.STEP_3;

  // 1. VibeGrid | 2. ColorSwatches | 3. LayoutArchitecture
  const [internalStep, setInternalStep] = useState(1);
  const totalInternalSteps = 3;

  const selectedVibe = formData.themeStyle || '';
  const brandColor = formData.brandColor || 'cyan';
  const currentHero = formData.heroLayout || 'center';
  const currentStory = formData.storyLayout || 'classic-split';
  const currentFlow = formData.contentLayout || 'classic';

  // Validation per micro-step
  const canProceed = () => {
    if (internalStep === 1) return selectedVibe !== '';
    if (internalStep === 2) return brandColor !== '';
    if (internalStep === 3) return currentHero !== '' && currentStory !== '' && currentFlow !== '';
    return false;
  };

  const handleNext = () => {
    if (internalStep < totalInternalSteps) {
      setInternalStep(prev => prev + 1);
    } else {
      nextStep();
    }
  };

  const handleBack = () => {
    if (internalStep > 1) {
      setInternalStep(prev => prev - 1);
    } else {
      prevStep(); // Returns to the global Step 2
    }
  };

  // DYNAMIC HEADER LOGIC
  const getHeader = () => {
    switch (internalStep) {
      case 1: return { 
        title: copy.VIBE_SELECT.TITLE.replace(/^\d+\.\s*/, ''), // Strips the "1. " 
        subtitle: copy.VIBE_SELECT.SUBTITLE 
      };
      case 2: return { 
        title: copy.COLOR_SELECT.TITLE.replace(/^\d+\.\s*/, ''), // Strips the "2. "
        subtitle: copy.COLOR_SELECT.SUBTITLE 
      };
      case 3: return { 
        title: copy.STRUCTURE_TOGGLE.TITLE.replace(/^\d+\.\s*/, ''), // Strips the "3. "
        subtitle: copy.STRUCTURE_TOGGLE.SUBTITLE 
      };
      default: return { title: "", subtitle: "" };
    }
  };

  const header = getHeader();

  return (
    // 🚀 FIXED: Changed max-w-4xl to w-full max-w-3xl so it perfectly matches its parent wrapper
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 min-h-125 flex flex-col">
      
      {/* FORCES EVERYTHING DEAD CENTER */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-10 w-full py-8 my-auto text-center">
        
        {/* DYNAMIC HEADER */}
        <div className="space-y-5 w-full">
          {/* Main Fixed Title */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase leading-none drop-shadow-md">
            {copy.TITLE_MAIN}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 via-fuchsia-400 to-pink-500 animate-text-gradient">
              {copy.TITLE_HIGHLIGHT}
            </span>
          </h1>
          
          {/* Sleek Sub-Step Indicator Pill */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 shadow-inner">
            <span className="text-xs font-bold tracking-widest text-fuchsia-400 uppercase">
              Step {internalStep}: {header.title}
            </span>
          </div>

          {/* Dynamic Instructions */}
          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed">
            {header.subtitle}
          </p>
        </div>

        {/* THE INPUT AREA */}
        <div className="w-full relative flex justify-center">

          {/* STEP 3A: THE VIBE GRID */}
          {internalStep === 1 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full">
              <VibeGrid 
                selectedVibe={selectedVibe} 
                onSelect={(val) => updateForm({ themeStyle: val })} 
              />
            </div>
          )}

          {/* STEP 3B: COLOR SWATCHES */}
          {internalStep === 2 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full">
              <ColorSwatches 
                currentColor={brandColor} 
                onSelectColor={(val) => updateForm({ brandColor: val })} 
              />
            </div>
          )}

          {/* STEP 3C: LAYOUT ARCHITECTURE */}
          {internalStep === 3 && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-300 w-full text-left">
              <LayoutArchitecture
                currentHero={currentHero}
                currentStory={currentStory}
                currentFlow={currentFlow}
                onHeroUpdate={(val) => updateForm({ heroLayout: val })}
                onStoryUpdate={(val) => updateForm({ storyLayout: val })}
                onFlowUpdate={(val) => updateForm({ contentLayout: val })}
              />
            </div>
          )}

        </div>
      </div>

      {/* FOOTER ACTIONS - Locked to the bottom */}
      <div className="w-full flex items-center justify-between pt-6 mt-auto border-t border-zinc-800/60 shrink-0">
        <button 
          type="button" 
          onClick={handleBack}
          className="text-xs font-semibold uppercase tracking-widest flex items-center gap-2 text-zinc-500 hover:text-white cursor-pointer transition-colors duration-300"
        >
          <ArrowLeft className="w-3 h-3" /> Back
        </button>
        
        <button 
          type="button" 
          onClick={handleNext}
          disabled={!canProceed()}
          className={`px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
            canProceed() 
              ? 'text-zinc-950 bg-fuchsia-400 hover:bg-fuchsia-300 shadow-[0_0_20px_rgba(232,121,249,0.3)] hover:scale-[1.05] cursor-pointer' 
              : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'
          }`}
        >
          <span>{internalStep === totalInternalSteps ? copy.ACTIONS.NEXT : "Continue"}</span>
          {internalStep !== totalInternalSteps && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>

    </div>
  );
}