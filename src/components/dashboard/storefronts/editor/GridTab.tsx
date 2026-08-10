// src/components/dashboard/storefronts/editor/GridTab.tsx
'use client';

import React from 'react';
import LifecyclePanel from './grid/LifecyclePanel';
import InfrastructurePanel from './grid/InfrastructurePanel';
import DangerZoneCard from './grid/DangerZoneCard';
import AuditLedger from './staging/AuditLedger'; 
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { Lock } from 'lucide-react';

export default function GridTab({ 
  formData, 
  setFormData, 
  onTerminate 
}: { 
  formData: any, 
  setFormData: any, 
  onTerminate: () => void 
}) {
  
  // Safely grab the configuration for the current state to check if we are locked
  const currentStatus = (formData.status as StorefrontStatus) || 'BUILDING';
  const config = STOREFRONT_LIFECYCLE[currentStatus] || STOREFRONT_LIFECYCLE['BUILDING'];

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* THE FIX: CANVAS LOCK WARNING BANNER */}
      {config.isCanvasLocked && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-xl text-[11px] font-mono uppercase tracking-wider flex items-start sm:items-center gap-3 mb-6 lg:mb-8 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
          <Lock size={16} className="shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong>SYSTEM LOCKED:</strong> Project is currently in <strong className="text-white">{config.label}</strong> mode. Switch status back to "Building" to make architectural edits.
          </span>
        </div>
      )}

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