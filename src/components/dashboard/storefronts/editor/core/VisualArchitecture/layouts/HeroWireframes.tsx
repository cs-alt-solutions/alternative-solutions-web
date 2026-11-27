/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/HeroWireframes.tsx */
import React, { useState } from 'react';
import { VISUAL_ARCH_COPY } from '@/config/dashboard/editor';
import { AdvancedToggle, LayoutOptionCard } from './LayoutCardPrimitives';

const ADVANCED_HERO_BASES = [
  'glass', 'editorial-frame', 'arch-spotlight', 'bento-hero',
  'bottom-dock', 'top-dock', 'minimal-type', 'masthead', 'masthead-wash',
];

interface HeroWireframesProps {
  currentHero: string;
  heroBase: string;
  isMastheadActive: boolean;
  allowedHeroes: string[];
  onSelect: (val: string) => void;
}

export default function HeroWireframes({
  currentHero,
  heroBase,
  isMastheadActive,
  allowedHeroes,
  onSelect,
}: HeroWireframesProps) {
  const [showAdvanced, setShowAdvanced] = useState(() => ADVANCED_HERO_BASES.includes(heroBase));
  const L = VISUAL_ARCH_COPY.LAYOUTS.LABELS;
  const isActive = (id: string, isDefault = false) => currentHero === id || (isDefault && !currentHero);

  return (
    <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800/80 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* CORE 4 HERO ARCHETYPES */}
      <div className="grid grid-cols-2 gap-2.5">
        <LayoutOptionCard compact active={isActive('center', true)} disabled={!allowedHeroes.includes('center')} label={L.CENTERED} onClick={() => onSelect('center')}>
          <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex flex-col items-center justify-center gap-1 p-1 rounded">
            <div className="w-1/2 h-0.5 bg-zinc-600 rounded" />
            <div className="w-3/4 h-1 bg-zinc-400 rounded" />
            <div className="w-1/4 h-1 bg-fuchsia-500 rounded mt-0.5" />
          </div>
        </LayoutOptionCard>

        <LayoutOptionCard compact active={isActive('split-left')} disabled={!allowedHeroes.includes('split-left')} label={L.SPLIT_LEFT} onClick={() => onSelect('split-left')}>
          <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full flex flex-col justify-center gap-0.5 pl-0.5">
              <div className="w-full h-1 bg-zinc-400 rounded" />
              <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
              <div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" />
            </div>
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
          </div>
        </LayoutOptionCard>

        <LayoutOptionCard compact active={isActive('split-right')} disabled={!allowedHeroes.includes('split-right')} label={L.SPLIT_RIGHT} onClick={() => onSelect('split-right')}>
          <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex items-center p-1 gap-1.5 rounded">
            <div className="w-1/2 h-full bg-zinc-700 rounded-sm" />
            <div className="w-1/2 h-full flex flex-col justify-center gap-0.5 pr-0.5">
              <div className="w-full h-1 bg-zinc-400 rounded" />
              <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
              <div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" />
            </div>
          </div>
        </LayoutOptionCard>

        <LayoutOptionCard compact active={isActive('cinematic')} disabled={!allowedHeroes.includes('cinematic')} label={L.CINEMATIC} onClick={() => onSelect('cinematic')}>
          <div className="w-full h-9 border border-zinc-700 bg-zinc-700 mb-1.5 flex items-end p-1.5 relative overflow-hidden rounded">
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent" />
            <div className="relative z-10 w-full flex flex-col gap-0.5 pr-2">
              <div className="w-full h-1 bg-white rounded" />
              <div className="w-1/2 h-1 bg-fuchsia-500 rounded" />
            </div>
          </div>
        </LayoutOptionCard>
      </div>

      {/* ADVANCED 8 HERO ARCHETYPES */}
      {showAdvanced && (
        <div className="grid grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <LayoutOptionCard compact active={isActive('glass')} disabled={!allowedHeroes.includes('glass')} label={L.GLASS} onClick={() => onSelect('glass')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex items-center justify-center p-1 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-zinc-800 opacity-20" />
              <div className="relative z-10 w-2/3 h-2/3 bg-zinc-500/30 border border-white/20 rounded-sm flex flex-col items-center justify-center gap-0.5">
                <div className="w-3/4 h-0.5 bg-white rounded" />
                <div className="w-1/2 h-px bg-zinc-300 rounded" />
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isActive('editorial-frame')} disabled={!allowedHeroes.includes('editorial-frame')} label={L.EDITORIAL_FRAME} onClick={() => onSelect('editorial-frame')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex flex-col items-center justify-between p-1 rounded">
              <div className="w-full flex flex-col items-center gap-0.5">
                <div className="w-2/3 h-1 bg-zinc-400 rounded" />
                <div className="w-1/4 h-0.5 bg-fuchsia-500 rounded" />
              </div>
              <div className="w-5/6 h-3.5 bg-zinc-700 border border-zinc-600 rounded-sm" />
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isActive('arch-spotlight')} disabled={!allowedHeroes.includes('arch-spotlight')} label={L.ARCH_SPOTLIGHT} onClick={() => onSelect('arch-spotlight')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex items-center justify-between px-1.5 py-1 gap-1.5 rounded">
              <div className="w-1/2 flex flex-col gap-0.5">
                <div className="w-full h-1 bg-zinc-400 rounded" />
                <div className="w-2/3 h-0.5 bg-zinc-600 rounded" />
                <div className="w-1/2 h-1 bg-fuchsia-500 rounded mt-0.5" />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <div className="w-5 h-6 bg-zinc-700 border border-fuchsia-500/60 rounded-t-full rounded-b-sm" />
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isActive('bento-hero')} disabled={!allowedHeroes.includes('bento-hero')} label={L.BENTO_HERO} onClick={() => onSelect('bento-hero')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 grid grid-cols-2 gap-1 p-1 rounded">
              <div className="h-full bg-zinc-800 border-t border-fuchsia-500 rounded-sm p-1 flex flex-col justify-between">
                <div className="w-3/4 h-1 bg-zinc-400 rounded" />
                <div className="w-1/2 h-1 bg-fuchsia-500 rounded" />
              </div>
              <div className="h-full grid grid-cols-2 gap-0.5">
                <div className="col-span-2 h-3 bg-zinc-700 rounded-sm" />
                <div className="h-2.5 bg-zinc-700/80 rounded-sm" />
                <div className="h-2.5 bg-zinc-600 rounded-sm" />
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isActive('bottom-dock')} disabled={!allowedHeroes.includes('bottom-dock')} label={L.BOTTOM_DOCK} onClick={() => onSelect('bottom-dock')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-700 mb-1.5 flex items-end p-1 rounded">
              <div className="w-full h-3 bg-zinc-950/90 border border-white/20 rounded-sm px-1 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" /><div className="w-6 h-1 bg-white rounded" /></div>
                <div className="w-3 h-1.5 bg-fuchsia-500 rounded-sm" />
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isActive('top-dock')} disabled={!allowedHeroes.includes('top-dock')} label={L.TOP_DOCK} onClick={() => onSelect('top-dock')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-700 mb-1.5 flex items-start p-1 rounded">
              <div className="w-full h-3 bg-zinc-950/90 border border-white/20 rounded-sm px-1 flex items-center justify-between gap-1">
                <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 bg-zinc-400 rounded-full" /><div className="w-6 h-1 bg-white rounded" /></div>
                <div className="w-3 h-1.5 bg-fuchsia-500 rounded-sm" />
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isActive('minimal-type')} disabled={!allowedHeroes.includes('minimal-type')} label={L.MINIMAL_TYPE} onClick={() => onSelect('minimal-type')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex flex-col justify-between p-1 rounded">
              <div className="w-full flex items-end justify-between gap-1">
                <div className="flex flex-col gap-0.5 w-2/3"><div className="w-full h-1.5 bg-zinc-300 rounded" /><div className="w-3/4 h-1.5 bg-zinc-400 rounded" /></div>
                <div className="w-4 h-3 bg-zinc-700 border border-zinc-600 rounded-sm shrink-0" />
              </div>
              <div className="w-full border-t border-zinc-700 pt-0.5 flex items-center justify-between">
                <div className="w-1/2 h-0.5 bg-zinc-600 rounded" /><div className="w-1/4 h-1 bg-fuchsia-500 rounded" />
              </div>
            </div>
          </LayoutOptionCard>

          <LayoutOptionCard compact active={isMastheadActive} disabled={!allowedHeroes.includes('masthead')} label={L.MASTHEAD} onClick={() => onSelect(isMastheadActive ? currentHero : 'masthead')}>
            <div className="w-full h-9 border border-zinc-700 bg-zinc-900 mb-1.5 flex flex-col items-center justify-center gap-1 px-1.5 py-1 rounded">
              <div className="w-11/12 h-2 bg-zinc-200 rounded-sm" />
              <div className="w-2/3 h-px bg-fuchsia-500/80" />
              <div className="w-1/2 h-0.5 bg-zinc-500 rounded" />
            </div>
          </LayoutOptionCard>
        </div>
      )}

      <AdvancedToggle isOpen={showAdvanced} onClick={() => setShowAdvanced(!showAdvanced)} count={8} />
    </div>
  );
}