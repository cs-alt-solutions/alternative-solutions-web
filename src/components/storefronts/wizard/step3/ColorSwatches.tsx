// src/components/storefronts/wizard/step3/ColorSwatches.tsx
'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { WIZARD_COPY } from '@/config/wizard';

interface ColorSwatchesProps {
  currentColor: string;
  onSelectColor: (color: string) => void;
}

export default function ColorSwatches({ currentColor, onSelectColor }: ColorSwatchesProps) {
  const swatches = WIZARD_COPY.STEP_3.COLOR_SELECT.SWATCHES || [];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl mx-auto">
      {swatches.map((color) => {
        const isActive = currentColor === color.id;
        return (
          <button
            key={color.id}
            type="button"
            onClick={() => onSelectColor(color.id)}
            className={`group relative flex flex-col items-center gap-3 transition-all duration-300 cursor-pointer ${
              isActive ? 'scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'
            }`}
          >
            {/* The Swatch Circle */}
            <div 
              className={`w-14 h-14 rounded-full transition-all flex items-center justify-center ${color.bg} ${
                isActive ? `ring-4 ring-offset-4 ring-offset-zinc-950 ${color.ring} ${color.glow}` : 'ring-1 ring-white/10 shadow-lg'
              }`}
            >
              {isActive && <Check className="w-6 h-6 text-white drop-shadow-md animate-in zoom-in duration-200" />}
            </div>
            {/* Label */}
            <span className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'
            }`}>
              {color.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}