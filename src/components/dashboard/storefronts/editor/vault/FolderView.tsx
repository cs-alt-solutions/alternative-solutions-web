/* src/components/dashboard/storefronts/editor/vault/FolderView.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, Edit2, Trash2, Loader2, Upload, FolderDown, Layers } from 'lucide-react';
import { VAULT_COPY } from '@/config/dashboard/vault';
import FolderAssetCard from './FolderAssetCard';
import ImageFramingModal from './ImageFramingModal';
import { HeroOverlayGuide } from './FramingStagePreview';

interface FolderViewProps {
  activeFolder: string;
  setActiveFolder: (f: string | null) => void;
  galleryItems: any[];
  availableCategories: string[];
  heroOverlay?: HeroOverlayGuide;
  legacyCoverUrl?: string;
  onImportLegacyCover?: () => void;
  isUploading: boolean;
  handleVaultUpload: (e: React.ChangeEvent<HTMLInputElement>, targetFolder?: string) => void;
  handleRenameFolder: (oldName: string) => void;
  handleDeleteFolder: (folderName: string) => void;
  removeImageFromFolder: (id: string) => void;
  updateFolderItem: (id: string, field: string, value: string) => void;
  patchFolderItem: (id: string, patch: Record<string, any>) => void;
  setCoverPhoto: (id: string, folderName: string) => void;
  reorderFolderItem: (id: string, folderName: string, direction: 'left' | 'right') => void;
}

export default function FolderView({
  activeFolder,
  setActiveFolder,
  galleryItems,
  availableCategories,
  heroOverlay,
  legacyCoverUrl,
  onImportLegacyCover,
  isUploading,
  handleVaultUpload,
  handleRenameFolder,
  handleDeleteFolder,
  removeImageFromFolder,
  updateFolderItem,
  patchFolderItem,
  setCoverPhoto,
  reorderFolderItem,
}: FolderViewProps) {
  const [framingItemId, setFramingItemId] = useState<string | null>(null);
  const [collectionFilter, setCollectionFilter] = useState<string>('ALL');
  const copy = VAULT_COPY.FOLDER_VIEW;

  const folderImages = useMemo(
    () =>
      galleryItems.filter(
        (i: any) =>
          i.category?.trim().toLowerCase() === activeFolder.trim().toLowerCase() &&
          i.imageUrl &&
          i.imageUrl.trim() !== ''
      ),
    [galleryItems, activeFolder]
  );

  // Deduplicated collection names (preserving first-seen casing) + counts
  const collectionStats = useMemo(() => {
    const map = new Map<string, { name: string; count: number }>();
    let untaggedCount = 0;

    for (const item of folderImages) {
      const raw = item.collection?.trim();
      if (!raw) {
        untaggedCount += 1;
        continue;
      }
      const key = raw.toLowerCase();
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { name: raw, count: 1 });
    }

    return {
      groups: Array.from(map.values()),
      names: Array.from(map.values()).map((g) => g.name),
      untaggedCount,
    };
  }, [folderImages]);

  // Fall back to ALL automatically if a filtered collection gets cleared/renamed
  const effectiveFilter =
    collectionFilter === 'ALL' ||
    (collectionFilter === '__UNTAGGED__' && collectionStats.untaggedCount > 0) ||
    collectionStats.names.some((n) => n.toLowerCase() === collectionFilter.toLowerCase())
      ? collectionFilter
      : 'ALL';

  const visibleEntries = useMemo(() => {
    return folderImages
      .map((img: any, trueIndex: number) => ({ img, trueIndex }))
      .filter(({ img }) => {
        if (effectiveFilter === 'ALL') return true;
        if (effectiveFilter === '__UNTAGGED__') return !img.collection?.trim();
        return img.collection?.trim().toLowerCase() === effectiveFilter.toLowerCase();
      });
  }, [folderImages, effectiveFilter]);

  const framingIndex = folderImages.findIndex((i: any) => i.id === framingItemId);
  const framingItem = framingIndex !== -1 ? folderImages[framingIndex] : null;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-in slide-in-from-right-8 duration-300 pb-24">
      <button
        type="button"
        onClick={() => setActiveFolder(null)}
        className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest cursor-pointer"
      >
        <ChevronLeft size={16} /> {copy.BTN_BACK}
      </button>

      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">{activeFolder}</h2>
            <button
              type="button"
              onClick={() => handleRenameFolder(activeFolder)}
              className="p-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title={copy.BTN_RENAME_FOLDER}
            >
              <Edit2 size={12} />
            </button>
            <button
              type="button"
              onClick={() => handleDeleteFolder(activeFolder)}
              className="p-1.5 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
              title={copy.BTN_DELETE_FOLDER}
            >
              <Trash2 size={12} />
            </button>
          </div>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">
            {folderImages.length} {copy.IMAGES_IN_PORTFOLIO} · Star sets Hero Cover · Group tags build Artist / Project cards
          </p>
        </div>

        <label className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 transition-all px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer shrink-0">
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}{' '}
          {copy.BTN_UPLOAD_DIRECT}
          <input
            type="file"
            multiple
            className="hidden"
            onChange={(e) => handleVaultUpload(e, activeFolder)}
            disabled={isUploading}
          />
        </label>
      </div>

      {legacyCoverUrl && onImportLegacyCover && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">
              Legacy Cover Photo Detected
            </p>
            <p className="text-[11px] text-zinc-400">
              Pull this department&apos;s existing cover photo into Drop Vault so you can frame, align, and caption it.
            </p>
          </div>
          <button
            type="button"
            onClick={onImportLegacyCover}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-black uppercase tracking-widest cursor-pointer shrink-0"
          >
            <FolderDown size={13} /> Import Cover to Folder
          </button>
        </div>
      )}

      {/* Sub-Collection Filter Bar (auto-appears once any photo in this folder has a group tag) */}
      {collectionStats.groups.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mr-1">
            <Layers size={12} className="text-cyan-400" /> Collections:
          </span>

          <button
            type="button"
            onClick={() => setCollectionFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
              effectiveFilter === 'ALL'
                ? 'bg-cyan-500 text-zinc-950 border-cyan-400'
                : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
            }`}
          >
            All ({folderImages.length})
          </button>

          {collectionStats.groups.map((grp) => {
            const isSelected = effectiveFilter.toLowerCase() === grp.name.toLowerCase();
            return (
              <button
                key={grp.name}
                type="button"
                onClick={() => setCollectionFilter(grp.name)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-500 text-zinc-950 border-cyan-400'
                    : 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:border-cyan-500/40 hover:text-white'
                }`}
              >
                {grp.name} ({grp.count})
              </button>
            );
          })}

          {collectionStats.untaggedCount > 0 && (
            <button
              type="button"
              onClick={() => setCollectionFilter('__UNTAGGED__')}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                effectiveFilter === '__UNTAGGED__'
                  ? 'bg-amber-500 text-zinc-950 border-amber-400'
                  : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:text-zinc-300'
              }`}
            >
              Untagged ({collectionStats.untaggedCount})
            </button>
          )}
        </div>
      )}

      {folderImages.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-black/20 text-center">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{copy.EMPTY_STATE}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleEntries.map(({ img, trueIndex }) => (
            <FolderAssetCard
              key={img.id}
              img={img}
              index={trueIndex}
              totalCount={folderImages.length}
              availableCategories={availableCategories}
              availableCollections={collectionStats.names}
              copy={copy}
              onOpenFraming={() => setFramingItemId(img.id)}
              onSetCover={() => setCoverPhoto(img.id, activeFolder)}
              onUpdateField={(field, val) => updateFolderItem(img.id, field, val)}
              onPatch={(patch) => patchFolderItem(img.id, patch)}
              onReorder={(dir) => reorderFolderItem(img.id, activeFolder, dir)}
              onRemove={() => removeImageFromFolder(img.id)}
            />
          ))}
        </div>
      )}

      {framingItem && (
        <ImageFramingModal
          imageUrl={framingItem.imageUrl}
          title={framingItem.title}
          isCover={framingIndex === 0}
          heroOverlay={heroOverlay}
          initialValue={{
            focalPoint: framingItem.focalPoint || { x: 50, y: 50 },
            imageFit: framingItem.imageFit || 'cover',
            imageZoom: framingItem.imageZoom || 1,
            heroFocalPoint: framingItem.heroFocalPoint,
            heroImageFit: framingItem.heroImageFit,
            heroImageZoom: framingItem.heroImageZoom,
            heroFitAlign: framingItem.heroFitAlign,
            heroFitScale: framingItem.heroFitScale,
          }}
          onSave={(val) => patchFolderItem(framingItem.id, val)}
          onClose={() => setFramingItemId(null)}
        />
      )}
    </div>
  );
}