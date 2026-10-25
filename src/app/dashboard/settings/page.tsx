/* src/app/dashboard/settings/page.tsx */
import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import TaskLibraryManager from '@/components/dashboard/settings/TaskLibraryManager';
import TaskAutomations from '@/components/dashboard/settings/TaskAutomations';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  const copy = WEBSITE_COPY.DASHBOARD.COMMON;

  return (
    <div className="p-4 md:p-8 w-full animate-in fade-in duration-500 pb-20 h-full overflow-y-auto custom-scrollbar">
      
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pb-6 mb-8 border-b border-zinc-800">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
            System Admin
          </h1>
          <p className="text-zinc-400 mt-1">Configure global triggers and backend rules.</p>
        </div>
      </div>

      {/* 🚀 THE FIX: Reverted back to a clean, full-width vertical stack */}
      <div className="flex flex-col gap-8 w-full">
        <TaskLibraryManager />
        <TaskAutomations />
      </div>
      
    </div>
  );
}