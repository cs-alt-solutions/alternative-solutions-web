// src/components/storefronts/wizard/step3/LayoutArchitecture.tsx
'use client';

import React, { useState } from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';
import { renderHeroWireframe, renderStoryWireframe, renderFlowWireframe } from './LayoutWireframes';

interface LayoutArchitectureProps {
  currentHero: string;
  currentStory: string;
  currentFlow: string;
  onHeroUpdate: (val: string) => void;
  onStoryUpdate: (val: string) => void;
  onFlowUpdate: (val: string) => void;
}

export default function LayoutArchitecture({
  currentHero,
  currentStory,
  currentFlow,
  onHeroUpdate,
  onStoryUpdate,
  onFlowUpdate
}: LayoutArchitectureProps) {
  const copy = WIZARD_COPY.STEP_3;
  const [structureMode, setStructureMode] = useState<'delegate' | 'custom'>('delegate');

  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6 shadow-xl space-y-6 w-full max-w-4xl mx-auto">
      
      {/* THE DELEGATE VS CUSTOM TOGGLE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => setStructureMode('delegate')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer group ${
            structureMode === 'delegate' 
              ? 'bg-zinc-900/80 border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.1)]' 
              : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
              {copy.STRUCTURE_TOGGLE?.BTN_DELEGATE_LABEL}
            </span>
            {structureMode === 'delegate' && <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />}
          </div>
          <p className="text-xs text-zinc-400 font-normal">
            {copy.STRUCTURE_TOGGLE?.BTN_DELEGATE_DESC}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStructureMode('custom')}
          className={`p-4 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer group ${
            structureMode === 'custom' 
              ? 'bg-zinc-900/80 border-fuchsia-400/80 shadow-[0_0_15px_rgba(232,121,249,0.1)]' 
              : 'bg-zinc-950/40 border-zinc-800/80 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <span className="text-sm font-bold text-white group-hover:text-fuchsia-400 transition-colors">
              {copy.STRUCTURE_TOGGLE?.BTN_CUSTOM_LABEL}
            </span>
            {structureMode === 'custom' && <CheckCircle2 className="w-4 h-4 text-fuchsia-400 shrink-0" />}
          </div>
          <p className="text-xs text-zinc-400 font-normal">
            {copy.STRUCTURE_TOGGLE?.BTN_CUSTOM_DESC}
          </p>
        </button>
      </div>

      {structureMode === 'delegate' && (
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-normal flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
          <span>{copy.STRUCTURE_TOGGLE?.DELEGATED_BADGE}</span>
        </div>
      )}

      {structureMode === 'custom' && (
        <div className="space-y-10 pt-6 border-t border-zinc-800/80 animate-in fade-in slide-in-from-top-2 duration-300">
          
          {/* Hero Structure */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest block pl-1">
              {copy.HERO_SELECT?.TITLE}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(copy.HERO_SELECT?.OPTIONS || []).map((opt: any) => (
                <div
                  key={opt.id}
                  onClick={() => onHeroUpdate(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    currentHero === opt.id 
                      ? 'bg-zinc-900 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]' 
                      : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {renderHeroWireframe(opt.id)}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                      {currentHero === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal leading-normal line-clamp-2">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Story & About Layout */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-fuchsia-400 uppercase tracking-widest block pl-1">
              {copy.STORY_SELECT?.TITLE}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(copy.STORY_SELECT?.OPTIONS || []).map((opt: any) => (
                <div
                  key={opt.id}
                  onClick={() => onStoryUpdate(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    currentStory === opt.id 
                      ? 'bg-zinc-900 border-fuchsia-400 shadow-[0_0_15px_rgba(232,121,249,0.15)]' 
                      : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {renderStoryWireframe(opt.id)}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                      {currentStory === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal leading-normal line-clamp-2">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Content Flow */}
          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-widest block pl-1">
              {copy.FLOW_SELECT?.TITLE}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {(copy.FLOW_SELECT?.OPTIONS || []).map((opt: any) => (
                <div
                  key={opt.id}
                  onClick={() => onFlowUpdate(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-2.5 ${
                    currentFlow === opt.id 
                      ? 'bg-zinc-900 border-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)]' 
                      : 'bg-zinc-950/50 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {renderFlowWireframe(opt.id)}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-200">{opt.label}</span>
                      {currentFlow === opt.id && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 font-normal leading-normal line-clamp-2">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}