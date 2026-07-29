// src/components/dashboard/storefronts/editor/MediaTab.tsx
'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, LayoutGrid, Trash2, Layers } from 'lucide-react';
import { updateStorefrontMedia, updateStorefrontGallery, removeImageFromGallery } from '@/app/actions/storefronts';

export default function MediaTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isUploadingCore, setIsUploadingCore] = useState(false);
  
  const coreFormRef = useRef<HTMLFormElement>(null);
  const [heroPreview, setHeroPreview] = useState<string | null>(null);
  const [aboutPreview, setAboutPreview] = useState<string | null>(null);

  // Safely parse live gallery from master state
  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') {
      return { id: `gal-${i}`, imageUrl: item, title: '', description: '', category: '' };
    }
    return item;
  });

  const handleHeroSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setHeroPreview(URL.createObjectURL(file));
  };

  const handleAboutSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAboutPreview(URL.createObjectURL(file));
  };

  async function handleSaveCore(uploadData: FormData) {
    setIsUploadingCore(true);
    try {
      await updateStorefrontMedia(formData.id, formData.slug, uploadData);
      if (coreFormRef.current) coreFormRef.current.reset();
      window.location.reload();
    } catch (e) {
      alert("Upload failed. Check storage permissions.");
    } finally {
      setIsUploadingCore(false);
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  async function handleUploadGallery() {
    setIsUploadingGallery(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    try {
      await updateStorefrontGallery(formData.id, formData.slug, uploadData);
      setFiles([]);
      window.location.reload();
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
    setFormData((prev: any) => ({ ...prev, gallery_items: updated }));
  };

  async function handleDeleteLiveImage(imageUrlToRemove: string) {
    if (!window.confirm("Remove this image from live gallery?")) return;
    setIsDeleting(imageUrlToRemove);
    try {
      await removeImageFromGallery(formData.id, imageUrlToRemove);
      setFormData((prev: any) => ({
        ...prev,
        gallery_items: prev.gallery_items.filter((img: any) => 
          (typeof img === 'string' ? img : img.imageUrl) !== imageUrlToRemove
        )
      }));
    } catch (e) {
      alert("Failed to remove image.");
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="space-y-10 pb-12">
      
      {/* 🚀 BLOCK 1: CORE IMAGES (MOVED TO TOP) */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <ImageIcon className="w-4 h-4 text-cyan-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Core Imagery</h2>
        </div>
        
        <form ref={coreFormRef} action={handleSaveCore} className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl space-y-6 shadow-sm">
          
          <div className="space-y-2">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Hero Background Image</label>
            <div className="flex flex-col gap-3">
              <div className="w-full aspect-video rounded-lg overflow-hidden border border-zinc-800 bg-black">
                <img src={heroPreview || formData.hero_image || 'https://via.placeholder.com/1920x1080/000000/333333?text=NO+IMAGE'} alt="Hero" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <input type="file" accept="image/*" name="hero_file" onChange={handleHeroSelect} className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-zinc-800/60">
            <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">About Section Image</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-lg overflow-hidden border border-zinc-800 bg-black shrink-0">
                <img src={aboutPreview || formData.about_image || 'https://via.placeholder.com/800x800/000000/333333?text=NO+IMAGE'} alt="About" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
              </div>
              <input type="file" accept="image/*" name="about_file" onChange={handleAboutSelect} className="w-full text-xs text-zinc-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-zinc-800 file:text-white hover:file:bg-zinc-700 cursor-pointer transition-colors" />
            </div>
          </div>

          <button type="submit" disabled={isUploadingCore} className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-zinc-950 font-black tracking-widest text-[10px] uppercase py-3 rounded-lg transition-all shadow-[0_0_10px_rgba(8,145,178,0.2)] disabled:opacity-50 mt-2">
            <UploadCloud className="w-3.5 h-3.5" /> {isUploadingCore ? 'UPLOADING...' : 'SAVE CORE MEDIA'}
          </button>
        </form>
      </div>

      {/* 🚀 BLOCK 2: GALLERY ECOSYSTEM */}
      <div className="space-y-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
          <LayoutGrid className="w-4 h-4 text-emerald-500" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest">Masonry Gallery</h2>
        </div>
        
        <div onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className="border border-dashed border-zinc-700 p-8 rounded-xl text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-colors bg-zinc-900/40 cursor-pointer">
          <UploadCloud className="w-8 h-8 mx-auto text-zinc-500 mb-2" />
          <p className="text-zinc-300 font-bold text-xs uppercase tracking-widest">Drag & Drop Images</p>
        </div>

        {files.length > 0 && (
          <div className="space-y-3 bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
            <h4 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">Staging Queue ({files.length})</h4>
            <div className="grid grid-cols-3 gap-2">
              {files.map((file, i) => (
                <div key={i} className="relative aspect-square bg-black rounded flex items-center justify-center overflow-hidden border border-zinc-800">
                  <span className="text-[8px] text-zinc-500 font-mono truncate px-1">{file.name}</span>
                  <button onClick={() => handleRemoveStaged(i)} className="absolute top-1 right-1 bg-black/80 rounded p-1 hover:bg-red-500 transition-colors"><X className="w-3 h-3 text-white" /></button>
                </div>
              ))}
            </div>
            <button onClick={handleUploadGallery} disabled={isUploadingGallery} className="w-full bg-emerald-600 hover:bg-emerald-500 transition-colors py-2.5 font-black tracking-widest text-[10px] text-zinc-950 uppercase rounded-lg shadow-[0_0_10px_rgba(16,185,129,0.2)] disabled:opacity-50">
              {isUploadingGallery ? 'SYNCING TO CLOUD...' : 'PUSH TO GALLERY'}
            </button>
          </div>
        )}

        {liveGallery.length > 0 && (
          <div className="space-y-4 pt-4">
            {liveGallery.map((item: any, i: number) => (
              <div key={item.id || i} className="bg-zinc-900/60 border border-zinc-800 p-3 rounded-xl flex flex-col gap-3 shadow-sm">
                
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 group">
                  <img src={item.imageUrl} alt={item.title || `Gallery ${i}`} className={`w-full h-full object-cover transition-all ${isDeleting === item.imageUrl ? 'opacity-30 blur-sm' : ''}`} />
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button onClick={() => handleDeleteLiveImage(item.imageUrl)} disabled={isDeleting === item.imageUrl} className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-950/50 px-3 py-1.5 rounded-lg border border-red-500/20 transition-colors">
                      <Trash2 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{isDeleting === item.imageUrl ? 'TRASHING...' : 'DELETE'}</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <input type="text" placeholder="Title/Name" value={item.title || ''} onChange={(e) => handleMetaChange(i, 'title', e.target.value)} className="w-full bg-black/40 border border-zinc-800 rounded-lg p-2 text-xs text-white focus:border-emerald-500 outline-none transition-colors font-bold" />
                  
                  <div className="relative">
                    <Layers className="w-3 h-3 text-emerald-500 absolute left-2.5 top-2 pointer-events-none" />
                    <select
                      value={item.category || ''}
                      onChange={(e) => handleMetaChange(i, 'category', e.target.value)}
                      className="w-full bg-black/40 border border-zinc-800 rounded-lg pl-7 pr-2 py-2 text-[10px] uppercase tracking-widest font-bold text-zinc-400 focus:border-emerald-500 outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value="">-- Main Portfolio --</option>
                      {(formData.capabilities || []).map((cap: any, idx: number) => {
                        const serviceTitle = typeof cap === 'string' ? cap : cap.title;
                        if (!serviceTitle) return null;
                        return (
                          <option key={idx} value={serviceTitle}>Link: {serviceTitle}</option>
                        );
                      })}
                    </select>
                  </div>
                  
                  <textarea placeholder="Description overlay text..." value={item.description || ''} onChange={(e) => handleMetaChange(i, 'description', e.target.value)} rows={2} className="w-full bg-black/40 border border-zinc-800 rounded-lg p-2 text-[11px] text-zinc-300 focus:border-emerald-500 outline-none transition-colors resize-none" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}