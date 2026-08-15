// src/components/storefronts/wizard/core/WizardProgress.tsx
'use client';

import React from 'react';
import { useWizard } from './WizardContext'; // 🚀 Fixed relative path since it's in the same folder!
import { Check } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard'; 

export default function WizardProgress() {
  const { currentStep, totalSteps } = useWizard();

  // Pulls the labels from your central brain
  const steps = WIZARD_COPY.PROGRESS_BAR;

  // The perfect math logic: (currentStep - 1) / (totalSteps - 1) * 100
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mb-12 px-2 sm:px-8">
      
      <div className="relative flex justify-between w-full">
        
        {/* Inner Track Wrapper */}
        <div className="absolute top-1/2 left-4 right-4 md:left-5 md:right-5 -translate-y-1/2 z-0">
          {/* Background Track */}
          <div className="w-full h-0.5 bg-zinc-800/80 rounded-full" />
          
          {/* Glowing Progress Line */}
          <div 
            className="absolute top-0 left-0 h-0.5 bg-cyan-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(34,211,238,0.5)]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step Nodes */}
        {steps.map((step) => {
          const isCompleted = step.num < currentStep;
          const isActive = step.num === currentStep;

          return (
            <div key={step.num} className="flex flex-col items-center gap-3 relative z-10">
              <div 
                className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-black transition-all duration-500 ${
                  isActive 
                    ? 'bg-zinc-950 border-2 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-110' 
                    : isCompleted
                      ? 'bg-cyan-400 border-2 border-cyan-400 text-zinc-950 scale-100'
                      : 'bg-zinc-950 border-2 border-zinc-800 text-zinc-600 scale-100'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : step.num}
              </div>
              <span className={`absolute -bottom-6 text-[9px] md:text-[11px] uppercase tracking-widest font-bold whitespace-nowrap transition-colors duration-500 hidden sm:block ${
                isActive ? 'text-cyan-400 drop-shadow-md' : isCompleted ? 'text-zinc-300' : 'text-zinc-600'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}