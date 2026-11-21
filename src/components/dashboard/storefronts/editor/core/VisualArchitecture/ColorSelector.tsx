/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/ColorSelector.tsx */
import React from 'react';
import { Pipette, Hash } from 'lucide-react';
import { VISUAL_ARCH_COPY, BRAND_COLORS } from '@/config/dashboard/editor';

export default function ColorSelector({
  brandColor,
  secondaryBrandColor,
  onChange,
  onSecondaryChange,
}: {
  brandColor: string;
  secondaryBrandColor?: string;
  onChange: (val: string) => void;
  onSecondaryChange?: (val: string) => void;
}) {
  const getHexValue = (color: string) => {
    if (!color) return '#06b6d4';
    if (color.startsWith('#')) return color;

    const legacyMap: Record<string, string> = {
      'cyan-500': '#06b6d4',
      'fuchsia-500': '#d946ef',
      'emerald-500': '#10b981',
      'amber-500': '#f59e0b',
      'rose-500': '#f43f5e',
      'indigo-500': '#6366f1',
      'zinc-500': '#71717a',
    };
    return legacyMap[color] || '#06b6d4';
  };

  const handleHexType = (e: React.ChangeEvent<HTMLInputElement>, updater: (val: string) => void) => {
    let val = e.target.value;
    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
    updater(val);
  };

  return (
    <div className="space-y-3.5">
      {/* Primary Brand Color */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 bg-black/40 px-2.5 py-2 rounded-lg border border-zinc-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative overflow-hidden w-7 h-7 rounded-full border border-zinc-700 shrink-0 group">
              <input
                type="color"
                value={getHexValue(brandColor)}
                onChange={(e) => onChange(e.target.value)}
                className="absolute -inset-2 w-11 h-11 cursor-pointer"
                title={VISUAL_ARCH_COPY.COLORS.PICK_TITLE}
              />
              <Pipette className="absolute inset-0 m-auto w-3 h-3 text-white/60 pointer-events-none group-hover:text-white drop-shadow" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                {VISUAL_ARCH_COPY.COLORS.PRIMARY}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 uppercase">
                {brandColor.startsWith('#') ? VISUAL_ARCH_COPY.COLORS.CUSTOM_HEX : VISUAL_ARCH_COPY.COLORS.PRESET}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 shrink-0">
            <Hash size={10} className="text-zinc-500" />
            <input
              type="text"
              value={brandColor.startsWith('#') ? brandColor.replace('#', '') : ''}
              onChange={(e) => handleHexType(e, onChange)}
              placeholder="HEX"
              className="bg-transparent text-[11px] font-mono text-cyan-400 focus:outline-none w-16 uppercase placeholder:text-zinc-700"
              maxLength={7}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 px-0.5">
          {BRAND_COLORS.map((c) => (
            <button
              key={`primary-${c.value}`}
              type="button"
              onClick={() => onChange(c.value)}
              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                brandColor === c.value ? 'border-white scale-110' : 'border-zinc-800/60 hover:scale-105'
              } ${c.twBg}`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Secondary Accent Color */}
      {onSecondaryChange && (
        <div className="space-y-2 pt-3 border-t border-zinc-800/60">
          <div className="flex items-center justify-between gap-2 bg-black/40 px-2.5 py-2 rounded-lg border border-zinc-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative overflow-hidden w-7 h-7 rounded-full border border-zinc-700 shrink-0 group">
                <input
                  type="color"
                  value={getHexValue(secondaryBrandColor || brandColor)}
                  onChange={(e) => onSecondaryChange(e.target.value)}
                  className="absolute -inset-2 w-11 h-11 cursor-pointer"
                  title={VISUAL_ARCH_COPY.COLORS.PICK_TITLE}
                />
                <Pipette className="absolute inset-0 m-auto w-3 h-3 text-white/60 pointer-events-none group-hover:text-white drop-shadow" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                  {VISUAL_ARCH_COPY.COLORS.SECONDARY}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 uppercase">
                  {(secondaryBrandColor || '').startsWith('#')
                    ? VISUAL_ARCH_COPY.COLORS.CUSTOM_HEX
                    : VISUAL_ARCH_COPY.COLORS.PRESET}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-md px-2 py-1 shrink-0">
              <Hash size={10} className="text-zinc-500" />
              <input
                type="text"
                value={(secondaryBrandColor || '').startsWith('#') ? secondaryBrandColor!.replace('#', '') : ''}
                onChange={(e) => handleHexType(e, onSecondaryChange)}
                placeholder="HEX"
                className="bg-transparent text-[11px] font-mono text-fuchsia-400 focus:outline-none w-16 uppercase placeholder:text-zinc-700"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 px-0.5">
            {BRAND_COLORS.map((c) => (
              <button
                key={`secondary-${c.value}`}
                type="button"
                onClick={() => onSecondaryChange(c.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                  secondaryBrandColor === c.value ? 'border-white scale-110' : 'border-zinc-800/60 hover:scale-105'
                } ${c.twBg}`}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}