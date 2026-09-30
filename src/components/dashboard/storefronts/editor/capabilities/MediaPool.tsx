/* src/components/dashboard/storefronts/editor/capabilities/MediaPool.tsx */
'use client';

import React, { useState, startTransition } from 'react';
import { UploadCloud, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { updateStorefrontGallery, removeImageFromGallery } from '@/app/actions/storefronts';

export default function MediaPool({ formData, setFormData, localCaps, onReload }: any) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') return { id: `gal-${i}`, imageUrl: item, title: '', description: '', category: '', price: '', isVisible: true };
    return { ...item, id: item.id || `gal-${i}`, isVisible: item.isVisible !== false };
  });

  const unassignedImages = liveGallery.filter((img: any) => !img.category || !localCaps.some((c: any) => c.title === img.category));

  const handleAssignMedia = (unassignedImg: any, actionValue: string) => {
    if (!actionValue) return;
    const [actionType, payload] = actionValue.split('|');

    setFormData((prev: any) => {
      let items = [...(prev.gallery_items || [])];
      if (actionType === 'CREATE_NEW') {
        const targetImg = items.find((img: any) => img.id === unassignedImg.id);
        if (targetImg) {
          items = items.filter((img: any) => img.id !== unassignedImg.id);
          items.unshift({ ...targetImg, category: payload, isVisible: true });
        }
      } else if (actionType === 'MERGE') {
        items = items.map((img: any) => img.id === payload ? { ...img, imageUrl: unassignedImg.imageUrl } : img);
        items = items.filter((img: any) => img.id !== unassignedImg.id);
      }
      return { ...prev, gallery_items: items };
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); 
    setFiles([...files, ...Array.from(e.dataTransfer.files)]);
  };

  const handleUploadGallery = async () => {
    setIsUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    try {
      const response = await updateStorefrontGallery(formData.id, formData.slug, uploadData);
      setFiles([]);
      if (response?.gallery_items) setFormData((prev: any) => ({ ...prev, gallery_items: response.gallery_items }));
      if (onReload) onReload(); 
    } catch (e) { alert("Gallery sync failed."); } finally { setIsUploading(false); }
  };

  const handleDeleteLiveItem = async (id: string, imageUrl?: string) => {
    if (!window.confirm("Remove this image from the vault?")) return;
    try {
      if (imageUrl && imageUrl.startsWith('http')) await removeImageFromGallery(formData.id, imageUrl);
      setFormData((prev: any) => ({
        ...prev, gallery_items: prev.gallery_items.filter((img: any) => img.id !== id)
      }));
      startTransition(() => { router.refresh(); if (onReload) onReload(); });
    } catch (e) { alert("Failed to remove item."); }
  };

  return (
    <div className="pt-10 mt-10 border-t border-zinc-800">
      <div className="flex items-center gap-2 mb-4">
        <ImageIcon className="w-4 h-4 text-emerald-500" />
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Unassigned Media Pool</h3>
      </div>
      
      <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="border border-dashed border-zinc-700 p-8 rounded-xl text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors bg-zinc-900/40 cursor-pointer">
        <UploadCloud className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
        <p className="text-zinc-300 font-bold text-xs uppercase tracking-widest">Drag & Drop Photos Here</p>
      </div>

      {files.length > 0 && (
        <div className="space-y-3 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl mt-4">
          <h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Staging Queue ({files.length})</h4>
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {files.map((file, i) => (
              <div key={i} className="relative aspect-square bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800">
                <span className="text-[8px] text-zinc-500 font-mono truncate px-1">{file.name}</span>
                <button type="button" onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-black/80 rounded p-1 hover:bg-red-500 transition-colors"><X className="w-3 h-3 text-white" /></button>
              </div>
            ))}
          </div>
          <button onClick={handleUploadGallery} disabled={isUploading} className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors py-2.5 font-black tracking-widest text-[10px] text-zinc-950 uppercase rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.2)] disabled:opacity-50">
            {isUploading ? 'UPLOADING...' : 'UPLOAD TO POOL'}
          </button>
        </div>
      )}

      {unassignedImages.length > 0 && (
        <div className="grid grid-cols-1 gap-4 mt-6">
          {unassignedImages.map((img: any) => (
            <div key={img.id} className="flex gap-3 bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl shadow-sm items-center">
              <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-black group flex items-center justify-center">
                {img.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={img.imageUrl} alt="unassigned" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest text-center px-1 leading-tight">Text<br/>Card</span>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-center gap-2 min-w-0">
                <select
                  value=""
                  onChange={(e) => handleAssignMedia(img, e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-2 py-2 text-[10px] uppercase tracking-widest font-bold text-emerald-400 focus:border-fuchsia-500 focus:outline-none transition-colors cursor-pointer truncate"
                >
                  <option value="">-- Assign Media --</option>
                  {localCaps.map((c: any, idx: number) => {
                    const categoryCards = liveGallery.filter((lg: any) => lg.category === c.title);
                    return (
                      <optgroup key={idx} label={c.title || 'Untitled Category'}>
                        <option value={`CREATE_NEW|${c.title}`}>+ Create New Card</option>
                        {categoryCards.map((card: any) => (
                          <option key={card.id} value={`MERGE|${card.id}`}>
                            Replace: {card.title || 'Untitled Item'}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </select>
                <div className="flex justify-end">
                  <button onClick={() => handleDeleteLiveItem(img.id, img.imageUrl)} className="text-[9px] text-rose-500 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent p-1.5 px-3 rounded-md uppercase tracking-widest font-bold flex items-center gap-1.5 transition-colors">
                    <Trash2 size={12} /> Delete Media
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}