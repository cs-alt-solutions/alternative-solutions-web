import React from 'react';
import StrategicBuildPlanner from '@/components/planner/StrategicBuildPlanner';
import { Directive } from '@/utils/glossary';

// This would eventually be a database call
const mockTasks: Directive[] = [
  {
    id: 1,
    goalId: 'goal_website',
    title: 'Finalize Architecture.md Integration',
    priority: 'high',
    status: 'pending',
    classification: 'Architecture'
  }
];

export default function TasksPage() {
  return (
    <div className="p-4">
      {/* Passing initialTasks to the client component */}
      <StrategicBuildPlanner initialTasks={mockTasks} />
    </div>
  );
}