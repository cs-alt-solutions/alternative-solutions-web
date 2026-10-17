'use client';

import React, { createContext, useContext, useState } from 'react';

export interface WizardData {
  name: string;
  email: string;
  businessName: string;
  
  // Step 2: Network
  activeSocials: Record<string, boolean>;
  socialHandles: Record<string, string>;

  // Step 3: Scope
  targetPlan: string;
  customDomain: string; 
  priorityQueue: boolean; 
  isPledged: boolean; 
}

interface WizardContextType {
  formData: WizardData;
  updateForm: (updates: Partial<WizardData>) => void;
  currentStep: number;
  totalSteps: number; 
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; 
  
  const [formData, setFormData] = useState<WizardData>({
    name: '', 
    email: '', 
    businessName: '', 
    activeSocials: {}, 
    socialHandles: {},
    targetPlan: 'standard',
    customDomain: '', 
    priorityQueue: false, 
    isPledged: false,
  });

  const updateForm = (updates: Partial<WizardData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const setStep = (step: number) => setCurrentStep(step);

  return (
    <WizardContext.Provider value={{ formData, updateForm, currentStep, totalSteps, nextStep, prevStep, setStep }}>
      {children}
    </WizardContext.Provider>
  );
}

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within a WizardProvider');
  return context;
};