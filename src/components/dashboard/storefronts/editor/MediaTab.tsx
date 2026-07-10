// src/components/dashboard/storefronts/editor/MediaTab.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Image as ImageIcon, X, CheckCircle, Trash2, Save, LayoutGrid } from 'lucide-react';
import { updateStorefrontMedia, updateStorefrontGallery, removeImageFromGallery } from '@/app/actions';
import { supabase } from '@/utils/supabase';

export default function MediaTab({ storefront }: { storefront: any }) {
  const router = useRouter();

  // --- SECTION 1: GALLERY ECOSYSTEM ---
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [liveGallery, setLiveGallery] = useState<any[]>([]);

  useEffect(() => {
    const raw = storefront.gallery_items || [];
    const formatted = raw.map((item: any, i: number) => {
      if (typeof item === 'string') {
        return { id: `gal-${Date.now()}-${i}`, imageUrl: item, title: '', description: '' };
      }
      return item;
    });
    setLiveGallery(formatted);
  }, [storefront.gallery_items]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  async function handleUploadGallery() {
    setIsUploadingGallery(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));

    try {
      await updateStorefrontGallery(storefront.id, storefront.slug, formData);
      setFiles([]);
      router.refresh();
    } catch (e) {
      alert("Gallery sync failed.");
    } finally {
      setIsUploadingGallery(false);
    }
  }

  function handleRemoveStaged(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  const handleMetaChange = (index: number, field: string, value: string) => {
    const updated = [...liveGallery];
    updated[index] = { ...updated[index], [field]: value };
    setLiveGallery(updated);
  };

  async function handleSaveMetadata() {
    setIsSavingMeta(true);
    try {
      const { error } = await supabase.from('storefronts').update({ gallery_items: liveGallery }).eq('id', storefront.id);
      if (error) throw error;
      router.refresh();
    } catch (e) {
      alert("Failed to save metadata.");
    } finally {
      setIsSavingMeta(false);
    }
  }

  async function handleDeleteLiveImage(imageUrlToRemove: string) {
    if (!window.confirm("Remove this image from live gallery?")) return;
    setIsDeleting(imageUrlToRemove);
    try {
      await removeImageFromGallery(storefront.id, imageUrlToRemove);
      setLiveGallery(prev => prev.filter(img => img.imageUrl !== imageUrlToRemove));
      router.refresh();
    } catch (e) {
      alert("Failed to remove image.");
    } finally {
      setIsDeleting(null);
    }
  }

  // --- SECTION 2: CORE IMAGES (HERO & ABOUT) ---
  const [isUploadingCore, setIsUploadingCore] = useState(false);
  const coreFormRef = useRef<HTMLFormElement>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);

  const handleHeroSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHeroPreview(URL.createObjectURL(file));
  };

  const handleAboutSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAboutPreview(URL.createObjectURL(file));
  };

  async function handleSaveCore(formData: FormData) {
    setIsUploadingCore(true);
    try {
      await updateStorefrontMedia(storefront.id, storefront.slug, formData);
      alert("Core media assets updated!");
      if (coreFormRef.current) coreFormRef.current.reset();
      router.refresh();
    } catch (e) {
      alert("Upload failed. Check storage permissions.");
    } finally {
      setIsUploadingCore(false);
    }
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 p-2">

      {/* BLOCK 1: GALLERY ECOSYSTEM */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <LayoutGrid className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-widest">Gallery & Portfolio</h2>
              <p className="text-xs text-zinc-500 font-mono mt-1">Manage masonry layout and dynamic hover states.</p>
            </div>
          </div>
          {liveGallery.length > 0 && (
            <button onClick={handleSaveMetadata} disabled={isSavingMeta} className="bg-emerald-600 hover:bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Save className="w-3 h-3" /> {isSavingMeta ? 'SAVING...' : 'SAVE METADATA'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-emerald-500" /> Drop New Media
          </label>
          <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="border-2 border-dashed border-zinc-800 p-12 rounded-2xl text-center hover:border-emerald-500/50 transition-colors bg-zinc-900/20">
            <UploadCloud className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
            <p className="text-white font-bold text-sm">Drag & Drop Images Here</p>
            <p className="text-zinc-500 text-xs mt-2 font-mono">Max resolution 2000px width</p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="space-y-4 pt-4 border-t border-zinc-800/50">
            <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Ready to Sync ({files.length})</h4>
            <div className="grid grid-cols-4 gap-4">
              {files.map((file, i) => (
                <div key={i} className="relative aspect-square bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800">
                  <span className="text-[10px] text-zinc-500 font-mono truncate px-2">{file.name}</span>
                  <button onClick={() => handleRemoveStaged(i)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-red-500/50 transition-colors"><X className="w-3 h-3 text-white" /></button>
                </div>
              ))}
            </div>
            <button onClick={handleUploadGallery} disabled={isUploadingGallery} className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors py-4 font-black tracking-widest text-zinc-950 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-50 mt-4">
              {isUploadingGallery ? 'SYNCING TO CLOUD...' : `SYNC ${files.length} ITEMS TO MASONRY GRID`}
            </button>
          </div>
        )}

        {liveGallery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-zinc-800/50">
            {liveGallery.map((item: any, i: number) => (
              <div key={item.id || i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col gap-3 shadow-lg">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 group">
                  <img src={item.imageUrl} alt={item.title || `Gallery ${i}`} className={`w-full h-full object-cover transition-all ${isDeleting === item.imageUrl ? 'opacity-30 blur-sm' : ''}`} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => handleDeleteLiveImage(item.imageUrl)} disabled={isDeleting === item.imageUrl} className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{isDeleting === item.imageUrl ? 'Removing...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <input type="text" placeholder="Title (e.g. Pan Seared Foie Gras)" value={item.title || ''} onChange={(e) => handleMetaChange(i, 'title', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white focus:border-emerald-500 outline-none transition-colors font-bold" />
                  <textarea placeholder="Description (e.g. Served with truffle butter...)" value={item.description || ''} onChange={(e) => handleMetaChange(i, 'description', e.target.value)} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white focus:border-emerald-500 outline-none transition-colors resize-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BLOCK 2: CORE IMAGES */}
      <div className="space-y-6 pt-8 border-t border-zinc-800">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <ImageIcon className="w-5 h-5 text-cyan-500" />
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Core Images</h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">Foundation visuals for Hero and About sections.</p>
          </div>
        </div>

        <form ref={coreFormRef} action={handleSaveCore} className="space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4 shadow-lg">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              Hero Background Image
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-48 h-32 rounded-lg overflow-hidden border-2 border-zinc-800 shrink-0 bg-zinc-950">
                <img src={heroPreview || storefront.hero_image || 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE'} alt="Hero" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" name="hero_file" onChange={handleHeroSelect} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
                <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase">1920x1080 recommended.</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl space-y-4 shadow-lg">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              About Section Image
            </label>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-zinc-800 shrink-0 bg-zinc-950">
                <img src={aboutPreview || storefront.about_image || 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE'} alt="About" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <input type="file" accept="image/*" name="about_file" onChange={handleAboutSelect} className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
                <p className="text-[10px] font-mono text-zinc-500 mt-2 uppercase">Square (800x800) recommended.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isUploadingCore} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-bold px-6 py-3 rounded-md transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50">
              <UploadCloud className="w-4 h-4" /> {isUploadingCore ? 'UPLOADING...' : 'SAVE CORE MEDIA'}
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}