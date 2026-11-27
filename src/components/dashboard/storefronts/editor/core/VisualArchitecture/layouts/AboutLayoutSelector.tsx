/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/AboutLayoutSelector.tsx */
import React, { useState } from 'react';
import { VISUAL_ARCH_COPY, ALL_ABOUTS } from '@/config/dashboard/editor';
import { AdvancedToggle, LayoutOptionCard } from './LayoutCardPrimitives';

const ADVANCED_ABOUT_IDS = ['manifesto', 'wash', 'plaque', 'portrait'];

export default function AboutLayoutSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(() =>
    ADVANCED_ABOUT_IDS.includes(formData?.about_layout)
  );
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, about_layout: val }));
  const isActive = (id: string, isDefault = false) =>
    formData.about_layout === id || (isDefault && !formData.about_layout);
  const L = VISUAL_ARCH_COPY.LAYOUTS.LABELS;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <LayoutOptionCard active={isActive('split', true)} disabled={!allowedLayouts.about.includes('split')} label={L.CLASSIC_SPLIT} onClick={() => handleSelect('split')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
            <div className="w-1/2 h-full flex flex-col gap-1 justify-center">
              <div className="w-3/4 h-1 bg-zinc-400 rounded" />
              <div className="w-full h-0.5 bg-zinc-600 rounded" />
              <div className="w-5/6 h-0.5 bg-zinc-600 rounded" />
            </div>
          </div>
        </LayoutOptionCard>

        <LayoutOptionCard active={isActive('editorial')} disabled={!allowedLayouts.about.includes('editorial')} label={L.EDITORIAL} onClick={() => handleSelect('editorial')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center justify-center p-1 rounded relative">
            <div className="absolute left-1.5 top-1.5 w-1/2 h-6 bg-zinc-700 rounded-sm z-0" />
            <div className="absolute right-1.5 bottom-1.5 w-2/3 h-5 bg-zinc-800 border border-zinc-600 rounded-sm z-10 flex flex-col gap-0.5 p-1">
              <div className="w-full h-0.5 bg-zinc-400 rounded" />
              <div className="w-3/4 h-px bg-zinc-500 rounded" />
            </div>
          </div>
        </LayoutOptionCard>

        <LayoutOptionCard active={isActive('minimal')} disabled={!allowedLayouts.about.includes('minimal')} label={L.MINIMAL} onClick={() => handleSelect('minimal')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 rounded">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-1/2 h-0.5 bg-zinc-400 rounded" />
            <div className="w-3/4 h-px bg-zinc-600 rounded" />
          </div>
        </LayoutOptionCard>

        <LayoutOptionCard active={isActive('card')} disabled={!allowedLayouts.about.includes('card')} label={L.GLASS_CARD} onClick={() => handleSelect('card')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-800 mb-2 flex items-center justify-center p-1 rounded relative overflow-hidden">
            <div className="absolute inset-0 bg-zinc-600" />
            <div className="relative z-10 w-5/6 h-5/6 bg-zinc-950/60 border border-white/20 rounded-sm flex items-center p-1 gap-1">
              <div className="w-1/3 h-full bg-zinc-500/50 rounded-sm" />
              <div className="w-2/3 flex flex-col gap-0.5">
                <div className="w-full h-0.5 bg-zinc-300 rounded" />
                <div className="w-2/3 h-px bg-zinc-500 rounded" />
              </div>
            </div>
          </div>
        </LayoutOptionCard>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <LayoutOptionCard active={isActive('manifesto')} disabled={!allowedLayouts.about.includes('manifesto')} label={L.MANIFESTO} onClick={() => handleSelect('manifesto')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 px-2 rounded">
              <div className="w-2/3 h-1.5 bg-zinc-200 rounded-sm" />
              <div className="w-1/2 h-px bg-fuchsia-500/80" />
              <div className="w-5/6 h-0.5 bg-zinc-500 rounded" />
              <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard active={isActive('wash')} disabled={!allowedLayouts.about.includes('wash')} label={L.WASH} onClick={() => handleSelect('wash')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-800/70 mb-2 flex flex-col items-center justify-center gap-1 px-2 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-zinc-600/30 to-zinc-950/90" />
              <div className="relative z-10 w-2/3 h-1.5 bg-white rounded-sm" />
              <div className="relative z-10 w-1/2 h-px bg-fuchsia-500" />
              <div className="relative z-10 w-3/4 h-0.5 bg-zinc-300 rounded" />
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard active={isActive('plaque')} disabled={!allowedLayouts.about.includes('plaque')} label={L.PLAQUE} onClick={() => handleSelect('plaque')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1.5 rounded">
              <div className="w-full h-full border border-fuchsia-500/40 rounded-xs flex items-center gap-1.5 px-1.5">
                <div className="w-2/5 flex flex-col gap-0.5"><div className="w-full h-1.5 bg-zinc-300 rounded-xs" /><div className="w-1/2 h-px bg-fuchsia-500" /></div>
                <div className="w-3/5 flex flex-col gap-0.5"><div className="w-full h-0.5 bg-zinc-500 rounded" /><div className="w-5/6 h-0.5 bg-zinc-600 rounded" /><div className="w-2/3 h-0.5 bg-zinc-600 rounded" /></div>
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard active={isActive('portrait')} disabled={!allowedLayouts.about.includes('portrait')} label={L.PORTRAIT} onClick={() => handleSelect('portrait')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center gap-1.5 px-1.5 py-1 rounded">
              <div className="w-1/3 h-full border border-zinc-600 p-0.5 rounded-xs"><div className="w-full h-full bg-zinc-700 rounded-xs" /></div>
              <div className="w-2/3 flex flex-col gap-1"><div className="w-3/4 h-1 bg-zinc-300 rounded" /><div className="w-1/2 h-px bg-fuchsia-500" /><div className="w-full h-0.5 bg-zinc-500 rounded" /><div className="w-4/5 h-0.5 bg-zinc-600 rounded" /></div>
            </div>
          </LayoutOptionCard>
        </div>
      )}

      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_ABOUTS.length > 4 ? ALL_ABOUTS.length - 4 : 0} />
    </div>
  );
}