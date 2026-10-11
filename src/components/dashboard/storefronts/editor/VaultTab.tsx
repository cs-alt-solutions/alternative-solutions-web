/* src/components/dashboard/storefronts/editor/VaultTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { 
  FileUp, Trash2, Download, FolderOpen, FileText, Loader2, 
  ShieldCheck, Clock, X, Upload, Edit2, Check, ImageOff, 
  ChevronLeft, Layers 
} from 'lucide-react';

export default function VaultTab({ storeId, formData, setFormData, onReload }: { storeId: string, formData: any, setFormData: any, onReload?: () => void }) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  
  // Controls diving into a specific Project Folder
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const bucketName = 'client-assets';
  const galleryItems = formData.gallery_items || [];
  
  // A Project Folder is uniquely identified by the 'category' tag on the gallery items
  const projectFolders = Array.from(new Set(galleryItems.map((item: any) => item.category).filter(Boolean))) as string[];

  useEffect(() => {
    fetchVaultData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const fetchVaultData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucketName).list(storeId, { sortBy: { column: 'created_at', order: 'desc' } });
      if (!error && data) {
        setVaultFiles(data.filter(f => f.id && f.name !== '.emptyFolderPlaceholder'));
      }
    } catch (error) {
      console.error("Vault fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVaultUpload = async (event: React.ChangeEvent<HTMLInputElement>, targetFolder?: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus(`Uploading ${files.length} file(s)...`);

    try {
      const newGalleryItems = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${storeId}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;

        // If uploaded directly while inside a folder, instantly route it to that project
        if (targetFolder) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
          newGalleryItems.push({
            id: `img-${Date.now()}-${i}`,
            imageUrl: data.publicUrl,
            title: '',
            description: '',
            category: targetFolder,
            isVisible: true
          });
        }
      }

      if (targetFolder && newGalleryItems.length > 0) {
        const updatedGallery = [...galleryItems, ...newGalleryItems];
        const { error } = await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
        if (!error) {
          setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
          if (onReload) onReload();
        }
      }

      setUploadStatus('Upload Complete.');
      fetchVaultData();
    } catch (error: any) {
      setUploadStatus('Transmission Error.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleRename = async (oldName: string) => {
    if (!newName.trim() || newName === oldName) {
      setRenamingFile(null); return;
    }
    try {
      const ext = oldName.includes('.') ? `.${oldName.split('.').pop()}` : '';
      const timestampMatch = oldName.match(/^[0-9]+[-_]/);
      const prefix = timestampMatch ? timestampMatch[0] : '';
      const finalName = `${prefix}${newName.includes('.') ? newName : newName + ext}`;

      await supabase.storage.from(bucketName).move(`${storeId}/${oldName}`, `${storeId}/${finalName}`);
      fetchVaultData();
    } finally {
      setRenamingFile(null); setNewName('');
    }
  };

  const handleDeleteBucketFile = async (fileName: string) => {
    if (!window.confirm('Permanently delete this file from the vault?')) return;
    await supabase.storage.from(bucketName).remove([`${storeId}/${fileName}`]);
    fetchVaultData();
  };

  // 🚀 PURE PROJECT PORTFOLIO ROUTING (Bypasses old Menu/Service logic)
  const handleAssignToProject = async (fileName: string, publicUrl: string, category: string) => {
    if (!category) return;
    setIsPushing(fileName);
    
    try {
      let targetCategory = category;
      if (category === 'CREATE_NEW') {
        const customName = window.prompt("Enter new Project Folder name:");
        if (!customName || !customName.trim()) return;
        targetCategory = customName.trim();
      }

      const newItem = {
        id: `img-${Date.now()}`,
        imageUrl: publicUrl,
        title: '',
        description: '',
        category: targetCategory,
        isVisible: true
      };

      const updatedGallery = [...galleryItems, newItem];
      
      const { error } = await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
      if (error) throw error;

      setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
      if (onReload) onReload();
    } catch (err) {
      alert("Failed to route media.");
    } finally {
      setIsPushing(null);
    }
  };

  // MANAGE INNER FOLDER ITEM
  const updateFolderItem = (id: string, field: string, value: string) => {
    const updated = galleryItems.map((item: any) => item.id === id ? { ...item, [field]: value } : item);
    setFormData((prev: any) => ({ ...prev, gallery_items: updated }));
  };

  const removeImageFromFolder = async (id: string) => {
    const updated = galleryItems.filter((item: any) => item.id !== id);
    const { error } = await supabase.from('storefronts').update({ gallery_items: updated }).eq('id', storeId);
    if (!error) {
      setFormData((prev: any) => ({ ...prev, gallery_items: updated }));
      if (onReload) onReload();
    }
  };

  const assignedUrls = galleryItems.map((item: any) => item.imageUrl);
  
  // Filter out files that are already assigned OR are core site assets (live- / cover-)
  const unassignedFiles = vaultFiles.filter(file => {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(`${storeId}/${file.name}`);
    return !assignedUrls.includes(data.publicUrl) && !file.name.includes('live-') && !file.name.includes('cover-');
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-amber-500 animate-in fade-in duration-500">
        <Loader2 size={48} className="animate-spin mb-4 opacity-50" />
        <span className="text-xs font-mono uppercase tracking-widest">Scanning Drop Vault...</span>
      </div>
    );
  }

  // --- SUB-VIEW: INSIDE A SPECIFIC PROJECT FOLDER ---
  if (activeFolder) {
    const folderImages = galleryItems.filter((i: any) => i.category === activeFolder);
    return (
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-in slide-in-from-right-8 duration-300 pb-24">
        <button onClick={() => setActiveFolder(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
          <ChevronLeft size={16} /> Back to Portfolios
        </button>
        
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6 mb-6">
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">{activeFolder}</h2>
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">{folderImages.length} Images in Portfolio</p>
          </div>
          <label className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 transition-all px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer">
            {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} Upload Directly Here
            <input type="file" multiple className="hidden" onChange={(e) => handleVaultUpload(e, activeFolder)} disabled={isUploading} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folderImages.map((img: any) => (
            <div key={img.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col group">
              <div className="relative aspect-video bg-black overflow-hidden border-b border-zinc-800">
                <img src={img.imageUrl} alt="Portfolio Asset" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button onClick={() => removeImageFromFolder(img.id)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/30 transition-colors" title="Remove from folder">
                    Remove from Folder
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <input 
                  type="text" value={img.title || ''} onChange={(e) => updateFolderItem(img.id, 'title', e.target.value)} 
                  placeholder="Image Title / Caption" className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <textarea 
                  value={img.description || ''} onChange={(e) => updateFolderItem(img.id, 'description', e.target.value)} 
                  placeholder="Detailed description..." rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- MAIN VIEW: PORTFOLIOS & DROP VAULT ---
  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-12 animate-in fade-in duration-500 pb-24">
      
      {/* SECTION 1: PROJECT PORTFOLIOS */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
          <Layers className="text-emerald-500 w-5 h-5" />
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">Active Portfolios</h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Manage organized project folders</p>
          </div>
        </div>

        {projectFolders.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-black/20 text-center">
             <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">No project folders created yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {projectFolders.map(folder => {
              const coverImg = galleryItems.find((i: any) => i.category === folder)?.imageUrl;
              const count = galleryItems.filter((i: any) => i.category === folder).length;
              return (
                <div 
                  key={folder} 
                  onClick={() => setActiveFolder(folder)}
                  className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg hover:border-emerald-500/50 transition-all"
                >
                  {coverImg && <img src={coverImg} alt={folder} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500" />}
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{folder}</h3>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{count} Images</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SECTION 2: THE DROP VAULT */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between mb-8 pb-6 border-b border-zinc-800/50 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
              <FileUp className="text-amber-500 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Drop Vault</h2>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Unassigned Raw Media</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Isolated Storage</span>
            </div>
            <p className="text-[9px] font-amber-500/60 font-mono uppercase tracking-widest max-w-xs text-right text-amber-500/70">
              *Unassigned raw files purge automatically after 30 days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <label className="bg-amber-500/5 border border-amber-500/20 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/50 transition-all h-48 group shadow-inner">
            <div className="bg-amber-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
              <Upload className="text-amber-400 w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Upload Files</span>
            <span className="text-[10px] text-amber-500/60 mt-1 font-mono">Drag & Drop</span>
            <input type="file" className="hidden" onChange={handleVaultUpload} multiple disabled={isUploading} />
          </label>

          {unassignedFiles.map((file, fileIdx) => {
            const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${storeId}/${file.name}`);
            const mimeType = file.metadata?.mimetype?.toLowerCase() || '';
            const isImage = mimeType.includes('image');
            const isWebSafeImage = isImage && !mimeType.includes('heic') && !mimeType.includes('heif') && !mimeType.includes('tiff');
            const displayName = file.name.replace(/^[0-9]+[-_]/, '');
            const isRenaming = renamingFile === file.name;

            const createdDate = new Date(file.created_at);
            const expirationDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000));
            const daysLeft = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

            return (
              <div key={file.id || file.name || `uf-${fileIdx}`} className="bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col relative h-48 shadow-lg">
                <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950/50">
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded border backdrop-blur-md flex items-center gap-1.5 z-10 shadow-lg ${
                    daysLeft <= 7 ? 'bg-rose-500/80 border-rose-500 text-white animate-pulse' : 'bg-black/60 border-amber-500/30 text-amber-400'
                  }`}>
                    <Clock size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {daysLeft > 0 ? `${daysLeft}D` : 'Purging'}
                    </span>
                  </div>

                  {isWebSafeImage ? (
                    <img src={publicUrlData.publicUrl} alt={displayName} loading="lazy" className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-700 group-hover:text-amber-500 transition-colors">
                      {isImage ? <ImageOff size={32} className="mb-2" /> : <FileText size={32} className="mb-2" />}
                      {isImage && <span className="text-[8px] font-bold uppercase tracking-widest text-center leading-tight">Raw / HEIC<br/>No Preview</span>}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/85 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 backdrop-blur-md z-20">
                    <div className="flex justify-end gap-2 p-1">
                      <button onClick={() => { setRenamingFile(file.name); setNewName(displayName.split('.')[0]); }} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white p-2 rounded-lg transition-colors border border-zinc-600" title="Rename File">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteBucketFile(file.name)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30" title="Delete Asset">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="mt-auto p-1">
                      {isImage && (
                        <select
                          onChange={(e) => handleAssignToProject(file.name, publicUrlData.publicUrl, e.target.value)}
                          value=""
                          disabled={isPushing === file.name}
                          className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-2 py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors shadow-lg cursor-pointer outline-none text-center appearance-none truncate"
                        >
                          <option value="" disabled>{isPushing === file.name ? 'ROUTING...' : 'ROUTE TO PORTFOLIO'}</option>
                          <option value="CREATE_NEW">+ New Project Folder</option>
                          {projectFolders.map(pf => <option key={pf} value={pf}>↳ {pf}</option>)}
                        </select>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/50 h-10 flex items-center shrink-0">
                  {isRenaming ? (
                    <div className="flex items-center gap-1 w-full">
                      <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(file.name)} className="w-full bg-zinc-950 border border-amber-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-amber-400 focus:outline-none" />
                      <button onClick={() => handleRename(file.name)} className="text-emerald-400"><Check size={14} /></button>
                    </div>
                  ) : (
                    <p className="text-[10px] font-mono text-zinc-400 truncate w-full" title={displayName}>{displayName}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {uploadStatus && (
        <div className="fixed bottom-8 right-8 bg-amber-500 text-amber-950 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-4 z-50">
          <ShieldCheck size={16} />
          <span className="text-xs font-black uppercase tracking-widest">{uploadStatus}</span>
        </div>
      )}
    </div>
  );
}