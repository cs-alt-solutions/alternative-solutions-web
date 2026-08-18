'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Radio, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function NetworkPulse() {
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('storefronts')
        .select('id, business_name, status, stripe_subscription_id, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (data) setRecentActivity(data);
      setIsLoading(false);
    };

    fetchActivity();
  }, []);

  return (
    <div className="bg-black/40 border border-white/5 rounded-2xl p-6 backdrop-blur-sm shadow-xl group hover:border-cyan-500/20 transition-all h-full">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
        <Radio size={18} className="text-amber-500" />
        <h2 className="text-sm font-bold text-white uppercase tracking-widest">Live Network Activity</h2>
        <span className="ml-auto text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Syncing
        </span>
      </div>
      
      <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-75 pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            No recent network activity logged.
          </div>
        ) : (
          recentActivity.map((activity, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 shrink-0">
                  {activity.stripe_subscription_id ? <ShieldCheck size={14} className="text-emerald-400" /> : <Zap size={14} className="text-amber-400" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white tracking-wide truncate max-w-37.5">{activity.business_name}</h4>
                  <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-0.5">
                    Status: <span className={activity.status === 'ACTIVE' || activity.status === 'LIVE' ? 'text-emerald-400' : 'text-amber-400'}>{activity.status}</span>
                  </p>
                </div>
              </div>
              <Link 
                href={`/dashboard/storefronts/${activity.id}`}
                className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 transition-colors shrink-0"
              >
                Hub <ArrowRight size={12} />
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}