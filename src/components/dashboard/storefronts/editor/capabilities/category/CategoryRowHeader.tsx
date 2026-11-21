/* src/components/dashboard/storefronts/editor/capabilities/category/CategoryRowHeader.tsx */
'use client';

import React from 'react';
import { ChevronUp, ChevronDown, X } from 'lucide-react';

interface CategoryRowHeaderProps {
  title?: string;
  index: number;
  totalCount: number;
  isOpen: boolean;
  isMenuMode: boolean;
  isAlaCarte: boolean;
  cardsCount: number;
  copy: any;
  onToggle: () => void;
  onMove: (direction: 'up' | 'down') => void;
  onRemove: () => void;
}

export default function CategoryRowHeader({
  title,
  index,
  totalCount,
  isOpen,
  isMenuMode,
  isAlaCarte,
  cardsCount,
  copy,
  onToggle,
  onMove,
  onRemove,
}: CategoryRowHeaderProps) {
  const fallbackTitle = isAlaCarte
    ? copy.UNTITLED_ADDON
    : isMenuMode
      ? copy.UNTITLED_CATEGORY
      : copy.UNTITLED_PACKAGE;

  return (
    <div
      className={`flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer transition-colors group ${
        isOpen ? (isAlaCarte ? 'bg-fuchsia-500/5' : 'bg-zinc-900/70') : 'hover:bg-zinc-900/40'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="flex flex-col shrink-0 -my-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => onMove('up')}
            disabled={index === 0}
            className="text-zinc-600 hover:text-cyan-400 disabled:opacity-15 cursor-pointer leading-none"
            title="Move Up"
          >
            <ChevronUp className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => onMove('down')}
            disabled={index === totalCount - 1}
            className="text-zinc-600 hover:text-cyan-400 disabled:opacity-15 cursor-pointer leading-none"
            title="Move Down"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        <h3 className={`font-bold text-xs truncate ${isAlaCarte ? 'text-fuchsia-400' : 'text-zinc-100'}`}>
          {title || fallbackTitle}
        </h3>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isMenuMode && (
          <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[9px] text-zinc-400 font-mono">
            {cardsCount}
          </span>
        )}
        <ChevronDown
          className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-0.5 text-zinc-600 hover:text-rose-400 transition-colors cursor-pointer"
          title="Remove"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}