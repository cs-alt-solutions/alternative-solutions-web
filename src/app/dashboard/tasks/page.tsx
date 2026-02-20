/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import { supabase } from '@/utils/supabase';
import StrategicPlannerClient from '@/components/planner/StrategicPlannerClient';
import { Task } from '@/types';

export default async function StrategicPlannerPage() {
  // Fetching all directives from the ideas_ledger
  const { data: rawTasks } = await supabase
    .from('ideas_ledger')
    .select('*')
    .order('created_at', { ascending: false });

  // Mapping the database schema to our unified Task type
  const initialTasks: Task[] = (rawTasks || []).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority as 'Critical' | 'High' | 'Medium' | 'Low',
    status: task.status as 'BACKLOG' | 'IN_PROGRESS' | 'COMPLETED' | 'Done',
    assignee: 'Architect',
    scheduled_date: task.scheduled_date,
    phases: task.phases || []
  }));

  return (
    <main className="min-h-screen bg-bg-app">
      {/* FIX: Passing the consolidated initialTasks array instead of fragmented props */}
      <StrategicPlannerClient initialTasks={initialTasks} />
    </main>
  );
}