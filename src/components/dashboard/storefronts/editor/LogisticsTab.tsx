/* src/components/dashboard/storefronts/editor/LogisticsTab.tsx */
'use client';

import React, { useState } from 'react';
import { Scale, Plus, Trash2, ChevronUp, ChevronDown, Tag } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY, getActiveBlueprint } from '@/config/dashboard/editor';

interface Fee {
  name: string;
  price: string;
}

interface Term {
  title: string;
  description: string;
  appliesTo?: string;
  fees?: Fee[];
}

export default function LogisticsTab({ formData, setFormData }: { formData: any; setFormData: any }) {
  const terms: Term[] = Array.isArray(formData.operational_terms) ? formData.operational_terms : [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const copy = EDITOR_WORKSPACE_COPY.LOGISTICS_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);

  const availableTargets: string[] = Array.isArray(formData.capabilities)
    ? Array.from(
        new Set(
          formData.capabilities
            .filter((c: any) => c && typeof c === 'object' && c.title?.trim() && !c.isAlaCarte)
            .map((c: any) => c.title.trim())
        )
      )
    : [];

  const handleAddTerm = () => {
    const nextIndex = terms.length;
    setFormData((prev: any) => ({
      ...prev,
      operational_terms: [
        ...(prev.operational_terms || []),
        { title: '', description: '', appliesTo: 'ALL', fees: [] },
      ],
    }));
    setOpenIndex(nextIndex);
  };

  const handleUpdateTerm = (index: number, field: keyof Term, value: string) => {
    const updated = [...terms];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleRemoveTerm = (index: number) => {
    const updated = terms.filter((_, i) => i !== index);
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
    if (openIndex === index) setOpenIndex(null);
  };

  const handleMoveTerm = (index: number, direction: 'up' | 'down') => {
    const updated = [...terms];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
    if (openIndex === index) setOpenIndex(target);
  };

  const handleAddFee = (termIndex: number) => {
    const updated = [...terms];
    const currentFees = updated[termIndex].fees || [];
    updated[termIndex].fees = [...currentFees, { name: '', price: '' }];
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleUpdateFee = (termIndex: number, feeIndex: number, field: keyof Fee, value: string) => {
    const updated = [...terms];
    const currentFees = [...(updated[termIndex].fees || [])];
    currentFees[feeIndex] = { ...currentFees[feeIndex], [field]: value };
    updated[termIndex].fees = currentFees;
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  const handleRemoveFee = (termIndex: number, feeIndex: number) => {
    const updated = [...terms];
    updated[termIndex].fees = (updated[termIndex].fees || []).filter((_, i) => i !== feeIndex);
    setFormData((prev: any) => ({ ...prev, operational_terms: updated }));
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-3">
      {/* Industry-Aware Header */}
      <div className="flex items-center justify-between gap-2 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2 text-indigo-400 min-w-0">
          <Scale className="w-4 h-4 shrink-0" />
          <h2 className="text-xs font-black uppercase tracking-widest text-white truncate">
            {blueprint.logisticsHeading}
          </h2>
        </div>
        <button
          type="button"
          onClick={handleAddTerm}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/25 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-3 h-3" /> {copy.ADD_RULE_BTN}
        </button>
      </div>

      <p className="text-[11px] text-zinc-500 leading-relaxed">{blueprint.logisticsHelper}</p>

      {/* Compact Collapsible Rules List */}
      {terms.length === 0 ? (
        <div className="p-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 text-center">
          <span className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
            {copy.EMPTY_STATE}
          </span>
        </div>
      ) : (
        <div className="space-y-1.5">
          {terms.map((term, index) => {
            const isOpen = openIndex === index;
            const scopeLabel = !term.appliesTo || term.appliesTo === 'ALL' ? 'Storewide' : term.appliesTo;

            return (
              <div
                key={index}
                className={`rounded-lg border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-zinc-900/60 border-indigo-500/40'
                    : 'bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                {/* Compact Row Header */}
                <div
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="px-2.5 py-2 flex items-center justify-between gap-2 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="flex flex-col shrink-0 -my-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleMoveTerm(index, 'up')}
                        disabled={index === 0}
                        className="text-zinc-600 hover:text-indigo-400 disabled:opacity-15 cursor-pointer leading-none"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveTerm(index, 'down')}
                        disabled={index === terms.length - 1}
                        className="text-zinc-600 hover:text-indigo-400 disabled:opacity-15 cursor-pointer leading-none"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-zinc-100 truncate block">
                        {term.title?.trim() || 'Untitled Policy'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-indigo-300/90 truncate max-w-44">
                          <Tag size={8} /> {scopeLabel}
                        </span>
                        {term.fees && term.fees.length > 0 && (
                          <span className="text-[9px] font-mono text-zinc-500">
                            · {term.fees.length} {term.fees.length === 1 ? 'rate' : 'rates'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <ChevronDown
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 cursor-pointer ${isOpen ? 'rotate-180 text-white' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTerm(index)}
                      className="p-0.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                      title={copy.DELETE_RULE_TITLE}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded Body */}
                {isOpen && (
                  <div className="px-3.5 pb-3.5 pt-3 border-t border-zinc-800/80 space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        {copy.RULE_TITLE_LABEL}
                      </label>
                      <input
                        value={term.title}
                        onChange={(e) => handleUpdateTerm(index, 'title', e.target.value)}
                        className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white focus:border-indigo-500 outline-none text-xs placeholder:text-zinc-700"
                        placeholder={blueprint.logisticsRulePlaceholder}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                        <Tag size={9} className="text-indigo-400" />
                        {blueprint.logisticsScopeLabel}
                      </label>
                      <select
                        value={term.appliesTo || 'ALL'}
                        onChange={(e) => handleUpdateTerm(index, 'appliesTo', e.target.value)}
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

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                        {copy.CAVEATS_LABEL}
                      </label>
                      <textarea
                        value={term.description}
                        onChange={(e) => handleUpdateTerm(index, 'description', e.target.value)}
                        className="w-full bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white h-16 resize-none focus:border-indigo-500 outline-none text-xs placeholder:text-zinc-700 leading-relaxed"
                        placeholder={blueprint.logisticsCaveatsPlaceholder}
                      />
                    </div>

                    {/* Optional Rate / Modifier Lines */}
                    <div className="pt-2 border-t border-zinc-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                          {copy.RATES_LABEL}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleAddFee(index)}
                          className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={10} /> {copy.ADD_FEE_BTN}
                        </button>
                      </div>

                      {term.fees && term.fees.length > 0 && (
                        <div className="space-y-1.5">
                          {term.fees.map((fee, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5">
                              <input
                                value={fee.name}
                                onChange={(e) => handleUpdateFee(index, fIdx, 'name', e.target.value)}
                                placeholder={blueprint.logisticsFeePlaceholder}
                                className="flex-1 min-w-0 bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white text-xs focus:border-indigo-500 outline-none"
                              />
                              <input
                                value={fee.price}
                                onChange={(e) => handleUpdateFee(index, fIdx, 'price', e.target.value)}
                                placeholder={blueprint.logisticsPricePlaceholder}
                                className="w-24 shrink-0 bg-zinc-950 px-2.5 py-1.5 rounded-md border border-zinc-800 text-indigo-400 font-mono font-bold text-xs focus:border-indigo-500 outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFee(index, fIdx)}
                                className="p-1 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer shrink-0"
                                title={copy.REMOVE_FEE_TITLE}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
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