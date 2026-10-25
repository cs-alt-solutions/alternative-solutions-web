/* src/app/dashboard/tasks/page.tsx */
import React from 'react';
import TasksManager from '@/components/dashboard/tasks/TasksManager';

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  return (
    // Removed max-w-7xl and mx-auto so it spans the full available width
    <div className="p-4 sm:p-6 lg:p-8 w-full h-full overflow-y-auto custom-scrollbar">
      <TasksManager />
    </div>
  );
}