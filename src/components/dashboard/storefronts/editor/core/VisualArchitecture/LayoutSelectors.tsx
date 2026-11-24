/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/LayoutSelectors.tsx */
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { VISUAL_ARCH_COPY, MASTHEAD_FONTS, ALL_CONTENTS, ALL_ABOUTS } from '@/config/dashboard/editor';

const ADVANCED_HERO_BASES = [
  'glass',
  'editorial-frame',
  'arch-spotlight',
  'bento-hero',
  'bottom-dock',
  'top-dock',
  'minimal-type',
  'masthead',
  'masthead-wash',
];

const ADVANCED_ABOUT_IDS = ['manifesto', 'wash', 'plaque', 'portrait'];
const ADVANCED_CONTENT_IDS = ['accordion', 'menu', 'lookbook', 'hub'];

const AdvancedToggle = ({ isOpen, onClick, count }: { isOpen: boolean; onClick: () => void; count: number }) => {
  if (count <= 0) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-zinc-800 rounded-lg text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-fuchsia-400 hover:border-fuchsia-900/50 hover:bg-fuchsia-950/20 transition-all cursor-pointer"
    >
      {isOpen ? (
        <>
          <ChevronUp size={14} /> {VISUAL_ARCH_COPY.LAYOUTS.ADVANCED_HIDE}
        </>
      ) : (
        <>
          <ChevronDown size={14} /> {VISUAL_ARCH_COPY.LAYOUTS.ADVANCED_SHOW} ({count})
        </>
      )}
    </button>
  );
};

