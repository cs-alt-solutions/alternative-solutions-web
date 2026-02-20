"use client"; // MANDATORY FOR HOOKS LIKE useState

import React, { useState } from 'react';
import GoalTracker from './GoalTracker';
// Updated path to ensure it finds your typed glossary
import { Directive } from '@/utils/glossary'; 
import '../../styles/planner.css';

interface PlannerProps {
  initialTasks?: Directive[];
}

const StrategicBuildPlanner: React.FC<PlannerProps> = ({ initialTasks = [] }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [directives, setDirectives] = useState<Directive[]>(initialTasks);

  const handleAddDirective = (newDirective: Omit<Directive, 'id' | 'status'>) => {
    const directive: Directive = { 
      ...newDirective, 
      id: Date.now(), 
      status: 'pending' 
    };
    setDirectives([...directives, directive]);
    setModalOpen(false);
  };

  return (
    <main className="planner-wrapper p-8 bg-[#0a0a0a] min-h-screen text-white">
      <header className="flex justify-between items-center mb-12">
        <div className="title-group">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Strategic Build Planner</h1>
          <p className="text-xs font-mono text-cyan-400">AN ACCELERATED DEVELOPMENT & LIFESTYLE PLUG</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 border border-white/20 hover:bg-white/10 transition-all font-mono text-sm">
            WEEKLY PLAN
          </button>
          <button 
            className="px-6 py-2 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-all"
            onClick={() => setModalOpen(true)}
          >
            + LOG DIRECTIVE
          </button>
        </div>
      </header>

      {/* Goal Tracker Component */}
      <GoalTracker activeDirectives={directives} />

      <div className="grid grid-cols-12 gap-8 mt-12">
        {/* Left Col - Stats */}
        <section className="col-span-12 lg:col-span-4">
          <div className="p-6 bg-[#111] border border-white/10 rounded-sm">
            <h3 className="text-sm font-bold mb-6 opacity-50 uppercase tracking-widest">Velocity & Vitality</h3>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black italic">12.5</span>
              <span className="text-sm font-mono opacity-50">HRS / WEEK</span>
            </div>
          </div>
        </section>

        {/* Right Col - Briefing */}
        <section className="col-span-12 lg:col-span-8">
          <div className="p-6 bg-[#111] border border-white/10 rounded-sm">
            <h3 className="text-sm font-bold mb-4 opacity-50 uppercase tracking-widest">Lead Architect Briefing</h3>
            <div className="font-mono text-sm text-cyan-400/80">
              {directives.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2">
                  {directives.filter(d => d.priority === 'high').map(d => (
                    <li key={d.id}>{d.title}</li>
                  ))}
                </ul>
              ) : (
                <p className="italic underline opacity-50">Standing by for next directive...</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default StrategicBuildPlanner;