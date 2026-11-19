/* src/components/dashboard/storefronts/editor/staging/AuditLedger.tsx */
'use client';

import React, { useMemo, useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Clock,
  Activity,
  Info,
  X,
  Send,
  PauseCircle,
  Plus,
  Loader2,
} from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import { STOREFRONT_LIFECYCLE, StorefrontStatus } from '@/config/lifecycle';
import { addStorefrontAuditLog } from '@/app/actions/storefronts';

function inferStatusFromLog(log: any): StorefrontStatus | null {
  if (log?.toStatus && STOREFRONT_LIFECYCLE[log.toStatus as StorefrontStatus]) {
    return log.toStatus as StorefrontStatus;
  }
  const t = String(log?.type || '').toUpperCase();
  if (STOREFRONT_LIFECYCLE[t as StorefrontStatus]) return t as StorefrontStatus;
  if (t === 'APPLICATION_RECEIVED' || t === 'PORTAL_REMINDER_SENT') return 'ONBOARDING';
  if (t === 'BRAIN_DUMP_COMPLETED' || t === 'PAYMENT_CLEARED') return 'PENDING_BUILD';
  if (t === 'BUILD_INITIALIZED') return 'BUILDING_CORE';
  if (t === 'REVIEW_DISPATCHED') return 'IN_REVIEW';
  if (t === 'APPROVED' || t === 'APPROVED_PENDING_BILLING') return 'CONTENT_ASSEMBLY';
  if (t === 'CHANGES_REQUESTED') return 'BUILDING_CORE';
  return null;
}

function formatDurationDays(ms: number) {
  const days = Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
  if (days === 0) return '< 1d';
  return `${days}d`;
}

