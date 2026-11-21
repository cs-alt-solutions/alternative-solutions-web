/* src/components/dashboard/storefronts/editor/core/VisualArchitecture/VibeSelector.tsx */
import React from 'react';
import { VISUAL_ARCH_COPY, THEME_FAMILIES } from '@/config/dashboard/editor';
import { Moon, Sun } from 'lucide-react';

export default function VibeSelector({
  currentTheme,
  onChange,
}: {
  currentTheme: string;
  onChange: (val: string) => void;
}) {
  const activeFamily =
    THEME_FAMILIES.find((f) => f.light === currentTheme || f.dark === currentTheme) || THEME_FAMILIES[0];
  const isLightModeActive = activeFamily.light === currentTheme;

  return (
    <div className="space-y-2.5">
      <div className="grid grid-cols-2 gap-2">
        {THEME_FAMILIES.map((family) => {
          const isActive = activeFamily.id === family.id;
          return (
            <button
              key={family.id}
              type="button"
              onClick={() => onChange(family.default)}
              className={`relative h-12 border-2 transition-all rounded-lg group overflow-hidden cursor-pointer flex items-center justify-center px-2 ${
                isActive ? 'ring-2 ring-emerald-500 z-10' : 'opacity-70 hover:opacity-100'
              } ${family.vibe}`}
            >
              <span className="text-center drop-shadow-sm text-[10px] font-black uppercase leading-tight tracking-wider truncate">
                {family.label}
              </span>

              {isActive && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              )}
            </button>
          );
        })}
      </div>

      {activeFamily.dark && activeFamily.light && (
        <div className="px-3 py-2 bg-zinc-950/70 border border-zinc-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {isLightModeActive ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              {VISUAL_ARCH_COPY.VIBE.MODE}
            </span>
          </div>
          <div className="flex bg-black rounded-md p-0.5 border border-zinc-800">
            <button
              type="button"
              onClick={() => onChange(activeFamily.light!)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                isLightModeActive ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {VISUAL_ARCH_COPY.VIBE.LIGHT}
            </button>
            <button
              type="button"
              onClick={() => onChange(activeFamily.dark!)}
              className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                !isLightModeActive ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {VISUAL_ARCH_COPY.VIBE.DARK}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}