/* src/components/dashboard/storefronts/editor/logistics/LogisticsFaqsPanel.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { HelpCircle, Plus, ChevronUp, ChevronDown, Trash2, Tag, ArrowDownToLine } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY, OperationalTerm } from '@/config/dashboard/editor';

interface IndexedTerm {
  term: OperationalTerm;
  originalIndex: number;
}

interface LogisticsFaqsPanelProps {
  faqEntries: IndexedTerm[];
  availableTargets: string[];
  capabilities: any[];
  onAddFaq: () => void;
  onUpdateTerm: (originalIndex: number, patch: Partial<OperationalTerm>) => void;
  onRemoveTerm: (originalIndex: number) => void;
  onSwapIndices: (fromIndex: number, toIndex: number) => void;
  onImportLegacyFaqs: () => void;
}

export default function LogisticsFaqsPanel({
  faqEntries,
  availableTargets,
  capabilities,
  onAddFaq,
  onUpdateTerm,
  onRemoveTerm,
  onSwapIndices,
  onImportLegacyFaqs,
}: LogisticsFaqsPanelProps) {
  const [openOriginalIdx, setOpenOriginalIdx] = useState<number | null>(null);
  const copy = EDITOR_WORKSPACE_COPY.LOGISTICS_TAB.FAQ_SECTION;

  const legacyCount = useMemo(() => {
    if (!Array.isArray(capabilities)) return 0;
    return capabilities.reduce((sum, cap) => {
      if (!cap || !Array.isArray(cap.faqs)) return sum;
      const valid = cap.faqs.filter((f: any) => f && f.question?.trim() && f.answer?.trim()).length;
      return sum + valid;
    }, 0);
  }, [capabilities]);

  const handleAdd = () => {
    onAddFaq();
    setOpenOriginalIdx(-1);
  };

  const handleMove = (pos: number, direction: 'up' | 'down') => {
    const targetPos = direction === 'up' ? pos - 1 : pos + 1;
    if (targetPos < 0 || targetPos >= faqEntries.length) return;
    const fromIdx = faqEntries[pos].originalIndex;
    const toIdx = faqEntries[targetPos].originalIndex;
    onSwapIndices(fromIdx, toIdx);
    if (openOriginalIdx === fromIdx) setOpenOriginalIdx(toIdx);
  };

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-cyan-400 min-w-0">
          <HelpCircle className="w-4 h-4 shrink-0" />
          <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
            {copy.HEADING}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3 h-3" /> {copy.ADD_BTN}
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed">{copy.HELPER}</p>

      {/* Optional 1-Click Migration Strip for Older Storefronts */}
      {legacyCount > 0 && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <span className="text-[10px] font-medium text-amber-200 leading-snug">
            {copy.LEGACY_BANNER_PREFIX} {legacyCount} {copy.LEGACY_BANNER_SUFFIX}
          </span>
          <button
            type="button"
            onClick={onImportLegacyFaqs}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer shrink-0"
          >
            <ArrowDownToLine size={11} />
            <span>{copy.LEGACY_IMPORT_BTN}</span>
          </button>
        </div>
      )}

      {faqEntries.length === 0 ? (
        <div className="p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 text-center">
          <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
            {copy.EMPTY_STATE}
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {faqEntries.map(({ term, originalIndex }, pos) => {
            const isOpen =
              openOriginalIdx === originalIndex ||
              (openOriginalIdx === -1 && pos === faqEntries.length - 1);
            const scopeLabel =
              !term.appliesTo || term.appliesTo === 'ALL'
                ? copy.STOREWIDE_LABEL
                : term.appliesTo;

            return (
              <div
                key={originalIndex}
                className={`rounded-lg border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/60 border-cyan-500/40'
                    : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div
                  onClick={() => setOpenOriginalIdx(isOpen ? null : originalIndex)}
                  className="px-2.5 py-2 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex flex-col shrink-0 -my-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMove(pos, 'up')}
                        disabled={pos === 0}
                        className="text-zinc-600 hover:text-cyan-400 disabled:opacity-15 cursor-pointer leading-none"
                        title={copy.MOVE_UP_TITLE}
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMove(pos, 'down')}
                        disabled={pos === faqEntries.length - 1}
                        className="text-zinc-600 hover:text-cyan-400 disabled:opacity-15 cursor-pointer leading-none"
                        title={copy.MOVE_DOWN_TITLE}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
                      <HelpCircle size={12} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="block text-xs font-bold text-zinc-100 truncate">
                        {term.title?.trim() || copy.UNTITLED_QUESTION}
                      </span>
                      <span className="inline-flex items-center gap-1 mt-0.5 text-[9px] font-mono uppercase text-cyan-300/80 truncate max-w-full">
                        <Tag size={8} /> {scopeLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <ChevronDown
                      onClick={() => setOpenOriginalIdx(isOpen ? null : originalIndex)}
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 cursor-pointer ${
                        isOpen ? 'rotate-180 text-white' : ''
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (isOpen) setOpenOriginalIdx(null);
                        onRemoveTerm(originalIndex);
                      }}
                      className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                      title={copy.DELETE_TITLE}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="px-3 pb-3 pt-2.5 border-t border-zinc-800/80 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        <Tag size={9} className="text-cyan-400" />
                        {copy.SCOPE_LABEL}
                      </label>
                      <select
                        value={term.appliesTo || 'ALL'}
                        onChange={(e) => onUpdateTerm(originalIndex, { appliesTo: e.target.value })}
                        className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-cyan-300 focus:border-cyan-500 outline-none text-xs cursor-pointer"
                      >
                        <option value="ALL">{copy.STOREWIDE_OPTION}</option>
                        {availableTargets.map((target) => (
                          <option key={target} value={target}>
                            {target}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        {copy.QUESTION_LABEL}
                      </label>
                      <input
                        value={term.title}
                        onChange={(e) => onUpdateTerm(originalIndex, { title: e.target.value })}
                        placeholder={copy.QUESTION_PLACEHOLDER}
                        className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white focus:border-cyan-500 outline-none text-xs placeholder:text-zinc-700"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        {copy.ANSWER_LABEL}
                      </label>
                      <textarea
                        value={term.description}
                        onChange={(e) => onUpdateTerm(originalIndex, { description: e.target.value })}
                        placeholder={copy.ANSWER_PLACEHOLDER}
                        rows={3}
                        className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white resize-none focus:border-cyan-500 outline-none text-xs placeholder:text-zinc-700 leading-relaxed"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}