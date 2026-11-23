/* src/components/dashboard/storefronts/editor/LogisticsTab.tsx */
'use client';

import React, { useState } from 'react';
import { Scale, Plus, Sparkles } from 'lucide-react';
import {
  EDITOR_WORKSPACE_COPY,
  getActiveBlueprint,
  OperationalTerm,
  getLogisticsPresets,
} from '@/config/dashboard/editor';
import PolicyRuleCard from './logistics/PolicyRuleCard';
import EventsAccordion from './events/EventsAccordion';

export default function LogisticsTab({ formData, setFormData }: { formData: any; setFormData: any }) {
  const terms: OperationalTerm[] = Array.isArray(formData.operational_terms) ? formData.operational_terms : [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const copy = EDITOR_WORKSPACE_COPY.LOGISTICS_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const presets = getLogisticsPresets(blueprint.id);

  const availableTargets: string[] = Array.isArray(formData.capabilities)
    ? Array.from(
        new Set(
          formData.capabilities
            .filter((c: any) => c && typeof c === 'object' && c.title?.trim() && !c.isAlaCarte)
            .map((c: any) => c.title.trim())
        )
      )
    : [];

  const appendRule = (template?: OperationalTerm) => {
    const nextIndex = terms.length;
    const newRule: OperationalTerm = template
      ? { ...template, fees: [...(template.fees || [])], days: [...(template.days || [])] }
      : { title: '', description: '', appliesTo: 'ALL', type: 'booking', badge: '', fees: [] };

    setFormData((prev: any) => ({
      ...prev,
      operational_terms: [...(prev.operational_terms || []), newRule],
    }));
    setOpenIndex(nextIndex);
  };

  const handleUpdateTerm = (index: number, patch: Partial<OperationalTerm>) => {
    const updated = terms.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleRemoveTerm = (index: number) => {
    const updated = terms.filter((_, i) => i !== index);
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
    if (openIndex === index) setOpenIndex(null);
  };

  const handleMoveTerm = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= terms.length) return;
    const updated = [...terms];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
    if (openIndex === index) setOpenIndex(target);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-3">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 min-w-0">
          <Scale className="w-4 h-4 shrink-0" />
          <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
            {blueprint.logisticsHeading}
          </h2>
        </div>
        <button
          type="button"
          onClick={() => appendRule()}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3 h-3" /> {copy.ADD_RULE_BTN}
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed">{blueprint.logisticsHelper}</p>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 flex items-center gap-1 mr-0.5">
          <Sparkles size={10} className="text-indigo-400" /> Quick Add:
        </span>
        {presets.map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => appendRule(preset.template)}
            className="px-2 py-1 rounded-md bg-zinc-900/80 hover:bg-indigo-500/15 border border-zinc-800 hover:border-indigo-500/40 text-[10px] font-semibold text-zinc-300 hover:text-indigo-200 transition-colors cursor-pointer"
          >
            + {preset.label}
          </button>
        ))}
      </div>

      {terms.length === 0 ? (
        <div className="p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 text-center">
          <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
            {copy.EMPTY_STATE}
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {terms.map((term, index) => (
            <PolicyRuleCard
              key={index}
              term={term}
              index={index}
              totalCount={terms.length}
              isOpen={openIndex === index}
              availableTargets={availableTargets}
              blueprint={blueprint}
              copy={copy}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              onUpdate={(patch) => handleUpdateTerm(index, patch)}
              onMove={(dir) => handleMoveTerm(index, dir)}
              onRemove={() => handleRemoveTerm(index)}
            />
          ))}
        </div>
      )}

      <EventsAccordion
        formData={formData}
        setFormData={setFormData}
        blueprintId={blueprint.id}
      />
    </div>
  );
}