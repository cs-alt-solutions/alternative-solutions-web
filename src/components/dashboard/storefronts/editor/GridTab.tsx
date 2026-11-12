/* src/components/dashboard/storefronts/editor/GridTab.tsx */
'use client';

import React from 'react';
import LifecyclePanel from './grid/LifecyclePanel';
import InfrastructurePanel from './grid/InfrastructurePanel';
import DangerZoneCard from './grid/DangerZoneCard';
import AuditLedger from './staging/AuditLedger'; 
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
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
  const currentStatus = (formData.status as string) || 'PENDING_BUILD';
  const config = STOREFRONT_LIFECYCLE[currentStatus as StorefrontStatus] || STOREFRONT_LIFECYCLE['PENDING_BUILD'];
  const copy = EDITOR_WORKSPACE_COPY.GRID_TAB;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* CANVAS LOCK WARNING BANNER */}
      {config.isCanvasLocked && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-xl text-[11px] font-mono uppercase tracking-wider flex items-start sm:items-center gap-3 mb-6 lg:mb-8 shadow-[0_0_20px_rgba(245,158,11,0.05)]">
          <Lock size={16} className="shrink-0 mt-0.5 sm:mt-0" />
          <span className="leading-relaxed">
            <strong>{copy.LOCKED_PREFIX}</strong> {copy.LOCKED_MID} <strong className="text-white">{config.label}</strong> {copy.LOCKED_SUFFIX}
          </span>
        </div>
      )}

      {/* TOP ROW: The Cockpit (Side-by-Side) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 items-start mb-6 lg:gap-y-8">
        <LifecyclePanel formData={formData} setFormData={setFormData} />
        <InfrastructurePanel formData={formData} setFormData={setFormData} />
      </div>

      {/* BOTTOM ROW: The Timeline & The Failsafe (Stacked Full-Width) */}
      <div className="grid grid-cols-1 gap-6 lg:gap-8 mt-6 lg:mt-8">
        <AuditLedger formData={formData} />
        <DangerZoneCard onTerminate={onTerminate} />
      </div>
    </div>
  );
}