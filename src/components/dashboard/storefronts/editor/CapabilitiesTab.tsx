/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
/* Architecture Note: Renders the "Services / Menu / Departments" Tab with Visual List + Drill-In Focus Mode */
'use client';

import React, { useState, useMemo } from 'react';
import {
  Plus,
  Briefcase,
  Utensils,
  Trash2,
  Layers,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import CategoryAccordion from './capabilities/CategoryAccordion';
import EditorAccordion from './shared/EditorAccordion';
import { ContentSelector } from './core/VisualArchitecture/LayoutSelectors';
import {
  EDITOR_WORKSPACE_COPY,
  THEME_CONSTRAINTS,
  getActiveBlueprint,
} from '@/config/dashboard/editor';

export default function CapabilitiesTab({
  formData,
  setFormData,
  onReload,
  isClientPortal = false,
}: {
  formData: any;
  setFormData: any;
  onReload?: () => void;
  isClientPortal?: boolean;
}) {
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(null);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'primary' | 'addons'>('primary');

  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const isMenuLayout = formData?.content_layout === 'menu';
  const isCulinary = formData?.industry_tag === 'Culinary';
  const effectiveSubTab = isHub ? 'primary' : activeSubTab;

  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  const localCaps = useMemo<any[]>(() => {
    if (!Array.isArray(formData.capabilities)) return [];
    return formData.capabilities.map((c: any) =>
      typeof c === 'string'
        ? { title: c, description: '', price: '', bullets: [], isAlaCarte: false }
        : { ...c, bullets: c.bullets || [] }
    );
  }, [formData.capabilities]);

  const normalizedGallery = useMemo<any[]>(() => {
    if (!Array.isArray(formData.gallery_items)) return [];
    return formData.gallery_items.map((item: any, i: number) => {
      if (typeof item === 'string') {
        return { id: `gal-${i}`, imageUrl: item, category: '', isVisible: true };
      }
      return { ...item, id: item.id || `gal-${i}`, isVisible: item.isVisible !== false };
    });
  }, [formData.gallery_items]);

  const packages = useMemo(
    () => localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter((c) => !c.isAlaCarte),
    [localCaps]
  );

  const addons = useMemo(
    () => localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter((c) => c.isAlaCarte),
    [localCaps]
  );

  const addPackage = () => {
    const updated = [
      {
        title: '',
        description: '',
        price: isMenuLayout ? 'All Day' : '',
        bullets: [],
        isAlaCarte: false,
      },
      ...localCaps,
    ];
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setActiveSubTab('primary');
    setOpenCapIndex(0);
  };

  const addAddon = () => {
    const updated = [
      ...localCaps,
      {
        title: '',
        description: '',
        price: '',
        bullets: [],
        isAlaCarte: true,
      },
    ];
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setActiveSubTab('addons');
    setOpenCapIndex(null);
  };

  const handleUpdateAddon = (index: number, field: string, value: string) => {
    const updated = localCaps.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCapability = (index: number) => {
    const updated = localCaps.filter((_, i) => i !== index);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    if (openCapIndex === index) {
      setOpenCapIndex(null);
    } else if (openCapIndex !== null && openCapIndex > index) {
      setOpenCapIndex(openCapIndex - 1);
    }
  };

  const movePackage = (pkgPos: number, direction: 'up' | 'down') => {
    const targetPos = direction === 'up' ? pkgPos - 1 : pkgPos + 1;
    if (targetPos < 0 || targetPos >= packages.length) return;
    const fromIdx = packages[pkgPos].originalIndex;
    const toIdx = packages[targetPos].originalIndex;
    const updated = [...localCaps];
    [updated[fromIdx], updated[toIdx]] = [updated[toIdx], updated[fromIdx]];
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  // Resolve active focused package (Level 2 Drill-In Mode)
  const focusedPkgPos =
    effectiveSubTab === 'primary' && openCapIndex !== null
      ? packages.findIndex((p) => p.originalIndex === openCapIndex)
      : -1;
  const focusedCap = focusedPkgPos >= 0 ? packages[focusedPkgPos] : null;

  // LEVEL 2: DRILL-IN FOCUS VIEW
  if (focusedCap) {
    return (
      <div className="animate-in fade-in slide-in-from-right-2 duration-200 pb-12 pt-2">
        <CategoryAccordion
          cap={focusedCap}
          index={focusedCap.originalIndex}
          displayNumber={focusedPkgPos + 1}
          totalPackages={packages.length}
          onBack={() => setOpenCapIndex(null)}
          onPrev={
            focusedPkgPos > 0
              ? () => setOpenCapIndex(packages[focusedPkgPos - 1].originalIndex)
              : undefined
          }
          onNext={
            focusedPkgPos < packages.length - 1
              ? () => setOpenCapIndex(packages[focusedPkgPos + 1].originalIndex)
              : undefined
          }
          onRemove={() => removeCapability(focusedCap.originalIndex)}
          localCaps={localCaps}
          formData={formData}
          setFormData={setFormData}
          onReload={onReload}
        />
      </div>
    );
  }

  // LEVEL 1: VISUAL DIRECTORY LIST VIEW
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 pt-3">
      {/* 0. CONTENT FLOW SELECTOR (Admin Only) */}
      {!isClientPortal && (
        <EditorAccordion
          title={copy.FLOW_ACCORDION}
          icon={Layers}
          accentColor="emerald"
          hidePercentage={true}
          isOpen={isFlowOpen}
          onToggle={() => setIsFlowOpen(!isFlowOpen)}
        >
          <div className="space-y-3">
            <p className="text-[10px] text-zinc-400 leading-relaxed">{copy.FLOW_HELPER}</p>
            <ContentSelector formData={formData} setFormData={setFormData} allowedLayouts={allowedLayouts} />
          </div>
        </EditorAccordion>
      )}

      {/* 1. HEADER BAR (Clean single bar in Hub mode; Segmented Switcher in Standard/Menu mode) */}
      {isHub ? (
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-2 px-1">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-200">
              {blueprint.primaryToggleLabel}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-400">
              {packages.length}
            </span>
          </div>

          <button
            type="button"
            onClick={addPackage}
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer px-3 py-1.5 rounded-lg border shrink-0 text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/25 hover:bg-cyan-500/20"
            title={blueprint.addPrimaryBtn}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-lg flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setActiveSubTab('primary')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer truncate ${
                effectiveSubTab === 'primary'
                  ? isCulinary
                    ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              {isCulinary ? <Utensils className="w-3 h-3 shrink-0" /> : <Briefcase className="w-3 h-3 shrink-0" />}
              <span className="truncate">{blueprint.primaryToggleLabel}</span>
              <span className="font-mono text-[9px] opacity-75">({packages.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSubTab('addons')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer truncate ${
                effectiveSubTab === 'addons'
                  ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              <Sparkles className="w-3 h-3 shrink-0" />
              <span className="truncate">{blueprint.addonsToggleLabel}</span>
              <span className="font-mono text-[9px] opacity-75">({addons.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={effectiveSubTab === 'primary' ? addPackage : addAddon}
            className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer px-2.5 py-2 rounded-lg border shrink-0 ${
              effectiveSubTab === 'addons' || isCulinary
                ? 'text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/25 hover:bg-fuchsia-500/20'
                : 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/25 hover:bg-cyan-500/20'
            }`}
            title={effectiveSubTab === 'primary' ? blueprint.addPrimaryBtn : copy.ADD_ADDON_BTN}
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      )}

      {/* 2. ACTIVE SUB-TAB CONTENT */}
      {effectiveSubTab === 'primary' ? (
        <div className="space-y-2">
          {packages.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 space-y-2.5">
              <p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
                {blueprint.emptyPrimaryText}
              </p>
              <button
                type="button"
                onClick={addPackage}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                <Plus className="w-3 h-3" /> {blueprint.addPrimaryBtn}
              </button>
            </div>
          ) : (
            packages.map((cap, pkgPos) => {
              const titleKey = (cap.title || '').trim().toLowerCase();
              const linkedPhotos = titleKey
                ? normalizedGallery.filter(
                    (img) =>
                      img.isVisible !== false &&
                      img.imageUrl &&
                      (img.category || '').trim().toLowerCase() === titleKey
                  )
                : [];
              const thumbUrl = linkedPhotos[0]?.imageUrl || cap.coverImage || '';
              const highlightsCount = Array.isArray(cap.bullets)
                ? cap.bullets.filter((b: string) => b && b.trim()).length
                : 0;
              const faqsCount = Array.isArray(cap.faqs)
                ? cap.faqs.filter((f: any) => f && f.question?.trim()).length
                : 0;
              const indexLabel = pkgPos + 1 < 10 ? `0${pkgPos + 1}` : `${pkgPos + 1}`;

              const metaParts: string[] = isMenuLayout
                ? [
                    `${linkedPhotos.length} ${linkedPhotos.length === 1 ? 'Card' : 'Cards'}`,
                    cap.price || 'All Day',
                  ]
                : [
                    `${highlightsCount} ${highlightsCount === 1 ? 'Highlight' : 'Highlights'}`,
                    `${linkedPhotos.length} ${linkedPhotos.length === 1 ? 'Photo' : 'Photos'}`,
                    ...(faqsCount > 0 ? [`${faqsCount} ${faqsCount === 1 ? 'FAQ' : 'FAQs'}`] : []),
                  ];

              return (
                <div
                  key={cap.originalIndex}
                  onClick={() => setOpenCapIndex(cap.originalIndex)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setOpenCapIndex(cap.originalIndex);
                    }
                  }}
                  className="group flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 hover:border-cyan-500/40 hover:bg-zinc-900/80 transition-all cursor-pointer"
                >
                  {/* Visual Thumbnail or Numbered Placeholder */}
                  <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                    {thumbUrl ? (
                      <img
                        src={thumbUrl}
                        alt={cap.title || `Item ${indexLabel}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-4 h-4 text-zinc-700" />
                    )}
                    <span className="absolute bottom-0.5 left-0.5 px-1 py-px rounded bg-black/80 text-[9px] font-mono font-bold text-zinc-200 leading-none">
                      {indexLabel}
                    </span>
                  </div>

                  {/* Title + Quiet Counts */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {cap.title?.trim() || 'Untitled'}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">
                      {metaParts.join(' · ')}
                    </p>
                  </div>

                  {/* Quick Reorder + Delete + Drill-In Arrow */}
                  <div
                    className="flex items-center gap-0.5 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => movePackage(pkgPos, 'up')}
                        disabled={pkgPos === 0}
                        className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePackage(pkgPos, 'down')}
                        disabled={pkgPos === packages.length - 1}
                        className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeCapability(cap.originalIndex)}
                      className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {addons.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 space-y-2">
              <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">
                {copy.EMPTY_ADDONS}
              </p>
              <button
                type="button"
                onClick={addAddon}
                className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/25 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                <Plus className="w-3 h-3" /> {copy.ADD_ADDON_BTN}
              </button>
            </div>
          ) : (
            addons.map((addon) => (
              <div
                key={addon.originalIndex}
                className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg flex flex-col gap-2 group relative"
              >
                <button
                  type="button"
                  onClick={() => removeCapability(addon.originalIndex)}
                  className="absolute top-2.5 right-2.5 text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
                  title={copy.REMOVE_ADDON_TITLE}
                >
                  <Trash2 size={13} />
                </button>

                <div className="flex items-center gap-2 pr-6">
                  <input
                    value={addon.title}
                    onChange={(e) => handleUpdateAddon(addon.originalIndex, 'title', e.target.value)}
                    placeholder={copy.ADDON_NAME_PLACEHOLDER}
                    className="flex-1 min-w-0 bg-zinc-900/70 px-2.5 py-1.5 rounded-md border border-zinc-800 text-white text-xs focus:border-fuchsia-500 outline-none"
                  />
                  <input
                    value={addon.price}
                    onChange={(e) => handleUpdateAddon(addon.originalIndex, 'price', e.target.value)}
                    placeholder={copy.ADDON_PRICE_PLACEHOLDER}
                    className="w-20 shrink-0 bg-zinc-900/70 px-2.5 py-1.5 rounded-md border border-zinc-800 text-fuchsia-400 font-mono font-bold text-xs focus:border-fuchsia-500 outline-none"
                  />
                </div>

                <input
                  value={addon.description}
                  onChange={(e) => handleUpdateAddon(addon.originalIndex, 'description', e.target.value)}
                  placeholder={copy.ADDON_DESC_PLACEHOLDER}
                  className="w-full bg-zinc-900/70 px-2.5 py-1.5 rounded-md border border-zinc-800 text-zinc-300 text-[11px] focus:border-fuchsia-500 outline-none"
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}