// src/components/dashboard/storefronts/editor/core/VisualArchitecture/VibeSelector.tsx
import React from 'react';
import { THEME_FAMILIES } from './constants';
import { Moon, Sun } from 'lucide-react';

export default function VibeSelector({ currentTheme, onChange }: { currentTheme: string, onChange: (val: string) => void }) {
  const activeFamily = THEME_FAMILIES.find(f => f.light === currentTheme || f.dark === currentTheme) || THEME_FAMILIES[0];
  const isLightModeActive = activeFamily.light === currentTheme;

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">1. Foundation Vibe</label>
      
      {/* THE FIX: Adjusted responsiveness to ensure grid never breaks */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {THEME_FAMILIES.map((family) => {
          const isActive = activeFamily.id === family.id;
          return (
            <button
              key={family.id}
              type="button"
              onClick={() => onChange(family.default)}
              className={`relative h-24 border-2 transition-all rounded-lg group overflow-hidden ${isActive ? 'border-emerald-500 ring-2 ring-emerald-500/20 z-10 bg-emerald-500/5' : 'border-zinc-800 bg-zinc-950 hover:border-zinc-600'} ${family.vibe}`}
            >
              {/* THE FIX: Absolute positioning prevents the rotated text from expanding the grid boundaries */}
              <div className="absolute inset-0 flex items-center justify-center p-3 pointer-events-none">
                <span className="text-center drop-shadow-sm text-[11px] font-black uppercase leading-[1.3] tracking-wider transform -rotate-6 group-hover:-rotate-3 transition-transform duration-300">
                  {family.label}
                </span>
              </div>
              
              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-20" />
              )}
            </button>
          );
        })}
      </div>

      {/* DUAL OPTION POP-OUT */}
      {activeFamily.dark && activeFamily.light && (
        <div className="mt-4 p-4 bg-zinc-950/50 border border-zinc-800/80 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-inner">
          <div className="flex items-center gap-2">
            {isLightModeActive ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400">Environment Mode</span>
          </div>
          <div className="flex bg-black rounded-lg p-1 border border-zinc-800 shadow-sm">
            <button
              type="button"
              onClick={() => onChange(activeFamily.light!)}
              className={`px-5 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${isLightModeActive ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => onChange(activeFamily.dark!)}
              className={`px-5 py-2 rounded-md text-[11px] font-black uppercase tracking-widest transition-all ${!isLightModeActive ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
            >
              Dark
            </button>
          </div>
        </div>
      )}
    </div>
  );
}