/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/HeroLayoutSelector.tsx */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { VISUAL_ARCH_COPY, MASTHEAD_FONTS } from '@/config/dashboard/editor';
import { HERO_NAME_MAP, composeMastheadLayout } from './LayoutCardPrimitives';
import HeroWireframes from './HeroWireframes';
import MastheadStudioCard from './MastheadStudioCard';

export default function HeroLayoutSelector({ formData, setFormData, allowedLayouts }: any) {
  const currentHero = formData?.hero_layout || '';
  const [heroBase = 'center', heroFont = 'default', heroColor = 'default'] = (currentHero || 'center').split('--');
  const isMastheadActive = heroBase === 'masthead' || heroBase === 'masthead-wash';
  const isPureMasthead = heroBase === 'masthead';

  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const handleSelect = (val: string, collapseAfter = true) => {
    setFormData((prev: any) => ({ ...prev, hero_layout: val }));
    if (collapseAfter) setIsPickerOpen(false);
  };

  const activeLayoutLabel = HERO_NAME_MAP[heroBase] || VISUAL_ARCH_COPY.LAYOUTS.LABELS.CENTERED;
  const activeFontLabel = MASTHEAD_FONTS.find((f) => f.id === heroFont)?.label || 'Theme Default';
  const activeColorLabel =
    heroColor === 'primary'
      ? 'Primary'
      : heroColor === 'duotone'
        ? 'Brand 2-Tone'
        : heroColor === 'gold'
          ? 'Yellow Gold'
          : heroColor.startsWith('hex-')
            ? heroColor.slice(4).includes('-')
              ? 'Custom 2-Tone'
              : 'Custom Solid'
            : 'Default';

  return (
    <div className="space-y-3">
      {/* COMPACT ACTIVE LAYOUT SUMMARY BAR */}
      <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800">
        <div className="min-w-0">
          <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            {VISUAL_ARCH_COPY.LAYOUTS.ACTIVE_LAYOUT}
          </span>
          <div className="flex items-center gap-2 flex-wrap mt-0.5">
            <span className="text-xs font-black uppercase tracking-wide text-white truncate">
              {activeLayoutLabel}
            </span>
            {isMastheadActive && (
              <span className="px-1.5 py-0.5 rounded bg-fuchsia-500/15 border border-fuchsia-500/30 text-[9px] font-mono text-fuchsia-300 uppercase">
                {activeFontLabel} · {activeColorLabel}
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsPickerOpen((prev) => !prev)}
          className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all cursor-pointer ${
            isPickerOpen
              ? 'bg-fuchsia-500 text-zinc-950 border-fuchsia-500'
              : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-fuchsia-500/60 hover:text-white'
          }`}
        >
          <SlidersHorizontal size={11} />
          <span>{isPickerOpen ? VISUAL_ARCH_COPY.LAYOUTS.DONE_LAYOUT : VISUAL_ARCH_COPY.LAYOUTS.CHANGE_LAYOUT}</span>
          {isPickerOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* EXPANDABLE VISUAL LAYOUT PICKER */}
      {isPickerOpen && (
        <HeroWireframes
          currentHero={currentHero}
          heroBase={heroBase}
          isMastheadActive={isMastheadActive}
          allowedHeroes={allowedLayouts.hero}
          onSelect={(val) => handleSelect(val, true)}
        />
      )}

      {/* CONTEXTUAL MASTHEAD STUDIO */}
      {isMastheadActive && (
        <MastheadStudioCard
          heroBase={heroBase as 'masthead' | 'masthead-wash'}
          heroFont={heroFont}
          heroColor={heroColor}
          brandColor={formData?.brand_color}
          secondaryBrandColor={formData?.secondary_brand_color}
          onUpdate={(nextBase, nextFont, nextColor) =>
            handleSelect(composeMastheadLayout(nextBase, nextFont, nextColor), false)
          }
        />
      )}

      {/* LOCK HERO BACKGROUND (Hidden on Pure Wall Masthead) */}
      {!isPureMasthead && (
        <label
          className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800/80 cursor-pointer group hover:border-zinc-700 transition-colors"
          title={VISUAL_ARCH_COPY.LAYOUTS.LOCK_BG_TITLE}
        >
          <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${formData.is_hero_fixed ? 'text-fuchsia-400' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
            {VISUAL_ARCH_COPY.LAYOUTS.LOCK_BG}
          </span>
          <div className="relative shrink-0">
            <input
              type="checkbox"
              className="sr-only"
              checked={formData.is_hero_fixed || false}
              onChange={(e) => setFormData((prev: any) => ({ ...prev, is_hero_fixed: e.target.checked }))}
            />
            <div className={`block w-8 h-4 rounded-full transition-colors ${formData.is_hero_fixed ? 'bg-fuchsia-500' : 'bg-zinc-800 border border-zinc-700'}`} />
            <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${formData.is_hero_fixed ? 'translate-x-4' : ''}`} />
          </div>
        </label>
      )}
    </div>
  );
}