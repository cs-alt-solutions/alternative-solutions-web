/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import StrategicPlannerClient from '@/components/planner/StrategicPlannerClient';

export default async function StrategicPlannerPage() {
  // Fetch data directly from Supabase for the Build Hub
  const { data: draftData } = await supabase
    .from('weekly_drafts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: ideasLedger } = await supabase.from('ideas_ledger').select('*');
  const { data: weekFlow } = await supabase.from('weekly_flow').select('*');

  return (
    <main className="min-h-screen bg-bg-app">
      <StrategicPlannerClient 
        initialData={draftData?.[0] || null} 
        ideasLedger={ideasLedger || []} 
        weekFlow={weekFlow || []} 
      />
    </main>
  );
}