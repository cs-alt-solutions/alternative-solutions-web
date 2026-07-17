'use client';

import React, { useState } from 'react';
import { UploadCloud, X, CheckCircle, Trash2 } from 'lucide-react';
import { updateStorefrontGallery, removeImageFromGallery } from '@/app/actions/storefronts';
import { WEBSITE_COPY } from '@/utils/glossary';

export default function GalleryTab({ formData, setFormData }: { formData: any, setFormData: any }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  // --- ALIGNED TO EXISTING 'STOREFRONT' TYPE ---
  const copy = WEBSITE_COPY.DASHBOARD.STOREFRONT;

  const liveGallery = (formData.gallery_items || []).map((item: any, i: number) => {
    if (typeof item === 'string') {
      return { id: `gal-${i}`, imageUrl: item, title: '', category: '' };
    }
    return item;
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles([...files, ...droppedFiles]);
  };

  async function handleUpload() {
    setIsUploading(true);
    const uploadData = new FormData();
    files.forEach(file => uploadData.append('images', file));
    
    try {
      await updateStorefrontGallery(formData.id, formData.slug, uploadData);
      setFiles([]); 
      window.location.reload(); 
    } catch (e) {
      alert((copy as Record<string, string>).ALERTS_SYNC_FAILED);
    } finally {
      setIsUploading(false);
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
    if (!window.confirm((copy as Record<string, string>).ALERTS_DELETE_IMAGE)) return;

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
      alert((copy as Record<string, string>).ALERTS_DELETE_FAILED);
      console.error(e);
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl pb-10 pt-6">
      {liveGallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-500" /> {(copy as Record<string, string>).GALLERY_TITLE}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">{(copy as Record<string, string>).GALLERY_SUBTITLE}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveGallery.map((item: any, i: number) => (
              <div key={item.id || i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col gap-3 shadow-lg">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || `Gallery ${i}`} 
                    className={`w-full h-full object-cover transition-all ${isDeleting === item.imageUrl ? 'opacity-30 blur-sm' : ''}`} 
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => handleDeleteLiveImage(item.imageUrl)}
                      disabled={isDeleting === item.imageUrl}
                      className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {isDeleting === item.imageUrl ? "Removing..." : "Delete"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <input 
                    type="text"
                    placeholder="Title"
                    value={item.title || ''}
                    onChange={(e) => handleMetaChange(i, 'title', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white focus:border-cyan-500 outline-none transition-colors"
                  />
                  <input 
                    type="text"
                    placeholder="Category"
                    value={item.category || ''}
                    onChange={(e) => handleMetaChange(i, 'category', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white focus:border-cyan-500 outline-none transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4 pt-4 border-t border-zinc-800/50">
        <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
          <UploadCloud className="w-4 h-4 text-zinc-500"/> Upload New Media
        </label>
        <div 
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-zinc-800 p-12 rounded-2xl text-center hover:border-cyan-500 transition-colors bg-zinc-900/20"
        >
          <UploadCloud className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
          <p className="text-white font-bold">Drag & Drop Images Here</p>
          <p className="text-zinc-500 text-xs mt-2">Max resolution 2000px width</p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-zinc-800/50">
          <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Ready to Sync ({files.length})</h4>
          <div className="grid grid-cols-4 gap-4">
            {files.map((file, i) => (
              <div key={i} className="relative aspect-square bg-zinc-900 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-mono truncate px-2">{file.name}</span>
                <button onClick={() => handleRemoveStaged(i)} className="absolute top-1 right-1 bg-black/50 rounded-full p-1 hover:bg-red-500/50 transition-colors">
                  <X className="w-3 h-3 text-white"/>
                </button>
              </div>
            ))}
          </div>

          <button 
            onClick={handleUpload} 
            disabled={isUploading} 
            className="w-full bg-cyan-600 hover:bg-cyan-500 transition-colors py-4 font-black tracking-widest text-zinc-950 rounded-lg shadow-[0_0_15px_rgba(8,145,178,0.4)] disabled:opacity-50 mt-4"
          >
            {isUploading ? 'SYNCING TO CLOUD...' : `SYNC ${files.length} ITEMS TO MASONRY GRID`}
          </button>
        </div>
      )}
    </div>
  );
}