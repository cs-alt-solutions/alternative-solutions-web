/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/vault/ActivePortfolios.tsx */
'use client';

import React from 'react';
import { Layers, Plus, FolderDown, FolderOpen } from 'lucide-react';
import { VAULT_COPY } from '@/config/dashboard/vault';

interface ActivePortfoliosProps {
  folderCategories: string[];
  serviceCategories: string[];
  capabilities: any[];
  galleryItems: any[];
  legacyCoversCount: number;
  onImportAllLegacyCovers: () => void;
  setActiveFolder: (f: string) => void;
  handleCreateFolder: () => void;
}

export default function ActivePortfolios({
  folderCategories,
  serviceCategories,
  capabilities,
  galleryItems,
  legacyCoversCount,
  onImportAllLegacyCovers,
  setActiveFolder,
  handleCreateFolder,
}: ActivePortfoliosProps) {
  const copy = VAULT_COPY.ACTIVE_PORTFOLIOS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Layers className="text-emerald-500 w-5 h-5 shrink-0" />
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">{copy.TITLE}</h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">
              Auto-synced with all active departments, services &amp; categories
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {legacyCoversCount > 0 && (
            <button
              type="button"
              onClick={onImportAllLegacyCovers}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 text-amber-300 border border-amber-500/35 hover:bg-amber-500 hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
            >
              <FolderDown size={12} /> Import {legacyCoversCount} Legacy Cover{legacyCoversCount === 1 ? '' : 's'}
            </button>
          )}

          <button
            type="button"
            onClick={handleCreateFolder}
            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
          >
            <Plus size={12} /> {copy.BTN_NEW_FOLDER}
          </button>
        </div>
      </div>

      {folderCategories.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-black/20 text-center">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{copy.EMPTY_STATE}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folderCategories.map((folder) => {
            const norm = folder.trim().toLowerCase();
            const vaultImages = galleryItems.filter(
              (i: any) => i.category?.trim().toLowerCase() === norm && i.imageUrl?.trim()
            );
            const matchedCap = capabilities.find((c: any) => c?.title?.trim().toLowerCase() === norm);
            const legacyCover = matchedCap?.coverImage?.trim() || '';
            const coverImg = vaultImages[0]?.imageUrl || legacyCover;
            const isLinkedService = serviceCategories.some((s) => s.trim().toLowerCase() === norm);

            return (
              <div
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg hover:border-emerald-500/50 transition-all"
              >
                {coverImg ? (
                  <img
                    src={coverImg}
                    alt={folder}
                    className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:scale-105 group-hover:opacity-70 transition-all duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/80">
                    <FolderOpen size={28} className="text-zinc-800 group-hover:text-emerald-500/50 transition-colors" />
                  </div>
                )}

                {legacyCover && vaultImages.length === 0 ? (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500/90 text-black text-[8px] font-mono font-black uppercase tracking-wider">
                    Legacy Cover
                  </span>
                ) : isLinkedService ? (
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded bg-black/70 border border-white/10 text-zinc-300 text-[8px] font-mono uppercase tracking-wider backdrop-blur-sm">
                    Synced
                  </span>
                ) : null}

                <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/45 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{folder}</h3>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">
                    {vaultImages.length} {copy.IMAGES_COUNT}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}