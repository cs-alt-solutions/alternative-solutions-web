/* src/components/dashboard/storefronts/editor/LogisticsTab.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { Scale, Plus, Sparkles, HelpCircle, CalendarDays } from 'lucide-react';
import {
  EDITOR_WORKSPACE_COPY,
  getActiveBlueprint,
  OperationalTerm,
  getLogisticsPresets,
} from '@/config/dashboard/editor';
import PolicyRuleCard from './logistics/PolicyRuleCard';
import LogisticsFaqsPanel from './logistics/LogisticsFaqsPanel';
import EventsAccordion from './events/EventsAccordion';

type LogisticsSubTab = 'policies' | 'faqs' | 'events';

export default function LogisticsTab({ formData, setFormData }: { formData: any; setFormData: any }) {
  const terms: OperationalTerm[] = Array.isArray(formData.operational_terms) ? formData.operational_terms : [];
  const [activeSubTab, setActiveSubTab] = useState<LogisticsSubTab>('policies');
  const [openPolicyOriginalIdx, setOpenPolicyOriginalIdx] = useState<number | null>(null);

  const copy = EDITOR_WORKSPACE_COPY.LOGISTICS_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const presets = getLogisticsPresets(blueprint.id);

  const availableTargets: string[] = useMemo(
    () =>
      Array.isArray(formData.capabilities)
        ? Array.from(
            new Set(
              formData.capabilities
                .filter((c: any) => c && typeof c === 'object' && c.title?.trim() && !c.isAlaCarte)
                .map((c: any) => c.title.trim())
            )
          )
        : [],
    [formData.capabilities]
  );

  const indexedTerms = useMemo(
    () => terms.map((term, originalIndex) => ({ term, originalIndex })),
    [terms]
  );
  const policyEntries = useMemo(
    () => indexedTerms.filter((entry) => entry.term.type !== 'faq'),
    [indexedTerms]
  );
  const faqEntries = useMemo(
    () => indexedTerms.filter((entry) => entry.term.type === 'faq'),
    [indexedTerms]
  );
  const eventsCount = Array.isArray(formData.events) ? formData.events.length : 0;

  const appendRule = (template?: OperationalTerm) => {
    const nextIndex = terms.length;
    const newRule: OperationalTerm = template
      ? { ...template, fees: [...(template.fees || [])], days: [...(template.days || [])] }
      : { title: '', description: '', appliesTo: 'ALL', type: 'booking', badge: '', fees: [] };

    setFormData((prev: any) => ({
      ...prev,
      operational_terms: [...(prev.operational_terms || []), newRule],
    }));
    setOpenPolicyOriginalIdx(nextIndex);
  };

  const appendFaq = () => {
    const newFaq: OperationalTerm = {
      title: '',
      description: '',
      appliesTo: 'ALL',
      type: 'faq',
      fees: [],
    };
    setFormData((prev: any) => ({
      ...prev,
      operational_terms: [...(prev.operational_terms || []), newFaq],
    }));
  };

  const handleUpdateTerm = (originalIndex: number, patch: Partial<OperationalTerm>) => {
    const updated = terms.map((item, i) => (i === originalIndex ? { ...item, ...patch } : item));
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleRemoveTerm = (originalIndex: number) => {
    const updated = terms.filter((_, i) => i !== originalIndex);
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
    if (openPolicyOriginalIdx === originalIndex) setOpenPolicyOriginalIdx(null);
  };

  const handleSwapIndices = (fromIndex: number, toIndex: number) => {
    if (fromIndex < 0 || toIndex < 0 || fromIndex >= terms.length || toIndex >= terms.length) return;
    const updated = [...terms];
    [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleMovePolicy = (pos: number, direction: 'up' | 'down') => {
    const targetPos = direction === 'up' ? pos - 1 : pos + 1;
    if (targetPos < 0 || targetPos >= policyEntries.length) return;
    const fromIdx = policyEntries[pos].originalIndex;
    const toIdx = policyEntries[targetPos].originalIndex;
    handleSwapIndices(fromIdx, toIdx);
    if (openPolicyOriginalIdx === fromIdx) setOpenPolicyOriginalIdx(toIdx);
  };

  const handleImportLegacyFaqs = () => {
    setFormData((prev: any) => {
      const existingTerms: OperationalTerm[] = Array.isArray(prev.operational_terms)
        ? [...prev.operational_terms]
        : [];
      const seenKeys = new Set(
        existingTerms
          .filter((t) => t.type === 'faq')
          .map((t) => `${(t.appliesTo || 'ALL').toLowerCase()}::${(t.title || '').trim().toLowerCase()}`)
      );

      const cleanedCaps = (prev.capabilities || []).map((cap: any) => {
        if (!cap || !Array.isArray(cap.faqs) || cap.faqs.length === 0) return cap;
        const target = cap.title?.trim() || 'ALL';
        cap.faqs.forEach((f: any) => {
          const q = f?.question?.trim();
          const a = f?.answer?.trim();
          if (!q || !a) return;
          const key = `${target.toLowerCase()}::${q.toLowerCase()}`;
          if (seenKeys.has(key)) return;
          seenKeys.add(key);
          existingTerms.push({ title: q, description: a, appliesTo: target, type: 'faq', fees: [] });
        });
        return { ...cap, faqs: [] };
      });

      return { ...prev, capabilities: cleanedCaps, operational_terms: existingTerms };
    });
  };

  const subTabs: Array<{
    id: LogisticsSubTab;
    label: string;
    count: number;
    icon: React.ElementType;
    activeClass: string;
  }> = [
    {
      id: 'policies',
      label: copy.SUB_TABS.POLICIES,
      count: policyEntries.length,
      icon: Scale,
      activeClass: 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300',
    },
    {
      id: 'faqs',
      label: copy.SUB_TABS.FAQS,
      count: faqEntries.length,
      icon: HelpCircle,
      activeClass: 'bg-cyan-500/15 border-cyan-500/50 text-cyan-300',
    },
    {
      id: 'events',
      label: copy.SUB_TABS.EVENTS,
      count: eventsCount,
      icon: CalendarDays,
      activeClass: 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300',
    },
  ];

  return (
    <div className="space-y-3 animate-in fade-in duration-300 pb-12 pt-3">
      {/* 3-PILL SUB-NAV BAR */}
      <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-zinc-950 border border-zinc-800/90 sticky top-0 z-20">
        {subTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                isActive
                  ? tab.activeClass
                  : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/70'
              }`}
            >
              <div className="flex items-center gap-1">
                <Icon size={12} className="shrink-0" />
                {tab.count > 0 && <span className="font-mono text-[9px] opacity-80">{tab.count}</span>}
              </div>
              <span className="whitespace-nowrap leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ISOLATED ACTIVE WORKSPACE */}
      <div className="p-3.5 rounded-xl bg-zinc-900/30 border border-zinc-800/70 animate-in fade-in duration-200">
        {activeSubTab === 'policies' && (
          <div className="space-y-3.5">
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

            {policyEntries.length === 0 ? (
              <div className="p-6 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 text-center">
                <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
                  {copy.EMPTY_STATE}
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                {policyEntries.map(({ term, originalIndex }, pos) => (
                  <PolicyRuleCard
                    key={originalIndex}
                    term={term}
                    index={pos}
                    totalCount={policyEntries.length}
                    isOpen={openPolicyOriginalIdx === originalIndex}
                    availableTargets={availableTargets}
                    blueprint={blueprint}
                    copy={copy}
                    onToggle={() =>
                      setOpenPolicyOriginalIdx(openPolicyOriginalIdx === originalIndex ? null : originalIndex)
                    }
                    onUpdate={(patch) => handleUpdateTerm(originalIndex, patch)}
                    onMove={(dir) => handleMovePolicy(pos, dir)}
                    onRemove={() => handleRemoveTerm(originalIndex)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'faqs' && (
          <LogisticsFaqsPanel
            faqEntries={faqEntries}
            availableTargets={availableTargets}
            capabilities={formData.capabilities || []}
            onAddFaq={appendFaq}
            onUpdateTerm={handleUpdateTerm}
            onRemoveTerm={handleRemoveTerm}
            onSwapIndices={handleSwapIndices}
            onImportLegacyFaqs={handleImportLegacyFaqs}
          />
        )}

        {activeSubTab === 'events' && (
          <EventsAccordion
            formData={formData}
            setFormData={setFormData}
            blueprintId={blueprint.id}
          />
        )}
      </div>
    </div>
  );
}