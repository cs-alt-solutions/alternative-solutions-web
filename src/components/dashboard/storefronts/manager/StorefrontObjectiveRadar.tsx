/* src/components/dashboard/storefronts/manager/StorefrontObjectiveRadar.tsx */
'use client';

import React from 'react';
import Link from 'next/link';
import { Lightbulb, Sparkles, CheckSquare } from 'lucide-react';
import { STOREFRONT_MANAGER_COPY } from '@/config/dashboard/manager';

interface ObjectiveRadarProps {
  store: any;
  tasks: any[];
  ideas: any[];
  onOpenTaskModal?: (storeId: string, taskToEdit?: any) => void;
  compact?: boolean;
}

export default function StorefrontObjectiveRadar({
  store,
  tasks = [],
  ideas = [],
  onOpenTaskModal,
  compact = false
}: ObjectiveRadarProps) {
  if (store.is_template) return null;
  const copy = STOREFRONT_MANAGER_COPY.TABLE;

  const storeTasks = tasks.filter(t => t.storefront_id === store.id && t.status !== 'DONE');
  const storeIdea = ideas.find(i => i.storefront_id === store.id);
  const hasBrainDump = Boolean(
    storeIdea && (
      (storeIdea.description && storeIdea.description.trim().length > 0) ||
      (Array.isArray(storeIdea.reference_links) && storeIdea.reference_links.length > 0)
    )
  );

  // Only render when there is an active task or an existing brain dump to surface
  if (storeTasks.length === 0 && !storeIdea) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${compact ? 'mt-1.5' : ''}`}>
      {storeIdea && (
        <Link
          href={`/dashboard/strategy/${storeIdea.id}`}
          title={copy.OPEN_STRATEGY_TITLE}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border transition-all ${
            hasBrainDump
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
              : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          {hasBrainDump ? <Sparkles size={10} className="shrink-0" /> : <Lightbulb size={10} className="shrink-0" />}
          <span>{hasBrainDump ? copy.BRAIN_DUMP_READY : copy.AWAITING_BRAIN_DUMP}</span>
        </Link>
      )}

      {storeTasks.map((t) => {
        const isWaitingTask = t.title?.toLowerCase().startsWith('awaiting');
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onOpenTaskModal && onOpenTaskModal(store.id, t)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer max-w-55 ${
              isWaitingTask
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : t.status === 'IN_PROGRESS'
                  ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-cyan-500/40'
            }`}
            title={t.title}
          >
            <CheckSquare size={10} className="shrink-0" />
            <span className="truncate">{t.title}</span>
          </button>
        );
      })}
    </div>
  );
}