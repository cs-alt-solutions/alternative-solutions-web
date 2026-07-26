// src/components/storefront/staging-review/StagingReviewOverlay.tsx
'use client';

import React, { useState } from 'react';
import { StorefrontAuditData, AUDIT_ROADMAP } from './types';
import StagingMinimizedBadge from './StagingMinimizedBadge';
import StagingSuccessCard from './StagingSuccessCard';
import StagingAuditCard from './StagingAuditCard';

export interface StagingReviewOverlayProps {
  store: StorefrontAuditData;
}

export default function StagingReviewOverlay({ store }: StagingReviewOverlayProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [sectionNotes, setSectionNotes] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const steps = AUDIT_ROADMAP;

  const scrollToSection = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      const offsets: { [key: number]: number } = { 0: 0, 1: 800, 2: 1600, 3: 2400, 4: 3200 };
      window.scrollTo({ top: offsets[currentStep] || 0, behavior: 'smooth' });
    }
  };

  const handleToggleCheck = () => {
    if (completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => prev.filter(i => i !== currentStep));
    } else {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
  };

  const handleNextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps(prev => [...prev, currentStep]);
    }
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      scrollToSection(steps[nextStep].targetId);
    }
  };

  const handleNoteChange = (text: string) => {
    setSectionNotes(prev => ({ ...prev, [currentStep]: text }));
  };

  const handleSubmitAudit = async (status: 'APPROVED' | 'CHANGES_REQUESTED') => {
    setIsSubmitting(true);
    // Wire up server action transmission here in your next development cycle
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 flex justify-end">
      {isSubmitted ? (
        <StagingSuccessCard onDismiss={() => setIsMinimized(true)} />
      ) : isMinimized ? (
        <StagingMinimizedBadge
          completedCount={completedSteps.length}
          totalSteps={steps.length}
          onExpand={() => setIsMinimized(false)}
        />
      ) : (
        <StagingAuditCard
          step={steps[currentStep]}
          currentStepIndex={currentStep}
          totalSteps={steps.length}
          isCompleted={completedSteps.includes(currentStep)}
          note={sectionNotes[currentStep] || ''}
          isSubmitting={isSubmitting}
          onToggleCheck={handleToggleCheck}
          onNoteChange={handleNoteChange}
          onNextStep={handleNextStep}
          onSubmitAudit={handleSubmitAudit}
          onMinimize={() => setIsMinimized(true)}
          completedSteps={completedSteps}
        />
      )}
    </div>
  );
}