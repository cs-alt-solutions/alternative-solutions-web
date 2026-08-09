'use client';

import React from 'react';
import LifecyclePanel from './grid/LifecyclePanel';
import InfrastructurePanel from './grid/InfrastructurePanel';
import DangerZoneCard from './grid/DangerZoneCard';
import AuditLedger from './staging/AuditLedger'; // Reaching into staging to grab the timeline

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
      
      {/* TOP ROW: The Cockpit (Side-by-Side) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start mb-6 lg:mb-8">
        <LifecyclePanel formData={formData} setFormData={setFormData} />
        <InfrastructurePanel formData={formData} setFormData={setFormData} />
      </div>

      {/* BOTTOM ROW: The Timeline & The Failsafe (Stacked Full-Width) */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8">
        <AuditLedger formData={formData} />
        <DangerZoneCard {...({ formData, onTerminate } as any)} />
      </div>

    </div>
  );
}