/* src/components/PublicAudioLogs.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import AudioLogEntry from '@/components/AudioLogEntry';
import { supabase } from '@/utils/supabase';
import { Radio } from 'lucide-react';

export default async function PublicAudioLogs() {
  const copy = WEBSITE_COPY.PUBLIC_LOGS; //

  // Fetch only PUBLIC and ACTIVE logs
  const { data: audioLogs } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'ACTIVE')
    .eq('category', 'PUBLIC')
    .order('date', { ascending: false });

  if (!audioLogs || audioLogs.length === 0) return null; 

  return (
    <section className="py-24 relative z-10 w-full bg-bg-surface-50 border-t border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-mono uppercase tracking-widest text-brand-primary mb-6">
            <Radio size={12} className="animate-pulse" />
            {copy.SUBHEAD}
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white mb-4">
            {copy.TITLE}
          </h2>
          <p className="text-text-muted text-lg max-w-2xl font-light">{copy.DESC}</p>
        </div>
        <div className="space-y-4 flex flex-col items-center max-w-2xl mx-auto">
          {audioLogs.map((log: any) => (
            <div key={log.id} className="w-full">
               <AudioLogEntry log={log} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}