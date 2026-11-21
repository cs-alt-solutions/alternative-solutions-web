/* src/components/dashboard/storefronts/editor/grid/LifecyclePanel.tsx */
'use client';

import React, { useState } from 'react';
import { Activity, CheckCircle2, Globe, PlayCircle, PauseCircle, Wrench } from 'lucide-react';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { quickUpdateStorefrontStatus } from '@/app/actions/storefronts';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import LifecyclePauseDrawer from './LifecyclePauseDrawer';
import LifecycleStepActions from './LifecycleStepActions';

export default function LifecyclePanel({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: any;
}) {
  const currentStatus = ((formData.status as string) || 'PENDING_BUILD') as StorefrontStatus;
  const currentConfig =
    STOREFRONT_LIFECYCLE[currentStatus] || STOREFRONT_LIFECYCLE['PENDING_BUILD'];
  const copy = EDITOR_WORKSPACE_COPY.GRID_TAB.LIFECYCLE;

  const [isUpdating, setIsUpdating] = useState(false);
  const [showPauseDrawer, setShowPauseDrawer] = useState(false);

  const handleStatusChange = async (
    newStatus: StorefrontStatus,
    customMessage?: string,
    skipConfirm = false
  ) => {
    const label = STOREFRONT_LIFECYCLE[newStatus]?.label || newStatus;
    if (!skipConfirm && !window.confirm(`Update project status to ${label}?`)) return;

    const now = new Date().toISOString();
    const logEntry = {
      id: crypto.randomUUID(),
      author: 'ADMIN',
      type: newStatus,
      fromStatus: currentStatus,
      toStatus: newStatus,
      message: customMessage || `Project status updated to ${label}.`,
      timestamp: now,
    };

    const prevFormData = formData;
    setIsUpdating(true);
    setFormData({
      ...formData,
      status: newStatus,
      updated_at: now,
      audit_notes: [...(formData.audit_notes || []), logEntry],
    });

    try {
      const result = await quickUpdateStorefrontStatus(formData.id, newStatus, logEntry);
      if (!result || !result.success) throw new Error('Failed to update status');
    } catch {
      setFormData(prevFormData);
      alert('Failed to save status to database. Please refresh and try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const pipelineSteps = [
    { id: 'QUEUE', label: copy.STEP_1 },
    { id: 'BUILDING_CORE', label: copy.STEP_2 },
    { id: 'IN_REVIEW', label: copy.STEP_3 },
    { id: 'CONTENT_ASSEMBLY', label: copy.STEP_4 },
    { id: 'ACTIVE', label: copy.STEP_5 },
  ];

  let visualStatus: string = currentStatus;
  if (['ONBOARDING', 'AWAITING_PAYMENT', 'PENDING_BUILD'].includes(currentStatus)) visualStatus = 'QUEUE';
  if (['ACTIVE', 'LIVE', 'MAINTENANCE', 'HIDDEN'].includes(currentStatus)) visualStatus = 'ACTIVE';
  if (['AWAITING_ASSETS', 'ON_HOLD'].includes(currentStatus)) visualStatus = 'CONTENT_ASSEMBLY';

  const currentIndex = Math.max(0, pipelineSteps.findIndex((s) => s.id === visualStatus));
  const isPausedState = ['AWAITING_ASSETS', 'ON_HOLD'].includes(currentStatus);
  const isInYourCourt = ['PENDING_BUILD', 'BUILDING_CORE', 'CONTENT_ASSEMBLY', 'MAINTENANCE'].includes(currentStatus);
  const isLiveOrOffline = ['ACTIVE', 'LIVE', 'MAINTENANCE', 'HIDDEN'].includes(currentStatus);

  const courtBadge =
    currentStatus === 'ACTIVE' || currentStatus === ('LIVE' as any)
      ? { label: 'Live Production', cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' }
      : isInYourCourt
        ? { label: 'In Your Court', cls: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' }
        : { label: 'Waiting on Client', cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };

  return (
    <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-xl overflow-hidden shadow-2xl flex flex-col">
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700">
            <Activity size={14} className={currentIndex >= 4 ? 'text-emerald-400' : 'text-cyan-400'} />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{copy.TITLE}</h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-md border text-[9px] font-black uppercase tracking-widest ${courtBadge.cls}`}>
            {courtBadge.label}
          </span>
          <select
            value={currentStatus}
            disabled={isUpdating}
            onChange={(e) =>
              handleStatusChange(
                e.target.value as StorefrontStatus,
                `Stage manually switched to ${STOREFRONT_LIFECYCLE[e.target.value as StorefrontStatus]?.label || e.target.value}.`
              )
            }
            title="Jump directly to any lifecycle stage"
            className="bg-zinc-950 border border-zinc-700 hover:border-cyan-500/50 rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-200 outline-none cursor-pointer"
          >
            {Object.entries(STOREFRONT_LIFECYCLE)
              .filter(([key]) => key !== 'PROTOTYPE')
              .map(([key, cfg]) => (
                <option key={key} value={key} className="bg-zinc-950 text-white">
                  {cfg.label}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* BALL-IN-COURT QUICK BAR */}
      <div className="px-5 py-3.5 bg-black/30 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-300 min-w-0">
          <span className={`px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-wider shrink-0 ${currentConfig.badgeColor}`}>
            {currentConfig.label}
          </span>
          <span className="text-[11px] text-zinc-400 truncate hidden sm:inline">{currentConfig.description}</span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isPausedState ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => handleStatusChange('CONTENT_ASSEMBLY', 'Client dependency cleared. Resuming build.', true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              <PlayCircle size={12} /> Resume Build
            </button>
          ) : !isLiveOrOffline ? (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() => setShowPauseDrawer((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              <PauseCircle size={12} /> Pause — Waiting on Client
            </button>
          ) : (
            <button
              type="button"
              disabled={isUpdating}
              onClick={() =>
                handleStatusChange(
                  currentStatus === 'MAINTENANCE' ? 'ACTIVE' : 'MAINTENANCE',
                  currentStatus === 'MAINTENANCE' ? 'Restored to Live Production.' : 'Switched to Maintenance Mode.'
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/40 text-blue-300 text-[10px] font-black uppercase tracking-wider cursor-pointer"
            >
              <Wrench size={12} /> {currentStatus === 'MAINTENANCE' ? 'Restore Live' : 'Maintenance Mode'}
            </button>
          )}
        </div>
      </div>

      {/* INLINE PAUSE DRAWER */}
      {showPauseDrawer && (
        <LifecyclePauseDrawer
          onClose={() => setShowPauseDrawer(false)}
          onConfirm={(target, message) => {
            setShowPauseDrawer(false);
            handleStatusChange(target, message, true);
          }}
        />
      )}

      {/* VERTICAL PIPELINE STEPS */}
      <div className="p-5 space-y-3">
        {pipelineSteps.map((step, idx) => {
          const isCompleted = currentIndex > idx;
          const isActive = currentIndex === idx;
          const isPausedHere = isActive && isPausedState;

          const nodeClasses = isCompleted
            ? 'bg-emerald-500 border-emerald-500 text-zinc-950'
            : isPausedHere
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : isActive
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.25)]'
                : 'bg-zinc-950 border-zinc-700 text-zinc-400';

          const cardClasses = isPausedHere
            ? 'border-amber-500/50 bg-amber-950/15'
            : isActive
              ? 'border-cyan-500/50 bg-zinc-950/90 shadow-lg'
              : isCompleted
                ? 'border-zinc-800 bg-black/30'
                : 'border-zinc-800/80 bg-black/20';

          return (
            <div key={step.id} className="relative flex items-start gap-3.5">
              {idx < pipelineSteps.length - 1 && (
                <div className={`absolute left-3.5 top-7 -bottom-3 w-0.5 ${isCompleted ? 'bg-emerald-500/50' : 'bg-zinc-800'}`} />
              )}

              <div className={`relative z-10 w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 transition-all ${nodeClasses}`}>
                {isCompleted ? <CheckCircle2 size={14} /> : step.id === 'ACTIVE' ? <Globe size={13} /> : <span className="text-[10px] font-black">{idx + 1}</span>}
              </div>

              <div className={`flex-1 rounded-xl border p-3.5 transition-all ${cardClasses}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'text-white' : isCompleted ? 'text-zinc-300' : 'text-zinc-400'}`}>
                    {step.label}
                  </span>
                  {isCompleted && <span className="text-[9px] font-mono uppercase text-emerald-400 font-bold">Done</span>}
                  {isPausedHere && <span className="text-[9px] font-mono uppercase text-amber-300 font-bold">Paused</span>}
                  {isActive && !isPausedHere && <span className="text-[9px] font-mono uppercase text-cyan-400 font-bold">Active</span>}
                </div>

                {isActive && (
                  <LifecycleStepActions
                    stepIndex={idx}
                    currentStatus={currentStatus}
                    isPausedState={isPausedState}
                    formData={formData}
                    setFormData={setFormData}
                    onStatusChange={handleStatusChange}
                    onOpenPauseDrawer={() => setShowPauseDrawer(true)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}