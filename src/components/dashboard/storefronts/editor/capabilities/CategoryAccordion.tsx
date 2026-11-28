/* src/components/dashboard/storefronts/editor/capabilities/CategoryAccordion.tsx */
/* Architecture Note: Drill-In Focus Editor for a single Department / Service / Menu Category */
'use client';

import React, { useState } from 'react';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Trash2,
  FileText,
  Sparkles,
  SlidersHorizontal,
  Image as ImageIcon,
  UtensilsCrossed,
} from 'lucide-react';
import MenuCardEditor from './MenuCardEditor';
import LinkedPoliciesBar from './category/LinkedPoliciesBar';
import StandardCategoryFields from './category/StandardCategoryFields';
import { EDITOR_WORKSPACE_COPY, getActiveBlueprint } from '@/config/dashboard/editor';

type FocusTab = 'pitch' | 'highlights' | 'inquiry' | 'photos' | 'cards';

export default function CategoryAccordion({
  cap,
  index,
  displayNumber = index + 1,
  totalPackages = 1,
  onBack,
  onPrev,
  onNext,
  onRemove,
  localCaps,
  formData,
  setFormData,
  onReload,
}: any) {
  const [focusTab, setFocusTab] = useState<FocusTab>('pitch');

  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const isMenuMode = formData?.content_layout === 'menu';
  const isAlaCarte = !!cap.isAlaCarte;

  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') {
      return { id: `gal-${i}`, imageUrl: item, title: '', description: '', category: '', price: '', isVisible: true };
    }
    return { ...item, id: item.id || `gal-${i}`, isVisible: item.isVisible !== false };
  });

  const titleKey = (cap.title || '').trim().toLowerCase();
  const categoryImages = titleKey
    ? liveGallery.filter((img: any) => (img.category || '').trim().toLowerCase() === titleKey)
    : [];

  const bulletsCount = Array.isArray(cap.bullets)
    ? cap.bullets.filter((b: string) => b && b.trim()).length
    : 0;
  const profilesCount = Array.isArray(cap.collectionProfiles)
    ? cap.collectionProfiles.filter((p: any) => p && p.name?.trim()).length
    : 0;
  const highlightsBadgeCount = bulletsCount + profilesCount;

  const addonsCount = Array.isArray(cap.addons) ? cap.addons.length : 0;
  const isTimingActive = cap.timeframeMode
    ? cap.timeframeMode !== 'off'
    : cap.askTimeframe === true;
  const hasCustomAction = Boolean(
    cap.ctaLabel?.trim() || cap.detailsLabel?.trim() || cap.bookingUrl?.trim()
  );
  const inquiryBadgeCount = addonsCount + (isTimingActive ? 1 : 0) + (hasCustomAction ? 1 : 0);
  const effectiveTab: FocusTab = isMenuMode
    ? focusTab === 'cards'
      ? 'cards'
      : 'pitch'
    : focusTab === 'cards'
      ? 'pitch'
      : focusTab;

  const updateTitle = (newTitle: string) => {
    const oldTitle = localCaps[index]?.title;

    setFormData((prev: any) => {
      const updatedFormDataCaps = (prev.capabilities || []).map((item: any, i: number) =>
        i === index ? { ...item, title: newTitle } : item
      );

      const updatedGallery = (prev.gallery_items || []).map((item: any) =>
        oldTitle !== undefined && item.category === oldTitle ? { ...item, category: newTitle } : item
      );

      const updatedTerms = Array.isArray(prev.operational_terms)
        ? prev.operational_terms.map((term: any) =>
            oldTitle && term.appliesTo === oldTitle ? { ...term, appliesTo: newTitle } : term
          )
        : prev.operational_terms;

      return {
        ...prev,
        capabilities: updatedFormDataCaps,
        gallery_items: updatedGallery,
        operational_terms: updatedTerms,
      };
    });
  };

  const updateField = (field: string, value: any) => {
    const updated = localCaps.map((item: any, i: number) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const addBlankCard = () => {
    const newId = `card-${Date.now()}`;
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: [
        { id: newId, imageUrl: '', title: '', description: '', price: '', category: cap.title, isVisible: true },
        ...(prev.gallery_items || []),
      ],
    }));
  };

  const currentAvailability = isMenuMode ? cap.price || 'All Day' : cap.price || '';
  const indexLabel = displayNumber < 10 ? `0${displayNumber}` : `${displayNumber}`;

  const tabs: Array<{ id: FocusTab; label: string; icon: React.ElementType; count?: number }> = isMenuMode
    ? [
        { id: 'pitch', label: 'Details', icon: FileText },
        { id: 'cards', label: 'Menu Cards', icon: UtensilsCrossed, count: categoryImages.length },
      ]
    : [
        { id: 'pitch', label: 'Pitch', icon: FileText },
        { id: 'highlights', label: 'Highlights', icon: Sparkles, count: highlightsBadgeCount },
        { id: 'inquiry', label: 'Inquiry', icon: SlidersHorizontal, count: inquiryBadgeCount },
        { id: 'photos', label: 'Photos', icon: ImageIcon, count: categoryImages.length },
      ];

  return (
    <div className="flex flex-col rounded-xl bg-zinc-950 border border-zinc-800/90 overflow-hidden shadow-lg">
      {/* STICKY ANCHOR HEADER — Always know exactly which department you're editing */}
      <div className="sticky top-0 z-20 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/90 p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-bold uppercase tracking-wider text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>All {blueprint.primaryToggleLabel}</span>
          </button>

          <div className="flex items-center gap-1">
            {totalPackages > 1 && (
              <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                <button
                  type="button"
                  onClick={onPrev}
                  disabled={!onPrev}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 cursor-pointer"
                  title="Previous"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[9px] font-mono text-zinc-400">
                  {displayNumber}/{totalPackages}
                </span>
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!onNext}
                  className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 disabled:opacity-25 cursor-pointer"
                  title="Next"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Active Department Title Anchor */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-[10px] font-bold shrink-0">
            {indexLabel}
          </span>
          <h3 className="text-sm font-black text-white truncate">
            {cap.title?.trim() || 'Untitled'}
          </h3>
        </div>

        {/* 4 Bite-Sized Sub-Tabs (2 in Menu Mode) */}
        <div
          className={`grid gap-1 p-1 rounded-lg bg-black/60 border border-zinc-800/80 ${
            isMenuMode ? 'grid-cols-2' : 'grid-cols-4'
          }`}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = effectiveTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFocusTab(tab.id)}
                className={`flex flex-col items-center justify-center gap-1 py-1.5 px-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1">
                  <Icon className="w-3 h-3 shrink-0" />
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className="font-mono text-[9px] opacity-80">{tab.count}</span>
                  )}
                </div>
                <span className="truncate max-w-full">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* FOCUSED TAB BODY */}
      <div className="p-4 space-y-4">
        {effectiveTab === 'pitch' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                {isHub ? 'Department Name' : isMenuMode ? 'Category Name' : 'Service Name'}
              </label>
              <input
                type="text"
                value={cap.title || ''}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder={isAlaCarte ? copy.ADDON_NAME_PLACEHOLDER : blueprint.titlePlaceholder}
                className="w-full bg-zinc-900/70 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-white font-bold outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            {/* Availability (Menu) or Starting Price (Standard) */}
            {isMenuMode ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Availability
                </label>
                <div className="relative">
                  <select
                    value={currentAvailability}
                    onChange={(e) => updateField('price', e.target.value)}
                    className="w-full bg-zinc-900/70 border border-zinc-800 rounded-lg pl-3 pr-8 py-2.5 text-xs font-bold text-emerald-400 outline-none focus:border-emerald-500 transition-colors appearance-none cursor-pointer"
                  >
                    {copy.AVAILABILITY_OPTIONS.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={13}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-emerald-500/60 pointer-events-none"
                  />
                </div>
              </div>
            ) : !isHub ? (
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                  Starting Price / Rate
                </label>
                <input
                  type="text"
                  value={cap.price === 'All Day' ? '' : cap.price || ''}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder={blueprint.pricePlaceholder}
                  className="w-full bg-zinc-900/70 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-fuchsia-400 font-bold outline-none focus:border-fuchsia-500 transition-colors"
                />
              </div>
            ) : null}

            {/* Overview Description */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">
                Overview / Description
              </label>
              <textarea
                value={cap.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder={copy.SHORT_DESC_PLACEHOLDER}
                rows={4}
                className="w-full bg-zinc-900/70 border border-zinc-800 rounded-lg px-3 py-2.5 text-xs text-zinc-200 leading-relaxed outline-none focus:border-cyan-500 transition-colors resize-none"
              />
            </div>

            {!isAlaCarte && (
              <LinkedPoliciesBar
                categoryTitle={cap.title}
                operationalTerms={formData.operational_terms}
              />
            )}
          </div>
        )}

        {effectiveTab === 'cards' && isMenuMode && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest flex items-center gap-1.5">
                <ImageIcon size={12} /> {copy.MENU_CARDS_LABEL} ({categoryImages.length})
              </label>
              <button
                type="button"
                onClick={addBlankCard}
                className="text-[10px] font-bold text-zinc-300 hover:text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/25 px-2.5 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus size={11} /> {copy.ADD_BLANK_CARD_BTN}
              </button>
            </div>

            {categoryImages.length === 0 ? (
              <p className="text-xs text-zinc-500 italic py-4 text-center border border-dashed border-zinc-800 rounded-xl">
                {copy.EMPTY_MENU_CARDS}
              </p>
            ) : (
              <div className="space-y-2.5">
                {categoryImages.map((img: any, i: number) => (
                  <MenuCardEditor
                    key={img.id || `gal-${i}`}
                    img={img}
                    index={i}
                    categoryImagesCount={categoryImages.length}
                    localCaps={localCaps}
                    isMenuMode={isMenuMode}
                    formData={formData}
                    setFormData={setFormData}
                    onReload={onReload}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {!isMenuMode && !isAlaCarte && effectiveTab !== 'pitch' && (
          <StandardCategoryFields
            cap={cap}
            storefrontId={formData.id}
            galleryItems={formData.gallery_items || []}
            setFormData={setFormData}
            blueprint={blueprint}
            onUpdateField={updateField}
            activeSection={effectiveTab as 'highlights' | 'inquiry' | 'photos'}
          />
        )}
      </div>
    </div>
  );
}