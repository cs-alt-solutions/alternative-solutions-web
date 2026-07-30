'use client';
import React from 'react';
import DispatchCannon from './DispatchCannon';
import AuditLedger from './AuditLedger';

export default function StagingTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  return (
    <div className="w-full h-full p-4 md:p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="w-full max-w-450 mx-auto h-full min-h-175">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-300 h-full">
          <div className="h-full">
            <DispatchCannon formData={formData} setFormData={setFormData} />
          </div>
          <div className="h-full">
            <AuditLedger formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}