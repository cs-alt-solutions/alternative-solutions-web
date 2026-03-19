/* src/app/dashboard/broadcast/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Radio } from 'lucide-react';

import BroadcastTabs from '@/components/dashboard/broadcast/BroadcastTabs';

export const revalidate = 0;

export default async function BroadcastHub() {
  const hubCopy = WEBSITE_COPY.DASHBOARD.MEDIA_HUB;
  
  // Fetch data ONCE on the initial server load
  const { data: episodes } = await supabase
    .from('audio_logs')
    .select('*')
    .order('created_at', { ascending: false });

  const activeCount = episodes?.filter(e => e.status === 'ACTIVE').length || 0;

  return (
    <div className="p-8 relative max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/5 pb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Radio className="text-brand-primary animate-pulse" size={16} />
            <span className="text-xs font-mono tracking-[0.2em] text-brand-primary uppercase">
              {hubCopy.SUBTITLE}
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">
            {hubCopy.TITLE}
          </h1>
        </div>
      </header>

      {/* Pure Client-Side Tab Switching for Instant Performance */}
      <BroadcastTabs episodes={episodes || []} activeCount={activeCount} />
      
    </div>
  );
}