/* src/components/portal/settings/secure-transfer/SecureTransfer.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, ShieldCheck, Trash2, FileText, Edit2, Check, LayoutDashboard } from 'lucide-react';
import { supabase } from '@/utils/supabase';

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

export default function SecureTransfer({ clientId }: { clientId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');

  const bucketName = 'client-assets';

  useEffect(() => {
    fetchVaultData();
  }, [clientId]);

  const fetchVaultData = async () => {
    setIsLoading(true);
    try {
      const { data: filesData, error: filesError } = await supabase.storage
        .from(bucketName)
        .list(clientId, { sortBy: { column: 'created_at', order: 'desc' } });

      if (!filesError && filesData) {
        const justFiles = filesData.filter(f => f.id && f.name !== '.emptyFolderPlaceholder' && !f.name.includes('live-'));
        setVaultFiles(justFiles);
      }
    } catch (error) {
      console.error("Fetch failed:", error);
    } finally {
      setIsLoading(false);
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
        `${clientId}/${oldName}`,
        `${clientId}/${finalName}`
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
    await supabase.storage.from(bucketName).remove([`${clientId}/${fileName}`]);
    fetchVaultData();
  };

  const filteredAssets = vaultFiles.filter(file => {
    const isImage = file.metadata?.mimetype?.includes('image');
    if (activeFilter === 'IMAGES') return isImage;
    if (activeFilter === 'DOCS') return !isImage;
    return true;
  });

  return (
    // 🚀 FIXED: Changed from max-w-6xl mx-auto to w-full so it nests seamlessly
    <div className="flex flex-col h-full w-full animate-in fade-in duration-500 pb-12">
      <div className="flex justify-between items-end mb-8 border-b border-zinc-800 pb-4 mt-2">
        <div>
          <h2 className="font-black tracking-widest uppercase text-xl text-white flex items-center gap-3">
            <LayoutDashboard className="text-cyan-500" /> Document Vault
          </h2>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Secure Workspace Files & Media</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-cyan-500">
          <ShieldCheck size={48} className="animate-pulse mb-4 opacity-50" />
          <span className="text-xs font-mono uppercase tracking-widest">Scanning Secure Vault...</span>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest">General Uploads</h3>
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