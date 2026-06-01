/* src/components/portal/core/SecureTransfer.tsx */
'use client';
import React, { useState, useEffect } from 'react';
import { Upload, FileImage, ShieldCheck, PackageSearch, Trash2, FileText, Edit2, Folder, FolderPlus, ChevronRight, Check, X } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

export default function SecureTransfer({ clientId }: { clientId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  // Storage State
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>(''); // '' means root of clientId
  
  // CRUD State
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [renamingItem, setRenamingItem] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const bucketName = 'client-assets';
  const basePath = clientId;
  const fullPath = currentPath ? `${basePath}/${currentPath}` : basePath;
  const copy = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL.MODULES;

  useEffect(() => {
    fetchItems();
  }, [currentPath, clientId]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucketName).list(fullPath, {
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) throw error;
      if (data) {
        // Filter out the ghost file used to keep empty folders alive
        setItems(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- CREATE (Upload & Folders) ---
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadStatus(`Processing ${files.length} file(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${fullPath}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;
      }
      setUploadStatus('Transfer Complete.');
      fetchItems();
    } catch (error: any) {
      setUploadStatus('Transmission Error.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return setIsCreatingFolder(false);
    const cleanFolderName = newFolderName.replace(/[^a-zA-Z0-9_-]/g, '-').toLowerCase();
    
    // Supabase needs a file to create a folder path, so we upload a tiny hidden placeholder
    const hiddenFilePath = `${fullPath}/${cleanFolderName}/.emptyFolderPlaceholder`;
    const emptyBlob = new Blob([''], { type: 'text/plain' });
    
    await supabase.storage.from(bucketName).upload(hiddenFilePath, emptyBlob);
    setNewFolderName('');
    setIsCreatingFolder(false);
    fetchItems();
  };

  // --- UPDATE (Rename) ---
  const handleRename = async (oldName: string) => {
    if (!newName.trim() || newName === oldName) {
      setRenamingItem(null);
      return;
    }
    try {
      const ext = oldName.includes('.') ? `.${oldName.split('.').pop()}` : '';
      const timestampMatch = oldName.match(/^[0-9]+[-_]/);
      const prefix = timestampMatch ? timestampMatch[0] : '';
      
      const cleanNewName = newName.includes('.') ? newName : `${newName}${ext}`;
      const finalName = `${prefix}${cleanNewName}`;

      const { error } = await supabase.storage.from(bucketName).move(
        `${fullPath}/${oldName}`,
        `${fullPath}/${finalName}`
      );
      if (error) throw error;
      fetchItems();
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setRenamingItem(null);
      setNewName('');
    }
  };

  // --- DELETE ---
  const handleDelete = async (fileName: string, isFolder: boolean) => {
    if (!window.confirm(`Permanently delete this ${isFolder ? 'folder and its contents' : 'file'}?`)) return;
    
    if (isFolder) {
      // Supabase requires deleting all files inside a folder before deleting the folder. 
      // For now, we delete the placeholder. (Deep delete requires an edge function or recursive client logic).
      await supabase.storage.from(bucketName).remove([`${fullPath}/${fileName}/.emptyFolderPlaceholder`]);
    } else {
      await supabase.storage.from(bucketName).remove([`${fullPath}/${fileName}`]);
    }
    fetchItems();
  };

  // --- UTILS ---
  const navigateUp = () => {
    const parts = currentPath.split('/');
    parts.pop();
    setCurrentPath(parts.join('/'));
  };

  const folders = items.filter(item => !item.id); // Supabase returns folders without an ID
  const files = items.filter(item => item.id);
  
  const filteredFiles = files.filter(file => {
    const isImage = file.metadata?.mimetype?.includes('image');
    if (activeFilter === 'IMAGES') return isImage;
    if (activeFilter === 'DOCS') return !isImage;
    return true;
  });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      {/* HEADER & BREADCRUMBS */}
      <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
        <div>
          <h2 className="font-black tracking-widest uppercase text-xl text-white flex items-center gap-3">
            <PackageSearch className="text-cyan-500" /> {copy.TRANSFERS_TITLE}
          </h2>
          
          <div className="flex items-center gap-2 mt-3 text-xs font-mono text-slate-400">
            <button onClick={() => setCurrentPath('')} className="hover:text-cyan-400 transition-colors">Root</button>
            {currentPath && (
              <>
                <ChevronRight size={14} className="text-slate-600" />
                <span className="text-cyan-500">{currentPath.split('/').pop()}</span>
                <button onClick={navigateUp} className="ml-2 px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700 transition-colors text-[10px]">Back</button>
              </>
            )}
          </div>
        </div>
        
        <button 
          onClick={() => setIsCreatingFolder(true)}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-cyan-500 hover:text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 px-4 py-2 rounded-xl transition-colors border border-cyan-500/20"
        >
          <FolderPlus size={16} /> New Folder
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
        {/* LEFT COLUMN: DROPZONE */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 text-center shadow-xl backdrop-blur-sm relative overflow-hidden group">
            <div className="bg-slate-950 border border-slate-800 p-5 rounded-full inline-flex mb-6 group-hover:border-cyan-500/50 transition-colors">
              <Upload size={32} className="text-cyan-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Upload Files</h3>
            <label className="cursor-pointer bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2 text-xs w-full justify-center mt-4">
              <FileImage size={16} /> Select Files
              <input type="file" className="hidden" onChange={handleFileUpload} multiple />
            </label>
            {uploadStatus && (
              <p className={`mt-4 text-[10px] font-bold uppercase tracking-widest ${isUploading ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
                {uploadStatus}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: FOLDERS & FILES GRID */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* FOLDER CREATION INLINE UI */}
          {isCreatingFolder && (
            <div className="bg-slate-900 border border-cyan-500/50 rounded-xl p-4 flex items-center gap-3 shadow-lg">
              <FolderPlus size={20} className="text-cyan-500" />
              <input 
                autoFocus
                type="text" 
                placeholder="Folder Name (e.g., Summer Campaign)"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateFolder()}
                className="flex-1 bg-transparent border-none focus:outline-none text-sm text-white font-mono placeholder:text-slate-600"
              />
              <button onClick={handleCreateFolder} className="text-emerald-400 hover:text-emerald-300 p-2"><Check size={18} /></button>
              <button onClick={() => setIsCreatingFolder(false)} className="text-rose-400 hover:text-rose-300 p-2"><X size={18} /></button>
            </div>
          )}

          {/* FOLDERS GRID */}
          {folders.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {folders.map(folder => (
                <div key={folder.name} onClick={() => setCurrentPath(currentPath ? `${currentPath}/${folder.name}` : folder.name)} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-cyan-500/50 transition-colors group relative">
                   <Folder className="text-cyan-500/70 group-hover:text-cyan-400 w-6 h-6 shrink-0" />
                   <span className="text-xs font-bold text-slate-300 group-hover:text-white truncate">{folder.name}</span>
                   <button onClick={(e) => { e.stopPropagation(); handleDelete(folder.name, true); }} className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-400 p-1">
                     <Trash2 size={14} />
                   </button>
                </div>
              ))}
            </div>
          )}

          {/* FILE CONTROLS */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Directory Files ({filteredFiles.length})</h3>
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button onClick={() => setActiveFilter('ALL')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeFilter === 'ALL' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}>All</button>
              <button onClick={() => setActiveFilter('IMAGES')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeFilter === 'IMAGES' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-500'}`}>Images</button>
            </div>
          </div>

          {/* FILES GRID */}
          {isLoading ? (
            <div className="text-center p-12 text-cyan-500/50 text-xs font-mono uppercase tracking-widest animate-pulse">Scanning Vault...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredFiles.map((file) => {
                const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${fullPath}/${file.name}`);
                const isImage = file.metadata?.mimetype?.includes('image');
                const displayName = file.name.replace(/^[0-9]+[-_]/, '');
                const isRenaming = renamingItem === file.name;

                return (
                  <div key={file.name} className="bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden group hover:border-cyan-500/30 transition-all flex flex-col relative h-48">
                    <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950/50">
                      {isImage ? (
                        <img src={publicUrlData.publicUrl} alt={displayName} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" />
                      ) : (
                        <FileText size={32} className="text-slate-600" />
                      )}
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                        <button onClick={() => { setRenamingItem(file.name); setNewName(displayName.split('.')[0]); }} className="bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white p-2 rounded-lg transition-colors border border-slate-600">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(file.name, false)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    
                    {/* Filename Footer */}
                    <div className="p-3 border-t border-slate-800 bg-slate-900 h-12 flex items-center">
                      {isRenaming ? (
                        <div className="flex items-center gap-2 w-full">
                          <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(file.name)} className="w-full bg-slate-950 border border-cyan-500/50 rounded-md px-2 py-1 text-[10px] font-mono text-cyan-400 focus:outline-none" />
                          <button onClick={() => handleRename(file.name)} className="text-emerald-400"><Check size={14} /></button>
                        </div>
                      ) : (
                        <p className="text-[10px] font-mono text-slate-400 truncate w-full" title={displayName}>{displayName}</p>
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