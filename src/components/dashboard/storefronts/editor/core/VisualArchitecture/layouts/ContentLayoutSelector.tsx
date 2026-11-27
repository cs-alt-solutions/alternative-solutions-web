/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/ContentLayoutSelector.tsx */
import React, { useState } from 'react';
import { VISUAL_ARCH_COPY, ALL_CONTENTS } from '@/config/dashboard/editor';
import { AdvancedToggle, LayoutOptionCard } from './LayoutCardPrimitives';

const ADVANCED_CONTENT_IDS = ['accordion', 'menu', 'lookbook', 'hub'];

export default function ContentLayoutSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(() =>
    ADVANCED_CONTENT_IDS.includes(formData?.content_layout)
  );
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, content_layout: val }));
  const isActive = (id: string, isDefault = false) =>
    formData.content_layout === id || (isDefault && !formData.content_layout);
  const L = VISUAL_ARCH_COPY.LAYOUTS.LABELS;

  return (
    <div className="space-y-3">
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
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
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
  );
}