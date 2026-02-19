/* src/app/dashboard/tasks/page.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { supabase } from '@/utils/supabase';
import { 
  ArrowLeft, Plus, Calendar, CalendarDays, ExternalLink,
  Coffee, MessageCircle, Mic, Share2, Heart, Loader2, Image as ImageIcon 
} from 'lucide-react';

import AiBriefingPanel from '@/components/planner/AiBriefingPanel';
import VelocityStats from '@/components/planner/VelocityStats';
import WeeklyFlowWheel from '@/components/planner/WeeklyFlowWheel';
import LogDirectiveModal from '@/components/planner/LogDirectiveModal';
import DailyDebriefPanel from '@/components/planner/DailyDebriefPanel';
import IdeasLedgerPanel from '@/components/planner/IdeasLedgerPanel';
import { createTextBroadcast, uploadMedia } from '@/app/actions';

// --- TYPES ---
interface PlannerTask {
  id: string;
  title: string;
  type: string;
  time: string;
  reflection?: string;
  status: string;
}

interface DayFlow {
  day: string;
  status: string;
  date: string;
  lifeEvents: string[];
  tasks: PlannerTask[];
}

const INITIAL_WEEK: DayFlow[] = [
  { day: 'MON', status: 'ACTIVE', date: 'Feb 23', lifeEvents: ['Doctor Appt (10am)'], tasks: [] },
  { day: 'TUE', status: 'PENDING', date: 'Feb 24', lifeEvents: ['Laundry/House'], tasks: [] },
  { day: 'WED', status: 'PENDING', date: 'Feb 25', lifeEvents: [], tasks: [] },
  { day: 'THU', status: 'PENDING', date: 'Feb 26', lifeEvents: ['Errands'], tasks: [] },
  { day: 'FRI', status: 'PENDING', date: 'Feb 27', lifeEvents: [], tasks: [] }
];

export default function StrategicPlannerPage() {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [selectedDay, setSelectedDay] = useState('MON');
  const [activeTab, setActiveTab] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [weekFlow, setWeekFlow] = useState<DayFlow[]>(INITIAL_WEEK);
  const [ideasLedger, setIdeasLedger] = useState<PlannerTask[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Transmission State
  const [transmissionText, setTransmissionText] = useState('');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // --- SUPABASE CONNECTION ---
  useEffect(() => {
    async function fetchDirectives() {
      const { data, error } = await supabase
        .from('ideas_ledger')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("CRITICAL: Failed to fetch from ideas_ledger:", error);
        return;
      }

      if (data) {
        const unscheduled = data
          .filter(task => task.scheduled_date === null)
          .map(task => ({
            id: task.id,
            title: task.title,
            type: task.type || 'FEATURE',
            time: 'TBD',
            reflection: task.description || '',
            status: task.status || 'BACKLOG'
          }));
        setIdeasLedger(unscheduled);

        setWeekFlow(prevWeek => prevWeek.map(dayObj => {
          const tasksForDay = data
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
        }));
      }
    }

    if (!isModalOpen) fetchDirectives();
  }, [isModalOpen, refreshTrigger]);

  const currentDayData = weekFlow.find(d => d.day === selectedDay);

  // --- TRANSMISSION HANDLERS ---
  async function handleBroadcast() {
    if (!transmissionText.trim()) return;
    
    setIsBroadcasting(true);
    const formData = new FormData();
    formData.append('description', transmissionText);

    const result = await createTextBroadcast(formData);
    if (result.success) {
      setTransmissionText('');
    }
    setIsBroadcasting(false);
  }

  // --- THE CLIPBOARD INTERCEPTOR ---
  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const items = e.clipboardData.items;
    const imageItem = Array.from(items).find(item => item.type.startsWith('image/'));

    // If it's an image, we hijack the paste
    if (imageItem) {
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;

      setIsUploadingMedia(true);
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadMedia(formData);
      
      if (result.success) {
        // Drop the image markdown syntax directly into the text box
        const imageMarkdown = `\n![Snapshot](${result.url})\n`;
        setTransmissionText(prev => prev + imageMarkdown);
      } else {
        console.error("CRITICAL: Intercept failed to save.");
      }
      setIsUploadingMedia(false);
    }
    // If it's just text, it ignores this and pastes normally!
  }

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
                    message="Ready to roll. The database is actively syncing directives. Awaiting Friday's calendar integration." 
                    gamePlan={['Execute database sync', 'Clear active roadmap']}
                 />
                 <VelocityStats copy={copy.VELOCITY} savings="142 HOURS" freedom="24 HOURS KEPT" />
                 <IdeasLedgerPanel copy={copy.SECTIONS.IDEAS} ideas={ideasLedger} />
              </aside>

              <main className="lg:col-span-3 space-y-6">
                 <WeeklyFlowWheel days={weekFlow} selectedDay={selectedDay} onSelectDay={setSelectedDay} />

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
                        onTaskUpdate={() => setRefreshTrigger(prev => prev + 1)} 
                      />
                    </div>

                    <section className="h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] flex items-center gap-2">
                            <MessageCircle size={12} /> {copy.SECTIONS.TRANSMISSION}
                          </h3>
                          {/* Visual Indicator that the interceptor is active */}
                          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[8px] font-mono text-brand-primary uppercase tracking-widest">
                            <ImageIcon size={10} /> PASTE IMAGES ENABLED
                          </div>
                        </div>
                        
                        <div className="bg-black/30 border border-white/5 rounded-xl p-6 flex-1 flex flex-col relative overflow-hidden">
                           
                           {/* Loading Overlay when intercepting an image */}
                           {isUploadingMedia && (
                             <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3 animate-in fade-in">
                               <Loader2 size={24} className="text-brand-primary animate-spin" />
                               <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest">{copy.PLACEHOLDERS.UPLOADING_MEDIA}</span>
                             </div>
                           )}

                           <textarea 
                            value={transmissionText}
                            onChange={(e) => setTransmissionText(e.target.value)}
                            onPaste={handlePaste}
                            disabled={isBroadcasting || isUploadingMedia}
                            placeholder={copy.PLACEHOLDERS.MINDSET}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white/60 font-light leading-relaxed resize-none placeholder:text-white/10 disabled:opacity-50 custom-scrollbar relative z-0"
                           />
                           
                           <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-4 relative z-0">
                              <button 
                                disabled
                                title="ElevenLabs Integration Pending"
                                className="flex items-center gap-2 px-4 py-2 rounded bg-white/5 text-white/30 text-[10px] font-mono uppercase tracking-widest border border-white/5 cursor-not-allowed transition-colors"
                              >
                                <Mic size={12} /> {copy.ACTIONS.AUDIO}
                              </button>
                              <button 
                                onClick={handleBroadcast}
                                disabled={isBroadcasting || !transmissionText.trim()}
                                className="flex items-center gap-2 px-4 py-2 rounded bg-brand-primary/10 text-brand-primary text-[10px] font-mono uppercase tracking-widest border border-brand-primary/20 hover:bg-brand-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                              >
                                {isBroadcasting ? <Loader2 size={12} className="animate-spin" /> : <Share2 size={12} />}
                                {isBroadcasting ? 'TRANSMITTING...' : copy.ACTIONS.BROADCAST}
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