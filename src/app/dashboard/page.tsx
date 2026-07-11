import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { WEBSITE_COPY } from '@/utils/glossary';

// Import your existing dashboard components
import DailyDirectivePanel, { DirectiveItem } from '@/components/workspace/DailyDirectivePanel';
import NetworkPulse from '@/components/workspace/NetworkPulse';
import PriorityQueuePanel from '@/components/workspace/PriorityQueuePanel';
import EngineeringPanel from '@/components/workspace/EngineeringPanel';
import PlatformTrackerPanel from '@/components/workspace/PlatformTrackerPanel';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const copy = WEBSITE_COPY.DASHBOARD.OVERVIEW;

  // 1. FETCH THE SECTOR ZERO LEADS
  // Note: Ensure 'leads' matches the exact table name your server action writes to!
  let recentLeads: DirectiveItem[] = [];
  
  try {
    const { data: leads, error } = await supabase
      .from('sector_zero_leads') // <-- Verify this table name in your database
      .select('*')
      .eq('status', 'PENDING') // Only grab new/unprocessed ones
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && leads) {
      // Map the database rows into the format the Up Next panel expects
      recentLeads = leads.map((lead) => ({
        id: lead.id,
        type: 'LEAD',
        title: lead.name || 'New Sector Zero Applicant',
        subtitle: lead.email,
        link: `/dashboard/clients?lead=${lead.id}` // We'll route this to Client HQ later
      }));
    }
  } catch (err) {
    console.error("Failed to fetch leads:", err);
  }

  return (
    <div className="p-0 md:p-8 max-w-7xl mx-auto space-y-4 md:space-y-8 animate-in fade-in duration-500">
      
      {/* TOP ROW: Up Next (Leads) & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Inject the mapped leads directly into the panel */}
          <DailyDirectivePanel items={recentLeads} copy={copy.DIRECTIVE} />
        </div>
        <div className="lg:col-span-1">
          <NetworkPulse copy={copy.LIVE_FEED} feed={[]} />
        </div>
      </div>

      {/* BOTTOM ROW: Queue, Engineering, Tech Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <PriorityQueuePanel queue={[]} copy={WEBSITE_COPY.DASHBOARD.BETA_COMMAND} commonCopy={WEBSITE_COPY.DASHBOARD.COMMON} />
        <EngineeringPanel projects={[]} copy={copy} />
        <PlatformTrackerPanel copy={copy.INFRASTRUCTURE} />
      </div>
      
    </div>
  );
}