/* src/components/dashboard/storefronts/editor/capabilities/category/StandardCategoryFields.tsx */
'use client';

import React from 'react';
import { List, Layers, Plus, X, CalendarClock, Sparkles } from 'lucide-react';
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
  activeSection?: 'highlights' | 'inquiry' | 'photos' | 'all';
}

export default function StandardCategoryFields({
  cap,
  storefrontId,
  galleryItems,
  setFormData,
  blueprint,
  onUpdateField,
  activeSection = 'all',
}: StandardCategoryFieldsProps) {
  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;

  const bullets: string[] = cap.bullets || [];
  const addons: { title?: string }[] = cap.addons || [];
  const faqs: DepartmentFaq[] = Array.isArray(cap.faqs) ? cap.faqs : [];
  const askTimeframe = cap.askTimeframe === true;

  const showHighlights = activeSection === 'all' || activeSection === 'highlights';
  const showInquiry = activeSection === 'all' || activeSection === 'inquiry';
  const showPhotos = activeSection === 'all' || activeSection === 'photos';

  const handleAddBullet = () => onUpdateField('bullets', [...bullets, '']);
  const handleUpdateBullet = (idx: number, val: string) =>
    onUpdateField(
      'bullets',
      bullets.map((b, i) => (i === idx ? val : b))
    );
  const handleRemoveBullet = (idx: number) =>
    onUpdateField(
      'bullets',
      bullets.filter((_, i) => i !== idx)
    );

  const handleAddAddon = () => onUpdateField('addons', [...addons, { title: '' }]);
  const handleUpdateAddon = (idx: number, val: string) =>
    onUpdateField(
      'addons',
      addons.map((a, i) => (i === idx ? { ...a, title: val } : a))
    );
  const handleRemoveAddon = (idx: number) =>
    onUpdateField(
      'addons',
      addons.filter((_, i) => i !== idx)
    );

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* HIGHLIGHTS / DELIVERABLES */}
      {showHighlights && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
              <List size={12} className="text-cyan-400" /> {blueprint.deliverablesLabel}
            </label>
            <span className="text-[10px] text-zinc-500 font-mono">Top 3 shown on card</span>
          </div>

          {bullets.length === 0 ? (
            <div className="py-6 px-4 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 space-y-2">
              <Sparkles className="w-4 h-4 text-zinc-600 mx-auto" />
              <p className="text-[11px] text-zinc-500">
                Add up to 3 quick highlights shown across the bottom of this card.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {bullets.map((bullet, bIndex) => (
                <div
                  key={bIndex}
                  className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 focus-within:border-cyan-500/60 transition-colors flex items-start gap-2.5"
                >
                  <span className="mt-0.5 px-1.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-bold shrink-0">
                    0{bIndex + 1}
                  </span>
                  <textarea
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(bIndex, e.target.value)}
                    placeholder={blueprint.deliverablePlaceholder}
                    rows={2}
                    className="flex-1 bg-transparent text-xs text-zinc-200 leading-relaxed focus:outline-none resize-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveBullet(bIndex)}
                    className="p-1 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer shrink-0"
                    title="Remove Highlight"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddBullet}
            className="w-full py-2 rounded-lg border border-dashed border-zinc-800 hover:border-cyan-500/40 bg-zinc-900/30 hover:bg-cyan-500/5 text-[10px] font-bold text-zinc-400 hover:text-cyan-300 uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus size={12} /> {blueprint.addDeliverableBtn}
          </button>
        </div>
      )}

      {/* INQUIRY OPTIONS + TIMEFRAME TOGGLE + FAQS */}
      {showInquiry && (
        <div className="space-y-4">
          {/* Soft Preferred Timeframe Toggle */}
          <button
            type="button"
            onClick={() => onUpdateField('askTimeframe', !askTimeframe)}
            className={`w-full p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-colors cursor-pointer ${
              askTimeframe
                ? 'bg-fuchsia-500/10 border-fuchsia-500/40'
                : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CalendarClock size={13} className={askTimeframe ? 'text-fuchsia-400' : 'text-zinc-500'} />
                <span>{copy.TIMEFRAME_TOGGLE_LABEL}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">{copy.TIMEFRAME_TOGGLE_HELPER}</p>
            </div>
            <span
              className={`px-2 py-0.5 rounded font-mono text-[9px] font-bold uppercase shrink-0 ${
                askTimeframe ? 'bg-fuchsia-500 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {askTimeframe ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Quick Inquiry Checkboxes */}
          <div className="space-y-2.5 pt-1">
            <div className="space-y-0.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={12} className="text-fuchsia-400" />
                {blueprint.optionsLabel} ({addons.length})
              </label>
              <p className="text-[10px] text-zinc-500 leading-relaxed">{copy.OPTIONS_HELPER}</p>
            </div>

            {addons.length > 0 && (
              <div className="space-y-2">
                {addons.map((addon, addonIdx) => (
                  <div key={addonIdx} className="flex items-center gap-2">
                    <input
                      value={addon.title || ''}
                      onChange={(e) => handleUpdateAddon(addonIdx, e.target.value)}
                      placeholder={blueprint.optionPlaceholder}
                      className="flex-1 bg-zinc-900/70 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:border-fuchsia-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAddon(addonIdx)}
                      className="p-1.5 text-zinc-600 hover:text-rose-400 cursor-pointer"
                      title="Remove Option"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddAddon}
              className="w-full py-2 rounded-lg border border-dashed border-zinc-800 hover:border-fuchsia-500/40 bg-zinc-900/30 hover:bg-fuchsia-500/5 text-[10px] font-bold text-zinc-400 hover:text-fuchsia-300 uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus size={12} /> {blueprint.addOptionBtn}
            </button>
          </div>

          {/* Department FAQs */}
          <DepartmentFaqsEditor faqs={faqs} onChange={(updated) => onUpdateField('faqs', updated)} />
        </div>
      )}

      {/* LINKED DROP VAULT PHOTOS */}
      {showPhotos && (
        <div className="space-y-2">
          <LinkedGalleryBar
            storefrontId={storefrontId}
            categoryTitle={cap.title || ''}
            legacyCoverImage={cap.coverImage}
            galleryItems={galleryItems}
            setFormData={setFormData}
            onClearLegacyCover={() => onUpdateField('coverImage', '')}
          />
        </div>
      )}
    </div>
  );
}