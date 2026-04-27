// sandbox/apps/storefront/product-card/DisposableHardwareLabel.tsx
import React from 'react';
import { Cpu, Flame, Sparkles } from 'lucide-react';

interface DisposableHardwareProps {
  tankCount: number; // 1, 2, 3, or 4
  includesPreRoll?: boolean;
  includesGummy?: boolean;
  description?: string; // 🚀 Description prop added
}

export const DisposableHardwareLabel: React.FC<DisposableHardwareProps> = ({
  tankCount = 1,
  includesPreRoll = false,
  includesGummy = false,
  description,
}) => {
  // Determine the display text for the hardware
  const hardwareText = 
    tankCount === 1 ? 'SINGLE TANK' :
    tankCount === 2 ? 'DUAL-CHAMBER' :
    tankCount === 3 ? 'TRI-TANK SWITCH' :
    tankCount === 4 ? 'QUAD-CORE' : `${tankCount} CHAMBERS`;

  const hasExtras = includesPreRoll || includesGummy;

  return (
    <div className="flex flex-col gap-2.5 p-3 sm:p-4 bg-zinc-950/90 border border-emerald-500/20 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.05)] relative overflow-hidden group mb-1">
      
      {/* Subtle ambient background glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full pointer-events-none transition-all duration-500 group-hover:bg-emerald-500/20" />

      {/* --- HARDWARE SPECS (THE TANKS) --- */}
      <div className="flex justify-between items-end relative z-10">
        <div className="flex items-center gap-1.5">
          <Cpu size={12} className="text-emerald-500" />
          <span className="text-[9px] font-black text-zinc-400 tracking-widest uppercase">
            Hardware Vitals
          </span>
        </div>
        <span className="text-[11px] font-black text-emerald-400 tracking-widest uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">
          {hardwareText}
        </span>
      </div>

      {/* Dynamic LED Tank Visualizer (Skewed Tech Aesthetic) */}
      <div className="flex gap-1.5 h-3 w-full relative z-10 px-0.5 mt-0.5">
        {[...Array(4)].map((_, i) => {
          const isActive = i < tankCount;
          return (
            <div
              key={i}
              className={`flex-1 rounded-sm skew-x-[-15deg] transition-all duration-500 ${
                isActive
                  ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-emerald-400'
                  : 'bg-zinc-900/50 border border-zinc-800/80 shadow-inner'
              }`}
            />
          );
        })}
      </div>

      {/* --- THE EXTRAS (BONUS ITEMS) --- */}
      {hasExtras && (
        <div className="mt-1.5 pt-2.5 border-t border-zinc-800/60 flex flex-col gap-2 relative z-10">
          <span className="text-[8px] font-black text-zinc-500 tracking-widest uppercase">
            Bonus Items
          </span>
          <div className="flex flex-wrap gap-2">
            {includesPreRoll && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/10 border border-amber-500/30 rounded-md text-amber-400 text-[9px] font-black tracking-widest uppercase shadow-sm">
                <Flame size={10} className="text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)]" /> 
                1x Pre-Roll
              </div>
            )}
            {includesGummy && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/30 rounded-md text-fuchsia-400 text-[9px] font-black tracking-widest uppercase shadow-sm">
                <Sparkles size={10} className="text-fuchsia-500 drop-shadow-[0_0_5px_rgba(217,70,239,0.8)]" /> 
                1x Gummy
              </div>
            )}
          </div>
        </div>
      )}

      {/* 🚀 ADDED: The Description now lives INSIDE the hardware block */}
      {description && (
        <div className="mt-1.5 pt-2.5 border-t border-emerald-500/20 relative z-10">
          <p className="text-[9px] text-zinc-300 leading-relaxed font-medium text-justify">
            {description}
          </p>
        </div>
      )}

    </div>
  );
};