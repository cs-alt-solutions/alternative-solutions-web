/* src/components/portal/core/SecureTransfer.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Upload, FileImage, ShieldCheck, Trash2, FileText, 
  Edit2, Check, LayoutDashboard, ImagePlus 
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

export default function SecureTransfer({ clientId }: { clientId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  // Data State
  const [storefront, setStorefront] = useState<any>(null);
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI State
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const bucketName = 'client-assets';

  useEffect(() => {
    fetchAllData();
  }, [clientId]);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      const { data: storeData, error: storeError } = await supabase
        .from('storefronts')
        .select('*')
        .eq('id', clientId)
        .single();
        
      if (!storeError && storeData) {
        setStorefront(storeData);
      }

      const { data: filesData, error: filesError } = await supabase.storage
        .from(bucketName)
        .list(clientId, { sortBy: { column: 'created_at', order: 'desc' } });

      if (!filesError && filesData) {
        const justFiles = filesData.filter(f => f.id && f.name !== '.emptyFolderPlaceholder');
        setVaultFiles(justFiles);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapLiveAsset = async (field: string, file: File) => {
    setIsUploading(true);
    setUploadStatus('Updating live site...');
    
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${clientId}/live-${field}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from(bucketName).upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const newUrl = data.publicUrl;

      const { error: dbError } = await supabase.from('storefronts').update({ [field]: newUrl }).eq('id', clientId);
      if (dbError) throw dbError;

      await fetchAllData();
      setUploadStatus('Live Asset Updated!');
    } catch (error) {
      console.error(error);
      setUploadStatus('Update Failed.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleVaultUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus(`Processing ${files.length} file(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${clientId}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;
      }
      setUploadStatus('Vault Transfer Complete.');
      fetchAllData();
    } catch (error: any) {
      setUploadStatus('Transmission Error.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleRename = async (oldName: string) => {
    if (!newName.trim() || newName === oldName) {
      setRenamingFile(null);
      return;
    }
    try {
      const ext = oldName.includes('.') ? `.${oldName.split('.').pop()}` : '';
      const timestampMatch = oldName.match(/^[0-9]+[-_]/);
      const prefix = timestampMatch ? timestampMatch[0] : '';
      const cleanNewName = newName.includes('.') ? newName : `${newName}${ext}`;
      const finalName = `${prefix}${cleanNewName}`;

      const { error } = await supabase.storage.from(bucketName).move(
        `${clientId}/${oldName}`,
        `${clientId}/${finalName}`
      );
      if (error) throw error;
      fetchAllData();
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setRenamingFile(null);
      setNewName('');
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Permanently delete this file from the vault?')) return;
    await supabase.storage.from(bucketName).remove([`${clientId}/${fileName}`]);
    fetchAllData();
  };

  const filteredAssets = vaultFiles.filter(file => {
    const isImage = file.metadata?.mimetype?.includes('image');
    if (activeFilter === 'IMAGES') return isImage;
    if (activeFilter === 'DOCS') return !isImage;
    return true;
  });

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto animate-in fade-in duration-500 pb-12">
      
      {/* HEADER */}
      <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4 mt-2">
        <div>
          <h2 className="font-black tracking-widest uppercase text-xl text-white flex items-center gap-3">
            <LayoutDashboard className="text-cyan-500" /> Asset Hub
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Live Assets & Media Vault</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-cyan-500">
          <ShieldCheck size={48} className="animate-pulse mb-4 opacity-50" />
          <span className="text-xs font-mono uppercase tracking-widest">Scanning Secure Vault...</span>
        </div>
      ) : (
        <>
          {/* --- SECTION 1: LIVE SITE ASSETS --- */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">Currently Live on Site</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Hero Image */}
              <div className="bg-black/40 border border-white/5 rounded-3xl p-5 shadow-lg group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Hero Background</span>
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg hover:bg-fuchsia-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest" title="Swap Asset">
                    <ImagePlus size={14} /> Swap
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSwapLiveAsset('hero_image', e.target.files[0])} />
                  </label>
                </div>
                <div className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative min-h-[160px]">
                  <img src={storefront?.hero_image || 'https://placehold.co/600x400/18181b/a1a1aa?text=No+Hero+Set'} alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Bio Portrait */}
              <div className="bg-black/40 border border-white/5 rounded-3xl p-5 shadow-lg group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Bio Portrait</span>
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-500/10 text-fuchsia-400 rounded-lg hover:bg-fuchsia-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest" title="Swap Asset">
                    <ImagePlus size={14} /> Swap
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSwapLiveAsset('about_image', e.target.files[0])} />
                  </label>
                </div>
                <div className="flex-1 rounded-xl bg-zinc-900 border border-zinc-800 overflow-hidden relative min-h-[160px]">
                  <img src={storefront?.about_image || 'https://placehold.co/600x400/18181b/a1a1aa?text=No+Bio+Set'} alt="About" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Brand Logo (Now a sleek circular badge) */}
              <div className="bg-black/40 border border-white/5 rounded-3xl p-5 shadow-lg group flex flex-col items-center justify-center relative">
                <div className="absolute top-5 left-5 right-5 flex items-center justify-between">
                  <span className="text-xs font-black text-white uppercase tracking-widest">Brand Logo</span>
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest" title="Swap Asset">
                    <ImagePlus size={14} /> Swap
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleSwapLiveAsset('brand_logo', e.target.files[0])} />
                  </label>
                </div>
                
                <div className="mt-12 mb-4 w-32 h-32 rounded-full bg-zinc-950 border-4 border-zinc-800/50 overflow-hidden relative shadow-[0_0_30px_rgba(34,211,238,0.1)] group-hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] group-hover:border-cyan-500/30 transition-all flex items-center justify-center p-2">
                  <img src={storefront?.brand_logo || 'https://placehold.co/400x400/18181b/a1a1aa?text=No+Logo'} alt="Logo" className="w-full h-full object-contain" />
                </div>
              </div>

            </div>

            {/* --- LIVE GALLERY GRID --- */}
            <div className="mt-8 pt-8 border-t border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">Live Gallery Roster</h3>
                <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 rounded-lg hover:bg-cyan-500 hover:text-black transition-colors text-[10px] font-bold uppercase tracking-widest">
                  <ImagePlus size={14} /> Add Gallery Image
                  {/* The input here will be wired up once we define the architecture */}
                  <input type="file" className="hidden" accept="image/*" multiple />
                </label>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {/* Placeholders for the visual layout */}
                {[1, 2].map((i) => (
                  <div key={i} className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden relative group">
                    <img src={`https://placehold.co/400x400/18181b/a1a1aa?text=Img+${i}`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt="Gallery Placeholder" />
                    <button className="absolute top-2 right-2 p-1.5 bg-black/60 text-rose-400 rounded-md hover:bg-rose-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
                
                <label className="aspect-square bg-zinc-950 border border-dashed border-zinc-800 hover:border-cyan-500/50 rounded-xl flex flex-col items-center justify-center cursor-pointer group transition-colors">
                  <ImagePlus className="w-6 h-6 text-zinc-600 group-hover:text-cyan-400 mb-2 transition-colors" />
                  <span className="text-[10px] font-bold text-zinc-600 group-hover:text-cyan-400 uppercase tracking-widest">Add Image</span>
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>
            </div>

          </div>

          {/* --- SECTION 2: THE DROP VAULT --- */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">The Drop Vault</h3>
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
                <button onClick={() => setActiveFilter('ALL')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${activeFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-white'}`}>All</button>
                <button onClick={() => setActiveFilter('IMAGES')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${activeFilter === 'IMAGES' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-white'}`}>Images</button>
                <button onClick={() => setActiveFilter('DOCS')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${activeFilter === 'DOCS' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-white'}`}>Docs</button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
              
              <label className="bg-cyan-500/5 border border-cyan-500/20 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all h-48 group shadow-inner">
                <div className="bg-cyan-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="text-cyan-400 w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Upload Files</span>
                <span className="text-[10px] text-cyan-500/60 mt-1 font-mono">Drag & Drop</span>
                <input type="file" className="hidden" onChange={handleVaultUpload} multiple />
              </label>

              {filteredAssets.map((file) => {
                const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${clientId}/${file.name}`);
                const isImage = file.metadata?.mimetype?.includes('image');
                const displayName = file.name.replace(/^[0-9]+[-_]/, '');
                const isRenaming = renamingFile === file.name;

                return (
                  <div key={file.name} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-cyan-500/30 transition-all flex flex-col relative h-48 shadow-lg">
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950/50">
                      {isImage ? (
                        <img src={publicUrlData.publicUrl} alt={displayName} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" />
                      ) : (
                        <FileText size={32} className="text-zinc-600 group-hover:text-cyan-500 transition-colors" />
                      )}
                      
                      <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button onClick={() => { setRenamingFile(file.name); setNewName(displayName.split('.')[0]); }} className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white p-2 rounded-lg transition-colors border border-zinc-600">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(file.name)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/50 h-12 flex items-center">
                      {isRenaming ? (
                        <div className="flex items-center gap-2 w-full">
                          <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(file.name)} className="w-full bg-zinc-950 border border-cyan-500/50 rounded-md px-2 py-1 text-[10px] font-mono text-cyan-400 focus:outline-none" />
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
        </>
      )}

      {uploadStatus && (
        <div className="fixed bottom-8 right-8 bg-cyan-500 text-black px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-4 z-50">
          {isUploading ? <Upload size={16} className="animate-bounce" /> : <ShieldCheck size={16} />}
          <span className="text-xs font-black uppercase tracking-widest">{uploadStatus}</span>
        </div>
      )}
    </div>
  );
}