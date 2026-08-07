// src/components/dashboard/storefronts/editor/core/VisualArchitecture/ColorSelector.tsx
import React from 'react';
import { Palette } from 'lucide-react';
import { BRAND_COLORS } from './constants';

export default function ColorSelector({ brandColor, onChange }: { brandColor: string, onChange: (val: string) => void }) {
  return (
    <div className="space-y-3 pt-6 border-t border-zinc-800/60">
      <div className="flex items-center gap-2">
        <Palette className="w-3 h-3 text-emerald-400" />
        <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">5. Brand Color</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {BRAND_COLORS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onChange(c.value)}
            className={`w-8 h-8 rounded-full border-2 shadow-md transition-all ${brandColor === c.value ? 'border-white scale-110 shadow-white/20' : 'border-zinc-800/50 hover:scale-105'} ${c.twBg}`}
            title={c.name}
          />
        ))}
      </div>
    </div>
  );
}