export function HeroSelector({ formData, setFormData, allowedLayouts }: any) {
  const currentHero = formData?.hero_layout || '';
  const [heroBase, heroFont = 'default'] = currentHero.split('--');
  const isMastheadActive = heroBase === 'masthead' || heroBase === 'masthead-wash';

  const [showAdvanced, setShowAdvanced] = useState(() =>
    ADVANCED_HERO_BASES.includes(heroBase)
  );

  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, hero_layout: val }));

  const updateMasthead = (nextBase: 'masthead' | 'masthead-wash', nextFont: string) => {
    const composed = nextFont && nextFont !== 'default' ? `${nextBase}--${nextFont}` : nextBase;
    handleSelect(composed);
  };

  const cardClass = (id: string, isDefault = false, forceActive = false) => {
    const active = forceActive || currentHero === id || (isDefault && !currentHero);
    return `flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
      active ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
    }`;
  };

  const labelClass = (id: string, isDefault = false, forceActive = false) => {
    const active = forceActive || currentHero === id || (isDefault && !currentHero);
    return `text-[11px] font-bold uppercase tracking-wider text-center ${
      active ? 'text-fuchsia-400' : 'text-zinc-500'
    }`;
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end mb-2">
        <label className="flex items-center gap-2 cursor-pointer group" title={VISUAL_ARCH_COPY.LAYOUTS.LOCK_BG_TITLE}>
          <span className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${formData.is_hero_fixed ? 'text-fuchsia-400' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
            {VISUAL_ARCH_COPY.LAYOUTS.LOCK_BG}
          </span>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={formData.is_hero_fixed || false} onChange={(e) => setFormData((prev: any) => ({ ...prev, is_hero_fixed: e.target.checked }))} />
            <div className={`block w-8 h-4 rounded-full transition-colors ${formData.is_hero_fixed ? 'bg-fuchsia-500' : 'bg-zinc-800 border border-zinc-700'}`}></div>
            <div className={`absolute left-0.5 top-0.5 bg-white w-3 h-3 rounded-full transition-transform duration-200 ${formData.is_hero_fixed ? 'translate-x-4' : ''}`}></div>
          </div>
        </label>
      </div>

      {/* CORE 4 HERO ARCHETYPES */}
      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={!allowedLayouts.hero.includes('center')} onClick={() => handleSelect('center')} className={cardClass('center', true)}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 p-1 rounded">
            <div className="w-1/2 h-0.5 bg-zinc-600 rounded" />
            <div className="w-3/4 h-1 bg-zinc-400 rounded" />
            <div className="w-1/4 h-1 bg-fuchsia-500 rounded mt-0.5" />
          </div>
          <span className={labelClass('center', true)}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.CENTERED}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.hero.includes('split-left')} onClick={() => handleSelect('split-left')} className={cardClass('split-left')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full flex flex-col justify-center gap-0.5 pl-0.5">
              <div className="w-full h-1 bg-zinc-400 rounded" />
              <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
              <div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" />
            </div>
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
          </div>
          <span className={labelClass('split-left')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.SPLIT_LEFT}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.hero.includes('split-right')} onClick={() => handleSelect('split-right')} className={cardClass('split-right')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
            <div className="w-1/2 h-full flex flex-col justify-center gap-0.5 pr-0.5">
              <div className="w-full h-1 bg-zinc-400 rounded" />
              <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
              <div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" />
            </div>
          </div>
          <span className={labelClass('split-right')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.SPLIT_RIGHT}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.hero.includes('cinematic')} onClick={() => handleSelect('cinematic')} className={cardClass('cinematic')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-700 mb-2 flex items-end p-1.5 relative overflow-hidden rounded">
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
            <div className="relative z-10 w-full flex flex-col gap-0.5 pr-2">
              <div className="w-full h-1 bg-white rounded" />
              <div className="w-1/2 h-1 bg-fuchsia-500 rounded" />
            </div>
          </div>
          <span className={labelClass('cinematic')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.CINEMATIC}</span>
        </button>
      </div>

      {/* ADVANCED 8 HERO ARCHETYPES */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Frosted Glass */}
          <button type="button" disabled={!allowedLayouts.hero.includes('glass')} onClick={() => handleSelect('glass')} className={cardClass('glass')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center justify-center p-1 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-800 opacity-20" />
              <div className="relative z-10 w-2/3 h-2/3 bg-zinc-500/30 border border-white/20 rounded-sm flex flex-col items-center justify-center gap-0.5">
                <div className="w-3/4 h-0.5 bg-white rounded" />
                <div className="w-1/2 h-px bg-zinc-300 rounded" />
              </div>
            </div>
            <span className={labelClass('glass')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.GLASS}</span>
          </button>

          {/* Editorial Frame */}
          <button type="button" disabled={!allowedLayouts.hero.includes('editorial-frame')} onClick={() => handleSelect('editorial-frame')} className={cardClass('editorial-frame')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-between p-1 rounded">
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="w-2/3 h-1 bg-zinc-400 rounded" />
                <div className="w-1/4 h-0.5 bg-fuchsia-500 rounded" />
              </div>
              <div className="w-5/6 h-4 bg-zinc-700 border border-zinc-600 rounded-sm" />
            </div>
            <span className={labelClass('editorial-frame')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.EDITORIAL_FRAME}</span>
          </button>

          {/* Arch Spotlight */}
          <button type="button" disabled={!allowedLayouts.hero.includes('arch-spotlight')} onClick={() => handleSelect('arch-spotlight')} className={cardClass('arch-spotlight')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center justify-between px-1.5 py-1 gap-1.5 rounded">
              <div className="w-1/2 flex flex-col gap-0.5">
                <div className="w-full h-1 bg-zinc-400 rounded" />
                <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
                <div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <div className="w-5 h-7 bg-zinc-700 border border-fuchsia-500/60 rounded-t-full rounded-b-sm" />
              </div>
            </div>
            <span className={labelClass('arch-spotlight')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.ARCH_SPOTLIGHT}</span>
          </button>

          {/* Bento Collage */}
          <button type="button" disabled={!allowedLayouts.hero.includes('bento-hero')} onClick={() => handleSelect('bento-hero')} className={cardClass('bento-hero')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 grid grid-cols-2 gap-1 p-1 rounded">
              <div className="h-full bg-zinc-800 border-t border-fuchsia-500 rounded-sm p-1 flex flex-col justify-between">
                <div className="w-3/4 h-1 bg-zinc-400 rounded" />
                <div className="w-1/2 h-1 bg-fuchsia-500 rounded" />
              </div>
              <div className="h-full grid grid-cols-2 gap-0.5">
                <div className="col-span-2 h-3.5 bg-zinc-700 rounded-sm" />
                <div className="h-3 bg-zinc-700/80 rounded-sm" />
                <div className="h-3 bg-zinc-600 rounded-sm" />
              </div>
            </div>
            <span className={labelClass('bento-hero')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.BENTO_HERO}</span>
          </button>

          {/* Bottom Dock */}
          <button type="button" disabled={!allowedLayouts.hero.includes('bottom-dock')} onClick={() => handleSelect('bottom-dock')} className={cardClass('bottom-dock')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-700 mb-2 flex items-end p-1 rounded relative overflow-hidden">
              <div className="w-full h-3.5 bg-zinc-950/90 border border-white/20 rounded-sm px-1 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <div className="w-6 h-1 bg-white rounded" />
                </div>
                <div className="w-3 h-1.5 bg-fuchsia-500 rounded-sm" />
              </div>
            </div>
            <span className={labelClass('bottom-dock')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.BOTTOM_DOCK}</span>
          </button>

          {/* Top Dock */}
          <button type="button" disabled={!allowedLayouts.hero.includes('top-dock')} onClick={() => handleSelect('top-dock')} className={cardClass('top-dock')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-700 mb-2 flex items-start p-1 rounded relative overflow-hidden">
              <div className="w-full h-3.5 bg-zinc-950/90 border border-white/20 rounded-sm px-1 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" />
                  <div className="w-6 h-1 bg-white rounded" />
                </div>
                <div className="w-3 h-1.5 bg-fuchsia-500 rounded-sm" />
              </div>
            </div>
            <span className={labelClass('top-dock')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.TOP_DOCK}</span>
          </button>

          {/* Kinetic Type */}
          <button type="button" disabled={!allowedLayouts.hero.includes('minimal-type')} onClick={() => handleSelect('minimal-type')} className={cardClass('minimal-type')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col justify-between p-1 rounded">
              <div className="w-full flex items-end justify-between gap-1">
                <div className="flex flex-col gap-0.5 w-2/3">
                  <div className="w-full h-1.5 bg-zinc-300 rounded" />
                  <div className="w-3/4 h-1.5 bg-zinc-400 rounded" />
                </div>
                <div className="w-4 h-3 bg-zinc-700 border border-zinc-600 rounded-sm shrink-0" />
              </div>
              <div className="w-full border-t border-zinc-700 pt-0.5 flex items-center justify-between">
                <div className="w-1/2 h-0.5 bg-zinc-600 rounded" />
                <div className="w-1/4 h-1 bg-fuchsia-500 rounded" />
              </div>
            </div>
            <span className={labelClass('minimal-type')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.MINIMAL_TYPE}</span>
          </button>

          {/* Brand Masthead */}
          <button
            type="button"
            disabled={!allowedLayouts.hero.includes('masthead')}
            onClick={() => handleSelect(isMastheadActive ? currentHero : 'masthead')}
            className={cardClass('masthead', false, isMastheadActive)}
          >
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded">
              <div className="w-11/12 h-2.5 bg-zinc-200 rounded-sm" />
              <div className="w-2/3 h-px bg-fuchsia-500/80" />
              <div className="w-1/2 h-0.5 bg-zinc-500 rounded" />
            </div>
            <span className={labelClass('masthead', false, isMastheadActive)}>
              {VISUAL_ARCH_COPY.LAYOUTS.LABELS.MASTHEAD}
            </span>
          </button>
        </div>
      )}

      {/* Contextual Controls when Brand Masthead is active */}
      {isMastheadActive && (
        <div className="p-3 rounded-xl bg-zinc-950 border border-fuchsia-500/30 space-y-3 animate-in fade-in duration-200">
          {/* Backdrop Mode */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_BACKDROP}
            </span>
            <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => updateMasthead('masthead', heroFont)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  heroBase === 'masthead'
                    ? 'bg-fuchsia-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_PURE}
              </button>
              <button
                type="button"
                onClick={() => updateMasthead('masthead-wash', heroFont)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  heroBase === 'masthead-wash'
                    ? 'bg-fuchsia-500 text-zinc-950'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_WASH}
              </button>
            </div>
          </div>

          {/* Display Lettering Picker */}
          <div className="pt-2.5 border-t border-zinc-800/80 space-y-2">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_FONT}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {MASTHEAD_FONTS.map((f) => {
                const active = heroFont === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateMasthead(heroBase as 'masthead' | 'masthead-wash', f.id)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                      active
                        ? 'bg-fuchsia-500/20 border-fuchsia-500 text-fuchsia-300'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <AdvancedToggle
        isOpen={showAdvanced}
        onClick={() => setShowAdvanced(!showAdvanced)}
        count={8}
      />
    </div>
  );
}

export function AboutSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(() =>
    ADVANCED_ABOUT_IDS.includes(formData?.about_layout)
  );
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, about_layout: val }));

  const cardClass = (id: string, isDefault = false) => {
    const active = formData.about_layout === id || (isDefault && !formData.about_layout);
    return `flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${
      active ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'
    }`;
  };

  const labelClass = (id: string, isDefault = false) => {
    const active = formData.about_layout === id || (isDefault && !formData.about_layout);
    return `text-[11px] font-bold uppercase tracking-wider text-center ${
      active ? 'text-fuchsia-400' : 'text-zinc-500'
    }`;
  };

  return (
    <div className="space-y-3">
      {/* CORE 4 STORY ARCHETYPES */}
      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={!allowedLayouts.about.includes('split')} onClick={() => handleSelect('split')} className={cardClass('split', true)}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
            <div className="w-1/2 h-full flex flex-col gap-1 justify-center">
              <div className="w-3/4 h-1 bg-zinc-400 rounded" />
              <div className="w-full h-0.5 bg-zinc-600 rounded" />
              <div className="w-5/6 h-0.5 bg-zinc-600 rounded" />
            </div>
          </div>
          <span className={labelClass('split', true)}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.CLASSIC_SPLIT}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.about.includes('editorial')} onClick={() => handleSelect('editorial')} className={cardClass('editorial')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center justify-center p-1 rounded relative">
            <div className="absolute left-1.5 top-1.5 w-1/2 h-6 bg-zinc-700 rounded-sm z-0" />
            <div className="absolute right-1.5 bottom-1.5 w-2/3 h-5 bg-zinc-800 border border-zinc-600 rounded-sm z-10 flex flex-col gap-0.5 p-1">
              <div className="w-full h-0.5 bg-zinc-400 rounded" />
              <div className="w-3/4 h-px bg-zinc-500 rounded" />
            </div>
          </div>
          <span className={labelClass('editorial')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.EDITORIAL}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.about.includes('minimal')} onClick={() => handleSelect('minimal')} className={cardClass('minimal')}>
          <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 rounded">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-1/2 h-0.5 bg-zinc-400 rounded" />
            <div className="w-3/4 h-px bg-zinc-600 rounded" />
          </div>
          <span className={labelClass('minimal')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.MINIMAL}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.about.includes('card')} onClick={() => handleSelect('card')} className={cardClass('card')}>
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
          <span className={labelClass('card')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.GLASS_CARD}</span>
        </button>
      </div>

      {/* ADVANCED 4 STORY ARCHETYPES */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Gallery Manifesto */}
          <button type="button" disabled={!allowedLayouts.about.includes('manifesto')} onClick={() => handleSelect('manifesto')} className={cardClass('manifesto')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 px-2 rounded">
              <div className="w-2/3 h-1.5 bg-zinc-200 rounded-sm" />
              <div className="w-1/2 h-px bg-fuchsia-500/80" />
              <div className="w-5/6 h-0.5 bg-zinc-500 rounded" />
              <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
            </div>
            <span className={labelClass('manifesto')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.MANIFESTO}</span>
          </button>

          {/* Atmospheric Wash */}
          <button type="button" disabled={!allowedLayouts.about.includes('wash')} onClick={() => handleSelect('wash')} className={cardClass('wash')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-800/70 mb-2 flex flex-col items-center justify-center gap-1 px-2 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-radial from-zinc-600/30 to-zinc-950/90" />
              <div className="relative z-10 w-2/3 h-1.5 bg-white rounded-sm" />
              <div className="relative z-10 w-1/2 h-px bg-fuchsia-500" />
              <div className="relative z-10 w-3/4 h-0.5 bg-zinc-300 rounded" />
            </div>
            <span className={labelClass('wash')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.WASH}</span>
          </button>

          {/* Framed Plaque */}
          <button type="button" disabled={!allowedLayouts.about.includes('plaque')} onClick={() => handleSelect('plaque')} className={cardClass('plaque')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center p-1.5 rounded">
              <div className="w-full h-full border border-fuchsia-500/40 rounded-xs flex items-center gap-1.5 px-1.5">
                <div className="w-2/5 flex flex-col gap-0.5">
                  <div className="w-full h-1.5 bg-zinc-300 rounded-xs" />
                  <div className="w-1/2 h-px bg-fuchsia-500" />
                </div>
                <div className="w-3/5 flex flex-col gap-0.5">
                  <div className="w-full h-0.5 bg-zinc-500 rounded" />
                  <div className="w-5/6 h-0.5 bg-zinc-600 rounded" />
                  <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
                </div>
              </div>
            </div>
            <span className={labelClass('plaque')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.PLAQUE}</span>
          </button>

          {/* Gallery Portrait */}
          <button type="button" disabled={!allowedLayouts.about.includes('portrait')} onClick={() => handleSelect('portrait')} className={cardClass('portrait')}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex items-center gap-1.5 px-1.5 py-1 rounded">
              <div className="w-1/3 h-full border border-zinc-600 p-0.5 rounded-xs">
                <div className="w-full h-full bg-zinc-700 rounded-xs" />
              </div>
              <div className="w-2/3 flex flex-col gap-1">
                <div className="w-3/4 h-1 bg-zinc-300 rounded" />
                <div className="w-1/2 h-px bg-fuchsia-500" />
                <div className="w-full h-0.5 bg-zinc-500 rounded" />
                <div className="w-4/5 h-0.5 bg-zinc-600 rounded" />
              </div>
            </div>
            <span className={labelClass('portrait')}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.PORTRAIT}</span>
          </button>
        </div>
      )}

      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_ABOUTS.length > 4 ? ALL_ABOUTS.length - 4 : 0} />
    </div>
  );
}

