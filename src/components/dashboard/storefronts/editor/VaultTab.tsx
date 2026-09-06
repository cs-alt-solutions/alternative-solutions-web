/* src/components/dashboard/storefronts/editor/VaultTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { FileUp, Trash2, Download, Image as ImageIcon, FileText, Loader2, ShieldCheck } from 'lucide-react';

export default function VaultTab({ storeId }: { storeId: string }) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bucketName = 'client-assets';

  useEffect(() => {
    fetchVaultData();
  }, [storeId]);

  const fetchVaultData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(storeId, { sortBy: { column: 'created_at', order: 'desc' } });

      if (!error && data) {
        // 🚀 CRITICAL FILTER: Hide the 'live-' assets used on the canvas. 
        // Only show raw vault uploads.
        const rawFiles = data.filter(f => f.id && f.name !== '.emptyFolderPlaceholder' && !f.name.includes('live-'));
        setVaultFiles(rawFiles);
      }
    } catch (error) {
      console.error("Vault fetch failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Permanently delete this file from the client vault?')) return;
    
    await supabase.storage.from(bucketName).remove([`${storeId}/${fileName}`]);
    fetchVaultData();
  };

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
        
        <div className="relative z-10 flex items-start justify-between mb-8 pb-6 border-b border-zinc-800/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shrink-0">
              <FileUp className="text-amber-500 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-widest">Drop Vault</h2>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Raw Client Uploads & Staging Assets</p>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Isolated Storage</span>
          </div>
        </div>

        {vaultFiles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800/80 rounded-2xl bg-black/20">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">The drop vault is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {vaultFiles.map((file) => {
              const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${storeId}/${file.name}`);
              const isImage = file.metadata?.mimetype?.includes('image');
              
              // Clean up the timestamp for the display name
              const displayName = file.name.replace(/^[0-9]+[-_]/, '');

              return (
                <div key={file.name} className="bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col relative h-48 shadow-lg">
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950/50">
                    {isImage ? (
                      <img 
                        src={publicUrlData.publicUrl} 
                        alt={displayName} 
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <FileText size={32} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
                    )}
                    
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-sm">
                      <a 
                        href={publicUrlData.publicUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="bg-zinc-800 text-zinc-300 hover:bg-cyan-500 hover:text-black p-2 rounded-lg transition-colors border border-zinc-600"
                        title="View / Download"
                      >
                        <Download size={16} />
                      </a>
                      <button 
                        onClick={() => handleDelete(file.name)} 
                        className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white p-2 rounded-lg transition-colors border border-rose-500/30"
                        title="Delete Asset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/50 h-10 flex items-center">
                    <p className="text-[10px] font-mono text-zinc-400 truncate w-full" title={displayName}>
                      {displayName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}