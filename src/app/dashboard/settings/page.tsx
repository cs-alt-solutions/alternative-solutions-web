/* src/app/dashboard/settings/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import TaskLibraryManager from '@/components/dashboard/settings/TaskLibraryManager';
import TaskAutomations from '@/components/dashboard/settings/TaskAutomations';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const copy = WEBSITE_COPY.DASHBOARD.COMMON;

  return (
    // Removed max-w-5xl and mx-auto so it spans the full available width
    <div className="p-4 md:p-8 w-full space-y-8 animate-in fade-in duration-500 pb-20 h-full overflow-y-auto custom-scrollbar">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
            System Admin
          </h1>
          <p className="text-zinc-400 mt-1">Configure global triggers and backend rules.</p>
        </div>
      </div>

      <div className="space-y-8">
        <TaskLibraryManager />
        <TaskAutomations />
      </div>
      
    </div>
  );
}