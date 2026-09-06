/* src/components/portal/media-vault/MediaVaultModule.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, ShieldCheck, Trash2, FileText, Edit2, Check, CloudUpload, Info } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { PORTAL_COPY } from '@/config/clients/portal';

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

export default function MediaVaultModule({ clientId }: { clientId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const bucketName = 'client-assets';

  const copy = PORTAL_COPY.vault || {
    title: "Media Vault",
    subtitle: "Raw Assets & Documents",
    retentionNotice: "To keep our workspace optimized, raw files in this vault that are not actively attached to your live storefront are automatically purged after 30 days.",
    uploadBtn: "Upload Files",
    dragDrop: "Drag & Drop",
    emptyState: "No raw files in the vault."
  };

  useEffect(() => {
    fetchVaultData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

      // 🚀 RADAR PING: Silently log the upload to the Support Desk as a System Alert
      await supabase.from('support_tickets').insert([{
        storefront_id: clientId,
        category: 'System Alert',
        topic: `Media Vault Drop: ${files.length} New Asset(s)`,
        details: `Client uploaded ${files.length} new raw file(s) into their staging vault.`,
        status: 'OPEN'
      }]);

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
    <div className="max-w-7xl mx-auto p-4 md:p-8 animate-in fade-in duration-500 pb-12 w-full h-full">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8 border-b border-white/5 pb-6">
        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
          <CloudUpload className="text-amber-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-widest">{copy.title}</h1>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">{copy.subtitle}</p>
        </div>
      </div>

      {/* RETENTION NOTICE */}
      <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start md:items-center gap-4">
        <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 md:mt-0" />
        <p className="text-xs text-amber-500/90 leading-relaxed font-medium">
          {copy.retentionNotice}
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 text-amber-500">
          <ShieldCheck size={48} className="animate-pulse mb-4 opacity-50" />
          <span className="text-xs font-mono uppercase tracking-widest">Scanning Secure Vault...</span>
        </div>
      ) : (
        <div className="bg-zinc-950/80 border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Raw Uploads</h3>
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5 w-full sm:w-auto">
              <button onClick={() => setActiveFilter('ALL')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${activeFilter === 'ALL' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-white'}`}>All</button>
              <button onClick={() => setActiveFilter('IMAGES')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${activeFilter === 'IMAGES' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-white'}`}>Images</button>
              <button onClick={() => setActiveFilter('DOCS')} className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors ${activeFilter === 'DOCS' ? 'bg-amber-500/20 text-amber-400' : 'text-zinc-500 hover:text-white'}`}>Docs</button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
            <label className="bg-amber-500/5 border border-amber-500/20 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:bg-amber-500/10 hover:border-amber-500/50 transition-all h-48 group shadow-inner">
              <div className="bg-amber-500/10 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <Upload className="text-amber-400 w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{copy.uploadBtn}</span>
              <span className="text-[10px] text-amber-500/60 mt-1 font-mono">{copy.dragDrop}</span>
              <input type="file" className="hidden" onChange={handleVaultUpload} multiple />
            </label>

            {filteredAssets.map((file) => {
              const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${clientId}/${file.name}`);
              const isImage = file.metadata?.mimetype?.includes('image');
              const displayName = file.name.replace(/^[0-9]+[-_]/, '');
              const isRenaming = renamingFile === file.name;

              return (
                <div key={file.name} className="bg-black/40 border border-white/5 rounded-2xl overflow-hidden group hover:border-amber-500/30 transition-all flex flex-col relative h-48 shadow-lg">
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950/50">
                    {isImage ? (
                      <img src={publicUrlData.publicUrl} alt={displayName} className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" />
                    ) : (
                      <FileText size={32} className="text-zinc-600 group-hover:text-amber-500 transition-colors" />
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
                        <input autoFocus type="text" value={newName} onChange={(e) => setNewName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename(file.name)} className="w-full bg-zinc-950 border border-amber-500/50 rounded-md px-2 py-1 text-[10px] font-mono text-amber-400 focus:outline-none" />
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
          
          {filteredAssets.length === 0 && (
             <div className="text-center mt-6 pt-6 border-t border-white/5">
                <p className="text-xs text-zinc-600 font-mono uppercase tracking-widest">{copy.emptyState}</p>
             </div>
          )}
        </div>
      )}

      {uploadStatus && (
        <div className="fixed bottom-8 right-8 bg-amber-500 text-amber-950 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-4 z-50">
          {isUploading ? <Upload size={16} className="animate-bounce" /> : <ShieldCheck size={16} />}
          <span className="text-xs font-black uppercase tracking-widest">{uploadStatus}</span>
        </div>
      )}
    </div>
  );
}