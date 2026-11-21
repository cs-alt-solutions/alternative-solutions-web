/* src/components/dashboard/storefronts/editor/CapabilitiesTab.tsx */
/* Architecture Note: Renders the "Services / Menu / Departments" Tab + Content Flow Selector */
'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Briefcase, Utensils, Trash2, Layers, Sparkles } from 'lucide-react';
import CategoryAccordion from './capabilities/CategoryAccordion';
import EditorAccordion from './shared/EditorAccordion';
import { ContentSelector } from './core/VisualArchitecture/LayoutSelectors';
import {
  EDITOR_WORKSPACE_COPY, THEME_CONSTRAINTS, getActiveBlueprint
} from '@/config/dashboard/editor';

export default function CapabilitiesTab({
  formData, setFormData, onReload, isClientPortal = false
}: {
  formData: any; setFormData: any; onReload?: () => void; isClientPortal?: boolean;
}) {
  const [localCaps, setLocalCaps] = useState<any[]>([]);
  const [openCapIndex, setOpenCapIndex] = useState<number | null>(null);
  const [isFlowOpen, setIsFlowOpen] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'primary' | 'addons'>('primary');

  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB;
  const isHub = formData?.engine_mode === 'hub' || formData?.content_layout === 'hub';
  const blueprint = getActiveBlueprint(formData?.industry_tag, isHub ? 'hub' : formData?.engine_mode);
  const isMenuLayout = formData?.content_layout === 'menu';
  const isCulinary = formData?.industry_tag === 'Culinary';

  const currentTheme = formData.theme_style || 'industrial';
  const allowedLayouts = THEME_CONSTRAINTS[currentTheme] || THEME_CONSTRAINTS['industrial'];

  useEffect(() => {
    if (formData.capabilities) {
      const normalized = formData.capabilities.map((c: any) =>
        typeof c === 'string'
          ? { title: c, description: '', price: '', bullets: [], isAlaCarte: false }
          : { ...c, bullets: c.bullets || [] }
      );
      setLocalCaps(normalized);
    }
  }, [formData.capabilities]);

  const addPackage = () => {
    const updated = [{
      title: '',
      description: '',
      price: isMenuLayout ? 'All Day' : '',
      bullets: [],
      isAlaCarte: false
    }, ...localCaps];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setActiveSubTab('primary');
    setOpenCapIndex(0);
  };

  const addAddon = () => {
    const updated = [...localCaps, {
      title: '',
      description: '',
      price: '',
      bullets: [],
      isAlaCarte: true
    }];
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
    setActiveSubTab('addons');
  };

  const handleUpdateAddon = (index: number, field: string, value: string) => {
    const updated = [...localCaps];
    updated[index] = { ...updated[index], [field]: value };
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const removeCapability = (index: number) => {
    const updated = localCaps.filter((_, i) => i !== index);
    setLocalCaps(updated);
    setFormData((prev: any) => ({ ...prev, capabilities: updated }));
  };

  const packages = localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter(c => !c.isAlaCarte);
  const addons = localCaps.map((c, i) => ({ ...c, originalIndex: i })).filter(c => c.isAlaCarte);

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

      {/* 1. COMPACT SEGMENTED SWITCHER + PRIMARY ADD ACTION */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-lg flex-1 min-w-0">
          <button
            type="button"
            onClick={() => setActiveSubTab('primary')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer truncate ${
              activeSubTab === 'primary'
                ? (isCulinary
                    ? 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30')
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
              activeSubTab === 'addons'
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
          onClick={activeSubTab === 'primary' ? addPackage : addAddon}
          className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer px-2.5 py-2 rounded-lg border shrink-0 ${
            activeSubTab === 'addons' || isCulinary
              ? 'text-fuchsia-400 hover:text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/25 hover:bg-fuchsia-500/20'
              : 'text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border-cyan-500/25 hover:bg-cyan-500/20'
          }`}
          title={activeSubTab === 'primary' ? blueprint.addPrimaryBtn : copy.ADD_ADDON_BTN}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* 2. ACTIVE SUB-TAB CONTENT */}
      {activeSubTab === 'primary' ? (
        <div className="space-y-1.5">
          {packages.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25">
              <p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
                {blueprint.emptyPrimaryText}
              </p>
            </div>
          ) : (
            packages.map((cap) => (
              <CategoryAccordion
                key={cap.originalIndex}
                cap={cap}
                index={cap.originalIndex}
                isOpen={openCapIndex === cap.originalIndex}
                setOpenCapIndex={setOpenCapIndex}
                localCaps={localCaps}
                setLocalCaps={setLocalCaps}
                formData={formData}
                setFormData={setFormData}
                onReload={onReload}
              />
            ))
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