/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/vault/FolderAssetCard.tsx */
'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, Crop, Eye, EyeOff, Trash2, Star } from 'lucide-react';

interface FolderAssetCardProps {
  img: any;
  index: number;
  totalCount: number;
  availableCategories: string[];
  copy: any;
  onOpenFraming: () => void;
  onSetCover: () => void;
  onUpdateField: (field: string, value: string) => void;
  onPatch: (patch: Record<string, any>) => void;
  onReorder: (direction: 'left' | 'right') => void;
  onRemove: () => void;
}

export default function FolderAssetCard({
  img,
  index,
  totalCount,
  availableCategories,
  copy,
  onOpenFraming,
  onSetCover,
  onUpdateField,
  onPatch,
  onReorder,
  onRemove,
}: FolderAssetCardProps) {
  const isCover = index === 0;
  const isVisible = img.isVisible !== false;
  const isContain = img.imageFit === 'contain';
  const fx = img.focalPoint?.x ?? 50;
  const fy = img.focalPoint?.y ?? 50;
  const zoom = img.imageZoom ?? 1;
  const hasCustomFrame = isContain || fx !== 50 || fy !== 50 || zoom > 1;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-sm flex flex-col border transition-all ${
        isVisible
          ? isCover
            ? 'bg-zinc-900/70 border-amber-500/40'
            : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
          : 'bg-zinc-950/60 border-dashed border-zinc-700 opacity-70'
      }`}
    >
      {/* Live-Framed 16:10 Preview */}
      <div className="relative aspect-16/10 bg-black overflow-hidden border-b border-zinc-800 group">
        {isContain ? (
          <>
            <img
              src={img.imageUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-45 pointer-events-none"
            />
            <img
              src={img.imageUrl}
              alt={copy.PORTFOLIO_ALT}
              className="relative z-10 w-full h-full object-contain"
            />
          </>
        ) : (
          <img
            src={img.imageUrl}
            alt={copy.PORTFOLIO_ALT}
            className="w-full h-full object-cover"
            style={{
              objectPosition: `${fx}% ${fy}%`,
              transform: zoom > 1 ? `scale(${zoom})` : undefined,
              transformOrigin: `${fx}% ${fy}%`,
            }}
          />
        )}

        {/* Top Left Cover Star / Promote Button */}
        <button
          type="button"
          onClick={onSetCover}
          disabled={isCover}
          className={`absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg border text-[9px] font-mono font-bold uppercase tracking-wider backdrop-blur-md transition-all ${
            isCover
              ? 'bg-amber-500 text-black border-amber-400 cursor-default shadow-sm'
              : 'bg-black/70 text-zinc-200 border-white/15 hover:bg-amber-500 hover:text-black hover:border-amber-400 cursor-pointer'
          }`}
          title={isCover ? 'Primary cover photo (powers Hero backdrop)' : 'Set as primary cover photo'}
        >
          <Star size={10} className={isCover ? 'fill-black' : ''} />
          <span>{isCover ? 'Cover' : `#${index + 1}`}</span>
        </button>

        {/* Top Right Frame Button */}
        <button
          type="button"
          onClick={onOpenFraming}
          className={`absolute top-2 right-2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-all cursor-pointer ${
            hasCustomFrame
              ? 'bg-emerald-500/90 text-black border-emerald-400 hover:bg-emerald-400'
              : 'bg-black/70 text-white border-white/15 hover:bg-emerald-500 hover:text-black hover:border-emerald-400'
          }`}
          title="Adjust focal point, zoom, or full-photo fit"
        >
          <Crop size={11} />
          <span>{isContain ? 'Fit' : 'Frame'}</span>
        </button>
      </div>

      {/* Compact Control Toolbar */}
      <div className="px-3 py-2 bg-zinc-950/80 border-b border-zinc-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onReorder('left')}
            disabled={index === 0}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
            title="Move Earlier"
          >
            <ChevronLeft size={12} />
          </button>
          <button
            type="button"
            onClick={() => onReorder('right')}
            disabled={index === totalCount - 1}
            className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
            title="Move Later"
          >
            <ChevronRight size={12} />
          </button>
        </div>

        <select
          value={img.category || ''}
          onChange={(e) => onPatch({ category: e.target.value })}
          className="flex-1 min-w-0 bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] font-semibold text-zinc-300 focus:border-emerald-500 outline-none truncate cursor-pointer"
          title="Move to another folder"
        >
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onPatch({ isVisible: !isVisible })}
            className={`p-1 rounded border transition-colors cursor-pointer ${
              isVisible
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20'
            }`}
            title={
              isVisible
                ? 'Visible in gallery (Click to hide from gallery)'
                : 'Hidden from gallery (Still powers Hero if set as Cover)'
            }
          >
            {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
          </button>

          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded bg-rose-500/10 border border-rose-500/25 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
            title={copy.BTN_REMOVE_IMAGE}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Story Title & Caption */}
      <div className="p-3 space-y-2">
        <input
          type="text"
          value={img.title || ''}
          onChange={(e) => onUpdateField('title', e.target.value)}
          placeholder={copy.PLACEHOLDER_TITLE}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
        />
        <textarea
          value={img.description || ''}
          onChange={(e) => onUpdateField('description', e.target.value)}
          placeholder={copy.PLACEHOLDER_DESC}
          rows={2}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
        />
      </div>
    </div>
  );
}