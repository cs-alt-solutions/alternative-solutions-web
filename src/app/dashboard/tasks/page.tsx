/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase'; //
import StrategicPlannerClient from '@/components/planner/StrategicPlannerClient';

export default async function StrategicPlannerPage() {
  // 1. Fetch Ideas Ledger (Backlog)
  const { data: ideasLedger } = await supabase
    .from('ideas_ledger')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. Fetch Active Audio Log Draft for the week
  const { data: activeLog } = await supabase
    .from('audio_logs')
    .select('*')
    .eq('status', 'DRAFT')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  // 3. Transform data for the Flow Wheel (Placeholder logic for current week)
  const weekFlow = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => ({
    day,
    status: 'OPTIMAL',
    date: '',
    lifeEvents: [],
    tasks: ideasLedger?.filter(task => task.scheduled_date === day) || []
  }));

  return (
    <StrategicPlannerClient 
      initialData={activeLog} 
      ideasLedger={ideasLedger || []}
      weekFlow={weekFlow}
    />
  );
}