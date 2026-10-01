/* src/components/dashboard/storefronts/editor/VaultTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { FileUp, Trash2, Image as ImageIcon, FileText, Loader2, ShieldCheck, Clock, X, Upload, Edit2, Check, ImageOff } from 'lucide-react';

export default function VaultTab({ storeId, formData, setFormData, onReload }: { storeId: string, formData: any, setFormData: any, onReload?: () => void }) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const bucketName = 'client-assets';
  
  // 🚀 The Single Source of Truth
  const isMenuMode = formData?.content_layout === 'menu';

  const availableCategories = (formData.capabilities || [])
    .map((c: any) => c.title)
    .filter(Boolean);

  useEffect(() => {
    fetchVaultData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeId]);

  const fetchVaultData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(storeId, { sortBy: { column: 'created_at', order: 'desc' } });

      if (!error && data) {
        const rawFiles = data.filter(f => f.id && f.name !== '.emptyFolderPlaceholder');
        setVaultFiles(rawFiles);
      }
    } catch (error) {
      console.error("Vault fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVaultUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    setUploadStatus(`Uploading ${files.length} file(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${storeId}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;
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
        `${storeId}/${oldName}`,
        `${storeId}/${finalName}`
      );
      if (error) throw error;
      fetchVaultData();
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setRenamingFile(null);
      setNewName('');
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Permanently delete this file from the vault?')) return;
    await supabase.storage.from(bucketName).remove([`${storeId}/${fileName}`]);
    fetchVaultData();
  };

  const handleAssignToService = async (fileName: string, publicUrl: string, actionValue: string) => {
    if (!actionValue) return;
    setIsPushing(fileName);
    setOpenMenuId(null);
    
    const [actionType, payload] = actionValue.split('|');

    try {
      let updatedGallery = [...(formData.gallery_items || [])];

      if (actionType === 'CREATE') {
        let newItem: any = {
          id: `assigned-${Date.now()}`,
          imageUrl: publicUrl,
          title: '',
          description: '',
          category: payload,
          isVisible: true,
        };

        if (isMenuMode) {
          newItem = {
            ...newItem,
            price: '',
            isRaw: false,
            addons: []
          };
        }

        updatedGallery.push(newItem);
      } else if (actionType === 'ATTACH') {
        updatedGallery = updatedGallery.map(item => 
          item.id === payload ? { ...item, imageUrl: publicUrl } : item
        );
      }

      const { error } = await supabase
        .from('storefronts')
        .update({ gallery_items: updatedGallery })
        .eq('id', storeId);

      if (error) throw error;

      setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
      if (onReload) onReload();

    } catch (err) {
      console.error("Assignment failed:", err);
      alert("Failed to route media to the requested card.");
    } finally {
      setIsPushing(null);
    }
  };

  const assignedUrls = (formData.gallery_items || []).map((item: any) => item.imageUrl);
  
  const unassignedFiles = vaultFiles.filter(file => {
    const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${storeId}/${file.name}`);
    return !assignedUrls.includes(publicUrlData.publicUrl) && !file.name.includes('live-');
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-amber-500 animate-in fade-in duration-500">
        <Loader2 size={48} className="animate-spin mb-4 opacity-50" />
        <span className="text-xs font-mono uppercase tracking-widest">Scanning Drop Vault...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-in fade-in duration-500 pb-24">
      
      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between mb-8 pb-6 border-b border-zinc-800/50 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
              <FileUp className="text-amber-500 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Drop Vault</h2>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Unassigned Client Uploads & Staging</p>
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
            const isMenuOpen = openMenuId === file.name;
            const isRenaming = renamingFile === file.name;

            const createdDate = new Date(file.created_at);
            const expirationDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000));
            const daysLeft = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            const isUrgent = daysLeft <= 7;

            return (
              <div key={file.id || file.name || `uf-${fileIdx}`} className="bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col relative h-48 shadow-lg">
                
                <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950/50">
                  
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded border backdrop-blur-md flex items-center gap-1.5 z-10 shadow-lg ${
                    isUrgent ? 'bg-rose-500/80 border-rose-500 text-white animate-pulse' : 'bg-black/60 border-amber-500/30 text-amber-400'
                  }`}>
                    <Clock size={10} />
                    <span className="text-[9px] font-black uppercase tracking-widest">
                      {daysLeft > 0 ? `${daysLeft}D` : 'Purging'}
                    </span>
                  </div>

                  {isWebSafeImage ? (
                    <img 
                      src={publicUrlData.publicUrl} 
                      alt={displayName} 
                      loading="lazy"
                      className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-700 group-hover:text-amber-500 transition-colors">
                      {isImage ? <ImageOff size={32} className="mb-2" /> : <FileText size={32} className="mb-2" />}
                      {isImage && <span className="text-[8px] font-bold uppercase tracking-widest text-center leading-tight">Raw / HEIC<br/>No Preview</span>}
                    </div>
                  )}
                  
                  <div className={`absolute inset-0 bg-black/85 transition-opacity flex flex-col justify-between p-2 backdrop-blur-md z-20 ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    
                    {!isMenuOpen ? (
                      <>
                        <div className="flex justify-end gap-2 p-1">
                          <button 
                            onClick={() => { setRenamingFile(file.name); setNewName(displayName.split('.')[0]); }} 
                            className="bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white p-2 rounded-lg transition-colors border border-zinc-600"
                            title="Rename File"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            onClick={() => handleDelete(file.name)} 
                            className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30"
                            title="Delete Asset"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>

                        <div className="mt-auto p-1">
                          {isImage && availableCategories.length > 0 ? (
                            <button
                              onClick={() => setOpenMenuId(file.name)}
                              disabled={isPushing === file.name}
                              className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-2 py-2 text-[9px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors shadow-lg cursor-pointer"
                            >
                              {isPushing === file.name ? 'ROUTING...' : 'ASSIGN TO SERVICE'}
                            </button>
                          ) : null}
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col h-full bg-zinc-950 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
                          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest pl-1">Route Media</span>
                          <button onClick={() => setOpenMenuId(null)} className="text-zinc-500 hover:text-white bg-black p-1 rounded border border-zinc-800 cursor-pointer">
                            <X size={12} />
                          </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-3">
                          {availableCategories.map((cat: string, catIdx: number) => {
                            
                            // 🚀 THE FIX: Context-Aware Routing Logic
                            if (!isMenuMode) {
                              // CONTRACTOR / CLASSIC FLOW: Simple assignment buttons
                              return (
                                <button
                                  key={`cat-${catIdx}`}
                                  onClick={() => handleAssignToService(file.name, publicUrlData.publicUrl, `CREATE|${cat}`)}
                                  className="w-full text-left px-3 py-2.5 rounded bg-zinc-900 border border-zinc-700 hover:bg-cyan-500 hover:border-cyan-400 hover:text-black text-[10px] font-bold transition-all uppercase tracking-wider text-zinc-300 shadow-sm cursor-pointer"
                                >
                                  {cat}
                                </button>
                              );
                            }

                            // RESTAURANT MENU FLOW: Complex Slot/Card Replacement Logic
                            const existingCards = (formData.gallery_items || []).filter((item: any) => item.category === cat);
                            return (
                              <div key={`cat-${catIdx}`} className="space-y-1">
                                <div className="px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded text-[9px] font-black text-fuchsia-400 uppercase tracking-widest sticky top-0 backdrop-blur-md z-10 shadow-sm">
                                  {cat}
                                </div>
                                <button
                                  onClick={() => handleAssignToService(file.name, publicUrlData.publicUrl, `CREATE|${cat}`)}
                                  className="w-full text-left px-2 py-2 mt-1 rounded bg-zinc-900 border border-zinc-700 hover:bg-fuchsia-500 hover:border-fuchsia-400 hover:text-black text-[9px] font-bold transition-all uppercase tracking-wider text-white cursor-pointer"
                                >
                                  + Create New Card
                                </button>
                                {existingCards.map((card: any, cardIdx: number) => {
                                  const fallbackName = card.imageUrl ? card.imageUrl.split('/').pop()?.split('?')[0] : 'Empty Slot';
                                  const displayTitle = card.title || fallbackName;
                                  return (
                                    <button
                                      key={card.id || `card-${catIdx}-${cardIdx}`}
                                      onClick={() => handleAssignToService(file.name, publicUrlData.publicUrl, `ATTACH|${card.id}`)}
                                      className="w-full text-left px-2 py-1.5 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white text-[9px] font-medium transition-colors flex items-center gap-1.5 truncate cursor-pointer"
                                      title={displayTitle}
                                    >
                                      <span className="text-zinc-600 shrink-0">↳</span> 
                                      <span className="truncate">
                                        Replace: {displayTitle}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/50 h-10 flex items-center shrink-0">
                  {isRenaming ? (
                    <div className="flex items-center gap-1 w-full">
                      <input 
                        autoFocus 
                        type="text" 
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)} 
                        onKeyDown={(e) => e.key === 'Enter' && handleRename(file.name)} 
                        className="w-full bg-zinc-950 border border-amber-500/50 rounded px-2 py-0.5 text-[10px] font-mono text-amber-400 focus:outline-none" 
                      />
                      <button onClick={() => handleRename(file.name)} className="text-emerald-400"><Check size={14} /></button>
                    </div>
                  ) : (
                    <p className="text-[10px] font-mono text-zinc-400 truncate w-full" title={displayName}>
                      {displayName}
                    </p>
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