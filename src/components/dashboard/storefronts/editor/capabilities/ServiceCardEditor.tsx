/* src/components/dashboard/storefronts/editor/capabilities/ServiceCardEditor.tsx */
'use client';

import React, { useState, startTransition } from 'react';
import { ChevronUp, ChevronDown, Trash2, Eye, EyeOff, Unlink, FolderOpen, ImagePlus, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { removeImageFromGallery } from '@/app/actions/storefronts';
import { supabase } from '@/utils/supabase';

export default function ServiceCardEditor({ img, index, categoryImagesCount, localCaps, formData, setFormData, onReload }: any) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const [showVaultPicker, setShowVaultPicker] = useState(false);
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoadingVault, setIsLoadingVault] = useState(false);
  
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

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${formData.id}/gallery-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('client-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('client-assets').getPublicUrl(filePath);
      
      handleMetaChange('imageUrl', data.publicUrl);
    } catch (error) {
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const openVaultPicker = async () => {
    setShowVaultPicker(true);
    setIsLoadingVault(true);
    try {
      const { data, error } = await supabase.storage.from('client-assets').list(formData.id, { sortBy: { column: 'created_at', order: 'desc' } });
      if (data && !error) {
        const assignedUrls = (formData.gallery_items || []).map((item: any) => item.imageUrl);
        const rawFiles = data.filter(f => {
          if (f.name === '.emptyFolderPlaceholder' || f.name.includes('live-')) return false;
          if (!f.metadata?.mimetype?.includes('image')) return false;
          const { data: pubData } = supabase.storage.from('client-assets').getPublicUrl(`${formData.id}/${f.name}`);
          return !assignedUrls.includes(pubData.publicUrl);
        });
        setVaultFiles(rawFiles);
      }
    } catch (err) {
      console.error("Vault fetch failed");
    } finally {
      setIsLoadingVault(false);
    }
  };

  const selectVaultImage = (fileName: string) => {
    const { data } = supabase.storage.from('client-assets').getPublicUrl(`${formData.id}/${fileName}`);
    handleMetaChange('imageUrl', data.publicUrl);
    setShowVaultPicker(false);
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
      return { ...prev, gallery_items: items };
    });
  };

  const deleteItem = async () => {
    if (!window.confirm("Remove this service item entirely?")) return;
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
          
          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-zinc-700 bg-zinc-950 flex flex-col items-center justify-center group shadow-inner">
            <label className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center hover:border-cyan-500 transition-colors z-0">
              <input type="file" accept="image/*" className="hidden" onChange={handleDirectUpload} disabled={isUploading || isDeleting} />
              
              {isUploading ? (
                <Loader2 size={16} className="text-cyan-500 animate-spin" />
              ) : hasImage ? (
                <>
                  <img src={img.imageUrl} alt="preview" className={`w-full h-full object-cover transition-opacity ${isDeleting ? 'opacity-30' : 'group-hover:opacity-40'}`} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ImagePlus size={16} className="text-white drop-shadow-md" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-zinc-600 group-hover:text-cyan-400 transition-colors">
                  <ImagePlus size={16} className="mb-1" />
                  <span className="text-[7px] font-black uppercase tracking-widest text-center leading-tight">Add<br/>Media</span>
                </div>
              )}
            </label>

            {!hasImage && !isUploading && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openVaultPicker(); }}
                className="absolute bottom-1 right-1 p-1 bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-cyan-400 hover:border-cyan-500 rounded shadow-md z-10 transition-colors cursor-pointer"
                title="Browse Drop Vault"
              >
                <FolderOpen size={10} />
              </button>
            )}
          </div>

          <div className="flex-1 space-y-2 min-w-0">
            <input placeholder="Service Title or Name" value={img.title || ''} onChange={(e) => handleMetaChange('title', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-1.5 text-xs text-white font-bold focus:border-cyan-500 outline-none" />
            <textarea placeholder="Description of this service..." value={img.description || ''} onChange={(e) => handleMetaChange('description', e.target.value)} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-[11px] text-zinc-400 focus:border-cyan-500 outline-none resize-none" />
          </div>
        </div>
        
        <div className="flex flex-wrap justify-between items-center gap-3 pt-3 mt-2 border-t border-zinc-800/50">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold shrink-0">Move:</span>
            <select
              value={img.category || ''}
              onChange={(e) => handleMetaChange('category', e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-md text-[9px] uppercase tracking-widest font-bold text-cyan-400 py-1.5 px-2 focus:outline-none focus:border-cyan-500 cursor-pointer w-full truncate"
            >
              {localCaps.map((c: any, idx: number) => (
                <option key={idx} value={c.title}>{c.title || 'Untitled'}</option>
              ))}
              <option value="">-- Remove --</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto hide-scrollbar">
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

      {showVaultPicker && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400 border border-cyan-500/20">
                  <FolderOpen size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">Select from Vault</h3>
                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">Showing unassigned Drop Vault media</p>
                </div>
              </div>
              <button onClick={() => setShowVaultPicker(false)} className="text-zinc-500 hover:text-white p-2 bg-black rounded-lg border border-zinc-800 transition-colors">
                <X size={16} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              {isLoadingVault ? (
                <div className="flex flex-col items-center justify-center py-20 text-cyan-500">
                  <Loader2 size={32} className="animate-spin mb-4 opacity-50" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Scanning Vault...</span>
                </div>
              ) : vaultFiles.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-black/20">
                  <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">No unassigned images found in the vault.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                  {vaultFiles.map(file => {
                    const { data: pubUrlData } = supabase.storage.from('client-assets').getPublicUrl(`${formData.id}/${file.name}`);
                    return (
                      <div 
                        key={file.name} 
                        onClick={() => selectVaultImage(file.name)}
                        className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-cyan-500 group relative shadow-md"
                      >
                        <img src={pubUrlData.publicUrl} alt="Vault file" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                          <span className="bg-black/80 text-cyan-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-cyan-500/50 shadow-lg">
                            Select
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}