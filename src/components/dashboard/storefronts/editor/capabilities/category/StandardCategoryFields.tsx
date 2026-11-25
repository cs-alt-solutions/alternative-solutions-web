/* src/components/dashboard/storefronts/editor/capabilities/category/StandardCategoryFields.tsx */
'use client';

import React, { useMemo } from 'react';
import {
  List,
  Layers,
  Plus,
  X,
  CalendarClock,
  Sparkles,
  MousePointerClick,
  ExternalLink,
} from 'lucide-react';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import LinkedGalleryBar from './LinkedGalleryBar';
import DepartmentFaqsEditor, { DepartmentFaq } from './DepartmentFaqsEditor';
import CollectionProfilesEditor, { CollectionProfile } from './CollectionProfilesEditor';

export type TimeframeMode = 'off' | 'flexible' | 'calendar';
export type AddonSelectionMode = 'single' | 'multiple';

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
  const collectionProfiles: CollectionProfile[] = Array.isArray(cap.collectionProfiles)
    ? cap.collectionProfiles
    : [];

  // Detect any Drop Vault photo collections tagged inside this department
  const deptCollections = useMemo(() => {
    const titleKey = (cap.title || '').trim().toLowerCase();
    if (!titleKey || !Array.isArray(galleryItems)) return [];

    const map = new Map<string, { name: string; count: number }>();
    for (const item of galleryItems) {
      if (!item || typeof item === 'string') continue;
      if ((item.category || '').trim().toLowerCase() !== titleKey) continue;
      if (item.isVisible === false || !item.imageUrl?.trim()) continue;
      const raw = item.collection?.trim();
      if (!raw) continue;
      const key = raw.toLowerCase();
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { name: raw, count: 1 });
    }
    return Array.from(map.values());
  }, [cap.title, galleryItems]);

  // Resolve 3-way timing mode with full backwards compatibility for legacy askTimeframe booleans
  const timeframeMode: TimeframeMode =
    cap.timeframeMode === 'off' || cap.timeframeMode === 'flexible' || cap.timeframeMode === 'calendar'
      ? cap.timeframeMode
      : cap.askTimeframe === true
        ? 'calendar'
        : 'off';

  const addonSelectionMode: AddonSelectionMode =
    cap.addonSelectionMode === 'single' ? 'single' : 'multiple';

  const isTimingActive = timeframeMode !== 'off';
  const hasBookingUrl = Boolean((cap.bookingUrl || '').trim());

  const handleTimeframeModeChange = (nextMode: TimeframeMode) => {
    onUpdateField('timeframeMode', nextMode);
  };

  const handleAddonSelectionModeChange = (nextMode: AddonSelectionMode) => {
    onUpdateField('addonSelectionMode', nextMode);
  };

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

  const modeOptions: Array<{ id: TimeframeMode; label: string }> = [
    { id: 'off', label: copy.TIMEFRAME_MODES.OFF },
    { id: 'flexible', label: copy.TIMEFRAME_MODES.FLEXIBLE },
    { id: 'calendar', label: copy.TIMEFRAME_MODES.CALENDAR },
  ];

  const selectionOptions: Array<{ id: AddonSelectionMode; label: string }> = [
    { id: 'single', label: copy.ADDON_SELECT_MODES.SINGLE },
    { id: 'multiple', label: copy.ADDON_SELECT_MODES.MULTIPLE },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* GROUPED PROFILES + GENERAL DEPARTMENT HIGHLIGHTS */}
      {showHighlights && (
        <div className="space-y-5">
          <CollectionProfilesEditor
            profiles={collectionProfiles}
            deptCollections={deptCollections}
            onChange={(updated) => onUpdateField('collectionProfiles', updated)}
          />

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <List size={12} className="text-cyan-400" />
                {collectionProfiles.length > 0
                  ? 'General Department Highlights'
                  : blueprint.deliverablesLabel}
              </label>
              <span className="text-[10px] text-zinc-500 font-mono">Up to 4 shown on card</span>
            </div>

            {bullets.length === 0 ? (
              <div className="py-5 px-4 text-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 space-y-1.5">
                <Sparkles className="w-4 h-4 text-zinc-600 mx-auto" />
                <p className="text-[11px] text-zinc-500">
                  {collectionProfiles.length > 0
                    ? 'Optional: Add studio-wide highlights shown beneath the Spotlight Cards.'
                    : 'Add up to 4 quick highlights shown across the bottom of this card.'}
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
        </div>
      )}

      {/* INQUIRY ACTIONS + 3-WAY TIMING SWITCH + OPTIONS + FAQS */}
      {showInquiry && (
        <div className="space-y-4">
          {/* Action Buttons & External Booking Link (e.g., Vagaro / Square / Calendly) */}
          <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <MousePointerClick size={13} className="text-cyan-400" />
              <span>Buttons & Direct Booking</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Primary Inquiry Button Text
              </label>
              <input
                type="text"
                value={cap.ctaLabel || ''}
                onChange={(e) => onUpdateField('ctaLabel', e.target.value)}
                placeholder="Quick Inquiry (default)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Details / Gallery Button Text
              </label>
              <input
                type="text"
                value={cap.detailsLabel || ''}
                onChange={(e) => onUpdateField('detailsLabel', e.target.value)}
                placeholder="Auto (Photos & Details / Policies)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <ExternalLink size={11} className="text-emerald-400" />
                <span>Direct Booking Link (Optional)</span>
              </label>
              <input
                type="url"
                value={cap.bookingUrl || ''}
                onChange={(e) => onUpdateField('bookingUrl', e.target.value)}
                placeholder="https://www.vagaro.com/..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-emerald-300 placeholder:text-zinc-600 focus:border-emerald-500 outline-none"
              />
            </div>

            {hasBookingUrl && (
              <div className="space-y-1 animate-in fade-in duration-150">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Booking Button Text
                </label>
                <input
                  type="text"
                  value={cap.bookingLabel || ''}
                  onChange={(e) => onUpdateField('bookingLabel', e.target.value)}
                  placeholder="Book Online (default)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:border-emerald-500 outline-none"
                />
              </div>
            )}
          </div>

          {/* 3-Way Preferred Timing Switch (Off / Flexible / + Calendar) */}
          <div
            className={`p-3 rounded-xl border space-y-2.5 transition-colors ${
              isTimingActive
                ? 'bg-fuchsia-500/10 border-fuchsia-500/40'
                : 'bg-zinc-900/50 border-zinc-800'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                <CalendarClock
                  size={13}
                  className={isTimingActive ? 'text-fuchsia-400' : 'text-zinc-500'}
                />
                <span>{copy.TIMEFRAME_MODE_LABEL}</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                {copy.TIMEFRAME_MODE_HELPER}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 rounded-lg bg-zinc-950 border border-zinc-800">
              {modeOptions.map((opt) => {
                const active = timeframeMode === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleTimeframeModeChange(opt.id)}
                    className={`py-1.5 px-2 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      active
                        ? opt.id === 'off'
                          ? 'bg-zinc-800 text-white'
                          : 'bg-fuchsia-500 text-white shadow-sm'
                        : 'text-zinc-500 hover:text-zinc-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Inquiry Options + Pick One / Select Any Switch */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between gap-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                <Layers size={12} className="text-fuchsia-400" />
                {blueprint.optionsLabel} ({addons.length})
              </label>

              <div className="flex items-center gap-0.5 p-0.5 rounded-md bg-zinc-950 border border-zinc-800 shrink-0">
                {selectionOptions.map((opt) => {
                  const active = addonSelectionMode === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleAddonSelectionModeChange(opt.id)}
                      className={`px-2 py-1 rounded font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        active
                          ? 'bg-fuchsia-500 text-white shadow-sm'
                          : 'text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed">{copy.OPTIONS_HELPER}</p>

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