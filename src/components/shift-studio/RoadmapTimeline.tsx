import React from 'react';
import { WEBSITE_COPY } from '@/utils/glossary';
import { MapPin } from 'lucide-react';

export default function RoadmapTimeline() {
  const { ROADMAP, SECTORS } = WEBSITE_COPY.SHIFT_STUDIO_PAGE;

  return (
    <div className="mb-32 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
            <MapPin className="text-brand-primary" size={24} />
            <h2 className="text-2xl font-bold uppercase tracking-widest">{SECTORS.FLIGHT_PLAN}</h2>
        </div>
        
        <div className="relative border-l border-white/5 ml-3 space-y-12">
            <div className="relative pl-12">
                <div className="absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full bg-brand-primary ring-4 ring-bg-app shadow-[0_0_15px_rgba(6,182,212,0.5)]" />
                <h3 className="text-xl font-bold text-white mb-2">{ROADMAP.PHASE_1_TITLE}</h3>
                <p className="text-text-muted max-w-xl font-light">{ROADMAP.PHASE_1_DESC}</p>
            </div>
             <div className="relative pl-12 opacity-50">
                <div className="absolute -left-1.25 top-2 w-2.5 h-2.5 rounded-full bg-white/10 ring-4 ring-bg-app" />
                <h3 className="text-xl font-bold text-white mb-2">{ROADMAP.PHASE_2_TITLE}</h3>
                <p className="text-text-muted max-w-xl font-light">{ROADMAP.PHASE_2_DESC}</p>
            </div>
        </div>
    </div>
  );
}