/* src/components/dashboard/storefronts/editor/grid/LifecyclePauseDrawer.tsx */
'use client';

import React, { useState } from 'react';
import { PauseCircle, X } from 'lucide-react';

const QUICK_PAUSE_REASONS = [
  'Waiting on menu / service pricing',
  'Waiting on brand photos or logo',
  'Waiting on bio / written copy',
  'Waiting on domain / DNS access',
  'Client requested pause',
];

interface PauseDrawerProps {
  onConfirm: (targetStatus: 'AWAITING_ASSETS' | 'ON_HOLD', message: string) => void;
  onClose: () => void;
}

export default function LifecyclePauseDrawer({ onConfirm, onClose }: PauseDrawerProps) {
  const [pauseTarget, setPauseTarget] = useState<'AWAITING_ASSETS' | 'ON_HOLD'>('AWAITING_ASSETS');
  const [pauseReason, setPauseReason] = useState(QUICK_PAUSE_REASONS[0]);
  const [customReason, setCustomReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const reasonText = pauseReason === 'Custom...' ? customReason.trim() : pauseReason;
    const label = pauseTarget === 'ON_HOLD' ? 'On Hold' : 'Awaiting Client';
    const message = reasonText
      ? `Paused (${label}): ${reasonText}`
      : 'Build paused waiting on client.';

    onConfirm(pauseTarget, message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="px-5 py-4 bg-amber-950/20 border-b border-amber-500/30 space-y-3 animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
          <PauseCircle size={13} /> Pause Build & Log Reason
        </span>
        <button
          type="button"
          onClick={onClose}
          className="text-zinc-500 hover:text-white cursor-pointer"
        >
          <X size={14} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <select
          value={pauseTarget}
          onChange={(e) => setPauseTarget(e.target.value as 'AWAITING_ASSETS' | 'ON_HOLD')}
          className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
        >
          <option value="AWAITING_ASSETS">Awaiting Client Assets / Copy</option>
          <option value="ON_HOLD">On Hold (Client Paused)</option>
        </select>

        <select
          value={pauseReason}
          onChange={(e) => setPauseReason(e.target.value)}
          className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
        >
          {QUICK_PAUSE_REASONS.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
          <option value="Custom...">Custom reason...</option>
        </select>
      </div>

      {pauseReason === 'Custom...' && (
        <input
          type="text"
          required
          value={customReason}
          onChange={(e) => setCustomReason(e.target.value)}
          placeholder="What are we waiting on from the client?"
          className="w-full bg-zinc-950 border border-amber-500/40 rounded-lg px-3 py-2 text-xs text-white outline-none"
          autoFocus
        />
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg border border-zinc-700 text-[10px] font-bold uppercase text-zinc-400 hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-[10px] font-black uppercase tracking-wider cursor-pointer"
        >
          Confirm Pause
        </button>
      </div>
    </form>
  );
}