export default function AuditLedger({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData?: any;
}) {
  const [showLegend, setShowLegend] = useState(false);
  const [noteInput, setNoteInput] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.GRID_TAB.AUDIT_LEDGER;

  const auditLogs = useMemo(
    () => (Array.isArray(formData?.audit_notes) ? formData.audit_notes : []),
    [formData?.audit_notes]
  );

  // Calculate real time metrics: Total Age, Current Stage, Your Court vs Their Court
  const timing = useMemo(() => {
    const now = Date.now();
    const createdMs = formData?.created_at ? new Date(formData.created_at).getTime() : now;
    const totalMs = Math.max(0, now - createdMs);

    const sorted = [...auditLogs]
      .filter((l) => l?.timestamp)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    let yourCourtMs = 0;
    let theirCourtMs = 0;
    let activeStatus: StorefrontStatus = 'ONBOARDING';
    let cursorMs = createdMs;
    let lastStageChangeMs = createdMs;

    for (const log of sorted) {
      const logMs = new Date(log.timestamp).getTime();
      if (isNaN(logMs) || logMs < cursorMs) continue;

      const delta = logMs - cursorMs;
      const court = STOREFRONT_LIFECYCLE[activeStatus]?.court;
      if (court === 'YOUR_COURT') yourCourtMs += delta;
      if (court === 'THEIR_COURT') theirCourtMs += delta;

      const nextStatus = inferStatusFromLog(log);
      if (nextStatus && nextStatus !== activeStatus) {
        activeStatus = nextStatus;
        lastStageChangeMs = logMs;
      }
      cursorMs = logMs;
    }

    const finalStatus = (formData?.status as StorefrontStatus) || activeStatus;
    const tailDelta = Math.max(0, now - cursorMs);
    const finalCourt = STOREFRONT_LIFECYCLE[finalStatus]?.court;
    if (finalCourt === 'YOUR_COURT') yourCourtMs += tailDelta;
    if (finalCourt === 'THEIR_COURT') theirCourtMs += tailDelta;

    const currentStageMs = Math.max(
      0,
      now - (lastStageChangeMs || (formData?.updated_at ? new Date(formData.updated_at).getTime() : createdMs))
    );

    return {
      totalAge: formatDurationDays(totalMs),
      inCurrentStage: formatDurationDays(currentStageMs),
      yourCourt: formatDurationDays(yourCourtMs),
      theirCourt: formatDurationDays(theirCourtMs),
    };
  }, [auditLogs, formData?.created_at, formData?.updated_at, formData?.status]);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !formData?.id) return;
    setIsAddingNote(true);
    try {
      const res = await addStorefrontAuditLog(formData.id, 'ADMIN', 'BUILD_NOTE', noteInput.trim());
      if (res.success && res.log && setFormData) {
        setFormData((prev: any) => ({
          ...prev,
          audit_notes: [...(prev.audit_notes || []), res.log],
        }));
      }
      setNoteInput('');
    } catch (err: any) {
      alert(err?.message || 'Failed to save note.');
    } finally {
      setIsAddingNote(false);
    }
  };

  const getLedgerTheme = (type: string) => {
    switch (type) {
      case 'APPROVED':
      case 'APPROVED_PENDING_BILLING':
      case 'ACTIVE':
        return { text: 'text-emerald-400', icon: CheckCircle2 };
      case 'PAYMENT_CLEARED':
        return { text: 'text-fuchsia-400', icon: CreditCard };
      case 'CHANGES_REQUESTED':
      case 'AWAITING_ASSETS':
      case 'ON_HOLD':
        return { text: 'text-amber-400', icon: PauseCircle };
      case 'REVIEW_DISPATCHED':
      case 'IN_REVIEW':
        return { text: 'text-blue-400', icon: Send };
      case 'BUILD_INITIALIZED':
      case 'BUILDING_CORE':
      case 'CONTENT_ASSEMBLY':
        return { text: 'text-cyan-400', icon: Activity };
      case 'PAYMENT_FAILED':
        return { text: 'text-rose-400', icon: AlertCircle };
      default:
        return { text: 'text-zinc-400', icon: Clock };
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-700/60 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-150 relative">
      {/* HEADER */}
      <div className="border-b border-zinc-800 bg-black/40 p-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-zinc-800 rounded-md border border-zinc-700">
            <ClipboardCheck size={14} className="text-zinc-300" />
          </div>
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">
            {copy.TITLE}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowLegend(true)}
          className="p-1.5 text-zinc-500 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors cursor-pointer"
          title={copy.LEGEND_TITLE}
        >
          <Info size={14} />
        </button>
      </div>

      {/* TIME TRACKING BREAKDOWN BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800/80 border-b border-zinc-800 shrink-0">
        <div className="bg-zinc-950/90 px-4 py-2.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
            Total Age
          </span>
          <span className="text-sm font-black text-white">{timing.totalAge}</span>
        </div>
        <div className="bg-zinc-950/90 px-4 py-2.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
            Current Stage
          </span>
          <span className="text-sm font-black text-cyan-400">{timing.inCurrentStage}</span>
        </div>
        <div className="bg-zinc-950/90 px-4 py-2.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
            Your Court (Build)
          </span>
          <span className="text-sm font-black text-emerald-400">{timing.yourCourt}</span>
        </div>
        <div className="bg-zinc-950/90 px-4 py-2.5">
          <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
            Their Court (Waiting)
          </span>
          <span className="text-sm font-black text-amber-400">{timing.theirCourt}</span>
        </div>
      </div>

      {/* QUICK MANUAL LOG NOTE */}
      <form onSubmit={handleAddNote} className="p-3 bg-black/30 border-b border-zinc-800 flex gap-2 shrink-0">
        <input
          type="text"
          value={noteInput}
          onChange={(e) => setNoteInput(e.target.value)}
          placeholder="Log a quick progress or pause note (e.g., Waiting on menu pricing)..."
          className="flex-1 bg-zinc-950 border border-zinc-800 focus:border-cyan-500/50 rounded-lg px-3 py-2 text-xs text-white outline-none"
        />
        <button
          type="submit"
          disabled={isAddingNote || !noteInput.trim()}
          className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-cyan-500/20 border border-zinc-700 hover:border-cyan-500/40 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40"
        >
          {isAddingNote ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
          Log
        </button>
      </form>

      {/* BODY */}
      <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
        {auditLogs.length === 0 ? (
          <div className="text-center p-8 bg-black/30 border border-zinc-800/80 rounded-lg text-zinc-500 text-sm">
            {copy.EMPTY_STATE}
          </div>
        ) : (
          [...auditLogs].reverse().map((log: any, idx: number) => {
            const theme = getLedgerTheme(log.type);
            return (
              <div
                key={log.id || idx}
                className="bg-black/50 border border-zinc-800/80 rounded-lg p-4 transition-all"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <theme.icon size={15} className={theme.text} />
                    <span className={`text-[11px] uppercase tracking-wider font-bold ${theme.text}`}>
                      {String(log.type || 'EVENT').replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 font-medium">
                    {formatDate(log.timestamp)}
                  </span>
                </div>
                {log.message && (
                  <p className="text-sm text-zinc-300 ml-6 leading-relaxed">{log.message}</p>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* LEGEND MODAL */}
      {showLegend && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 max-w-sm w-full shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowLegend(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>

            <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-6">
              {copy.STATUS_LEGEND_HEADING}
            </h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-emerald-400">{copy.APPROVED_TITLE}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{copy.APPROVED_DESC}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <PauseCircle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-amber-400">{copy.CHANGES_TITLE}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{copy.CHANGES_DESC}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CreditCard size={16} className="text-fuchsia-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-fuchsia-400">{copy.PAYMENT_TITLE}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{copy.PAYMENT_DESC}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}