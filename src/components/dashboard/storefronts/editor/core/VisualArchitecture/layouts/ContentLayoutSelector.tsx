/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/ContentLayoutSelector.tsx */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { VISUAL_ARCH_COPY, ALL_CONTENTS } from '@/config/dashboard/editor';
import { AdvancedToggle, LayoutOptionCard } from './LayoutCardPrimitives';

const ADVANCED_CONTENT_IDS = ['accordion', 'menu', 'lookbook', 'hub'];

export default function ContentLayoutSelector({ formData, setFormData, allowedLayouts }: any) {
  const L = VISUAL_ARCH_COPY.LAYOUTS.LABELS;
  const activeId = formData?.content_layout || 'classic';

  const CONTENT_NAME_MAP: Record<string, string> = {
    classic: L.STACKED,
    bento: L.BENTO,
    sticky: L.STICKY,
    editorial: L.EDITORIAL,
    accordion: L.ACCORDION,
    menu: L.MENU,
    lookbook: L.LOOKBOOK,
    hub: L.HUB,
  };

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(() => ADVANCED_CONTENT_IDS.includes(activeId));

  const handleSelect = (val: string) => {
    setFormData((prev: any) => ({ ...prev, content_layout: val }));
    setIsPickerOpen(false);
  };

  const isActive = (id: string, isDefault = false) =>
    formData.content_layout === id || (isDefault && !formData.content_layout);

  return (
    <div className="space-y-3">
      {/* COMPACT ACTIVE LAYOUT SUMMARY BAR */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
        <div className="min-w-0">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            {VISUAL_ARCH_COPY.LAYOUTS.ACTIVE_LAYOUT}
          </span>
          <span className="block text-xs font-black uppercase tracking-wide text-white truncate mt-0.5">
            {CONTENT_NAME_MAP[activeId] || L.STACKED}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen((prev) => !prev)}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
            isPickerOpen
              ? 'bg-emerald-500 text-zinc-950 border-emerald-500'
              : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-emerald-500/60 hover:text-white'
          }`}
        >
          <SlidersHorizontal size={11} />
          <span>{isPickerOpen ? VISUAL_ARCH_COPY.LAYOUTS.DONE_LAYOUT : VISUAL_ARCH_COPY.LAYOUTS.CHANGE_LAYOUT}</span>
          {isPickerOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* EXPANDABLE VISUAL LAYOUT PICKER */}
      {isPickerOpen && (
        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-3">
            <LayoutOptionCard active={isActive('classic', true)} disabled={!allowedLayouts.content.includes('classic')} label={L.STACKED} onClick={() => handleSelect('classic')}>
              <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-1 rounded">
                <div className="w-full h-2.5 bg-zinc-600 rounded-sm" />
                <div className="w-full h-2.5 bg-zinc-600 rounded-sm" />
              </div>
            </LayoutOptionCard>

            <LayoutOptionCard active={isActive('bento')} disabled={!allowedLayouts.content.includes('bento')} label={L.BENTO} onClick={() => handleSelect('bento')}>
              <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 grid grid-cols-2 gap-1 p-1 rounded">
                <div className="w-full h-full bg-fuchsia-500/50 rounded-sm" />
                <div className="w-full h-full bg-zinc-600 rounded-sm" />
                <div className="w-full h-full bg-zinc-600 rounded-sm" />
                <div className="w-full h-full bg-fuchsia-500/50 rounded-sm" />
              </div>
            </LayoutOptionCard>

            <LayoutOptionCard active={isActive('sticky')} disabled={!allowedLayouts.content.includes('sticky')} label={L.STICKY} onClick={() => handleSelect('sticky')}>
              <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded">
                <div className="w-1/3 h-full bg-fuchsia-500/50 rounded-sm" />
                <div className="w-2/3 h-full flex flex-col gap-0.5">
                  <div className="w-full h-1/2 bg-zinc-600 rounded-sm" />
                  <div className="w-full h-1/2 bg-zinc-600 rounded-sm" />
                </div>
              </div>
            </LayoutOptionCard>

            <LayoutOptionCard active={isActive('editorial')} disabled={!allowedLayouts.content.includes('editorial')} label={L.EDITORIAL} onClick={() => handleSelect('editorial')}>
              <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 rounded">
                <div className="w-3/4 h-1 bg-fuchsia-500/80 rounded-sm" />
                <div className="w-1/2 h-1 bg-zinc-600 rounded-sm" />
                <div className="w-2/3 h-1 bg-zinc-600 rounded-sm" />
              </div>
            </LayoutOptionCard>
          </div>

          {showAdvanced && (
            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <LayoutOptionCard active={isActive('accordion')} disabled={!allowedLayouts.content.includes('accordion')} label={L.ACCORDION} onClick={() => handleSelect('accordion')}>
                <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-0.5 rounded">
                  <div className="w-full h-1.5 bg-fuchsia-500/50 rounded-sm" />
                  <div className="w-full h-1 bg-zinc-600 rounded-sm" />
                  <div className="w-full h-1 bg-zinc-600 rounded-sm" />
                  <div className="w-full h-1 bg-zinc-600 rounded-sm" />
                </div>
              </LayoutOptionCard>

              <LayoutOptionCard active={isActive('menu')} disabled={!allowedLayouts.content.includes('menu')} label={L.MENU} onClick={() => handleSelect('menu')}>
                <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-1 rounded items-center justify-center">
                  <div className="w-2/3 h-1.5 bg-fuchsia-500/80 rounded-sm" />
                  <div className="w-full flex justify-between gap-1 px-1"><div className="w-1/2 h-1 bg-zinc-500 rounded-sm" /><div className="w-1/4 h-1 bg-zinc-400 rounded-sm" /></div>
                  <div className="w-full flex justify-between gap-1 px-1"><div className="w-1/2 h-1 bg-zinc-500 rounded-sm" /><div className="w-1/4 h-1 bg-zinc-400 rounded-sm" /></div>
                </div>
              </LayoutOptionCard>

              <LayoutOptionCard active={isActive('lookbook')} disabled={!allowedLayouts.content.includes('lookbook')} label={L.LOOKBOOK} onClick={() => handleSelect('lookbook')}>
                <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded items-start justify-center">
                  <div className="w-1/2 flex flex-col gap-1"><div className="w-full h-6 bg-fuchsia-500/50 rounded-sm" /><div className="w-full h-3 bg-zinc-600 rounded-sm" /></div>
                  <div className="w-1/2 flex flex-col gap-1"><div className="w-full h-3 bg-zinc-600 rounded-sm" /><div className="w-full h-6 bg-fuchsia-500/50 rounded-sm" /></div>
                </div>
              </LayoutOptionCard>

              <LayoutOptionCard active={isActive('hub')} disabled={!allowedLayouts.content.includes('hub')} label={L.HUB} onClick={() => handleSelect('hub')}>
                <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded items-start justify-center">
                  <div className="w-1/3 h-full bg-fuchsia-500/50 rounded-sm" />
                  <div className="w-1/3 h-full bg-zinc-600 rounded-sm" />
                  <div className="w-1/3 h-full bg-zinc-600 rounded-sm" />
                </div>
              </LayoutOptionCard>
            </div>
          )}

          <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_CONTENTS.length > 4 ? ALL_CONTENTS.length - 4 : 0} />
        </div>
      )}
    </div>
  );
}