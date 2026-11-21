/* src/components/dashboard/storefronts/editor/vault/VaultTab.tsx */
'use client';

import React, { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { Loader2, ShieldCheck } from 'lucide-react';
import ActivePortfolios from './ActivePortfolios';
import DropVault from './DropVault';
import FolderView from './FolderView';
import { VAULT_COPY } from '@/config/dashboard/vault';
import { useVaultActions } from './useVaultActions';

export default function VaultTab({
  storeId,
  formData,
  setFormData,
  onReload,
}: {
  storeId: string;
  formData: any;
  setFormData: any;
  onReload?: () => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [renamingFile, setRenamingFile] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [activeFolder, setActiveFolder] = useState<string | null>(null);

  const actions = useVaultActions({ storeId, formData, setFormData, onReload });

  const galleryItems = formData.gallery_items || [];
  const capabilities = formData.capabilities || [];
  const isMenuMode = formData?.content_layout === 'menu';

  const serviceCategories: string[] = capabilities
    .filter((c: any) => c && !c.isAlaCarte && c.title?.trim())
    .map((c: any) => c.title.trim());

  const galleryCategories = Array.from(
    new Set(galleryItems.map((item: any) => item.category?.trim()).filter(Boolean))
  ) as string[];

  // Auto-synced: every department, service, or category always gets a Drop Vault folder
  const allFolders = Array.from(new Set([...serviceCategories, ...galleryCategories]));

  const legacyCoversCount = capabilities.filter(
    (c: any) => c && !c.isAlaCarte && c.title?.trim() && c.coverImage?.trim()
  ).length;

  const activeLegacyCover = activeFolder
    ? capabilities.find(
        (c: any) => c?.title?.trim().toLowerCase() === activeFolder.trim().toLowerCase() && c.coverImage?.trim()
      )?.coverImage
    : '';

  const assignedUrls = [
    ...galleryItems.map((item: any) => item.imageUrl),
    ...capabilities.map((cap: any) => cap.coverImage),
    formData.hero_image,
    formData.about_image,
    formData.brand_logo,
  ].filter(Boolean);

  const unassignedFiles = actions.vaultFiles.filter((file) => {
    const { data: pUrl } = supabase.storage
      .from(actions.bucketName)
      .getPublicUrl(`${storeId}/${file.name}`);
    const isAssigned = assignedUrls.includes(pUrl.publicUrl);
    const isProtectedPrefix = file.name.includes('live-') || file.name.includes('cover-');
    return !isAssigned && !isProtectedPrefix;
  });

  if (actions.isLoading) {
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
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          galleryItems={galleryItems}
          availableCategories={allFolders}
          heroOverlay={{
            logoUrl: formData.brand_logo,
            tagline: formData.tagline,
            businessName: formData.business_name,
          }}
          legacyCoverUrl={activeLegacyCover}
          onImportLegacyCover={() => actions.importLegacyCovers(activeFolder)}
          isUploading={actions.isUploading}
          handleVaultUpload={actions.handleVaultUpload}
          handleRenameFolder={async (oldName) => {
            const next = await actions.handleRenameFolder(oldName);
            if (next) setActiveFolder(next);
          }}
          handleDeleteFolder={async (folderName) => {
            const deleted = await actions.handleDeleteFolder(folderName);
            if (deleted) setActiveFolder(null);
          }}
          removeImageFromFolder={actions.removeImageFromFolder}
          updateFolderItem={actions.updateFolderItem}
          patchFolderItem={actions.patchFolderItem}
          setCoverPhoto={actions.setCoverPhoto}
          reorderFolderItem={actions.reorderFolderItem}
        />
      ) : (
        <div className="w-full p-4 sm:p-6 lg:p-8 space-y-12 animate-in fade-in duration-500 pb-24">
          <ActivePortfolios
            folderCategories={allFolders}
            serviceCategories={serviceCategories}
            capabilities={capabilities}
            galleryItems={galleryItems}
            legacyCoversCount={legacyCoversCount}
            onImportAllLegacyCovers={() => actions.importLegacyCovers()}
            setActiveFolder={setActiveFolder}
            handleCreateFolder={actions.handleCreateFolder}
          />
          <DropVault
            storeId={storeId}
            bucketName={actions.bucketName}
            unassignedFiles={unassignedFiles}
            isUploading={actions.isUploading}
            handleVaultUpload={actions.handleVaultUpload}
            renamingFile={renamingFile}
            setRenamingFile={setRenamingFile}
            newName={newName}
            setNewName={setNewName}
            handleRename={async (oldName: string) => {
              await actions.handleRenameFile(oldName, newName);
              setRenamingFile(null);
              setNewName('');
            }}
            handleDeleteBucketFile={actions.handleDeleteBucketFile}
            openMenuId={openMenuId}
            setOpenMenuId={setOpenMenuId}
            isPushing={actions.isPushing}
            handleAssignToService={async (fileName: string, publicUrl: string, val: string) => {
              setOpenMenuId(null);
              await actions.handleAssignToService(fileName, publicUrl, val);
            }}
            availableCategories={allFolders}
            isMenuMode={isMenuMode}
            formData={formData}
          />
        </div>
      )}

      {actions.uploadStatus && (
        <div className="fixed bottom-8 right-8 bg-amber-500 text-amber-950 px-6 py-3 rounded-xl shadow-[0_0_30px_rgba(245,158,11,0.4)] flex items-center gap-3 animate-in slide-in-from-bottom-4 z-50">
          <ShieldCheck size={16} />
          <span className="text-xs font-black uppercase tracking-widest">{actions.uploadStatus}</span>
        </div>
      )}
    </>
  );
}