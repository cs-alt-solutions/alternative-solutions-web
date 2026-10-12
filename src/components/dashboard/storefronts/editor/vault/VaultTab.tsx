/* src/components/dashboard/storefronts/editor/vault/VaultTab.tsx */
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2, ShieldCheck } from 'lucide-react';
import ActivePortfolios from './ActivePortfolios';
import DropVault from './DropVault';
import FolderView from './FolderView';
import { VAULT_COPY } from '@/config/dashboard/vault';

export default function VaultTab({ storeId, formData, setFormData, onReload }: { storeId: string, formData: any, setFormData: any, onReload?: () => void }) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const bucketName = 'client-assets';
  const galleryItems = formData.gallery_items || [];
  const isMenuMode = formData?.content_layout === 'menu';

  const serviceCategories = (formData.capabilities || []).map((c: any) => c.title).filter(Boolean);
  const folderCategories = Array.from(new Set(galleryItems.map((item: any) => item.category).filter(Boolean))) as string[];
  const availableCategories = Array.from(new Set([...serviceCategories, ...folderCategories]));

  useEffect(() => { fetchVaultData(); }, [storeId]);

  const fetchVaultData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from(bucketName).list(storeId, { sortBy: { column: 'created_at', order: 'desc' } });
      if (!error && data) setVaultFiles(data.filter(f => f.id && f.name !== '.emptyFolderPlaceholder'));
    } catch (error) { console.error("Vault fetch failed:", error); } 
    finally { setIsLoading(false); }
  };

  const handleVaultUpload = async (event: React.ChangeEvent<HTMLInputElement>, targetFolder?: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadStatus(`Uploading ${files.length} file(s)...`);

    try {
      const newGalleryItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${storeId}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;

        if (targetFolder) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
          newGalleryItems.push({ id: `img-${Date.now()}-${i}`, imageUrl: data.publicUrl, title: '', description: '', category: targetFolder, isVisible: true });
        }
      }

      if (targetFolder && newGalleryItems.length > 0) {
        const updatedGallery = [...galleryItems, ...newGalleryItems];
        await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
        setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
        if (onReload) onReload();
      }
      setUploadStatus(VAULT_COPY.ALERTS.UPLOAD_COMPLETE);
      fetchVaultData();
    } catch (error: any) { setUploadStatus(VAULT_COPY.ALERTS.UPLOAD_ERROR); } 
    finally { setIsUploading(false); setTimeout(() => setUploadStatus(null), 3000); }
  };

  const handleRename = async (oldName: string) => {
    if (!newName.trim() || newName === oldName) { setRenamingFile(null); return; }
    try {
      const ext = oldName.includes('.') ? `.${oldName.split('.').pop()}` : '';
      const prefix = oldName.match(/^[0-9]+[-_]/)?.[0] || '';
      const cleanNewName = newName.includes('.') ? newName : `${newName}${ext}`;
      await supabase.storage.from(bucketName).move(`${storeId}/${oldName}`, `${storeId}/${prefix}${cleanNewName}`);
      fetchVaultData();
    } finally { setRenamingFile(null); setNewName(''); }
  };

  const handleDeleteBucketFile = async (fileName: string) => {
    if (!window.confirm(VAULT_COPY.ALERTS.CONFIRM_DELETE_FILE)) return;
    await supabase.storage.from(bucketName).remove([`${storeId}/${fileName}`]);
    fetchVaultData();
  };

  const handleAssignToService = async (fileName: string, publicUrl: string, actionValue: string) => {
    if (!actionValue) return;
    setIsPushing(fileName);
    setOpenMenuId(null);
    const [actionType, payload] = actionValue.split('|');

    try {
      let updatedGallery = [...galleryItems];
      if (actionType === 'CREATE') {
        let newItem: any = { id: `assigned-${Date.now()}`, imageUrl: publicUrl, title: '', description: '', category: payload, isVisible: true };
        if (isMenuMode) newItem = { ...newItem, price: '', isRaw: false, addons: [] };
        updatedGallery.push(newItem);
      } else if (actionType === 'ATTACH') {
        updatedGallery = updatedGallery.map(item => item.id === payload ? { ...item, imageUrl: publicUrl } : item);
      }

      await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
      setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
      if (onReload) onReload();
    } catch (err) {
      alert(VAULT_COPY.ALERTS.ROUTE_ERROR);
    } finally { setIsPushing(null); }
  };

  const handleCreateFolder = async () => {
    const folderName = window.prompt(VAULT_COPY.ALERTS.PROMPT_NEW_FOLDER);
    if (!folderName || !folderName.trim()) return;
    const updatedGallery = [...galleryItems, { id: `folder-init-${Date.now()}`, imageUrl: '', title: '', description: '', category: folderName.trim(), isVisible: false }];
    await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
    setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
    if (onReload) onReload();
  };

  const handleRenameFolder = async (oldName: string) => {
    const newName = window.prompt(VAULT_COPY.ALERTS.PROMPT_RENAME_FOLDER, oldName);
    if (!newName || !newName.trim() || newName === oldName) return;
    const updatedGallery = galleryItems.map((item: any) => item.category === oldName ? { ...item, category: newName.trim() } : item);
    await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
    setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
    setActiveFolder(newName.trim());
    if (onReload) onReload();
  };

  const handleDeleteFolder = async (folderName: string) => {
    if (!window.confirm(`${VAULT_COPY.ALERTS.CONFIRM_DELETE_FOLDER_PREFIX} "${folderName}" ${VAULT_COPY.ALERTS.CONFIRM_DELETE_FOLDER_SUFFIX}`)) return;
    const updatedGallery = galleryItems.filter((item: any) => item.category !== folderName);
    await supabase.from('storefronts').update({ gallery_items: updatedGallery }).eq('id', storeId);
    setFormData((prev: any) => ({ ...prev, gallery_items: updatedGallery }));
    setActiveFolder(null);
    if (onReload) onReload();
  };

  const updateFolderItem = (id: string, field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, gallery_items: galleryItems.map((item: any) => item.id === id ? { ...item, [field]: value } : item) }));
  };

  const removeImageFromFolder = async (id: string) => {
    const updated = galleryItems.filter((item: any) => item.id !== id);
    await supabase.from('storefronts').update({ gallery_items: updated }).eq('id', storeId);
    setFormData((prev: any) => ({ ...prev, gallery_items: updated }));
    if (onReload) onReload();
  };

  // 🚀 THE FIX: Gather ALL active URLs across the entire storefront
  const assignedUrls = [
    ...(formData.gallery_items || []).map((item: any) => item.imageUrl),
    ...(formData.capabilities || []).map((cap: any) => cap.coverImage), // Protect package covers
    formData.hero_image,
    formData.about_image,
    formData.brand_logo
  ].filter(Boolean); // Filter out empty/null values

  const unassignedFiles = vaultFiles.filter(file => {
    const { data: pUrl } = supabase.storage.from(bucketName).getPublicUrl(`${storeId}/${file.name}`);
    
    const isAssigned = assignedUrls.includes(pUrl.publicUrl);
    // 🚀 THE FIX: Also explicitly hide files labeled as live assets or covers
    const isProtectedPrefix = file.name.includes('live-') || file.name.includes('cover-');
    
    return !isAssigned && !isProtectedPrefix;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-amber-500 animate-in fade-in duration-500">
        <Loader2 size={48} className="animate-spin mb-4 opacity-50" />
        <span className="text-xs font-mono uppercase tracking-widest">{VAULT_COPY.ALERTS.SCANNING}</span>
      </div>
    );
  }

  return (
    <>
      {activeFolder ? (
        <FolderView 
          activeFolder={activeFolder} setActiveFolder={setActiveFolder} galleryItems={galleryItems} isUploading={isUploading}
          handleVaultUpload={handleVaultUpload} handleRenameFolder={handleRenameFolder} handleDeleteFolder={handleDeleteFolder}
          removeImageFromFolder={removeImageFromFolder} updateFolderItem={updateFolderItem}
        />
      ) : (
        <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-12 animate-in fade-in duration-500 pb-24">
          <ActivePortfolios 
            folderCategories={folderCategories} galleryItems={galleryItems} 
            setActiveFolder={setActiveFolder} handleCreateFolder={handleCreateFolder} 
          />
          <DropVault 
            storeId={storeId} bucketName={bucketName} unassignedFiles={unassignedFiles} isUploading={isUploading}
            handleVaultUpload={handleVaultUpload} renamingFile={renamingFile} setRenamingFile={setRenamingFile}
            newName={newName} setNewName={setNewName} handleRename={handleRename} handleDeleteBucketFile={handleDeleteBucketFile}
            openMenuId={openMenuId} setOpenMenuId={setOpenMenuId} isPushing={isPushing} handleAssignToService={handleAssignToService}
            availableCategories={availableCategories} isMenuMode={isMenuMode} formData={formData}
          />
        </div>
      )}
      
      {uploadStatus && (
        <div className="fixed bottom-8 right-8 bg-amber-500 text-amber-950 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-4 z-50">
          <ShieldCheck size={16} />
          <span className="text-xs font-black uppercase tracking-widest">{uploadStatus}</span>
        </div>
      )}
    </>
  );
}