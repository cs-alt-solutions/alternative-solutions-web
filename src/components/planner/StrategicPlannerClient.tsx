/* src/components/planner/StrategicPlannerClient.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WEBSITE_COPY } from '@/utils/glossary';
import { 
  ArrowLeft, Plus, Calendar, CalendarDays, ExternalLink,
  Coffee, Heart 
} from 'lucide-react';

import AiBriefingPanel from '@/components/planner/AiBriefingPanel';
import VelocityStats from '@/components/planner/VelocityStats';
import WeeklyFlowWheel from '@/components/planner/WeeklyFlowWheel';
import LogDirectiveModal from '@/components/planner/LogDirectiveModal';
import DailyDebriefPanel from '@/components/planner/DailyDebriefPanel';
import IdeasLedgerPanel from '@/components/planner/IdeasLedgerPanel';
import TransmissionPanel from '@/components/planner/TransmissionPanel';
import InitializeWeekModule from '@/components/planner/InitializeWeekModule';

interface DayFlow {
  day: string;
  status: string;
  date: string;
  lifeEvents: string[];
  tasks: any[];
}

const INITIAL_WEEK: DayFlow[] = [
  { day: 'MON', status: 'ACTIVE', date: 'Feb 23', lifeEvents: ['Doctor Appt (10am)'], tasks: [] },
  { day: 'TUE', status: 'PENDING', date: 'Feb 24', lifeEvents: ['Laundry/House'], tasks: [] },
  { day: 'WED', status: 'PENDING', date: 'Feb 25', lifeEvents: [], tasks: [] },
  { day: 'THU', status: 'PENDING', date: 'Feb 26', lifeEvents: ['Errands'], tasks: [] },
  { day: 'FRI', status: 'PENDING', date: 'Feb 27', lifeEvents: [], tasks: [] }
];

interface Props {
  initialDraft: any;
  initialLedger: any[];
}

export default function StrategicPlannerClient({ initialDraft, initialLedger }: Props) {
  const router = useRouter();
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  
  const [selectedDay, setSelectedDay] = useState('MON');
  const [activeTab, setActiveTab] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [activeDraft, setActiveDraft] = useState<any>(initialDraft);

  // 1. CACHE BUSTER: Forces Next.js to ping the server for fresh data when navigating here
  useEffect(() => {
    router.refresh();
  }, [router]);

  // 2. STATE SYNC: Keeps our client UI perfectly aligned with server data
  useEffect(() => {
    setActiveDraft(initialDraft);
  }, [initialDraft]);

  // 3. SYNCHRONOUS TRANSFORMS: No need for useEffect, we calculate on render
  const ideasLedger = initialLedger
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
    const tasksForDay = initialLedger
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

  const currentDayData = weekFlow.find(d => d.day === selectedDay);

  return (
    <div className="min-h-screen bg-bg-app text-text-main p-8 relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col pb-24">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-primary transition-all">
                <ArrowLeft size={16} />
              </Link>
              <div>
                 <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy.TITLE}</h1>
                 <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-1 block">{copy.SUBTITLE}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded text-xs font-mono uppercase font-bold text-black bg-brand-primary hover:bg-brand-primary/90 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              <Plus size={16} /> {copy.BTN_ADD}
            </button>
          </header>

          <nav className="flex items-center gap-2 mb-8 border-b border-white/10 pb-px">
            <button 
              onClick={() => setActiveTab('WEEKLY')} 
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'WEEKLY' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <Calendar size={14} /> {copy.TABS.WEEKLY}
            </button>
            <button 
              onClick={() => setActiveTab('MONTHLY')} 
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'MONTHLY' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-white/40 hover:text-white'}`}
            >
              <CalendarDays size={14} /> {copy.TABS.MONTHLY}
            </button>
          </nav>

          {activeTab === 'WEEKLY' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <aside className="lg:col-span-1 space-y-6">
                 <AiBriefingPanel 
                    copy={copy.AI_BRIEF} 
                    message={activeDraft ? "Active draft detected. All clear for transmissions." : "Awaiting weekly initialization to commence logging."} 
                    gamePlan={['Execute database sync', 'Clear active roadmap']}
                 />
                 <VelocityStats copy={copy.VELOCITY} savings="142 HOURS" freedom="24 HOURS KEPT" />
                 <IdeasLedgerPanel copy={copy.SECTIONS.IDEAS} ideas={ideasLedger} />
              </aside>

              <main className="lg:col-span-3 space-y-6">
                 <WeeklyFlowWheel days={weekFlow} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

                 {!activeDraft ? (
                   <InitializeWeekModule 
                      copy={copy.ZERO_STATE} 
                      onInitialized={(draft) => setActiveDraft(draft)} 
                   />
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <section>
                          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                            <Coffee size={12} /> {copy.SECTIONS.LIFESTYLE}
                          </h3>
                          <div className="space-y-2">
                            {currentDayData?.lifeEvents.length === 0 ? (
                               <div className="p-4 border border-dashed border-white/10 rounded-lg text-[10px] font-mono text-white/20 uppercase text-center">{copy.PLACEHOLDERS.CLEAR}</div>
                            ) : (
                              currentDayData?.lifeEvents.map((event, i) => (
                                <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-lg flex items-center justify-between">
                                  <span className="text-xs text-white/70 uppercase font-bold tracking-tight">{event}</span>
                                  <Heart size={14} className="text-brand-secondary/40" />
                                </div>
                              ))
                            )}
                          </div>
                        </section>

                        <DailyDebriefPanel 
                          tasks={currentDayData?.tasks || []} 
                          onTaskUpdate={() => { router.refresh(); }} 
                        />
                      </div>

                      <TransmissionPanel 
                        copy={copy} 
                        draftTitle={activeDraft.title} 
                      />
                   </div>
                 )}
              </main>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--brand-primary),transparent)] opacity-5" />
               <CalendarDays size={64} className="text-white/10 mb-6" />
               <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">{copy.TABS.MONTHLY}</h2>
               <p className="text-sm text-white/40 font-mono uppercase tracking-tight mb-8">{copy.PLACEHOLDERS.CAL_INIT}</p>
               <button className="flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 text-white/40 border border-white/10 font-mono text-xs uppercase tracking-widest hover:text-white hover:border-brand-primary transition-all">
                  <ExternalLink size={14} /> {copy.ACTIONS.SYNC}
               </button>
            </div>
          )}
       </div>

       <LogDirectiveModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}