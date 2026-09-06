/* src/app/dashboard/broadcast/page.tsx */
import React from 'react';
import { createClient } from '@/utils/supabase/server';
import { Radio } from 'lucide-react';
import DispatchManager from '@/components/dashboard/broadcast/DispatchManager';

export const revalidate = 0;

export default async function BroadcastHub() {
  const supabase = await createClient();
  
  // Fetch all global platform updates
  const { data: updates } = await supabase
    .from('platform_updates')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-4 md:p-8 relative max-w-7xl mx-auto w-full animate-in fade-in duration-500 pb-24">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="text-cyan-400 animate-pulse" size={16} />
            <span className="text-xs font-mono tracking-[0.2em] text-cyan-400 uppercase">
              Global Notifications
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white uppercase">
            Platform Dispatch
          </h1>
        </div>
      </header>

      <DispatchManager initialUpdates={updates || []} />
    </div>
  );
}