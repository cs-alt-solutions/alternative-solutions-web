/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import StrategicPlannerClient from '@/components/planner/StrategicPlannerClient';
import { DayFlow } from '@/types';
import { unstable_noStore as noStore } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0; 

const INITIAL_WEEK: DayFlow[] = [
  { day: 'MON', status: 'ACTIVE', date: 'Feb 23', lifeEvents: ['Doctor Appt (10am)'], tasks: [] },
  { day: 'TUE', status: 'PENDING', date: 'Feb 24', lifeEvents: ['Laundry/House'], tasks: [] },
  { day: 'WED', status: 'PENDING', date: 'Feb 25', lifeEvents: [], tasks: [] },
  { day: 'THU', status: 'PENDING', date: 'Feb 26', lifeEvents: ['Errands'], tasks: [] },
  { day: 'FRI', status: 'PENDING', date: 'Feb 27', lifeEvents: [], tasks: [] }
];

export default async function StrategicPlannerPage() {
  noStore(); // THE NUCLEAR OPTION: Completely disables Next.js caching for this route.

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

  const rawLedger = directiveData || [];

  const ideasLedger = rawLedger
    .filter(task => task.scheduled_date === null)
    .map(task => ({
      id: task.id,
      title: task.title,
      type: task.type || 'FEATURE',
      time: 'TBD',
      reflection: task.description || '',
      status: task.status || 'BACKLOG'
    }));

  const weekFlow = INITIAL_WEEK.map(dayObj => {
    const tasksForDay = rawLedger
      .filter(task => {
        if (!task.scheduled_date) return false;
        const taskDayName = new Date(task.scheduled_date)
          .toLocaleDateString('en-US', { weekday: 'short' })
          .toUpperCase();
        return taskDayName === dayObj.day;
      })
      .map(task => ({
        id: task.id,
        title: task.title,
        type: task.type || 'FEATURE',
        time: 'TBD',
        reflection: task.description || '',
        status: task.status || 'BACKLOG'
      }));
    return { ...dayObj, tasks: tasksForDay };
  });

  return (
    <StrategicPlannerClient 
      initialDraft={draftData?.[0] || null} 
      ideasLedger={ideasLedger}
      weekFlow={weekFlow}
    />
  );
}