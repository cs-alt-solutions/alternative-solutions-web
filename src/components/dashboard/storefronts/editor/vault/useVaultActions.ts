/* src/components/dashboard/storefronts/editor/vault/useVaultActions.ts */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/utils/supabase';
import { VAULT_COPY } from '@/config/dashboard/vault';

interface UseVaultActionsParams {
  storeId: string;
  formData: any;
  setFormData: any;
  onReload?: () => void;
}

export function useVaultActions({ storeId, formData, setFormData, onReload }: UseVaultActionsParams) {
  const [vaultFiles, setVaultFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushing, setIsPushing] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const bucketName = 'client-assets';
  const galleryItems: any[] = formData.gallery_items || [];
  const capabilities: any[] = formData.capabilities || [];
  const isMenuMode = formData?.content_layout === 'menu';

  const fetchVaultData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .list(storeId, { sortBy: { column: 'created_at', order: 'desc' } });
      if (!error && data) {
        setVaultFiles(data.filter((f) => f.id && f.name !== '.emptyFolderPlaceholder'));
      }
    } catch (error) {
      console.error('Vault fetch failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchVaultData();
  }, [fetchVaultData]);

  const syncStoreFields = async (patch: Record<string, any>) => {
    setFormData((prev: any) => ({ ...prev, ...patch }));
    await supabase.from('storefronts').update(patch).eq('id', storeId);
    if (onReload) onReload();
  };

  const handleVaultUpload = async (event: React.ChangeEvent<HTMLInputElement>, targetFolder?: string) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadStatus(`${VAULT_COPY.ALERTS.UPLOADING_PREFIX} ${files.length} ${VAULT_COPY.ALERTS.UPLOADING_SUFFIX}`);

    try {
      const newItems = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${storeId}/${Date.now()}-${cleanName}`;
        const { error } = await supabase.storage.from(bucketName).upload(filePath, file);
        if (error) throw error;

        if (targetFolder) {
          const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
          newItems.push({
            id: `img-${Date.now()}-${i}`,
            imageUrl: data.publicUrl,
            title: '',
            description: '',
            category: targetFolder,
            isVisible: true,
          });
        }
      }

      if (targetFolder && newItems.length > 0) {
        await syncStoreFields({ gallery_items: [...galleryItems, ...newItems] });
      }

      setUploadStatus(VAULT_COPY.ALERTS.UPLOAD_COMPLETE);
      fetchVaultData();
    } catch {
      setUploadStatus(VAULT_COPY.ALERTS.UPLOAD_ERROR);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadStatus(null), 3000);
    }
  };

  const handleRenameFile = async (oldName: string, nextName: string) => {
    if (!nextName.trim() || nextName === oldName) return;
    const ext = oldName.includes('.') ? `.${oldName.split('.').pop()}` : '';
    const prefix = oldName.match(/^[0-9]+[-_]/)?.[0] || '';
    const cleanNew = nextName.includes('.') ? nextName : `${nextName}${ext}`;
    await supabase.storage.from(bucketName).move(`${storeId}/${oldName}`, `${storeId}/${prefix}${cleanNew}`);
    fetchVaultData();
  };

  const handleDeleteBucketFile = async (fileName: string) => {
    if (!window.confirm(VAULT_COPY.ALERTS.CONFIRM_DELETE_FILE)) return;
    await supabase.storage.from(bucketName).remove([`${storeId}/${fileName}`]);
    fetchVaultData();
  };

  const handleAssignToService = async (fileName: string, publicUrl: string, actionValue: string) => {
    if (!actionValue) return;
    setIsPushing(fileName);
    const [actionType, payload] = actionValue.split('|');

    try {
      let updated = [...galleryItems];
      if (actionType === 'CREATE') {
        const base: any = { id: `assigned-${Date.now()}`, imageUrl: publicUrl, title: '', description: '', category: payload, isVisible: true };
        updated.push(isMenuMode ? { ...base, price: '', isRaw: false, addons: [] } : base);
      } else if (actionType === 'ATTACH') {
        updated = updated.map((item) => (item.id === payload ? { ...item, imageUrl: publicUrl } : item));
      }
      await syncStoreFields({ gallery_items: updated });
    } catch {
      alert(VAULT_COPY.ALERTS.ROUTE_ERROR);
    } finally {
      setIsPushing(null);
    }
  };

  const importLegacyCovers = async (targetCategory?: string) => {
    const importedItems: any[] = [];
    const updatedCaps = capabilities.map((cap, idx) => {
      const title = cap?.title?.trim();
      const legacyUrl = cap?.coverImage?.trim();
      if (!title || !legacyUrl || cap.isAlaCarte) return cap;
      if (targetCategory && title.toLowerCase() !== targetCategory.toLowerCase()) return cap;

      const alreadyInFolder = galleryItems.some(
        (g) => g.imageUrl === legacyUrl && g.category?.trim().toLowerCase() === title.toLowerCase()
      );
      if (!alreadyInFolder) {
        importedItems.push({
          id: `cover-import-${Date.now()}-${idx}`,
          imageUrl: legacyUrl,
          title: '',
          description: '',
          category: title,
          isVisible: true,
        });
      }
      return { ...cap, coverImage: '' };
    });

    await syncStoreFields({
      capabilities: updatedCaps,
      gallery_items: [...importedItems, ...galleryItems],
    });
  };

  const handleCreateFolder = async () => {
    const folderName = window.prompt(VAULT_COPY.ALERTS.PROMPT_NEW_FOLDER);
    if (!folderName?.trim()) return;
    await syncStoreFields({
      gallery_items: [
        ...galleryItems,
        { id: `folder-init-${Date.now()}`, imageUrl: '', title: '', description: '', category: folderName.trim(), isVisible: false },
      ],
    });
  };

  const handleRenameFolder = async (oldName: string) => {
    const next = window.prompt(VAULT_COPY.ALERTS.PROMPT_RENAME_FOLDER, oldName);
    if (!next?.trim() || next === oldName) return null;
    const trimmed = next.trim();
    const updatedGallery = galleryItems.map((i) => (i.category === oldName ? { ...i, category: trimmed } : i));
    const updatedCaps = capabilities.map((c) => (c.title === oldName ? { ...c, title: trimmed } : c));
    const updatedTerms = Array.isArray(formData.operational_terms)
      ? formData.operational_terms.map((t: any) => (t.appliesTo === oldName ? { ...t, appliesTo: trimmed } : t))
      : formData.operational_terms;
    await syncStoreFields({ gallery_items: updatedGallery, capabilities: updatedCaps, operational_terms: updatedTerms });
    return trimmed;
  };

  const handleDeleteFolder = async (folderName: string) => {
    const msg = `${VAULT_COPY.ALERTS.CONFIRM_DELETE_FOLDER_PREFIX} "${folderName}" ${VAULT_COPY.ALERTS.CONFIRM_DELETE_FOLDER_SUFFIX}`;
    if (!window.confirm(msg)) return false;
    await syncStoreFields({ gallery_items: galleryItems.filter((item) => item.category !== folderName) });
    return true;
  };

  const updateFolderItem = (id: string, field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      gallery_items: (prev.gallery_items || []).map((item: any) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const patchFolderItem = async (id: string, patch: Record<string, any>) => {
    await syncStoreFields({
      gallery_items: galleryItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    });
  };

  const setCoverPhoto = async (id: string, folderName: string) => {
    const target = galleryItems.find((item) => item.id === id);
    if (!target) return;
    const withoutTarget = galleryItems.filter((item) => item.id !== id);
    const firstIdx = withoutTarget.findIndex((item) => item.category === folderName && item.imageUrl?.trim());
    const insertAt = firstIdx === -1 ? 0 : firstIdx;
    await syncStoreFields({
      gallery_items: [...withoutTarget.slice(0, insertAt), target, ...withoutTarget.slice(insertAt)],
    });
  };

  const reorderFolderItem = async (id: string, folderName: string, direction: 'left' | 'right') => {
    const folderIndices = galleryItems
      .map((item, idx) => (item.category === folderName && item.imageUrl?.trim() ? idx : -1))
      .filter((idx) => idx !== -1);
    const globalIdx = galleryItems.findIndex((item) => item.id === id);
    const pos = folderIndices.indexOf(globalIdx);
    const swapPos = direction === 'left' ? pos - 1 : pos + 1;
    if (pos === -1 || swapPos < 0 || swapPos >= folderIndices.length) return;

    const updated = [...galleryItems];
    [updated[globalIdx], updated[folderIndices[swapPos]]] = [updated[folderIndices[swapPos]], updated[globalIdx]];
    await syncStoreFields({ gallery_items: updated });
  };

  const removeImageFromFolder = async (id: string) => {
    await syncStoreFields({ gallery_items: galleryItems.filter((item) => item.id !== id) });
  };

  return {
    bucketName,
    vaultFiles,
    isLoading,
    isPushing,
    isUploading,
    uploadStatus,
    handleVaultUpload,
    handleRenameFile,
    handleDeleteBucketFile,
    handleAssignToService,
    importLegacyCovers,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
    updateFolderItem,
    patchFolderItem,
    setCoverPhoto,
    reorderFolderItem,
    removeImageFromFolder,
  };
}