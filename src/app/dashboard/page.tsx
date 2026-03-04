/* src/app/dashboard/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY, STRATEGIC_GOALS } from '@/utils/glossary';
import DailyDirectivePanel from '@/components/workspace/DailyDirectivePanel';
import NetworkPulse from '@/components/workspace/NetworkPulse';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import PlatformTrackerPanel from '@/components/workspace/PlatformTrackerPanel';
import TelemetryPanel from '@/components/workspace/TelemetryPanel';

export default async function DashboardOverview() {
  const copy = WEBSITE_COPY.DASHBOARD.OVERVIEW;
  const commonCopy = WEBSITE_COPY.DASHBOARD.COMMON;

  // Unified Parallel Fetch
  const [
    { data: directives },
    { data: projects },
    { data: pulse },
    { data: queue }
  ] = await Promise.all([
    supabase.from('ideas_ledger').select('*').eq('status', 'IN_PROGRESS').limit(5),
    supabase.from('projects').select('*').limit(3),
    supabase.from('pulse_log').select('*').order('timestamp', { ascending: false }).limit(10),
    supabase.from('waitlist').select('*').eq('status', 'PENDING').order('created_at', { ascending: false })
  ]);

  const mappedDirectives = (directives || []).map(d => ({
    ...d,
    type: d.classification || 'TASK',
    subtitle: STRATEGIC_GOALS[d.goal_id as keyof typeof STRATEGIC_GOALS]?.label || 'System',
    link: '/dashboard/tasks'
  }));

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <DailyDirectivePanel copy={copy.DIRECTIVE} items={mappedDirectives} />
        </div>
        <div className="lg:col-span-1">
          <NetworkPulse copy={copy.LIVE_FEED} feed={pulse || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <PriorityQueuePanel copy={copy.PANELS.ACTION_REQD} commonCopy={commonCopy} queue={queue || []} />
        </div>
        <div className="lg:col-span-2">
          <EngineeringPanel copy={copy.PANELS.ENGINEERING} projects={projects || []} />
        </div>
        <div className="lg:col-span-1">
          <PlatformTrackerPanel copy={copy.INFRASTRUCTURE} />
        </div>
      </div>
      <TelemetryPanel copy={copy.TELEMETRY} />
    </div>
  );
}