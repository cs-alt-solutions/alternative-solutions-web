/* eslint-disable @next/next/no-img-element */
/* src/components/dashboard/storefronts/editor/capabilities/menu-card/VaultPickerModal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { FolderOpen, X, Loader2 } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface VaultPickerModalProps {
  isOpen: boolean;
  storefrontId: string;
  assignedUrls: string[];
  copy: any;
  onSelect: (publicUrl: string) => void;
  onClose: () => void;
}

export default function VaultPickerModal({
  isOpen,
  storefrontId,
  assignedUrls,
  copy,
  onSelect,
  onClose,
}: VaultPickerModalProps) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen || !storefrontId) return;

    let cancelled = false;
    const loadVault = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.storage
          .from('client-assets')
          .list(storefrontId, { sortBy: { column: 'created_at', order: 'desc' } });

        if (!cancelled && data && !error) {
          const unassigned = data.filter((f) => {
            if (f.name === '.emptyFolderPlaceholder' || f.name.includes('live-')) return false;
            if (!f.metadata?.mimetype?.includes('image')) return false;
            const { data: pubData } = supabase.storage
              .from('client-assets')
              .getPublicUrl(`${storefrontId}/${f.name}`);
            return !assignedUrls.includes(pubData.publicUrl);
          });
          setVaultFiles(unassigned);
        }
      } catch {
        console.error('Vault fetch failed');
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadVault();
    return () => {
      cancelled = true;
    };
  }, [isOpen, storefrontId, assignedUrls]);

  if (!isOpen) return null;

  const handleSelectFile = (fileName: string) => {
    const { data } = supabase.storage.from('client-assets').getPublicUrl(`${storefrontId}/${fileName}`);
    onSelect(data.publicUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg text-fuchsia-400 border border-fuchsia-500/20">
              <FolderOpen size={16} />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                {copy.VAULT_MODAL_TITLE}
              </h3>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                {copy.VAULT_MODAL_SUBTITLE}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-2 bg-black rounded-lg border border-zinc-800 transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-fuchsia-500">
              <Loader2 size={32} className="animate-spin mb-4 opacity-50" />
              <span className="text-[10px] font-mono uppercase tracking-widest">
                {copy.VAULT_SCANNING}
              </span>
            </div>
          ) : vaultFiles.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl bg-black/20">
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
                {copy.VAULT_EMPTY}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {vaultFiles.map((file) => {
                const { data: pubUrlData } = supabase.storage
                  .from('client-assets')
                  .getPublicUrl(`${storefrontId}/${file.name}`);
                return (
                  <div
                    key={file.name}
                    onClick={() => handleSelectFile(file.name)}
                    className="aspect-square bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden cursor-pointer hover:border-fuchsia-500 group relative shadow-md"
                  >
                    <img
                      src={pubUrlData.publicUrl}
                      alt="Vault file"
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="bg-black/80 text-fuchsia-400 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-fuchsia-500/50 shadow-lg">
                        {copy.VAULT_SELECT_BADGE}
                      </span>
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