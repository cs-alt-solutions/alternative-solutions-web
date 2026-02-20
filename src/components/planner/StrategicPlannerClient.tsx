/* src/components/planner/StrategicPlannerClient.tsx */
'use client';

import React, { useState } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import AiBriefingPanel from './AiBriefingPanel';
import VelocityStats from './VelocityStats';
import WeeklyFlowWheel from './WeeklyFlowWheel';
import TransmissionPanel from './TransmissionPanel';
import DailyDebriefPanel from './DailyDebriefPanel';
import IdeasLedgerPanel from './IdeasLedgerPanel';

interface DayFlow {
  day: string;
  status: string;
  date: string;
  lifeEvents: string[];
  tasks: any[];
}

interface StrategicPlannerProps {
  initialData: any;
  ideasLedger: any[];
  weekFlow: DayFlow[];
}

export default function StrategicPlannerClient({ 
  initialData, 
  ideasLedger, 
  weekFlow 
}: StrategicPlannerProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [selectedDay, setSelectedDay] = useState('MON');
  const currentDayData = weekFlow.find(d => d.day === selectedDay);

  return (
    <div className="w-full max-w-400 mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-700 font-sans">
      
      {/* COMMAND GRID: Industrial 8/4 Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: INTEL & VELOCITY (8/12) */}
        <div className="xl:col-span-8 space-y-8">
          <AiBriefingPanel copy={copy} hasActiveDraft={!!initialData} />
          <VelocityStats copy={copy} />
          <WeeklyFlowWheel 
            copy={copy} 
            days={weekFlow} 
            selectedDay={selectedDay} 
            onSelectDay={setSelectedDay} 
          />
        </div>

        {/* RIGHT COLUMN: THE TRANSMISSION HUB (4/12) */}
        <div className="xl:col-span-4 space-y-8">
          <TransmissionPanel 
            copy={copy} 
            draftTitle={initialData?.title || "LOG_INITIALIZING..."} 
          />
          {/* FIX: Passing 'ideas' to match the component's interface */}
          <IdeasLedgerPanel 
            copy={copy} 
            ideas={ideasLedger} 
          />
        </div>
      </div>

      {/* FOOT ROW: DAILY DEBRIEF */}
      <div className="w-full">
        <DailyDebriefPanel 
          copy={copy} 
          tasks={currentDayData?.tasks || []} 
          onTaskUpdate={() => {}} 
        />
      </div>
    </div>
  );
}