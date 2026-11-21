/* src/components/dashboard/storefronts/editor/logistics/PolicyRuleCard.tsx */
'use client';

import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Tag } from 'lucide-react';
import { OperationalTerm, RULE_TYPES, WEEK_DAYS, getRuleTypeMeta } from './logisticsConfig';
import DaySchedulePicker from './DaySchedulePicker';
import PolicyRuleRates from './PolicyRuleRates';

interface PolicyRuleCardProps {
  term: OperationalTerm;
  index: number;
  totalCount: number;
  isOpen: boolean;
  availableTargets: string[];
  blueprint: any;
  copy: any;
  onToggle: () => void;
  onUpdate: (patch: Partial<OperationalTerm>) => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

export default function PolicyRuleCard({
  term,
  index,
  totalCount,
  isOpen,
  availableTargets,
  blueprint,
  copy,
  onToggle,
  onUpdate,
  onMove,
  onRemove,
}: PolicyRuleCardProps) {
  const typeMeta = getRuleTypeMeta(term.type);
  const TypeIcon = typeMeta.icon;
  const scopeLabel = !term.appliesTo || term.appliesTo === 'ALL' ? 'Storewide' : term.appliesTo;
  const activeDaysSummary = (term.days || [])
    .map((key) => WEEK_DAYS.find((d) => d.key === key)?.label)
    .filter(Boolean)
    .join(', ');

  return (
    <div
      className={`rounded-lg border transition-all overflow-hidden ${
        isOpen
          ? 'bg-zinc-900/60 border-indigo-500/40'
          : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      {/* Compact Row Header */}
      <div
        onClick={onToggle}
        className="px-2.5 py-2 flex items-center justify-between gap-2 cursor-pointer select-none"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="flex flex-col shrink-0 -my-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="text-zinc-600 hover:text-indigo-400 disabled:opacity-15 cursor-pointer leading-none"
              title="Move Up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => onMove('down')}
              disabled={index === totalCount - 1}
              className="text-zinc-600 hover:text-indigo-400 disabled:opacity-15 cursor-pointer leading-none"
              title="Move Down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>
          </div>

          <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400 shrink-0">
            <TypeIcon size={12} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-100 truncate">
                {term.title?.trim() || 'Untitled Policy'}
              </span>
              {term.badge?.trim() && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-300 text-[9px] font-mono shrink-0">
                  {term.badge}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5 text-[9px] font-mono text-zinc-500 truncate">
              <span className="inline-flex items-center gap-1 uppercase text-indigo-300/80 truncate">
                <Tag size={8} /> {scopeLabel}
              </span>
              {activeDaysSummary && <span className="truncate">· {activeDaysSummary}</span>}
              {term.fees && term.fees.length > 0 && <span>· {term.fees.length} rate(s)</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          <ChevronDown
            onClick={onToggle}
            className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 cursor-pointer ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
          <button
            type="button"
            onClick={onRemove}
            className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
            title={copy.DELETE_RULE_TITLE}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Expanded Body */}
      {isOpen && (
        <div className="px-3 pb-3 pt-2.5 border-t border-zinc-800/80 space-y-3">
          {/* Rule Type Pill Bar */}
          <div className="grid grid-cols-5 gap-1">
            {RULE_TYPES.map((rt) => {
              const Icon = rt.icon;
              const selected = (term.type || 'booking') === rt.id;
              return (
                <button
                  key={rt.id}
                  type="button"
                  onClick={() => onUpdate({ type: rt.id })}
                  className={`py-1.5 px-1 rounded-md border flex flex-col items-center gap-0.5 text-[8px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    selected
                      ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Icon size={11} />
                  <span>{rt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Title + Quick Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
            <div className="sm:col-span-7 space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                {copy.RULE_TITLE_LABEL}
              </label>
              <input
                value={term.title}
                onChange={(e) => onUpdate({ title: e.target.value })}
                className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white focus:border-indigo-500 outline-none text-xs placeholder:text-zinc-700"
                placeholder={blueprint.logisticsRulePlaceholder}
              />
            </div>

            <div className="sm:col-span-5 space-y-1">
              <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                Quick Badge
              </label>
              <input
                value={term.badge || ''}
                onChange={(e) => onUpdate({ badge: e.target.value })}
                className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-indigo-300 font-mono focus:border-indigo-500 outline-none text-xs placeholder:text-zinc-700"
                placeholder="e.g., Sundays Only"
              />
            </div>
          </div>

          {/* Applies To Scope */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
              <Tag size={9} className="text-indigo-400" />
              {blueprint.logisticsScopeLabel}
            </label>
            <select
              value={term.appliesTo || 'ALL'}
              onChange={(e) => onUpdate({ appliesTo: e.target.value })}
              className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-indigo-300 focus:border-indigo-500 outline-none text-xs cursor-pointer"
            >
              <option value="ALL">All / General (Storewide)</option>
              {availableTargets.map((target) => (
                <option key={target} value={target}>
                  {target}
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Weekly Schedule Picker */}
          <DaySchedulePicker
            days={term.days || []}
            scheduleMode={term.scheduleMode || 'active'}
            scheduleWindow={term.scheduleWindow || ''}
            onChange={(patch) => onUpdate(patch)}
          />

          {/* Policy Details */}
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
              {copy.CAVEATS_LABEL}
            </label>
            <textarea
              value={term.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white h-16 resize-none focus:border-indigo-500 outline-none text-xs placeholder:text-zinc-700 leading-relaxed"
              placeholder={blueprint.logisticsCaveatsPlaceholder}
            />
          </div>

          {/* Attached Rates / Modifiers */}
          <PolicyRuleRates
            fees={term.fees || []}
            label={copy.RATES_LABEL}
            addBtnLabel={copy.ADD_FEE_BTN}
            namePlaceholder={blueprint.logisticsFeePlaceholder}
            pricePlaceholder={blueprint.logisticsPricePlaceholder}
            removeTitle={copy.REMOVE_FEE_TITLE}
            onChange={(fees) => onUpdate({ fees })}
          />
        </div>
      )}
    </div>
  );
}