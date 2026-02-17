/* src/components/PublicAudioLogs.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import AudioLogEntry from '@/components/AudioLogEntry';
import { supabase } from '@/utils/supabase';
import { Radio } from 'lucide-react';

export default async function PublicAudioLogs() {
  const copy = WEBSITE_COPY.PUBLIC_LOGS; 

  // Fetch only PUBLIC and ACTIVE logs
  const { data: audioLogs } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'ACTIVE')
    .eq('category', 'PUBLIC')
    .order('date', { ascending: false });

  if (!audioLogs || audioLogs.length === 0) return null; 

  return (
    <section className="relative z-10 w-full bg-black/40 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
      <div className="flex flex-col mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-mono uppercase tracking-widest text-brand-primary mb-4 w-fit">
          <Radio size={12} className="animate-pulse" />
          {copy.SUBHEAD}
        </div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-white mb-2">
          {copy.TITLE}
        </h2>
        <p className="text-text-muted text-sm font-light max-w-md">
          {copy.DESC}
        </p>
      </div>
      
      {/* Scrollable container so it doesn't break the layout if you upload 20 logs */}
      <div className="space-y-3 flex flex-col max-h-87.5 overflow-y-auto pr-2">
        {audioLogs.map((log: any) => (
          <div key={log.id} className="w-full">
             <AudioLogEntry log={log} />
          </div>
        ))}
      </div>
    </section>
  );
}