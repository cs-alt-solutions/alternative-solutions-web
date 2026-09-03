/* src/app/dashboard/page.tsx */
import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { WEBSITE_COPY } from '@/utils/glossary';

import StorefrontIntakePanel, { ApplicationItem } from '@/components/dashboard/overview/StorefrontIntakePanel';
import PriorityQueuePanel from '@/components/dashboard/overview/PriorityQueuePanel';
import PlatformTrackerPanel from '@/components/dashboard/overview/PlatformTrackerPanel';
import TelemetryRow from '@/components/dashboard/overview/TelemetryRow';
import NetworkPulse from '@/components/dashboard/overview/NetworkPulse';
import ActiveClientRequests from '@/components/dashboard/overview/ActiveClientRequests'; 

export const dynamic = 'force-dynamic';

export default async function DashboardOverview() {
  const supabase = await createClient();
  const copy = WEBSITE_COPY.DASHBOARD.OVERVIEW;

  let recentLeads: ApplicationItem[] = [];
  try {
    const { data: applications, error } = await supabase
      .from('storefront_applications') 
      .select('*')
      .eq('status', 'PENDING')
      .order('is_priority', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: true })
      .limit(6); 

    if (!error && applications) {
      recentLeads = applications.map((app) => ({
        id: app.id,
        type: 'LEAD',
        title: app.business_name || 'New Application',
        subtitle: app.contact_email,
        created_at: app.created_at,
        is_priority: app.is_priority, 
        link: `/dashboard/storefronts?application=${app.id}`
      }));
    }
  } catch (err) {
    console.error("Failed to fetch pending applications:", err);
  }

  // The Two-Step Manual Join
  let activeRequests: any[] = [];
  try {
    const { data: tickets, error } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (error) throw error;

    if (tickets && tickets.length > 0) {
      const storefrontIds = [...new Set(tickets.map(t => t.storefront_id))];

      const { data: storefrontsData } = await supabase
        .from('storefronts')
        .select('id, business_name')
        .in('id', storefrontIds);

      const storefrontMap = storefrontsData?.reduce((acc: any, curr: any) => {
        acc[curr.id] = curr.business_name;
        return acc;
      }, {});

      activeRequests = tickets.map(t => ({
        ...t,
        storefronts: { business_name: storefrontMap?.[t.storefront_id] || 'Client Workspace' }
      }));
    }
  } catch (err) {
    console.error("Failed to fetch client requests:", err);
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
            {copy.TITLE}
          </h1>
          <p className="text-zinc-400 mt-1">Welcome back. Here is your operational status.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-emerald-500 tracking-widest uppercase">System Online</span>
        </div>
      </div>

      <TelemetryRow />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: The Primary Focus */}
        <div className="xl:col-span-8 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-fuchsia-500 to-cyan-500" />
            <StorefrontIntakePanel items={recentLeads} copy={copy.DIRECTIVE} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NetworkPulse />
            <PriorityQueuePanel queue={[]} copy={WEBSITE_COPY.DASHBOARD.BETA_COMMAND} commonCopy={WEBSITE_COPY.DASHBOARD.COMMON} />
          </div>
        </div>

        {/* RIGHT COLUMN: Infrastructure & Radars */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* 🚀 MOVED: Client Request Radar */}
          <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in slide-in-from-top-4">
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-500 to-orange-500" />
            <ActiveClientRequests requests={activeRequests} />
          </div>

          <PlatformTrackerPanel copy={copy.INFRASTRUCTURE} />
        </div>

      </div>
    </div>
  );
}