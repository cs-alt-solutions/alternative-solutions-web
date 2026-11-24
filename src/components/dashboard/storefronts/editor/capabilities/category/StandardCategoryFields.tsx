/* src/components/dashboard/storefronts/editor/capabilities/category/StandardCategoryFields.tsx */
'use client';

import React, { useState } from 'react';
import { List, Layers, Plus, X, ChevronDown, CalendarClock } from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import LinkedGalleryBar from './LinkedGalleryBar';
import DepartmentFaqsEditor, { DepartmentFaq } from './DepartmentFaqsEditor';

interface StandardCategoryFieldsProps {
  cap: any;
  storefrontId: string;
  galleryItems: any[];
  setFormData: any;
  blueprint: any;
  onUpdateField: (field: string, value: any) => void;
}

export default function StandardCategoryFields({
  cap,
  storefrontId,
  galleryItems,
  setFormData,
  blueprint,
  onUpdateField,
}: StandardCategoryFieldsProps) {
  const [optionsOpen, setOptionsOpen] = useState(false);
  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;

  const bullets: string[] = cap.bullets || [];
  const addons: { title?: string }[] = cap.addons || [];
  const faqs: DepartmentFaq[] = Array.isArray(cap.faqs) ? cap.faqs : [];
  const askTimeframe = cap.askTimeframe === true;

  const handleAddBullet = () => onUpdateField('bullets', [...bullets, '']);
  const handleUpdateBullet = (idx: number, val: string) =>
    onUpdateField('bullets', bullets.map((b, i) => (i === idx ? val : b)));
  const handleRemoveBullet = (idx: number) =>
    onUpdateField('bullets', bullets.filter((_, i) => i !== idx));

  const handleAddAddon = () => {
    setOptionsOpen(true);
    onUpdateField('addons', [...addons, { title: '' }]);
  };
  const handleUpdateAddon = (idx: number, val: string) =>
    onUpdateField('addons', addons.map((a, i) => (i === idx ? { ...a, title: val } : a)));
  const handleRemoveAddon = (idx: number) =>
    onUpdateField('addons', addons.filter((_, i) => i !== idx));

  return (
    <>
      {/* Highlights / Deliverables */}
      <div className="space-y-2 pt-3 border-t border-zinc-800/60">
        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <List size={11} className="text-cyan-500" /> {blueprint.deliverablesLabel}
        </label>

        <div className="space-y-1.5">
          {bullets.map((bullet, bIndex) => (
            <div key={bIndex} className="flex items-center gap-2">
              <div className="w-1 h-1 rounded-full bg-zinc-600 shrink-0" />
              <input
                value={bullet}
                onChange={(e) => handleUpdateBullet(bIndex, e.target.value)}
                placeholder={blueprint.deliverablePlaceholder}
                className="flex-1 bg-transparent border-b border-zinc-800 py-1 text-xs text-zinc-300 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => handleRemoveBullet(bIndex)}
                className="text-zinc-600 hover:text-rose-400 cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddBullet}
          className="text-[9px] font-bold text-zinc-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-1 pt-1 cursor-pointer"
        >
          <Plus size={10} /> {blueprint.addDeliverableBtn}
        </button>
      </div>

      {/* Collapsible Quick Inquiry Options + Soft Timeframe Toggle */}
      <div className="pt-2.5 border-t border-zinc-800/60 space-y-2">
        <button
          type="button"
          onClick={() => setOptionsOpen(!optionsOpen)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <span className="text-[9px] font-bold text-zinc-500 group-hover:text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <Layers size={11} className="text-fuchsia-500" />
            {blueprint.optionsLabel} ({addons.length}{askTimeframe ? ' · Timeframe ON' : ''})
          </span>
          <ChevronDown
            size={12}
            className={`text-zinc-500 transition-transform duration-200 ${optionsOpen ? 'rotate-180 text-fuchsia-400' : ''}`}
          />
        </button>

        {optionsOpen && (
          <div className="space-y-2.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-150">
            {/* Soft Preferred Timeframe Toggle */}
            <button
              type="button"
              onClick={() => onUpdateField('askTimeframe', !askTimeframe)}
              className={`w-full p-2.5 rounded-lg border text-left flex items-start justify-between gap-2.5 transition-colors cursor-pointer ${
                askTimeframe
                  ? 'bg-fuchsia-500/10 border-fuchsia-500/40'
                  : 'bg-black/40 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
                  <CalendarClock size={12} className={askTimeframe ? 'text-fuchsia-400' : 'text-zinc-500'} />
                  <span>{copy.TIMEFRAME_TOGGLE_LABEL}</span>
                </div>
                <p className="text-[10px] text-zinc-500 leading-relaxed">{copy.TIMEFRAME_TOGGLE_HELPER}</p>
              </div>
              <span
                className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase shrink-0 ${
                  askTimeframe ? 'bg-fuchsia-500 text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                {askTimeframe ? 'ON' : 'OFF'}
              </span>
            </button>

            <p className="text-[10px] text-zinc-500 leading-relaxed">{copy.OPTIONS_HELPER}</p>

            {addons.length > 0 && (
              <div className="space-y-1.5">
                {addons.map((addon, addonIdx) => (
                  <div key={addonIdx} className="flex items-center gap-2">
                    <input
                      value={addon.title || ''}
                      onChange={(e) => handleUpdateAddon(addonIdx, e.target.value)}
                      placeholder={blueprint.optionPlaceholder}
                      className="flex-1 bg-black/40 border border-zinc-800 rounded px-2.5 py-1 text-[11px] text-zinc-300 focus:border-fuchsia-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addonIdx)}
                      className="text-zinc-600 hover:text-rose-400 cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddAddon}
              className="text-[9px] font-bold text-zinc-500 hover:text-fuchsia-400 uppercase tracking-widest flex items-center gap-1 cursor-pointer"
            >
              <Plus size={10} /> {blueprint.addOptionBtn}
            </button>
          </div>
        )}
      </div>

      {/* Collapsible Department FAQs */}
      <DepartmentFaqsEditor faqs={faqs} onChange={(updated) => onUpdateField('faqs', updated)} />

      {/* Unified Drop Vault Cover & Gallery Link */}
      <LinkedGalleryBar
        storefrontId={storefrontId}
        categoryTitle={cap.title || ''}
        legacyCoverImage={cap.coverImage}
        galleryItems={galleryItems}
        setFormData={setFormData}
        onClearLegacyCover={() => onUpdateField('coverImage', '')}
      />
    </>
  );
}