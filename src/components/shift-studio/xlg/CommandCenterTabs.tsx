/* src/components/shift-studio/xlg/CommandCenterTabs.tsx */
'use client';

import React, { useState } from 'react';
import { Calculator, MonitorPlay } from 'lucide-react';
import RoiCalculator from './RoiCalculator';
import UnifiedSystemShowcase from './UnifiedSystemShowcase';
import TerminalTab from '@/components/core/TerminalTab'; // IMPORTING THE CORE COMPONENT

export default function CommandCenterTabs() {
  const [activeTab, setActiveTab] = useState<'audit' | 'showcase'>('audit');

  return (
    <div className="w-full mx-auto flex flex-col items-center">
      
      {/* REUSABLE TERMINAL TABS */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16 z-20 relative">
        <TerminalTab 
          label="THE SAVINGS ENGINE"
          isActive={activeTab === 'audit'}
          onClick={() => setActiveTab('audit')}
          icon={Calculator}
          variant="brand"
        />
        
        <TerminalTab 
          label="THE DIFFERENCE: LIVE SYSTEM"
          isActive={activeTab === 'showcase'}
          onClick={() => setActiveTab('showcase')}
          icon={MonitorPlay}
          variant="fuchsia"
        />
      </div>

      {/* DYNAMIC CONTENT AREA */}
      <div className="w-full min-h-200 relative z-10 max-w-7xl mx-auto">
        {activeTab === 'audit' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full w-full">
            <RoiCalculator />
          </div>
        )}
        
        {activeTab === 'showcase' && (
          <div className="animate-in fade-in zoom-in-95 duration-500 h-full w-full">
            <UnifiedSystemShowcase />
          </div>
        )}
      </div>
      
    </div>
  );
}