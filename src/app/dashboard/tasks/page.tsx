/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import StrategicPlannerClient from '@/components/planner/StrategicPlannerClient';

// Ensure this page NEVER caches stale data
export const dynamic = 'force-dynamic';

export default async function StrategicPlannerPage() {
  // 1. Fetch Active Draft
  const { data: draftData } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'DRAFT')
    .order('created_at', { ascending: false })
    .limit(1);

  // 2. Fetch Active Ledger
  const { data: directiveData } = await supabase
    .from('ideas_ledger')
    .select('*')
    .order('created_at', { ascending: false });

  // 3. Handoff to Client UI
  return (
    <StrategicPlannerClient 
      initialDraft={draftData?.[0] || null} 
      initialLedger={directiveData || []} 
    />
  );
}