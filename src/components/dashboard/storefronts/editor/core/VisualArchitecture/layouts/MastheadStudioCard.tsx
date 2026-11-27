/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/layouts/MastheadStudioCard.tsx */
import React, { useState, useEffect } from 'react';
import { Pipette, Hash, Sparkles } from 'lucide-react';
import { VISUAL_ARCH_COPY, MASTHEAD_FONTS } from '@/config/dashboard/editor';
import { normalizeHexBody, toHex } from './LayoutCardPrimitives';

interface MastheadStudioCardProps {
  heroBase: 'masthead' | 'masthead-wash';
  heroFont: string;
  heroColor: string;
  brandColor?: string;
  secondaryBrandColor?: string;
  onUpdate: (base: 'masthead' | 'masthead-wash', font: string, color: string) => void;
}

function HexStopInput({
  label,
  value,
  fallback,
  onPick,
  onType,
}: {
  label: string;
  value: string;
  fallback: string;
  onPick: (hex: string) => void;
  onType: (raw: string) => void;
}) {
  const safeHex = value.length === 6 ? value : fallback;
  return (
    <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1.5">
      <div className="relative overflow-hidden w-6 h-6 rounded-full border border-zinc-700 shrink-0">
        <input
          type="color"
          value={`#${safeHex}`}
          onChange={(e) => onPick(e.target.value.replace('#', '').toUpperCase())}
          className="absolute -inset-2 w-10 h-10 cursor-pointer"
        />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block text-[8px] font-bold uppercase tracking-widest text-zinc-500">{label}</span>
        <div className="flex items-center gap-0.5">
          <Hash size={9} className="text-zinc-600 shrink-0" />
          <input
            type="text"
            value={value}
            onChange={(e) => onType(e.target.value)}
            maxLength={6}
            className="w-full bg-transparent text-[11px] font-mono text-amber-300 uppercase focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}

export default function MastheadStudioCard({
  heroBase,
  heroFont,
  heroColor,
  brandColor,
  secondaryBrandColor,
  onUpdate,
}: MastheadStudioCardProps) {
  const isCustomColor = heroColor.startsWith('hex-');
  const parsedHexParts = isCustomColor ? heroColor.slice(4).split('-') : [];

  const [customStartHex, setCustomStartHex] = useState(() => parsedHexParts[0] || 'FFF1A8');
  const [customEndHex, setCustomEndHex] = useState(() => parsedHexParts[1] || 'B8860B');
  const [customMode, setCustomMode] = useState<'solid' | 'twotone'>(() =>
    isCustomColor && parsedHexParts.length >= 2 ? 'twotone' : 'solid'
  );

  useEffect(() => {
    if (heroColor.startsWith('hex-')) {
      const parts = heroColor.slice(4).split('-');
      if (parts[0]) setCustomStartHex(parts[0].toUpperCase());
      if (parts[1]) {
        setCustomEndHex(parts[1].toUpperCase());
        setCustomMode('twotone');
      } else {
        setCustomMode('solid');
      }
    }
  }, [heroColor]);

  const primaryHex = toHex(brandColor, '#f59e0b');
  const secondaryHex = toHex(secondaryBrandColor || brandColor, '#b45309');

  const applyCustom = (mode: 'solid' | 'twotone', start: string, end: string) => {
    const s = start.length === 6 ? start : 'F5C518';
    const e = end.length === 6 ? end : 'B8860B';
    onUpdate(heroBase, heroFont, mode === 'twotone' ? `hex-${s}-${e}` : `hex-${s}`);
  };

  const colorPresets = [
    { id: 'default', label: 'Default', swatch: '#e7e5e4' },
    { id: 'primary', label: 'Primary', swatch: primaryHex },
    { id: 'duotone', label: 'Brand 2-Tone', swatch: `linear-gradient(180deg, ${primaryHex}, ${secondaryHex})` },
    { id: 'gold', label: 'Yellow Gold', swatch: 'linear-gradient(180deg, #FFF4B8 0%, #F5C518 48%, #B47809 100%)' },
  ];

  const pillClass = (active: boolean) =>
    `flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
      active
        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
    }`;

  return (
    <div className="p-3 rounded-xl bg-zinc-950 border border-amber-500/30 space-y-3 animate-in fade-in duration-200">
      {/* Header + Backdrop Toggle */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
          <Sparkles size={11} />
          {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_STUDIO}
        </span>
        <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
          {(['masthead', 'masthead-wash'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => onUpdate(mode, heroFont, heroColor)}
              className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                heroBase === mode ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mode === 'masthead' ? VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_PURE : VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_WASH}
            </button>
          ))}
        </div>
      </div>

      {/* Display Lettering */}
      <div className="pt-2.5 border-t border-zinc-800/80 space-y-1.5">
        <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
          {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_FONT}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {MASTHEAD_FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onUpdate(heroBase, f.id, heroColor)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-all cursor-pointer ${
                heroFont === f.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lettering Finish */}
      <div className="pt-2.5 border-t border-zinc-800/80 space-y-2">
        <span className="block text-[9px] font-bold uppercase tracking-widest text-zinc-500">
          {VISUAL_ARCH_COPY.LAYOUTS.MASTHEAD_COLOR}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
          {colorPresets.map((p) => (
            <button key={p.id} type="button" onClick={() => onUpdate(heroBase, heroFont, p.id)} className={pillClass(heroColor === p.id)}>
              <span className="w-3 h-3 rounded-full border border-white/20 shrink-0" style={{ background: p.swatch }} />
              <span className="truncate">{p.label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => applyCustom(customMode, customStartHex, customEndHex)}
            className={`col-span-2 justify-center ${pillClass(isCustomColor)}`}
          >
            <Pipette size={11} />
            <span>Custom Color</span>
          </button>
        </div>

        {isCustomColor && (
          <div className="p-2.5 rounded-lg bg-black/50 border border-zinc-800 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">Custom Style</span>
              <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-md border border-zinc-800">
                {(['solid', 'twotone'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => {
                      setCustomMode(m);
                      applyCustom(m, customStartHex, customEndHex);
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider cursor-pointer ${
                      customMode === m ? 'bg-amber-500 text-zinc-950' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m === 'solid' ? 'Solid' : 'Two-Tone'}
                  </button>
                ))}
              </div>
            </div>

            <div className={`grid gap-2 ${customMode === 'twotone' ? 'grid-cols-2' : 'grid-cols-1'}`}>
              <HexStopInput
                label={customMode === 'twotone' ? 'Top' : 'Color'}
                value={customStartHex}
                fallback="F5C518"
                onPick={(hex) => {
                  setCustomStartHex(hex);
                  applyCustom(customMode, hex, customEndHex);
                }}
                onType={(raw) => {
                  const clean = normalizeHexBody(raw);
                  setCustomStartHex(clean);
                  if (clean.length === 6) applyCustom(customMode, clean, customEndHex);
                }}
              />
              {customMode === 'twotone' && (
                <HexStopInput
                  label="Bottom"
                  value={customEndHex}
                  fallback="B8860B"
                  onPick={(hex) => {
                    setCustomEndHex(hex);
                    applyCustom('twotone', customStartHex, hex);
                  }}
                  onType={(raw) => {
                    const clean = normalizeHexBody(raw);
                    setCustomEndHex(clean);
                    if (clean.length === 6) applyCustom('twotone', customStartHex, clean);
                  }}
                />
              )}
            </div>

            <div
              className="h-2 w-full rounded-full border border-white/10"
              style={{
                background:
                  customMode === 'twotone'
                    ? `linear-gradient(90deg, #${customStartHex.length === 6 ? customStartHex : 'FFF1A8'}, #${customEndHex.length === 6 ? customEndHex : 'B8860B'})`
                    : `#${customStartHex.length === 6 ? customStartHex : 'F5C518'}`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}