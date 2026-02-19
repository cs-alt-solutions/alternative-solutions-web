/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import StrategicPlannerClient from '@/components/planner/StrategicPlannerClient';

// This is the "Nuclear Option" for caching - it forces a fresh look on every request
export const dynamic = 'force-dynamic';
export const revalidate = 0; 

export default async function StrategicPlannerPage() {
  // We add { cache: 'no-store' } logic implicitly by using the supabase client 
  // with the dynamic flag above.
  
  const { data: draftData } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'DRAFT')
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: directiveData } = await supabase
    .from('ideas_ledger')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <StrategicPlannerClient 
      initialDraft={draftData?.[0] || null} 
      initialLedger={directiveData || []} 
    />
  );
}