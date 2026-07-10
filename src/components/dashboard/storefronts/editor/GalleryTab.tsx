// src/components/dashboard/storefronts/editor/GalleryTab.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, X, CheckCircle, Trash2, Save } from 'lucide-react';
import { updateStorefrontGallery, removeImageFromGallery } from '@/app/actions';
import { supabase } from '@/utils/supabase';

export default function GalleryTab({ storefront }: { storefront: any }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  // 🚨 State for managing live objects and metadata
  const [liveGallery, setLiveGallery] = useState<any[]>([]);

  // Parse incoming data safely into objects
  useEffect(() => {
    const raw = storefront.gallery_items || [];
    const formatted = raw.map((item: any, i: number) => {
      if (typeof item === 'string') {
        return { id: `gal-${Date.now()}-${i}`, imageUrl: item, title: '', category: '' };
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

  async function handleUpload() {
    setIsUploading(true);
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    
    try {
      await updateStorefrontGallery(storefront.id, storefront.slug, formData);
      setFiles([]); // Clear the staging area
      router.refresh(); 
    } catch (e) {
      alert("Sync failed.");
    } finally {
      setIsUploading(false);
    }
  }

  function handleRemoveStaged(index: number) {
    setFiles(files.filter((_, i) => i !== index));
  }

  // 🚨 Handle Local Metadata Changes
  const handleMetaChange = (index: number, field: string, value: string) => {
    const updated = [...liveGallery];
    updated[index] = { ...updated[index], [field]: value };
    setLiveGallery(updated);
  };

  // 🚨 Save Metadata Directly to Supabase
  async function handleSaveMetadata() {
    setIsSavingMeta(true);
    try {
      const { error } = await supabase
        .from('storefronts')
        .update({ gallery_items: liveGallery })
        .eq('id', storefront.id);
        
      if (error) throw error;
      router.refresh();
    } catch (e) {
      console.error(e);
      alert("Failed to save gallery metadata.");
    } finally {
      setIsSavingMeta(false);
    }
  }

  // 🚨 Handle Image Deletion
  async function handleDeleteLiveImage(imageUrlToRemove: string) {
    if (!window.confirm("Are you sure you want to remove this image from the live gallery?")) return;

    setIsDeleting(imageUrlToRemove);
    try {
      await removeImageFromGallery(storefront.id, imageUrlToRemove);
      setLiveGallery(prev => prev.filter(img => img.imageUrl !== imageUrlToRemove));
      router.refresh();
    } catch (e) {
      alert("Failed to remove image.");
      console.error(e);
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl pb-10">

      {/* 🚨 DISPLAY LIVE IMAGES & METADATA EDITOR */}
      {liveGallery.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-cyan-500" /> Active Masonry Grid
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Add dish names and categories to enable the hover effect.</p>
            </div>
            
            <button 
              onClick={handleSaveMetadata} 
              disabled={isSavingMeta}
              className="bg-cyan-600 hover:bg-cyan-500 text-zinc-950 text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {isSavingMeta ? 'Saving...' : 'Save Details'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveGallery.map((item: any, i: number) => (
              <div key={item.id || i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex flex-col gap-3 shadow-lg">
                
                {/* Image Container */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={item.imageUrl} 
                    alt={item.title || `Gallery ${i}`} 
                    className={`w-full h-full object-cover transition-all ${isDeleting === item.imageUrl ? 'opacity-30 blur-sm' : ''}`} 
                  />
                  
                  {/* Delete Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <button 
                      onClick={() => handleDeleteLiveImage(item.imageUrl)}
                      disabled={isDeleting === item.imageUrl}
                      className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {isDeleting === item.imageUrl ? 'Removing...' : 'Delete'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Metadata Inputs */}
                <div className="space-y-2">
                  <input 
                    type="text"
                    placeholder="Dish Title (e.g., Pan Seared Foie Gras)"
                    value={item.title || ''}
                    onChange={(e) => handleMetaChange(i, 'title', e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded p-2.5 text-xs text-white focus:border-cyan-500 outline-none transition-colors"
                  />
                  <input 
                    type="text"
                    placeholder="Category (e.g., High Protein)"
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

      {/* DROPZONE */}
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

      {/* STAGED PREVIEW */}
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