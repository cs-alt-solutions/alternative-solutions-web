/* src/app/dashboard/analytics/page.tsx */
import React from 'react';
import LiveTrafficModule from '@/components/dashboard/analytics/LiveTrafficModule';

export const dynamic = 'force-dynamic';

export default function LiveTrafficPage() {
  return (
    <div className="w-full px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          Live Traffic & Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
          Edge traffic across HQ, hosted storefronts, and client portal logins.
        </p>
      </div>

      <LiveTrafficModule />
    </div>
  );
}