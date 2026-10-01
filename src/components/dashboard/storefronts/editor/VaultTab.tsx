/* src/components/dashboard/storefronts/editor/VaultTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { FileUp, Trash2, Download, Image as ImageIcon, FileText, Loader2, ShieldCheck, Clock, X } from 'lucide-react';

export default function VaultTab({ storeId, formData, setFormData, onReload }: { storeId: string, formData: any, setFormData: any, onReload?: () => void }) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState<string | null>(null);
  
  // 🚀 NEW: State to track which card has the assignment menu open
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const bucketName = 'client-assets';

  // Pull active service categories
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

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Permanently delete this file from the client vault?')) return;
    
    await supabase.storage.from(bucketName).remove([`${storeId}/${fileName}`]);
    fetchVaultData();
  };

  // Dual-Action Routing (Create New vs Attach to Existing)
  const handleAssignToService = async (fileName: string, publicUrl: string, actionValue: string) => {
    if (!actionValue) return;
    setIsPushing(fileName);
    setOpenMenuId(null); // Close menu on select
    
    const [actionType, payload] = actionValue.split('|');

    try {
      let updatedGallery = [...(formData.gallery_items || [])];

      if (actionType === 'CREATE') {
        const newItem = {
          id: `assigned-${Date.now()}`,
          imageUrl: publicUrl,
          title: '',
          description: '',
          category: payload,
          price: '',
          isVisible: true,
          isRaw: false,
          addons: []
        };
        updatedGallery.push(newItem);
      } else if (actionType === 'ATTACH') {
        updatedGallery = updatedGallery.map(item => 
          item.id === payload ? { ...item, imageUrl: publicUrl } : item
        );
      }

      // Save directly to Supabase
      const { error } = await supabase
        .from('storefronts')
        .update({ gallery_items: updatedGallery })
        .eq('id', storeId);

      if (error) throw error;

      // Update local state so it vanishes from the vault instantly
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
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Unassigned Client Uploads</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-lg">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Isolated Storage</span>
            </div>
            <p className="text-[9px] text-amber-500/60 font-mono uppercase tracking-widest max-w-xs text-right">
              *Unassigned raw files will be automatically purged after 30 days to optimize network storage.
            </p>
          </div>
        </div>

        {unassignedFiles.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-zinc-800/80 rounded-2xl bg-black/20">
            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">All media successfully assigned. Vault is clear.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {unassignedFiles.map((file) => {
              const { data: publicUrlData } = supabase.storage.from(bucketName).getPublicUrl(`${storeId}/${file.name}`);
              const isImage = file.metadata?.mimetype?.includes('image');
              const displayName = file.name.replace(/^[0-9]+[-_]/, '');
              const isMenuOpen = openMenuId === file.name;

              const createdDate = new Date(file.created_at);
              const expirationDate = new Date(createdDate.getTime() + (30 * 24 * 60 * 60 * 1000));
              const daysLeft = Math.ceil((expirationDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              const isUrgent = daysLeft <= 7;

              return (
                <div key={file.name} className="bg-black/40 border border-zinc-800 rounded-2xl overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col relative h-48 shadow-lg">
                  
                  <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-zinc-950/50">
                    
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded border backdrop-blur-md flex items-center gap-1.5 z-10 shadow-lg ${
                      isUrgent ? 'bg-rose-500/80 border-rose-500 text-white animate-pulse' : 'bg-black/60 border-amber-500/30 text-amber-400'
                    }`}>
                      <Clock size={10} />
                      <span className="text-[9px] font-black uppercase tracking-widest">
                        {daysLeft > 0 ? `${daysLeft} Days Left` : 'Purging Soon'}
                      </span>
                    </div>

                    {isImage ? (
                      <img 
                        src={publicUrlData.publicUrl} 
                        alt={displayName} 
                        className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform" 
                      />
                    ) : (
                      <FileText size={32} className="text-zinc-700 group-hover:text-amber-500 transition-colors" />
                    )}
                    
                    {/* 🚀 THE FIX: Dynamic Overlay Engine */}
                    <div className={`absolute inset-0 bg-black/85 transition-opacity flex flex-col justify-between p-2 backdrop-blur-md z-20 ${isMenuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                      
                      {!isMenuOpen ? (
                        <>
                          <div className="flex justify-end gap-2 p-1">
                            <a 
                              href={publicUrlData.publicUrl} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="bg-zinc-800 text-zinc-300 hover:bg-cyan-500 hover:text-black p-2 rounded-lg transition-colors border border-zinc-600"
                              title="View / Download"
                            >
                              <Download size={14} />
                            </a>
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
                                className="w-full bg-zinc-950 border border-emerald-500/50 rounded-lg px-2 py-2.5 text-[9px] font-bold uppercase tracking-widest text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors shadow-lg cursor-pointer"
                              >
                                {isPushing === file.name ? 'ROUTING...' : 'ASSIGN TO SERVICE'}
                              </button>
                            ) : isImage && availableCategories.length === 0 ? (
                              <div className="text-[9px] text-center font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg uppercase tracking-widest">
                                Create a service first
                              </div>
                            ) : null}
                          </div>
                        </>
                      ) : (
                        
                        /* 🚀 THE CUSTOM UI MENU */
                        <div className="flex flex-col h-full bg-zinc-950 border border-emerald-500/30 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between p-2 border-b border-zinc-800 bg-zinc-900/50 shrink-0">
                            <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest pl-1">Route Media</span>
                            <button onClick={() => setOpenMenuId(null)} className="text-zinc-500 hover:text-white bg-black p-1 rounded border border-zinc-800 cursor-pointer">
                              <X size={12} />
                            </button>
                          </div>
                          
                          <div className="flex-1 overflow-y-auto custom-scrollbar p-1.5 space-y-3">
                            {availableCategories.map((cat: string) => {
                              const existingCards = (formData.gallery_items || []).filter((item: any) => item.category === cat);
                              
                              return (
                                <div key={cat} className="space-y-1">
                                  {/* Section Header */}
                                  <div className="px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded text-[9px] font-black text-fuchsia-400 uppercase tracking-widest sticky top-0 backdrop-blur-md z-10 shadow-sm">
                                    {cat}
                                  </div>
                                  
                                  {/* Create New Option */}
                                  <button
                                    onClick={() => handleAssignToService(file.name, publicUrlData.publicUrl, `CREATE|${cat}`)}
                                    className="w-full text-left px-2 py-2 mt-1 rounded bg-zinc-900 border border-zinc-700 hover:bg-fuchsia-500 hover:border-fuchsia-400 hover:text-black text-[9px] font-bold transition-all uppercase tracking-wider text-white cursor-pointer"
                                  >
                                    + Create New Card
                                  </button>
                                  
                                  {/* Existing Card Options */}
                                  {existingCards.map((card: any) => (
                                    <button
                                      key={card.id}
                                      onClick={() => handleAssignToService(file.name, publicUrlData.publicUrl, `ATTACH|${card.id}`)}
                                      className="w-full text-left px-2 py-1.5 rounded text-zinc-400 hover:bg-zinc-800 hover:text-white text-[9px] font-medium transition-colors flex items-center gap-1.5 truncate cursor-pointer"
                                      title={card.title || 'Untitled Card'}
                                    >
                                      <span className="text-zinc-600 shrink-0">↳</span> 
                                      <span className="truncate">{card.title || 'Untitled Card'}</span>
                                    </button>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-3 border-t border-zinc-800/50 bg-zinc-900/50 h-10 flex items-center shrink-0">
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