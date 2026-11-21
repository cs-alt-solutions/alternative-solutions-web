/* src/components/dashboard/storefronts/editor/capabilities/MenuCardEditor.tsx */
'use client';

import React, { useState, useMemo } from 'react';
import { DollarSign, Trash2, Unlink, AlertCircle } from 'lucide-react';
import { removeImageFromGallery } from '@/app/actions/storefronts';
import { EDITOR_WORKSPACE_COPY } from '@/config/dashboard/editor';
import MenuCardHeader from './menu-card/MenuCardHeader';
import MenuCardPhotoTile from './menu-card/MenuCardPhotoTile';
import MenuCardAddons from './menu-card/MenuCardAddons';
import VaultPickerModal from './menu-card/VaultPickerModal';

export default function MenuCardEditor({
  img,
  index,
  categoryImagesCount,
  localCaps,
  isMenuMode,
  formData,
  setFormData,
}: any) {
  const [isExpanded, setIsExpanded] = useState(() => !img.title && !img.imageUrl);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showVaultPicker, setShowVaultPicker] = useState(false);

  const copy = EDITOR_WORKSPACE_COPY.SERVICES_TAB.CARD_EDITOR;
  const currentId = img.id;
  const hasImage = !!img.imageUrl;
  const isVisible = img.isVisible !== false;
  const isRaw = !!img.isRaw;

  const assignedUrls = useMemo(
    () => (formData.gallery_items || []).map((item: any) => item.imageUrl).filter(Boolean),
    [formData.gallery_items]
  );

  const handleMetaChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: (prev.gallery_items || []).map((item: any) =>
        item.id === currentId ? { ...item, [field]: value } : item
      ),
    }));
  };

  const moveItem = (direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const items = [...(prev.gallery_items || [])];
      const currentIndex = items.findIndex((item: any) => item.id === currentId);
      if (currentIndex === -1) return prev;

      const category = items[currentIndex].category;
      const categoryIndices = items
        .map((item: any, idx: number) => (item.category === category ? idx : -1))
        .filter((idx) => idx !== -1);
      const relativeIndex = categoryIndices.indexOf(currentIndex);

      if (direction === 'up' && relativeIndex > 0) {
        const swapIndex = categoryIndices[relativeIndex - 1];
        [items[currentIndex], items[swapIndex]] = [items[swapIndex], items[currentIndex]];
      } else if (direction === 'down' && relativeIndex < categoryIndices.length - 1) {
        const swapIndex = categoryIndices[relativeIndex + 1];
        [items[currentIndex], items[swapIndex]] = [items[swapIndex], items[currentIndex]];
      }
      return { ...prev, gallery_items: items };
    });
  };

  const detachMedia = () => handleMetaChange('imageUrl', '');

  const deleteItem = async () => {
    if (!window.confirm(copy.DELETE_CONFIRM)) return;
    setIsDeleting(true);
    try {
      if (img.imageUrl && img.imageUrl.startsWith('http')) {
        await removeImageFromGallery(formData.id, img.imageUrl);
      }
      setFormData((prev: any) => ({
        ...prev,
        gallery_items: prev.gallery_items.filter((item: any) => item.id !== currentId),
      }));
    } catch {
      alert('Failed to remove item.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className={`rounded-lg border transition-all overflow-hidden ${
        !isVisible
          ? 'bg-zinc-950/40 border-dashed border-zinc-700/80 opacity-65'
          : isExpanded
            ? 'bg-zinc-900/50 border-fuchsia-500/35'
            : 'bg-black/40 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <MenuCardHeader
        img={img}
        index={index}
        categoryImagesCount={categoryImagesCount}
        isMenuMode={isMenuMode}
        isExpanded={isExpanded}
        isDeleting={isDeleting}
        copy={copy}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
        onMove={moveItem}
        onToggleVisible={() => handleMetaChange('isVisible', !isVisible)}
        onDelete={deleteItem}
      />

      {isExpanded && (
        <div className="p-3 border-t border-zinc-800/80 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex gap-2.5 items-start">
            <MenuCardPhotoTile
              storefrontId={formData.id}
              imageUrl={img.imageUrl}
              isDeleting={isDeleting}
              copy={copy}
              onImageUploaded={(url) => handleMetaChange('imageUrl', url)}
              onOpenVault={() => setShowVaultPicker(true)}
            />

            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex gap-1.5">
                <input
                  placeholder={copy.NAME_PLACEHOLDER}
                  value={img.title || ''}
                  onChange={(e) => handleMetaChange('title', e.target.value)}
                  className="flex-1 min-w-0 bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-xs text-white font-bold focus:border-fuchsia-500 outline-none"
                />
                {isMenuMode && (
                  <div className="relative w-20 shrink-0">
                    <DollarSign className="w-3 h-3 text-fuchsia-500 absolute left-2 top-2 pointer-events-none" />
                    <input
                      placeholder={copy.PRICE_PLACEHOLDER}
                      value={img.price || ''}
                      onChange={(e) => handleMetaChange('price', e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-6 pr-2 py-1.5 text-xs text-white font-bold focus:border-fuchsia-500 outline-none"
                    />
                  </div>
                )}
              </div>

              <textarea
                placeholder={copy.DESC_PLACEHOLDER}
                value={img.description || ''}
                onChange={(e) => handleMetaChange('description', e.target.value)}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2.5 py-1.5 text-[11px] text-zinc-300 focus:border-fuchsia-500 outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {isMenuMode && (
            <MenuCardAddons
              addons={img.addons || []}
              copy={copy}
              onChange={(updated) => handleMetaChange('addons', updated)}
            />
          )}

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-800/60">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold shrink-0">
                {copy.MOVE_LABEL}
              </span>
              <select
                value={img.category || ''}
                onChange={(e) => handleMetaChange('category', e.target.value)}
                className="bg-zinc-950 border border-zinc-800 rounded text-[9px] uppercase tracking-wider font-bold text-fuchsia-400 py-1 px-1.5 focus:outline-none focus:border-fuchsia-500 cursor-pointer flex-1 min-w-0 truncate"
              >
                {localCaps.map((c: any, idx: number) => (
                  <option key={idx} value={c.title}>
                    {c.title || 'Untitled'}
                  </option>
                ))}
                <option value="">{copy.REMOVE_CATEGORY_OPTION}</option>
              </select>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {isMenuMode && (
                <button
                  type="button"
                  onClick={() => handleMetaChange('isRaw', !isRaw)}
                  className={`p-1 px-1.5 rounded border transition-colors flex items-center gap-1 cursor-pointer ${
                    isRaw
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                  }`}
                  title={copy.RAW_WARNING_TITLE}
                >
                  <AlertCircle size={11} />
                  <span className="text-[8px] font-bold uppercase">Raw</span>
                </button>
              )}

              <button
                type="button"
                onClick={detachMedia}
                disabled={!hasImage}
                className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 disabled:opacity-20 transition-colors cursor-pointer"
                title={copy.DETACH_TITLE}
              >
                <Unlink size={11} />
              </button>

              <button
                type="button"
                onClick={deleteItem}
                className="p-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors cursor-pointer"
                title={copy.DELETE_TITLE}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>
        </div>
      )}

      <VaultPickerModal
        isOpen={showVaultPicker}
        storefrontId={formData.id}
        assignedUrls={assignedUrls}
        copy={copy}
        onSelect={(url) => handleMetaChange('imageUrl', url)}
        onClose={() => setShowVaultPicker(false)}
      />
    </div>
  );
}