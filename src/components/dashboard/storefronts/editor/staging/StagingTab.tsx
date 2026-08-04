/* src/components/dashboard/storefronts/editor/staging/StagingTab.tsx */
'use client';

import React from 'react';
import DispatchCannon from './DispatchCannon';
import AuditLedger from './AuditLedger';

export default function StagingTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  return (
    <div className="w-full h-full p-6 md:p-8 lg:p-12 overflow-y-auto custom-scrollbar">
      <div className="w-full h-full">
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">
          <div className="w-full h-full">
            <DispatchCannon formData={formData} setFormData={setFormData} />
          </div>
          <div className="w-full h-full">
            <AuditLedger formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}