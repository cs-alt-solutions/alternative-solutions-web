/* src/components/sandbox/shared/AssetHubTerminal.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X, FileImage, ShieldCheck, PackageSearch, Trash2, FileText, Edit2, Check, Eye, Filter, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation'; 

// 1. Define the interface including the missing onExit prop
interface AssetHubTerminalProps {
  clientConfig: any;
  onExit: () => void;
}

type FilterType = 'ALL' | 'IMAGES' | 'DOCS';

// 2. Use the interface in the component signature
export default function AssetHubTerminal({ clientConfig, onExit }: AssetHubTerminalProps) {
  const router = useRouter(); 
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      const { data, error } = await supabase.storage.from(bucketName).list(folderPath, {
        sortBy: { column: 'created_at', order: 'desc' }
      });

      if (error) throw error; 

      if (data) {
        setAssets(data.filter(f => f.name !== '.emptyFolderPlaceholder'));
      }
    } catch (error) {
      console.error("Asset fetch failed:", error);
      setAssets([]); 
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
      console.error("Upload error:", error);
      setUploadStatus('Transmission Error. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!window.confirm('Are you sure you want to permanently remove this asset?')) return;

    const { error } = await supabase.storage.from(bucketName).remove([`${folderPath}/${fileName}`]);
    if (error) {
      console.error("Delete error:", error);
      alert(`Delete Blocked: ${error.message}\n(Check your Supabase Storage Policies!)`);
    } else {
      fetchAssets();
    }
  };

  const handleRename = async (oldName: string) => {
    if (!newName.trim()) {
      setRenamingAsset(null);
      return;
    }

    try {
      const ext = oldName.split('.').pop();
      const timestampMatch = oldName.match(/^[0-9]+[-_]/);
      const prefix = timestampMatch ? timestampMatch[0] : '';
      
      const cleanNewName = newName.includes('.') ? newName : `${newName}.${ext}`;
      const finalName = `${prefix}${cleanNewName}`;

      if (finalName === oldName) {
        setRenamingAsset(null);
        return;
      }

      const { error } = await supabase.storage.from(bucketName).move(
        `${folderPath}/${oldName}`,
        `${folderPath}/${finalName}`
      );

      if (error) {
        console.error("Rename error:", error);
        alert(`Rename Blocked: ${error.message}\n(Check your Supabase Storage Policies!)`);
        throw error;
      }
      fetchAssets();
    } catch (err) {
      console.error("Rename failed", err);
    } finally {
      setRenamingAsset(null);
      setNewName('');
    }
  };

  const filteredAssets = assets.filter(file => {
    const isImage = file.metadata?.mimetype?.includes('image');
    if (activeFilter === 'IMAGES') return isImage;
    if (activeFilter === 'DOCS') return !isImage;
    return true;
  });

  return (
    <div className="bg-zinc-950 flex flex-col p-6 text-zinc-100 selection:bg-cyan-500/30 relative">
      
      {/* FULLSCREEN LIGHTBOX PREVIEWER */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-200">
          <button onClick={() => setPreviewAsset(null)} className="absolute top-8 right-8 text-zinc-400 hover:text-white bg-zinc-900 p-3 rounded-full border border-zinc-800 transition-colors">
            <X size={24} />
          </button>
          
          <img 
            src={supabase.storage.from(bucketName).getPublicUrl(`${folderPath}/${previewAsset.name}`).data.publicUrl} 
            alt={previewAsset.name.replace(/^[0-9]+[-_]/, '')} 
            className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-zinc-800" 
          />
          <p className="mt-6 font-mono text-cyan-400 tracking-widest">{previewAsset.name.replace(/^[0-9]+[-_]/, '')}</p>
        </div>
      )}

      {/* HEADER */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-8 border-b border-zinc-800 pb-4 mt-4">
        <div>
          <h1 className="font-black tracking-widest uppercase text-xl text-zinc-100 flex items-center gap-3">
            <PackageSearch className="text-cyan-400" /> Asset Hub
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">Direct Pipeline to Our Development</p>
        </div>
        {/* Call onExit here */}
        <button onClick={onExit} className="flex items-center gap-2 text-zinc-500 hover:text-rose-400 transition-colors bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-inner">
          <X size={14} /> Exit Hub
        </button>
      </div>

      {/* ... rest of your JSX remains exactly the same ... */}
    </div>
  );
}