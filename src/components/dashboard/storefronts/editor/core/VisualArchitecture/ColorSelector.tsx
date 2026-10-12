/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/ColorSelector.tsx */
import React from 'react';
import { Pipette, Hash } from 'lucide-react';
import { VISUAL_ARCH_COPY, BRAND_COLORS } from '@/config/dashboard/editor';

export default function ColorSelector({ 
  brandColor, secondaryBrandColor, onChange, onSecondaryChange 
}: { 
  brandColor: string, secondaryBrandColor?: string, onChange: (val: string) => void, onSecondaryChange?: (val: string) => void 
}) {
  
  const getHexValue = (color: string) => {
    if (!color) return '#06b6d4'; 
    if (color.startsWith('#')) return color;
    
    const legacyMap: Record<string, string> = {
      'cyan-500': '#06b6d4', 'fuchsia-500': '#d946ef', 'emerald-500': '#10b981',
      'amber-500': '#f59e0b', 'rose-500': '#f43f5e', 'indigo-500': '#6366f1', 'zinc-500': '#71717a'
    };
    return legacyMap[color] || '#06b6d4';
  };

  const handleHexType = (e: React.ChangeEvent<HTMLInputElement>, updater: (val: string) => void) => {
    let val = e.target.value;
    if (!val.startsWith('#') && val.length > 0) val = '#' + val;
    updater(val);
  };

  return (
    <div className="space-y-6">
      
      {/* Primary Brand Color */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-black/40 p-3 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative overflow-hidden w-10 h-10 rounded-full border-2 border-zinc-700 shrink-0 group">
              <input 
                type="color" 
                value={getHexValue(brandColor)} 
                onChange={(e) => onChange(e.target.value)}
                className="absolute -inset-2 w-14 h-14 cursor-pointer"
                title="Pick a custom color"
              />
              <Pipette className="absolute inset-0 m-auto w-4 h-4 text-white/50 pointer-events-none group-hover:text-white transition-colors drop-shadow-md" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white uppercase tracking-widest">{VISUAL_ARCH_COPY.COLORS.PRIMARY}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                {brandColor.startsWith('#') ? 'Custom Hex' : VISUAL_ARCH_COPY.COLORS.PRESET}
              </span>
            </div>
          </div>

          {/* Custom Hex Input Field */}
          <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 w-full sm:w-auto">
            <Hash size={12} className="text-zinc-500" />
            <input
              type="text"
              value={brandColor.startsWith('#') ? brandColor.replace('#', '') : ''}
              onChange={(e) => handleHexType(e, onChange)}
              placeholder="HEX CODE"
              className="bg-transparent text-xs font-mono text-cyan-400 focus:outline-none w-20 uppercase placeholder:text-zinc-700"
              maxLength={7}
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 pt-1">
          {BRAND_COLORS.map((c) => (
            <button
              key={`primary-${c.value}`}
              type="button"
              onClick={() => onChange(c.value)}
              className={`w-8 h-8 rounded-full border-2 shadow-md transition-all ${brandColor === c.value ? 'border-white scale-110 shadow-white/20' : 'border-zinc-800/50 hover:scale-105'} ${c.twBg}`}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Secondary Accent Color */}
      {onSecondaryChange && (
        <div className="space-y-3 pt-4 border-t border-zinc-800/60">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-black/40 p-3 rounded-xl border border-zinc-800">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative overflow-hidden w-10 h-10 rounded-full border-2 border-zinc-700 shrink-0 group">
                <input 
                  type="color" 
                  value={getHexValue(secondaryBrandColor || brandColor)} 
                  onChange={(e) => onSecondaryChange(e.target.value)}
                  className="absolute -inset-2 w-14 h-14 cursor-pointer"
                  title="Pick a custom color"
                />
                <Pipette className="absolute inset-0 m-auto w-4 h-4 text-white/50 pointer-events-none group-hover:text-white transition-colors drop-shadow-md" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white uppercase tracking-widest">{VISUAL_ARCH_COPY.COLORS.SECONDARY}</span>
                <span className="text-[10px] font-mono text-zinc-500 uppercase">
                  {(secondaryBrandColor || '').startsWith('#') ? 'Custom Hex' : VISUAL_ARCH_COPY.COLORS.PRESET}
                </span>
              </div>
            </div>

            {/* Custom Hex Input Field */}
            <div className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 w-full sm:w-auto">
              <Hash size={12} className="text-zinc-500" />
              <input
                type="text"
                value={(secondaryBrandColor || '').startsWith('#') ? secondaryBrandColor!.replace('#', '') : ''}
                onChange={(e) => handleHexType(e, onSecondaryChange)}
                placeholder="HEX CODE"
                className="bg-transparent text-xs font-mono text-fuchsia-400 focus:outline-none w-20 uppercase placeholder:text-zinc-700"
                maxLength={7}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            {BRAND_COLORS.map((c) => (
              <button
                key={`secondary-${c.value}`}
                type="button"
                onClick={() => onSecondaryChange(c.value)}
                className={`w-8 h-8 rounded-full border-2 shadow-md transition-all ${secondaryBrandColor === c.value ? 'border-white scale-110 shadow-white/20' : 'border-zinc-800/50 hover:scale-105'} ${c.twBg}`}
                title={c.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}