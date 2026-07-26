// src/components/storefront/staging-review/StagingAuditCard.tsx
'use client';

import React from 'react';
import { ChevronDown, MessageSquare, ArrowRight, ThumbsUp, Send } from 'lucide-react';
import { AuditStep } from './types';
import StagingChecklist from './StagingChecklist';

interface Props {
  step: AuditStep;
  currentStepIndex: number;
  totalSteps: number;
  isCompleted: boolean;
  note: string;
  isSubmitting: boolean;
  onToggleCheck: () => void;
  onNoteChange: (val: string) => void;
  onNextStep: () => void;
  onSubmitAudit: (status: 'APPROVED' | 'CHANGES_REQUESTED') => void;
  onMinimize: () => void;
  completedSteps: number[];
}

export default function StagingAuditCard({
  step,
  currentStepIndex,
  totalSteps,
  isCompleted,
  note,
  isSubmitting,
  onToggleCheck,
  onNoteChange,
  onNextStep,
  onSubmitAudit,
  onMinimize,
  completedSteps
}: Props) {
  const isFinalStep = currentStepIndex === totalSteps - 1;

  return (
    <div className="bg-zinc-950/95 backdrop-blur-xl border-2 border-fuchsia-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-w-md w-full">
      
      {/* HEADER */}
      <div className="bg-zinc-900/90 border-b border-zinc-800 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-fuchsia-500"></span>
          </span>
          <span className="text-white font-black text-xs uppercase tracking-widest">
            Staging Audit • Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>
        <button
          onClick={onMinimize}
          className="text-zinc-500 hover:text-white p-1 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          title="Minimize to browse freely"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-zinc-900 h-1.5 flex">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <div
            key={idx}
            className={`h-full flex-1 transition-all duration-500 border-r border-zinc-950 ${
              completedSteps.includes(idx)
                ? 'bg-fuchsia-500 shadow-[0_0_10px_rgba(192,38,213,0.8)]'
                : idx === currentStepIndex
                ? 'bg-cyan-400 animate-pulse'
                : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* BODY CONTENT */}
      <div className="p-5 flex-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
        <div className="mb-4">
          <span className="text-fuchsia-400 font-mono text-[10px] font-bold uppercase tracking-widest block mb-1">
            Target Area: #{step.targetId}
          </span>
          <h3 className="text-white font-black text-xl tracking-tight leading-none mb-2">
            {step.title}
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed font-light">
            {step.description}
          </p>
        </div>

        <StagingChecklist
          checks={step.checks}
          isCompleted={isCompleted}
          onToggle={onToggleCheck}
        />

        {/* TWEAK NOTES */}
        <div className="mb-5">
          <label className="block text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-3 h-3 text-cyan-400" />
            <span>Request Tweaks or Copy Changes (Optional)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            placeholder={`e.g., "Change the secondary button to say 'View Rituals' instead..."`}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none h-20"
          />
        </div>

        {/* STEP NAVIGATION DECK */}
        {!isFinalStep ? (
          <button
            onClick={onNextStep}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Confirm Section & Next</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block text-center mb-1">
              Audit Complete • Select Deployment Action
            </span>
            
            <button
              onClick={() => onSubmitAudit('APPROVED')}
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>Greenlight & Approve Build</span>
            </button>

            <button
              onClick={() => onSubmitAudit('CHANGES_REQUESTED')}
              disabled={isSubmitting}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-widest py-3 rounded-xl border border-zinc-700 hover:border-zinc-600 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-fuchsia-400" />
              <span>Submit Tweak List For Review</span>
            </button>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-zinc-950 border-t border-zinc-900 px-5 py-2.5 flex items-center justify-between text-[10px] font-mono text-zinc-600">
        <span>Powered by Alternative Solutions</span>
        <span className="text-cyan-500/70">Interactive QA Engine v1.0</span>
      </div>
    </div>
  );
}