// src/components/dashboard/storefronts/editor/DesignTab.tsx
'use client';

import React from 'react';
import VisualArchitecture from './core/VisualArchitecture';

export default function DesignTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  
  // We keep the local handler, but it now updates the MASTER state in the parent
  const handleVisualSelect = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2 pt-6 relative">
      <VisualArchitecture 
        formData={formData} 
        handleVisualSelect={handleVisualSelect} 
        setFormData={setFormData} 
      />
    </div>
  );
}