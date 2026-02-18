/* src/app/dashboard/tasks/page.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // FIXED: Swapped from react-router-dom to next/link
import { WEBSITE_COPY } from '@/utils/glossary';
import { 
  ArrowLeft, Plus, Calendar, CalendarDays, ExternalLink,
  Coffee, Activity, Lightbulb, MessageCircle, Mic, Share2, Heart, Clock, Zap
} from 'lucide-react';

import AiBriefingPanel from '@/components/planner/AiBriefingPanel';
import VelocityStats from '@/components/planner/VelocityStats';
import WeeklyFlowWheel from '@/components/planner/WeeklyFlowWheel';
import LogDirectiveModal from '@/components/planner/LogDirectiveModal';
import DailyDebriefPanel from '@/components/planner/DailyDebriefPanel';

// MOCK DATA: Ready to be swapped for Supabase useEffect hooks
const WEEK_FLOW = [
  { day: 'MON', status: 'ACTIVE', date: 'Feb 23', lifeEvents: ['Doctor Appt (10am)'], tasks: [{ id: '1', title: 'Small UI Fixes', type: 'BUG', time: '2h', reflection: 'Spent an hour on the tailwind v4 migration tangents.' }] },
  { day: 'TUE', status: 'PENDING', date: 'Feb 24', lifeEvents: ['Laundry/House'], tasks: [{ id: '2', title: 'Beta Auth Audit', type: 'INFRA', time: '4h' }] },
  { day: 'WED', status: 'PENDING', date: 'Feb 25', lifeEvents: [], tasks: [{ id: '3', title: 'Telemetry Engine', type: 'FEATURE', time: '6h' }] },
  { day: 'THU', status: 'PENDING', date: 'Feb 26', lifeEvents: ['Errands'], tasks: [{ id: '4', title: 'Weekly Broadcast', type: 'LOG', time: '2h' }] },
  { day: 'FRI', status: 'PENDING', date: 'Feb 27', lifeEvents: [], tasks: [{ id: '5', title: 'Roadmap Review', type: 'INFRA', time: '3h' }] }
];

export default function StrategicPlannerPage() {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [selectedDay, setSelectedDay] = useState('MON');
  const [activeTab, setActiveTab] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentDayData = WEEK_FLOW.find(d => d.day === selectedDay);

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
              <aside className="lg:col-span-1 space-y-8">
                 <AiBriefingPanel 
                    copy={copy.AI_BRIEF} 
                    message="Courtney, we've adjusted for your Monday appointment. Focus on low-friction UI work today." 
                    gamePlan={['Small UI Fixes', 'Mindset Broadcast']}
                 />
                 <VelocityStats copy={copy.VELOCITY} savings="142 HOURS" freedom="24 HOURS KEPT" />
              </aside>

              <main className="lg:col-span-3 space-y-6">
                 <WeeklyFlowWheel days={WEEK_FLOW} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

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

                      <DailyDebriefPanel tasks={currentDayData?.tasks || []} />
                    </div>

                    <section className="h-full flex flex-col">
                        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <MessageCircle size={12} /> {copy.SECTIONS.TRANSMISSION}
                        </h3>
                        <div className="bg-black/30 border border-white/5 rounded-xl p-6 flex-1 flex flex-col">
                           <textarea 
                            placeholder={copy.PLACEHOLDERS.MINDSET}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white/60 font-light leading-relaxed resize-none placeholder:text-white/10"
                           />
                           <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-4">
                              <button className="flex items-center gap-2 px-4 py-2 rounded bg-white/5 text-white/50 text-[10px] font-mono uppercase tracking-widest border border-white/10">
                                <Mic size={12} /> {copy.ACTIONS.AUDIO}
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-mono uppercase tracking-widest border border-brand-primary/20">
                                <Share2 size={12} /> {copy.ACTIONS.BROADCAST}
                              </button>
                           </div>
                        </div>
                    </section>
                 </div>
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