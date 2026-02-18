/* src/app/dashboard/tasks/page.tsx */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { WEBSITE_COPY } from '@/utils/glossary';
import { 
  ArrowLeft, Plus, Terminal, Bug, Lightbulb, 
  Mic, Share2, Activity, Zap, Sparkles, Clock, 
  Calendar, Coffee, Heart, MessageCircle, CalendarDays, ExternalLink
} from 'lucide-react';

const WEEK_FLOW = [
  { day: 'MON', status: 'ACTIVE', date: 'Feb 23', lifeEvents: ['Doctor Appt (10am)'], tasks: [{ id: '1', title: 'Small UI Fixes', type: 'BUG', time: '2h' }] },
  { day: 'TUE', status: 'PENDING', date: 'Feb 24', lifeEvents: ['Laundry/House'], tasks: [{ id: '2', title: 'Beta Auth Audit', type: 'INFRA', time: '4h' }] },
  { day: 'WED', status: 'PENDING', date: 'Feb 25', lifeEvents: [], tasks: [{ id: '3', title: 'Telemetry Engine', type: 'FEATURE', time: '6h' }] },
  { day: 'THU', status: 'PENDING', date: 'Feb 26', lifeEvents: ['Errands'], tasks: [{ id: '4', title: 'Weekly Broadcast', type: 'LOG', time: '2h' }] },
  { day: 'FRI', status: 'PENDING', date: 'Feb 27', lifeEvents: [], tasks: [{ id: '5', title: 'Roadmap Review', type: 'INFRA', time: '3h' }] }
];

const MOCK_IDEAS = [
  { id: 'i1', title: 'Google Calendar Sync', desc: 'Integrate the monthly view with live Google Calendar data for automated lifestyle block syncing.', type: 'INFRA', state: 'BACKLOG' },
  { id: 'i2', title: 'AI Triage Sensitivity Slider', desc: 'Adjust leniency of AI synthesis for beta feedback.', type: 'FEATURE', state: 'BACKLOG' }
];

