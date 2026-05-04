/* src/components/sandbox/apps/asset-hub/AssetHubTerminal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X, FileImage, ShieldCheck, PackageSearch, Trash2, FileText, Edit2, Check, Eye, Filter, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase';

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

export default function AssetHubTerminal({ clientConfig, onExit }: { clientConfig: any, onExit: () => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // NEW ADVANCED FEATURES STATE
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [previewAsset, setPreviewAsset] = useState<any | null>(null);
  const [renamingAsset, setRenamingAsset] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const bucketName = 'client-assets';
  const folderPath = clientConfig.id;

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
      sortBy: { column: 'created_at', order: 'desc' }
    });
    
    if (data) {
      setAssets(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    }
    setIsLoading(false);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`Securing ${files.length} file(s)...`);
    
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Clean name to avoid weird URL issues
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${folderPath}/${Date.now()}-${cleanName}`;
        
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;
      }
      setUploadStatus('Transfer Complete.');
      fetchAssets(); 
    } catch (error: any) {
      console.error("Upload error:", error);
      setUploadStatus('Transmission Error. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm('Are you sure you want to permanently remove this asset?')) return;
    
    const { error } = await supabase.storage.from(bucketName).remove([`${folderPath}/${fileName}`]);
    if (!error) fetchAssets(); 
  };

  const handleRename = async (oldName: string) => {
    if (!newName.trim() || newName === oldName) {
      setRenamingAsset(null);
      return;
    }

    try {
      // Preserve the file extension
      const ext = oldName.split('.').pop();
      const cleanNewName = newName.includes('.') ? newName : `${newName}.${ext}`;
      
      const { error } = await supabase.storage.from(bucketName).move(
        `${folderPath}/${oldName}`,
        `${folderPath}/${cleanNewName}`
      );

      if (error) throw error;
      fetchAssets();
    } catch (err) {
      console.error("Rename failed", err);
      alert("Failed to rename file. Make sure the name is unique.");
    } finally {
      setRenamingAsset(null);
      setNewName('');
    }
  };

  // FILTER ENGINE
  const filteredAssets = assets.filter(file => {
    const isImage = file.metadata?.mimetype?.includes('image');
    if (activeFilter === 'IMAGES') return isImage;
    if (activeFilter === 'DOCS') return !isImage;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col p-6 text-zinc-100 selection:bg-cyan-500/30 overflow-y-auto relative">
      
      {/* FULLSCREEN LIGHTBOX PREVIEWER */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-200">
          <button onClick={() => setPreviewAsset(null)} className="absolute top-8 right-8 text-zinc-400 hover:text-white bg-zinc-900 p-3 rounded-full border border-zinc-800 transition-colors">
            <X size={24} />
          </button>
          
          <img 
            src={supabase.storage.from(bucketName).getPublicUrl(`${folderPath}/${previewAsset.name}`).data.publicUrl} 
            alt={previewAsset.name} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-zinc-800"
          />
          <p className="mt-6 font-mono text-cyan-400 tracking-widest">{previewAsset.name}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
        <div>
           <h1 className="font-black tracking-widest uppercase text-xl text-zinc-100 flex items-center gap-3">
             <PackageSearch className="text-cyan-400" /> Secure Asset Hub
           </h1>
           <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Direct Pipeline to Shift Studio</p>
        </div>
        <button onClick={onExit} className="flex items-center gap-2 text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-inner">
           <X size={14} /> Exit Hub
        </button>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* LEFT COLUMN: THE DROPZONE */}
        <div className="lg:col-span-1">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group top-6">
              <div className="absolute inset-0 bg-linear-to-b from-cyan-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-full inline-flex mb-6 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                  <Upload size={32} className="text-cyan-400" />
              </div>
              <h2 className="text-lg font-black uppercase tracking-widest mb-2">Upload Files</h2>
              <p className="text-zinc-400 text-xs mb-8 max-w-50 mx-auto leading-relaxed">
                  Drop high-res photos, vectors, or documents here.
              </p>
              <label className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-black uppercase tracking-widest py-3 px-6 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all inline-flex items-center gap-2 text-xs w-full justify-center">
                  <FileImage size={16} />
                  Select Files
                  <input type="file" className="hidden" onChange={handleFileUpload} multiple />
              </label>
              {uploadStatus && (
                  <p className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'text-amber-400 animate-pulse' : 'text-emerald-400 flex justify-center items-center gap-1.5'}`}>
                      {!isUploading && <ShieldCheck size={12} />} {uploadStatus}
                  </p>
              )}
          </div>
        </div>

        {/* RIGHT COLUMN: THE INTERACTIVE VAULT */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* VAULT TOOLBAR */}
          <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-4 gap-4">
             <div className="flex items-center gap-3">
               <h2 className="text-sm font-black text-zinc-300 uppercase tracking-widest">Active Vault</h2>
               <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 rounded-md border border-zinc-800">{filteredAssets.length} Files</span>
             </div>

             {/* FILTER CONTROLS */}
             <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800">
                <button onClick={() => setActiveFilter('ALL')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <Filter size={12} /> All
                </button>
                <button onClick={() => setActiveFilter('IMAGES')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'IMAGES' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <ImageIcon size={12} /> Images
                </button>
                <button onClick={() => setActiveFilter('DOCS')} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeFilter === 'DOCS' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'}`}>
                  <FileText size={12} /> Docs
                </button>
             </div>
          </div>

          {/* VAULT GRID */}
          {isLoading ? (
            <div className="text-center p-12 text-cyan-400/50 text-xs font-mono uppercase tracking-widest animate-pulse">Scanning Vault...</div>
          ) : filteredAssets.length === 0 ? (
            <div className="bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-16 text-center border-dashed">
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No matching assets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAssets.map((file) => {
                const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${folderPath}/${file.name}`);
                const fileUrl = publicUrlData.publicUrl;
                const isImage = file.metadata?.mimetype?.includes('image');
                const isRenaming = renamingAsset === file.name;

                return (
                  <div key={file.name} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group hover:border-cyan-500/30 transition-all flex flex-col h-full relative">
                    
                    {/* ASSET PREVIEW */}
                    <div className="aspect-square bg-zinc-950 flex items-center justify-center relative overflow-hidden flex-1">
                      {isImage ? (
                        <img src={fileUrl} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100" />
                      ) : (
                        <FileText size={32} className="text-zinc-600 group-hover:text-cyan-500/50 transition-colors" />
                      )}
                      
                      {/* HOVER CONTROLS */}
                      <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        {isImage && (
                          <button onClick={() => setPreviewAsset(file)} className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-zinc-950 p-2 rounded-lg transition-colors border border-cyan-500/30">
                            <Eye size={16} />
                          </button>
                        )}
                        <button onClick={() => { setRenamingAsset(file.name); setNewName(file.name.split('.')[0]); }} className="bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white p-2 rounded-lg transition-colors border border-zinc-600">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(file.name)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* FILENAME / RENAMING INPUT */}
                    <div className="p-3 bg-zinc-900 border-t border-zinc-800 min-h-12.5 flex items-center">
                      {isRenaming ? (
                        <div className="flex items-center gap-2 w-full">
                          <input 
                            autoFocus
                            type="text" 
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRename(file.name)}
                            className="w-full bg-zinc-950 border border-cyan-500/50 rounded-md px-2 py-1 text-[10px] font-mono text-cyan-400 focus:outline-none"
                          />
                          <button onClick={() => handleRename(file.name)} className="text-emerald-400 hover:text-emerald-300">
                            <Check size={14} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-[10px] font-mono text-zinc-400 truncate w-full" title={file.name}>
                          {file.name}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}