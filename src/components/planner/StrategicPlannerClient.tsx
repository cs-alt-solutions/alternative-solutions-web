'use client';

import React, { useState } from 'react';
import GoalTracker from './GoalTracker';
import { Directive } from '../../utils/glossary';
// Ensure this path exists or update it to your global.css location
import '../../app/globals.css'; 

const StrategicPlannerClient: React.FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [directives, setDirectives] = useState<Directive[]>([]);

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
    <div className="planner-wrapper">
      <header className="planner-header">
        <div className="title-group">
          <h1 className="text-2xl font-bold">STRATEGIC BUILD PLANNER</h1>
          <p className="text-sm opacity-70">AN ACCELERATED DEVELOPMENT & LIFESTYLE PLUG</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-gray-800 rounded">WEEKLY PLAN</button>
          <button 
            className="px-4 py-2 bg-blue-600 rounded font-bold"
            onClick={() => setModalOpen(true)}
          >
            + LOG DIRECTIVE
          </button>
        </div>
      </header>

      <div className="mt-8">
        <GoalTracker activeDirectives={directives} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <section className="col-span-1">
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <h3 className="text-lg mb-4">VELOCITY & VITALITY</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-mono text-blue-400">12.5</span>
              <span className="text-xs">HRS / WEEK</span>
            </div>
          </div>
        </section>

        <section className="col-span-1">
          <div className="p-6 bg-gray-900 border border-gray-800 rounded-lg">
            <h3 className="text-lg mb-4">LEAD ARCHITECT BRIEFING</h3>
            <p className="text-sm text-gray-400 italic">Standing by for next directive...</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default StrategicPlannerClient;