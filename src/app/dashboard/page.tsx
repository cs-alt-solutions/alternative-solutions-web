/* src/app/dashboard/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import DailyDirectivePanel from '@/components/workspace/DailyDirectivePanel';
import NetworkPulse from '@/components/workspace/NetworkPulse';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import PlatformTrackerPanel from '@/components/workspace/PlatformTrackerPanel';
import TelemetryPanel from '@/components/workspace/TelemetryPanel';

/**
 * DASHBOARD OVERVIEW (COMMAND CENTER)
 * High-level system telemetry. 
 * Fix: Explicitly passing arrays to children to prevent 'undefined' crashes.
 */
export default function DashboardOverview() {
  const copy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;

  // Placeholder arrays to keep the UI stable while we wire up the DB fetches
  const systemProjects: any[] = [];
  const priorityQueue: any[] = [];
  const dailyDirectives: any[] = [];
  const networkFeed: any[] = [];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* MISSION CRITICAL OVERWATCH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DailyDirectivePanel 
            copy={copy.DIRECTIVE} 
            items={dailyDirectives} 
          />
        </div>
        <div className="lg:col-span-1">
          <NetworkPulse 
            copy={copy.LIVE_FEED} 
            feed={networkFeed} 
          />
        </div>
      </div>

      {/* OPERATIONS & INFRASTRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PriorityQueuePanel 
            copy={copy.PANELS.ACTION_REQD} 
            commonCopy={commonCopy}
            queue={priorityQueue} 
          />
        </div>
        <div className="lg:col-span-2">
          <EngineeringPanel 
            copy={copy.PANELS.ENGINEERING} 
            projects={systemProjects} 
          />
        </div>
        <div className="lg:col-span-1">
          <PlatformTrackerPanel copy={copy.INFRASTRUCTURE} />
        </div>
      </div>

      {/* SYSTEM TELEMETRY */}
      <TelemetryPanel copy={copy.TELEMETRY} />
    </div>
  );
}