/* src/components/planner/StrategicPlannerClient.tsx */
'use client';

import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import AiBriefingPanel from './AiBriefingPanel';
import VelocityStats from './VelocityStats';
import WeeklyFlowWheel from './WeeklyFlowWheel';
import TransmissionPanel from './TransmissionPanel';
import DailyDebriefPanel from './DailyDebriefPanel';
import IdeasLedgerPanel from './IdeasLedgerPanel';

interface StrategicPlannerProps {
  initialData: any;
  ideasLedger: any[];
  weekFlow: any[];
}

/**
 * STRATEGIC PLANNER CLIENT
 * Orchestrates the Build sequence UI.
 * Fix: Removed redundant props to children and locked the 12-column grid layout.
 */
export default function StrategicPlannerClient({ 
  initialData, 
  ideasLedger, 
  weekFlow 
}: StrategicPlannerProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;

  return (
    <div className="w-full max-w-[1600px] mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700">
      
      {/* GRID CONTAINER: Establishes the Command Desk layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTEL & VELOCITY (8/12 Width) */}
        <div className="xl:col-span-8 space-y-8">
          <div className="grid grid-cols-1 gap-8">
            <AiBriefingPanel copy={copy} hasActiveDraft={!!initialData} />
            <VelocityStats copy={copy} />
            <WeeklyFlowWheel copy={copy} flow={weekFlow} />
          </div>
        </div>

        {/* RIGHT COLUMN: THE TRANSMISSION HUB (4/12 Width) */}
        <div className="xl:col-span-4 space-y-8">
          <div className="flex flex-col gap-8">
            <TransmissionPanel 
              copy={copy} 
              draftTitle={initialData?.title || "ARCHITECT_LOG_INITIALIZING..."} 
            />
            <IdeasLedgerPanel copy={copy} ledger={ideasLedger} />
          </div>
        </div>
      </div>

      {/* FOOT ROW: FULL WIDTH DEBRIEF */}
      <div className="w-full">
        <DailyDebriefPanel copy={copy} />
      </div>
      
    </div>
  );
}