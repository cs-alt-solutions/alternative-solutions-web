/* src/components/dashboard/storefronts/editor/capabilities/MenuCardEditor.tsx */
'use client';

import React, { useState, startTransition } from 'react';
import { ChevronUp, ChevronDown, DollarSign, Trash2, Eye, EyeOff, Unlink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { removeImageFromGallery } from '@/app/actions/storefronts';

export default function MenuCardEditor({ img, index, categoryImagesCount, localCaps, isMenuMode, formData, setFormData, onReload }: any) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const currentId = img.id;
  const hasImage = !!img.imageUrl;
  const isVisible = img.isVisible !== false;

  const handleMetaChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: (prev.gallery_items || []).map((item: any) => 
        (item.id === currentId) ? { ...item, [field]: value } : item
      )
    }));
  };

  const moveItem = (direction: 'up' | 'down') => {
    setFormData((prev: any) => {
      const items = [...(prev.gallery_items || [])];
      const currentIndex = items.findIndex((item: any) => item.id === currentId);
      if (currentIndex === -1) return prev;
      
      const category = items[currentIndex].category;
      const categoryIndices = items.map((item: any, idx: number) => item.category === category ? idx : -1).filter(idx => idx !== -1);
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

  const detachMedia = () => {
    setFormData((prev: any) => {
      let items = [...(prev.gallery_items || [])];
      items = items.map((item: any) => (item.id === currentId) ? { ...item, imageUrl: '' } : item);
      items.unshift({ id: `unassigned-${Date.now()}`, imageUrl: img.imageUrl, title: '', description: '', price: '', category: '', isVisible: true });
      return { ...prev, gallery_items: items };
    });
  };

  const deleteItem = async () => {
    if (!window.confirm("Remove this item entirely?")) return;
    setIsDeleting(true);
    try {
      if (img.imageUrl && img.imageUrl.startsWith('http')) await removeImageFromGallery(formData.id, img.imageUrl);
      setFormData((prev: any) => ({
        ...prev, gallery_items: prev.gallery_items.filter((item: any) => item.id !== currentId)
      }));
      startTransition(() => { router.refresh(); if (onReload) onReload(); });
    } catch (e) { alert("Failed to remove item."); } finally { setIsDeleting(false); }
  };

  return (
    <div className={`flex gap-3 ${isVisible ? 'bg-black/40 border-zinc-800/80' : 'bg-zinc-950/50 border-dashed border-zinc-700 opacity-60'} border p-3 rounded-xl items-start transition-all`}>
      <div className="flex flex-col gap-1 items-center justify-center shrink-0 w-4 pt-2">
        <button onClick={() => moveItem('up')} disabled={index === 0} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 transition-colors">
          <ChevronUp size={16} />
        </button>
        <button onClick={() => moveItem('down')} disabled={index === categoryImagesCount - 1} className="text-zinc-600 hover:text-cyan-400 disabled:opacity-0 transition-colors">
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex gap-3 items-start">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950 flex items-center justify-center group">
            {hasImage ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={img.imageUrl} alt="preview" className={`w-full h-full object-cover ${isDeleting ? 'opacity-30' : ''}`} />
            ) : (
              <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center px-1 leading-tight">Text<br/>Card</span>
            )}
          </div>
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex gap-2">
              <input placeholder="Name" value={img.title || ''} onChange={(e) => handleMetaChange('title', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-white font-bold focus:border-fuchsia-500 outline-none" />
              {isMenuMode && (
                <div className="relative w-24 shrink-0">
                  <DollarSign className="w-3 h-3 text-fuchsia-500 absolute left-2.5 top-2 pointer-events-none" />
                  <input placeholder="Price" value={img.price || ''} onChange={(e) => handleMetaChange('price', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md pl-7 pr-2 py-1.5 text-xs text-white font-bold focus:border-fuchsia-500 outline-none" />
                </div>
              )}
            </div>
            <textarea placeholder="Description..." value={img.description || ''} onChange={(e) => handleMetaChange('description', e.target.value)} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-[11px] text-zinc-400 focus:border-fuchsia-500 outline-none resize-none" />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-3 pt-3 mt-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold shrink-0">Move:</span>
            <select
              value={img.category || ''}
              onChange={(e) => handleMetaChange('category', e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-md text-[9px] uppercase tracking-widest font-bold text-fuchsia-400 py-1.5 px-2 focus:outline-none focus:border-fuchsia-500 cursor-pointer w-full truncate"
            >
              {localCaps.map((c: any, idx: number) => (
                <option key={idx} value={c.title}>{c.title || 'Untitled'}</option>
              ))}
              <option value="">-- Remove --</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* 🚀 THE FIX: whitespace-nowrap and shrink-0 guarantees the button won't squish or break lines! */}
            <button onClick={() => handleMetaChange('isVisible', !isVisible)} className={`shrink-0 whitespace-nowrap p-1.5 px-2 rounded-md border transition-colors flex items-center gap-1.5 ${isVisible ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-amber-500/10 border-amber-500/20 text-amber-500 hover:bg-amber-500/20'}`} title={isVisible ? "Currently Visible (Click to Hide)" : "Currently Hidden (Click to Show)"}>
              {isVisible ? <><Eye size={12}/> <span className="text-[9px] font-bold uppercase">Visible</span></> : <><EyeOff size={12}/> <span className="text-[9px] font-bold uppercase">Hidden</span></>}
            </button>
            <div className="w-px h-4 bg-zinc-800 mx-1 shrink-0" />
            <button onClick={detachMedia} disabled={!hasImage} className="shrink-0 p-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-amber-400 hover:border-amber-500/30 disabled:opacity-20 transition-colors" title="Detach Image">
              <Unlink size={12} />
            </button>
            <button onClick={deleteItem} className="shrink-0 p-1.5 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 transition-colors" title="Delete Item">
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}