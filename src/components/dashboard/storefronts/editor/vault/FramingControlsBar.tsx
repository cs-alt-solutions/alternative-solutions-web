/* src/components/dashboard/storefronts/editor/vault/FramingControlsBar.tsx */
'use client';

import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface FramingControlsBarProps {
  mode: 'hero' | 'story';
  imageFit: 'cover' | 'contain';
  focalPoint: { x: number; y: number };
  imageZoom: number;
  fitAlign: 'left' | 'center' | 'right';
  fitScale: number;
  onChangeFocalPoint: (next: { x: number; y: number }) => void;
  onChangeZoom: (next: number) => void;
  onChangeFitAlign: (next: 'left' | 'center' | 'right') => void;
  onChangeFitScale: (next: number) => void;
}

export default function FramingControlsBar({
  mode,
  imageFit,
  focalPoint,
  imageZoom,
  fitAlign,
  fitScale,
  onChangeFocalPoint,
  onChangeZoom,
  onChangeFitAlign,
  onChangeFitScale,
}: FramingControlsBarProps) {
  if (imageFit === 'cover') {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[9px] font-mono uppercase text-zinc-500 mr-1">Quick Y:</span>
          {[
            { label: 'Top', y: 15 },
            { label: 'Upper', y: 32 },
            { label: 'Center', y: 50 },
            { label: 'Lower', y: 72 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChangeFocalPoint({ x: focalPoint.x, y: preset.y })}
              className="px-2 py-1 rounded bg-zinc-950 border border-zinc-800 hover:border-emerald-500/40 text-[10px] font-bold uppercase text-zinc-300 cursor-pointer"
            >
              {preset.label}
            </button>
          ))}
          <span className="text-[10px] font-mono text-emerald-400 ml-1">
            {focalPoint.x}%, {focalPoint.y}%
          </span>
        </div>

        <div className="flex items-center gap-2.5 sm:w-48">
          <span className="text-[9px] font-mono uppercase text-zinc-400 shrink-0">
            Zoom {imageZoom.toFixed(1)}x
          </span>
          <input
            type="range"
            min={1}
            max={2}
            step={0.05}
            value={imageZoom}
            onChange={(e) => onChangeZoom(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  if (mode === 'hero') {
    const alignments: { id: 'left' | 'center' | 'right'; label: string; icon: React.ElementType }[] = [
      { id: 'left', label: 'Left', icon: AlignLeft },
      { id: 'center', label: 'Center', icon: AlignCenter },
      { id: 'right', label: 'Right', icon: AlignRight },
    ];

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800 rounded-xl p-3">
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono uppercase text-zinc-500 mr-1">Place Photo:</span>
          {alignments.map((opt) => {
            const Icon = opt.icon;
            const active = fitAlign === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChangeFitAlign(opt.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded border text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                  active
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Icon size={11} /> {opt.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5 sm:w-52">
          <span className="text-[9px] font-mono uppercase text-zinc-400 shrink-0">
            Size {fitScale}%
          </span>
          <input
            type="range"
            min={65}
            max={100}
            step={5}
            value={fitScale}
            onChange={(e) => onChangeFitScale(parseInt(e.target.value, 10))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>
    );
  }

  return (
    <p className="text-[11px] text-zinc-400 bg-zinc-900/50 border border-zinc-800 rounded-xl px-3.5 py-2.5">
      Full uncropped image displays inside the frame over a soft blurred backdrop.
    </p>
  );
}