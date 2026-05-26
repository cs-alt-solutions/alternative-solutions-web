/* src/components/portal/core/SecureTransfer.tsx */
'use client';
import React, { useState, useEffect } from 'react';
import { Upload, FileImage, ShieldCheck, PackageSearch, Trash2, FileText, Filter, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { WEBSITE_COPY } from '@/utils/glossary';

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

export default function SecureTransfer({ clientId }: { clientId: string }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterType>('ALL');

  const bucketName = 'client-assets';
  const folderPath = clientId;
  const copy = WEBSITE_COPY.DASHBOARD.CLIENT_PORTAL.MODULES;

  useEffect(() => {
    fetchAssets();
  }, [clientId]);

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (error) throw error;
      if (data) setAssets(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
    } catch (error) {
      console.error("Asset fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadStatus(`Processing ${files.length} file(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${folderPath}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;
      }
      setUploadStatus('Transfer Complete.');
      fetchAssets();
    } catch (error: any) {
      setUploadStatus('Transmission Error. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this asset?')) return;
    const { error } = await supabase.storage.from(bucketName).remove([`${folderPath}/${fileName}`]);
    if (!error) fetchAssets();
  };

  const filteredAssets = assets.filter(file => {
    const isImage = file.metadata?.mimetype?.includes('image');
    if (activeFilter === 'IMAGES') return isImage;
    if (activeFilter === 'DOCS') return !isImage;
    return true;
  });

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <div>
          <h2 className="font-black tracking-widest uppercase text-xl text-white flex items-center gap-3">
            <PackageSearch className="text-brand-primary" /> {copy.TRANSFERS_TITLE}
          </h2>
          <p className="text-xs text-white/50 uppercase tracking-widest mt-1">{copy.TRANSFERS_DESC}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
        {/* LEFT COLUMN: THE DROPZONE */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 border border-white/5 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
            <div className="bg-black/60 border border-white/10 p-5 rounded-full inline-flex mb-6 group-hover:border-brand-primary/50 transition-colors">
              <Upload size={32} className="text-brand-primary" />
            </div>
            <h3 className="text-lg font-black text-white uppercase tracking-widest mb-2">Upload Files</h3>
            <label className="cursor-pointer bg-brand-primary hover:bg-brand-primary/80 text-black font-black uppercase tracking-widest py-3 px-6 rounded-xl transition-all inline-flex items-center gap-2 text-xs w-full justify-center mt-4">
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

        {/* RIGHT COLUMN: THE VAULT GRID */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-sm font-black text-white/70 uppercase tracking-widest">Active Vault ({filteredAssets.length})</h3>
            <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/5">
              <button onClick={() => setActiveFilter('ALL')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeFilter === 'ALL' ? 'bg-brand-primary/20 text-brand-primary' : 'text-white/40'}`}>All</button>
              <button onClick={() => setActiveFilter('IMAGES')} className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${activeFilter === 'IMAGES' ? 'bg-brand-primary/20 text-brand-primary' : 'text-white/40'}`}>Images</button>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center p-12 text-brand-primary/50 text-xs font-mono uppercase tracking-widest animate-pulse">Scanning Vault...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filteredAssets.map((file) => {
                const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${folderPath}/${file.name}`);
                const isImage = file.metadata?.mimetype?.includes('image');
                const displayName = file.name.replace(/^[0-9]+[-_]/, '');

                return (
                  <div key={file.name} className="bg-black/40 border border-white/5 rounded-xl overflow-hidden group hover:border-brand-primary/30 transition-all flex flex-col relative">
                    <div className="aspect-square flex items-center justify-center relative overflow-hidden bg-black/60">
                      {isImage ? (
                        <img src={publicUrlData.publicUrl} alt={displayName} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform" />
                      ) : (
                        <FileText size={32} className="text-white/30" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button onClick={() => handleDelete(file.name)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="p-3 border-t border-white/5">
                      <p className="text-[10px] font-mono text-white/50 truncate">{displayName}</p>
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