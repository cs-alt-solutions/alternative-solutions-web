/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/capabilities/menu-card/MenuCardHeader.tsx */
'use client';

import React from 'react';
import { ChevronUp, ChevronDown, Trash2, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';

interface MenuCardHeaderProps {
  img: any;
  index: number;
  categoryImagesCount: number;
  isMenuMode: boolean;
  isExpanded: boolean;
  isDeleting: boolean;
  copy: any;
  onToggleExpand: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onToggleVisible: () => void;
  onDelete: () => void;
}

export default function MenuCardHeader({
  img,
  index,
  categoryImagesCount,
  isMenuMode,
  isExpanded,
  isDeleting,
  copy,
  onToggleExpand,
  onMove,
  onToggleVisible,
  onDelete,
}: MenuCardHeaderProps) {
  const hasImage = !!img.imageUrl;
  const isVisible = img.isVisible !== false;
  const addonsCount = (img.addons || []).length;

  return (
    <div
      onClick={onToggleExpand}
      className="px-2 py-1.5 flex items-center justify-between gap-2 cursor-pointer select-none"
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Reorder Arrows */}
        <div className="flex flex-col shrink-0 -my-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="text-zinc-600 hover:text-fuchsia-400 disabled:opacity-15 cursor-pointer leading-none"
            title="Move Up"
          >
            <ChevronUp size={12} />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={index === categoryImagesCount - 1}
            className="text-zinc-600 hover:text-fuchsia-400 disabled:opacity-15 cursor-pointer leading-none"
            title="Move Down"
          >
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Mini Thumbnail Preview */}
        <div className="w-6 h-6 rounded bg-zinc-950 border border-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
          {hasImage ? (
            <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={11} className="text-zinc-700" />
          )}
        </div>

        {/* Item Title */}
        <span className="text-[11px] font-bold text-zinc-200 truncate">
          {img.title?.trim() || 'Untitled Item'}
        </span>

        {addonsCount > 0 && (
          <span className="text-[9px] font-mono text-zinc-500 shrink-0 hidden sm:inline">
            +{addonsCount}
          </span>
        )}
      </div>

      {/* Right Quick Info + Controls */}
      <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
        {isMenuMode && img.price && (
          <span className="text-[10px] font-mono font-bold text-fuchsia-400 px-1.5 py-0.5 rounded bg-fuchsia-500/10">
            {String(img.price).startsWith('$') ? img.price : `$${img.price}`}
          </span>
        )}

        <button
          type="button"
          onClick={onToggleVisible}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isVisible ? 'text-emerald-500/70 hover:text-emerald-400' : 'text-amber-500 hover:text-amber-400'
          }`}
          title={isVisible ? copy.VISIBLE_TITLE : copy.HIDDEN_TITLE}
        >
          {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>

        <button
          type="button"
          onClick={onToggleExpand}
          className="p-0.5 text-zinc-500 hover:text-white cursor-pointer"
        >
          <ChevronDown
            size={13}
            className={`transition-transform duration-200 ${isExpanded ? 'rotate-180 text-fuchsia-400' : ''}`}
          />
        </button>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="p-1 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
          title={copy.DELETE_TITLE}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}