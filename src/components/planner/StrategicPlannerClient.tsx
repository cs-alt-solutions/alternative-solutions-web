/* src/components/planner/StrategicPlannerClient.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { Task } from '@/types';
import VelocityStats from './VelocityStats';
import AiBriefingPanel from './AiBriefingPanel';
import WeeklyFlowWheel from './WeeklyFlowWheel';
import IdeasLedgerPanel from './IdeasLedgerPanel';
import DailyDebriefPanel from './DailyDebriefPanel';
import TransmissionPanel from './TransmissionPanel';
import LogDirectiveModal from './LogDirectiveModal';
import { Plus, LayoutDashboard, Calendar } from 'lucide-react';

interface StrategicPlannerClientProps {
  initialTasks: Task[];
}

export default function StrategicPlannerClient({ initialTasks }: StrategicPlannerClientProps) {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Logic: Separate ledger ideas from scheduled flow tasks
  const ledgerTasks = useMemo(() => 
    tasks.filter(t => !t.scheduled_date || t.priority === 'Low'), 
  [tasks]);

  const activeTasks = useMemo(() => 
    tasks.filter(t => t.scheduled_date && t.status !== 'Done'), 
  [tasks]);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">
            {copy.TITLE}
          </h1>
          <p className="text-text-muted text-xs font-mono uppercase tracking-[0.3em] mt-2">
            {copy.SUBTITLE}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-black/40 border border-white/5 p-1 rounded-lg">
            <button 
              onClick={() => setView('WEEKLY')}
              className={`px-4 py-2 rounded text-[10px] font-mono uppercase transition-all ${view === 'WEEKLY' ? 'bg-brand-primary text-black font-bold' : 'text-white/40'}`}
            >
              <LayoutDashboard size={14} className="inline mr-2" /> {copy.TABS.WEEKLY}
            </button>
            <button 
              onClick={() => setView('MONTHLY')}
              className={`px-4 py-2 rounded text-[10px] font-mono uppercase transition-all ${view === 'MONTHLY' ? 'bg-brand-primary text-black font-bold' : 'text-white/40'}`}
            >
              <Calendar size={14} className="inline mr-2" /> {copy.TABS.MONTHLY}
            </button>
          </div>

          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold text-[10px] font-mono uppercase hover:bg-brand-primary transition-all"
          >
            <Plus size={16} /> {copy.BTN_ADD}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4">
          <VelocityStats copy={copy.VELOCITY} />
        </div>
        <div className="lg:col-span-8">
          <AiBriefingPanel copy={copy.AI_BRIEF} hasActiveDraft={false} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-bg-surface-100 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
            <h3 className="text-[10px] font-mono text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              {copy.SECTIONS.BUILD}
            </h3>
            <WeeklyFlowWheel 
              copy={copy.PLACEHOLDERS} 
              days={['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
          </div>
          <TransmissionPanel copy={copy.ACTIONS} draftTitle="Current Transmission Alpha" />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <IdeasLedgerPanel copy={copy.SECTIONS} tasks={ledgerTasks} />
          <DailyDebriefPanel 
            copy={copy.SECTIONS} 
            tasks={activeTasks} 
            onTaskUpdate={handleTaskUpdate} 
          />
        </div>
      </div>

      <LogDirectiveModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}