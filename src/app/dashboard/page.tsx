// src/app/dashboard/page.tsx
import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { WEBSITE_COPY } from '@/utils/glossary';

// Components located in the central dashboard overview directory
import StorefrontIntakePanel, { ApplicationItem } from '@/components/dashboard/overview/StorefrontIntakePanel';
import NetworkPulse from '@/components/dashboard/overview/NetworkPulse';
import PriorityQueuePanel from '@/components/dashboard/overview/PriorityQueuePanel';
import TelemetryRow from '@/components/dashboard/overview/TelemetryRow';
import ActiveClientRequests from '@/components/dashboard/overview/ActiveClientRequests';
import PlatformTrackerPanel from '@/components/dashboard/overview/PlatformTrackerPanel';

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const copy = WEBSITE_COPY.DASHBOARD.OVERVIEW;

  // 1. FETCH PENDING STOREFRONT APPLICATIONS
  let recentLeads: ApplicationItem[] = [];
  try {
    const { data: applications, error } = await supabase
      .from('storefront_applications')
      .select('*')
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && applications) {
      recentLeads = applications.map((app) => ({
        id: app.id,
        type: 'LEAD',
        title: app.business_name || 'New Application',
        subtitle: app.contact_email,
        created_at: app.created_at,
        link: `/dashboard/storefronts?application=${app.id}`,
        is_priority: app.is_priority
      }));
    }
  } catch (err) {
    console.error("Failed to fetch pending applications:", err);
  }

  // 2. FETCH RECENT SUPPORT TICKETS FOR THE RADAR
  let supportRequests: any[] = [];
  try {
    const { data: tickets } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false });

    if (tickets) {
      supportRequests = tickets;
    }
  } catch (err) {
    console.error("Failed to fetch support tickets:", err);
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      
      {/* VISUAL HERO HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight uppercase">
            {copy.TITLE}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">Operational Command Center</p>
        </div>
        <div className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800 px-3 py-1.5 rounded-full">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase">System Online</span>
        </div>
      </div>

      {/* 🚀 MOBILE-FIRST PRIORITY ROW: TELEMETRY (MRR & Pay Signals) */}
      <div className="w-full">
        <TelemetryRow />
      </div>

      {/* THE MAIN GRID ARCHITECTURE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Storefront Applications & Waiting Room */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-fuchsia-500 to-cyan-500" />
            <StorefrontIntakePanel items={recentLeads} copy={copy.DIRECTIVE} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PriorityQueuePanel queue={[]} copy={WEBSITE_COPY.DASHBOARD.BETA_COMMAND} commonCopy={WEBSITE_COPY.DASHBOARD.COMMON} />
          </div>
        </div>

        {/* RIGHT COLUMN: Client Request Radar (Moved Up for Mobile Visibility) & Infrastructure */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-black/40 border border-amber-500/20 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
            <ActiveClientRequests requests={supportRequests} />
          </div>
          <PlatformTrackerPanel copy={copy.INFRASTRUCTURE} />
          <NetworkPulse />
        </div>

      </div>
    </div>
  );
}