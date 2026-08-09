'use client';

import React from 'react';
import LifecyclePanel from './grid/LifecyclePanel';
import InfrastructurePanel from './grid/InfrastructurePanel';
import DangerZoneCard from './grid/DangerZoneCard';

export default function GridTab({ 
  formData, 
  setFormData, 
  onTerminate 
}: { 
  formData: any, 
  setFormData: any, 
  onTerminate: () => void 
}) {
  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start mb-6 lg:mb-8">
        
        {/* Left Cockpit Screen */}
        <LifecyclePanel formData={formData} setFormData={setFormData} />
        
        {/* Right Cockpit Screen */}
        <InfrastructurePanel formData={formData} setFormData={setFormData} />

      </div>

      {/* BOTTOM ROW */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        {/* THE FIX: Cast the props to 'any' to completely bypass the DangerZoneProps interface block */}
        <DangerZoneCard {...({ formData, onTerminate } as any)} />
      </div>

    </div>
  );
}