/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/capabilities/CapabilitiesDirectoryList.tsx */
'use client';

import React from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { EDITOR_WORKSPACE_COPY, IndustryBlueprint } from '@/config/dashboard/editor';

interface CapabilitiesDirectoryListProps {
  packages: any[];
  normalizedGallery: any[];
  isMenuLayout: boolean;
  blueprint: IndustryBlueprint;
  onAddPrimary: () => void;
  onSelectIndex: (originalIndex: number) => void;
  onMovePackage: (pkgPos: number, direction: 'up' | 'down') => void;
  onRemoveCapability: (originalIndex: number) => void;
}

export default function CapabilitiesDirectoryList({
  packages,
  normalizedGallery,
  isMenuLayout,
  blueprint,
  onAddPrimary,
  onSelectIndex,
  onMovePackage,
  onRemoveCapability,
}: CapabilitiesDirectoryListProps) {
  const dir = EDITOR_WORKSPACE_COPY.SERVICES_TAB.DIRECTORY;

  if (packages.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/25 space-y-2.5">
        <p className="text-[11px] text-zinc-500 font-mono tracking-widest uppercase">
          {blueprint.emptyPrimaryText}
        </p>
        <button
          type="button"
          onClick={onAddPrimary}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 border border-cyan-500/25 px-3 py-1.5 rounded-lg cursor-pointer"
        >
          <Plus className="w-3 h-3" /> {blueprint.addPrimaryBtn}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {packages.map((cap, pkgPos) => {
        const titleKey = (cap.title || '').trim().toLowerCase();
        const linkedPhotos = titleKey
          ? normalizedGallery.filter(
              (img) =>
                img.isVisible !== false &&
                img.imageUrl &&
                (img.category || '').trim().toLowerCase() === titleKey
            )
          : [];
        const thumbUrl = linkedPhotos[0]?.imageUrl || cap.coverImage || '';
        const highlightsCount = Array.isArray(cap.bullets)
          ? cap.bullets.filter((b: string) => b && b.trim()).length
          : 0;
        const faqsCount = Array.isArray(cap.faqs)
          ? cap.faqs.filter((f: any) => f && f.question?.trim()).length
          : 0;
        const indexLabel = pkgPos + 1 < 10 ? `0${pkgPos + 1}` : `${pkgPos + 1}`;

        const metaParts: string[] = isMenuLayout
          ? [
              `${linkedPhotos.length} ${linkedPhotos.length === 1 ? dir.CARD_SINGULAR : dir.CARD_PLURAL}`,
              cap.price || dir.ALL_DAY_DEFAULT,
            ]
          : [
              `${highlightsCount} ${highlightsCount === 1 ? dir.HIGHLIGHT_SINGULAR : dir.HIGHLIGHT_PLURAL}`,
              `${linkedPhotos.length} ${linkedPhotos.length === 1 ? dir.PHOTO_SINGULAR : dir.PHOTO_PLURAL}`,
              ...(faqsCount > 0
                ? [`${faqsCount} ${faqsCount === 1 ? dir.FAQ_SINGULAR : dir.FAQ_PLURAL}`]
                : []),
            ];

        return (
          <div
            key={cap.originalIndex}
            onClick={() => onSelectIndex(cap.originalIndex)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectIndex(cap.originalIndex);
              }
            }}
            className="group flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 hover:border-cyan-500/40 hover:bg-zinc-900/80 transition-all cursor-pointer"
          >
            <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900 flex items-center justify-center">
              {thumbUrl ? (
                <img
                  src={thumbUrl}
                  alt={cap.title || `${dir.ITEM_FALLBACK_PREFIX} ${indexLabel}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-4 h-4 text-zinc-700" />
              )}
              <span className="absolute bottom-0.5 left-0.5 px-1 py-px rounded bg-black/80 text-[9px] font-mono font-bold text-zinc-200 leading-none">
                {indexLabel}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate group-hover:text-cyan-300 transition-colors">
                  {cap.title?.trim() || dir.UNTITLED_ITEM}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono truncate mt-0.5">
                {metaParts.join(' · ')}
              </p>
            </div>

            <div
              className="flex items-center gap-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col opacity-40 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onMovePackage(pkgPos, 'up')}
                  disabled={pkgPos === 0}
                  className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  title={dir.MOVE_UP_TITLE}
                >
                  <ChevronUp className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onMovePackage(pkgPos, 'down')}
                  disabled={pkgPos === packages.length - 1}
                  className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 cursor-pointer"
                  title={dir.MOVE_DOWN_TITLE}
                >
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => onRemoveCapability(cap.originalIndex)}
                className="p-1.5 text-zinc-600 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                title={dir.DELETE_TITLE}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
            </div>
          </div>
        );
      })}
    </div>
  );
}