export default function StrategicPlannerPage() {
  const copy = WEBSITE_COPY.DASHBOARD.STRATEGIC_PLANNER;
  const [selectedDay, setSelectedDay] = useState('MON');
  const [activeTab, setActiveTab] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');

  const currentDayData = WEEK_FLOW.find(d => d.day === selectedDay);

  return (
    <div className="min-h-screen bg-bg-app text-text-main p-8 relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />
       
       <div className="max-w-7xl mx-auto w-full relative z-10 flex-1 flex flex-col pb-24">
          
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand-primary transition-all">
                <ArrowLeft size={16} />
              </Link>
              <div>
                 <h1 className="text-2xl font-black uppercase tracking-tight text-white">{copy.TITLE}</h1>
                 <span className="text-[10px] font-mono text-brand-primary uppercase tracking-widest mt-1 block">{copy.SUBTITLE}</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-5 py-2.5 rounded text-xs font-mono uppercase font-bold text-black bg-brand-primary hover:bg-brand-primary/90 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
              <Plus size={16} /> {copy.BTN_ADD}
            </button>
          </div>

          {/* VIEW TOGGLE TABS */}
          <div className="flex items-center gap-2 mb-8 border-b border-white/10 pb-px">
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
          </div>

          {activeTab === 'WEEKLY' ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* (Existing Weekly Flow Column logic below) */}
              <div className="lg:col-span-1 space-y-8">
                 <section className="bg-linear-to-b from-brand-primary/10 to-transparent border border-brand-primary/20 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Sparkles size={48} /></div>
                    <h3 className="text-xs font-black text-brand-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Activity size={14} /> {copy.AI_BRIEF.TITLE}
                    </h3>
                    <p className="text-sm text-white/80 font-light leading-relaxed mb-4 italic">
                      "Courtney, we've adjusted the board for your Monday appointment. Low-friction tasks are prioritized today."
                    </p>
                    <div className="pt-4 border-t border-white/5">
                      <span className="text-[10px] font-mono text-white/40 uppercase">{copy.AI_BRIEF.GAME_PLAN}</span>
                      <ul className="mt-2 space-y-2">
                        <li className="text-xs text-white/60 flex items-center gap-2"><div className="w-1 h-1 bg-brand-primary rounded-full" /> Small UI Fixes</li>
                        <li className="text-xs text-white/60 flex items-center gap-2"><div className="w-1 h-1 bg-white/20 rounded-full" /> Mindset Broadcast</li>
                      </ul>
                    </div>
                 </section>

                 <section className="bg-black/40 border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
                      <Zap size={14} className="text-brand-primary" /> {copy.VELOCITY.TITLE}
                    </h3>
                    <div className="space-y-4">
                       <div>
                         <span className="text-[9px] font-mono text-white/30 uppercase block mb-1">{copy.VELOCITY.SAVINGS}</span>
                         <span className="text-2xl font-black text-brand-primary tabular-nums tracking-tighter">142 HOURS</span>
                       </div>
                       <div className="pt-4 border-t border-white/5">
                         <span className="text-[9px] font-mono text-white/30 uppercase block mb-1">{copy.VELOCITY.FREEDOM}</span>
                         <span className="text-lg font-black text-brand-secondary tabular-nums tracking-tighter">24 HOURS KEPT</span>
                       </div>
                    </div>
                 </section>
              </div>

              <div className="lg:col-span-3 space-y-6">
                 <div className="flex justify-between items-center gap-2 bg-black/20 p-2 rounded-xl border border-white/5">
                   {WEEK_FLOW.map((d, i) => (
                     <button 
                      key={i} 
                      onClick={() => setSelectedDay(d.day)}
                      className={`flex-1 flex flex-col items-center py-3 rounded-lg border transition-all ${
                       selectedDay === d.day ? 'bg-brand-primary text-black border-brand-primary shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-105' : 
                       'bg-white/2 border-white/5 text-white/40 hover:text-white hover:bg-white/5'
                     }`}
                     >
                       <span className="text-[10px] font-black tracking-widest">{d.day}</span>
                       <span className="text-[9px] font-mono opacity-60">{d.date}</span>
                     </button>
                   ))}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <section>
                        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Coffee size={12} /> Lifestyle Blocks
                        </h3>
                        <div className="space-y-2">
                          {currentDayData?.lifeEvents.map((event, i) => (
                            <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-lg flex items-center justify-between">
                              <span className="text-xs text-white/70 uppercase font-bold tracking-tight">{event}</span>
                              <Heart size={14} className="text-brand-secondary/40" />
                            </div>
                          ))}
                        </div>
                      </section>

                      <section>
                        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Activity size={12} /> Build Slots
                        </h3>
                        <div className="space-y-3">
                          {currentDayData?.tasks.map((task) => (
                            <div key={task.id} className="bg-white/2 border border-white/5 rounded-xl p-5 hover:border-brand-primary/30 transition-all">
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="text-sm font-bold text-white uppercase">{task.title}</h4>
                                <span className="text-[9px] font-mono text-brand-primary border border-brand-primary/20 bg-brand-primary/5 px-1.5 py-0.5 rounded">{task.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* THE IDEAS LEDGER (Integrated Bottom) */}
                      <section className="pt-8 border-t border-white/5">
                        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <Lightbulb size={12} /> {copy.SECTIONS.PARKING_LOT}
                        </h3>
                        <div className="space-y-2">
                          {MOCK_IDEAS.map(idea => (
                            <div key={idea.id} className="p-3 bg-black/20 border border-white/5 rounded-lg text-xs text-white/40 hover:text-white transition-colors">
                               <span className="font-bold uppercase text-white/60">{idea.title}</span> — {idea.desc}
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section className="h-full flex flex-col">
                        <h3 className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                          <MessageCircle size={12} /> Personal Transmission
                        </h3>
                        <div className="bg-black/30 border border-white/5 rounded-xl p-6 flex-1 flex flex-col">
                           <textarea 
                            placeholder="Today's mindset, thoughts, or roadblocks..."
                            className="flex-1 bg-transparent border-none outline-none text-sm text-white/60 font-light leading-relaxed resize-none placeholder:text-white/10"
                           />
                           <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3 mt-4">
                              <button className="flex items-center gap-2 px-4 py-2 rounded bg-white/5 text-white/50 hover:text-white transition-colors text-[10px] font-mono uppercase tracking-widest border border-white/10">
                                <Mic size={12} /> RECORD AUDIO
                              </button>
                              <button className="flex items-center gap-2 px-4 py-2 rounded bg-brand-primary/10 text-brand-primary hover:bg-brand-primary hover:text-black transition-colors text-[10px] font-mono uppercase tracking-widest border border-brand-primary/20">
                                <Share2 size={12} /> BROADCAST LOG
                              </button>
                           </div>
                        </div>
                      </section>
                    </div>
                 </div>
              </div>
            </div>
          ) : (
            /* MONTHLY COMMAND / GOOGLE INTEGRATION PLACEHOLDER */
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-xl relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--brand-primary),transparent)] opacity-5" />
               <CalendarDays size={64} className="text-white/10 mb-6" />
               <h2 className="text-xl font-black text-white uppercase tracking-widest mb-2">{copy.SECTIONS.MONTHLY}</h2>
               <p className="text-sm text-white/40 font-mono uppercase tracking-tight mb-8">System Initializing // Integration Pending</p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  <div className="p-6 bg-white/2 border border-white/5 rounded-xl flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono text-brand-primary uppercase mb-4">Phase 1: API Link</span>
                    <p className="text-xs text-white/60 font-light leading-relaxed">Connect to Google Calendar API to pull real-time lifestyle blocks into the weekly flow.</p>
                  </div>
                  <div className="p-6 bg-white/2 border border-white/5 rounded-xl flex flex-col items-center text-center">
                    <span className="text-[10px] font-mono text-brand-secondary uppercase mb-4">Phase 2: Auto-Triage</span>
                    <p className="text-xs text-white/60 font-light leading-relaxed">AI will automatically reshuffle the 'Plan of Attack' based on calendar conflicts.</p>
                  </div>
               </div>

               <button className="mt-12 flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 text-white/40 border border-white/10 font-mono text-xs uppercase tracking-widest hover:text-white hover:border-brand-primary transition-all">
                  <ExternalLink size={14} /> Initialize Google Auth Sync
               </button>
            </div>
          )}

       </div>
    </div>
  );
}