export function ContentSelector({ formData, setFormData, allowedLayouts }: any) {
  const [showAdvanced, setShowAdvanced] = useState(() =>
    ADVANCED_CONTENT_IDS.includes(formData?.content_layout)
  );
  const handleSelect = (val: string) => setFormData((prev: any) => ({ ...prev, content_layout: val }));

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button type="button" disabled={!allowedLayouts.content.includes('classic')} onClick={() => handleSelect('classic')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'classic' || !formData.content_layout ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-1 rounded"><div className="w-full h-2.5 bg-zinc-600 rounded-sm" /><div className="w-full h-2.5 bg-zinc-600 rounded-sm" /></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'classic' || !formData.content_layout ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.STACKED}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.content.includes('bento')} onClick={() => handleSelect('bento')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'bento' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 grid grid-cols-2 gap-1 p-1 rounded"><div className="w-full h-full bg-fuchsia-500/50 rounded-sm" /><div className="w-full h-full bg-zinc-600 rounded-sm" /><div className="w-full h-full bg-zinc-600 rounded-sm" /><div className="w-full h-full bg-fuchsia-500/50 rounded-sm" /></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'bento' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.BENTO}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.content.includes('sticky')} onClick={() => handleSelect('sticky')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'sticky' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded"><div className="w-1/3 h-full bg-fuchsia-500/50 rounded-sm" /><div className="w-2/3 h-full flex flex-col gap-0.5"><div className="w-full h-1/2 bg-zinc-600 rounded-sm" /><div className="w-full h-1/2 bg-zinc-600 rounded-sm" /></div></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'sticky' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.STICKY}</span>
        </button>

        <button type="button" disabled={!allowedLayouts.content.includes('editorial')} onClick={() => handleSelect('editorial')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'editorial' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
           <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col items-center justify-center gap-1 rounded relative"><div className="w-3/4 h-1 bg-fuchsia-500/80 rounded-sm z-10" /><div className="w-1/2 h-1 bg-zinc-600 rounded-sm z-10" /><div className="w-2/3 h-1 bg-zinc-600 rounded-sm z-10" /></div>
           <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'editorial' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.EDITORIAL}</span>
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-3 mt-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <button type="button" disabled={!allowedLayouts.content.includes('accordion')} onClick={() => handleSelect('accordion')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'accordion' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-0.5 rounded"><div className="w-full h-1.5 bg-fuchsia-500/50 rounded-sm" /><div className="w-full h-1 bg-zinc-600 rounded-sm" /><div className="w-full h-1 bg-zinc-600 rounded-sm" /><div className="w-full h-1 bg-zinc-600 rounded-sm" /></div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'accordion' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.ACCORDION}</span>
          </button>

          <button type="button" disabled={!allowedLayouts.content.includes('menu')} onClick={() => handleSelect('menu')} className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'menu' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}>
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex flex-col p-1 gap-1 rounded items-center justify-center">
              <div className="w-2/3 h-1.5 bg-fuchsia-500/80 rounded-sm" />
              <div className="w-full flex justify-between gap-1 px-1"><div className="w-1/2 h-1 bg-zinc-500 rounded-sm" /><div className="w-1/4 h-1 bg-zinc-400 rounded-sm" /></div>
              <div className="w-full flex justify-between gap-1 px-1"><div className="w-1/2 h-1 bg-zinc-500 rounded-sm" /><div className="w-1/4 h-1 bg-zinc-400 rounded-sm" /></div>
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'menu' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.MENU}</span>
          </button>

          <button
            type="button"
            disabled={!allowedLayouts.content.includes('lookbook')}
            onClick={() => handleSelect('lookbook')}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'lookbook' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
          >
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded items-start justify-center">
              <div className="w-1/2 flex flex-col gap-1"><div className="w-full h-6 bg-fuchsia-500/50 rounded-sm" /><div className="w-full h-3 bg-zinc-600 rounded-sm" /></div>
              <div className="w-1/2 flex flex-col gap-1"><div className="w-full h-3 bg-zinc-600 rounded-sm" /><div className="w-full h-6 bg-fuchsia-500/50 rounded-sm" /></div>
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'lookbook' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.LOOKBOOK}</span>
          </button>

          <button
            type="button"
            disabled={!allowedLayouts.content.includes('hub')}
            onClick={() => handleSelect('hub')}
            className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed ${formData.content_layout === 'hub' ? 'border-fuchsia-500 bg-fuchsia-500/10' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-700'}`}
          >
            <div className="w-full h-10 border border-zinc-700 bg-zinc-900 mb-2 flex p-1 gap-1 rounded items-start justify-center">
              <div className="w-1/3 h-full bg-fuchsia-500/50 rounded-sm" />
              <div className="w-1/3 h-full bg-zinc-600 rounded-sm" />
              <div className="w-1/3 h-full bg-zinc-600 rounded-sm" />
            </div>
            <span className={`text-[11px] font-bold uppercase tracking-wider ${formData.content_layout === 'hub' ? 'text-fuchsia-400' : 'text-zinc-500'}`}>{VISUAL_ARCH_COPY.LAYOUTS.LABELS.HUB}</span>
          </button>
        </div>
      )}
      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={ALL_CONTENTS.length > 4 ? ALL_CONTENTS.length - 4 : 0} />
    </div>
  );
}