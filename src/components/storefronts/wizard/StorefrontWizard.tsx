'use client';

import React from 'react';
import { WizardProvider, useWizard } from './core/WizardContext';
import WizardProgress from './core/WizardProgress';

// Import all your isolated steps
import Step1Basics from './Step1Basics';
import Step2Network from './Step2Network';
import Step3Vibe from './Step3Vibe';
import Step4Scope from './Step4Scope';
import Step5Pledge from './Step5Pledge'; // 🚀 UPDATED: Now pointing to your new 5th step!

// 1. THE SWITCHBOARD (Reads the Brain, shows the correct screen)
function WizardController() {
  const { currentStep } = useWizard();

  return (
    <div className="w-full max-w-5xl mx-auto">
      
      {/* 🚀 The Progress Bar is now wired in! */}
      <WizardProgress />

      <div className="mt-8">
        {currentStep === 1 && <Step1Basics />}
        {currentStep === 2 && <Step2Network />}
        {currentStep === 3 && <Step3Vibe />}
        {currentStep === 4 && <Step4Scope />}
        {currentStep === 5 && <Step5Pledge />} {/* 🚀 UPDATED: Rendering the new component! */}
      </div>
    </div>
  );
}

// 2. THE WRAPPER (Injects the Brain into the Switchboard)
export default function StorefrontWizard() {
  return (
    <WizardProvider>
      <WizardController />
    </WizardProvider>
  );
}