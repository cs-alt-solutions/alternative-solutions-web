'use client';

import React from 'react';
import { WizardProvider, useWizard } from './core/WizardContext';
import WizardProgress from './core/WizardProgress';

import Step1Basics from './Step1Basics';
import Step2Network from './Step2Network';
import Step3Scope from './Step3Scope';

function WizardController() {
  const { currentStep } = useWizard();

  return (
    <div className="w-full max-w-5xl mx-auto">
      <WizardProgress />
      <div className="mt-8">
        {currentStep === 1 && <Step1Basics />}
        {currentStep === 2 && <Step2Network />}
        {/* 🚀 FIXED: Pointed currentStep 3 to the actual component instead of 'null' */}
        {currentStep === 3 && <Step3Scope />}
      </div>
    </div>
  );
}

export default function StorefrontWizard() {
  return (
    <WizardProvider>
      <WizardController />
    </WizardProvider>
  );
}