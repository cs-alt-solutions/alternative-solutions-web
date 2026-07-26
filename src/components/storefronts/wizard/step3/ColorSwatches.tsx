'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WIZARD_COPY } from '@/utils/glossary';

interface ColorSwatchesProps {
  currentColor: string;
  onSelectColor: (colorId: string) => void;
}

export default function ColorSwatches({ currentColor, onSelectColor }: ColorSwatchesProps) {
  const copy = WIZARD_COPY.STEP_3;

  return (
    <div className="bg-zinc-900/30 border border-white/5 p-6 md:p-8 rounded-2xl shadow-xl space-y-5">
      <div className="space-y-1">
        <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 animate-pulse" />
          <span>{copy.COLOR_SELECT?.TITLE}</span>
        </h3>
        <p className="text-xs md:text-sm text-zinc-400 font-normal">
          {copy.COLOR_SELECT?.SUBTITLE}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-1">
        {(copy.COLOR_SELECT?.SWATCHES || []).map((swatch: any) => {
          const isSelected = currentColor === swatch.id;
          return (
            <button
              key={swatch.id}
              type="button"
              onClick={() => onSelectColor(swatch.id)}
              className={`group relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 cursor-pointer ${swatch.bg} ${
                isSelected ? `ring-4 ring-white scale-110 ${swatch.glow}` : 'opacity-80 hover:opacity-100 hover:scale-105'
              }`}
              title={swatch.label}
            >
              {isSelected && (
                <Check className="w-6 h-6 text-zinc-950 font-black animate-in zoom-in-50 duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}