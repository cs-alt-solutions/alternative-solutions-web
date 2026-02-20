/* src/components/workspace/NetworkPulse.tsx */
'use client';

import React from 'react';
import { Activity, Radio } from 'lucide-react';

interface NetworkPulseProps {
  copy: any;
  feed?: any[]; // Optional to prevent crashes
}

/**
 * NETWORK PULSE
 * Logic: Monitors real-time system activity.
 * Fix: Added a default empty array for 'feed' to prevent .length errors.
 */
export default function NetworkPulse({ copy, feed = [] }: NetworkPulseProps) {
  // If no activity, we display an idle state instead of crashing or returning null
  const hasActivity = feed && feed.length > 0;

  return (
    <section className="bg-black/30 border border-white/5 rounded-xl p-6 group hover:border-brand-primary/20 transition-all">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
          <Activity size={12} className="text-brand-primary" /> {copy.TITLE}
        </h3>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-primary/5 border border-brand-primary/10 text-[8px] font-mono text-brand-primary uppercase tracking-widest">
          <Radio size={10} className={hasActivity ? "animate-pulse" : ""} /> 
          {hasActivity ? "LIVE_TRAFFIC" : "SYSTEM_IDLE"}
        </div>
      </div>

      <div className="min-h-32 flex flex-col items-center justify-center border border-dashed border-white/5 rounded-lg text-center p-8">
        {!hasActivity ? (
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
            {copy.NEW_BETA || "WAITING_FOR_PULSE..."}
          </p>
        ) : (
          <div className="w-full space-y-3">
             {/* Future: Map through network events here */}
          </div>
        )}
      </div>
    </section>
  );
}