/* src/components/dashboard/foundation/WidgetsTab.tsx */
'use client';
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function WidgetsTab() {
  const copy = WEBSITE_COPY.DASHBOARD.FOUNDATION;
  
  return (
    <div className="bg-bg-surface-200/50 border border-white/5 rounded-2xl p-8 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-white mb-2">{copy.TABS.WIDGETS}</h2>
      <p className="text-slate-400 font-mono text-sm">
        Embed codes and public tracking links for your active builds will generate here.
      </p>
    </div>
  );
}