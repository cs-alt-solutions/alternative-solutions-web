/* src/components/dashboard/storefronts/editor/vault/FolderView.tsx */
import React from 'react';
import { ChevronLeft, Edit2, Trash2, Loader2, Upload } from 'lucide-react';
import { VAULT_COPY } from '@/config/dashboard/vault';

interface FolderViewProps {
  activeFolder: string;
  setActiveFolder: (f: string | null) => void;
  galleryItems: any[];
  isUploading: boolean;
  handleVaultUpload: (e: React.ChangeEvent<HTMLInputElement>, targetFolder?: string) => void;
  handleRenameFolder: (oldName: string) => void;
  handleDeleteFolder: (folderName: string) => void;
  removeImageFromFolder: (id: string) => void;
  updateFolderItem: (id: string, field: string, value: string) => void;
}

export default function FolderView({
  activeFolder, setActiveFolder, galleryItems, isUploading, handleVaultUpload,
  handleRenameFolder, handleDeleteFolder, removeImageFromFolder, updateFolderItem
}: FolderViewProps) {
  const copy = VAULT_COPY.FOLDER_VIEW;
  const folderImages = galleryItems.filter((i: any) => i.category === activeFolder && i.imageUrl && i.imageUrl.trim() !== '');

  return (
    <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-6 animate-in slide-in-from-right-8 duration-300 pb-24">
      <button onClick={() => setActiveFolder(null)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-black uppercase tracking-widest">
        <ChevronLeft size={16} /> {copy.BTN_BACK}
      </button>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-800 pb-6 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white uppercase tracking-widest">{activeFolder}</h2>
            <button onClick={() => handleRenameFolder(activeFolder)} className="p-1.5 bg-zinc-900 border border-zinc-700 rounded text-zinc-400 hover:text-white transition-colors cursor-pointer" title={copy.BTN_RENAME_FOLDER}>
              <Edit2 size={12} />
            </button>
            <button onClick={() => handleDeleteFolder(activeFolder)} className="p-1.5 bg-rose-500/10 border border-rose-500/30 rounded text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer" title={copy.BTN_DELETE_FOLDER}>
              <Trash2 size={12} />
            </button>
          </div>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">{folderImages.length} {copy.IMAGES_IN_PORTFOLIO}</p>
        </div>
        <label className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-black border border-emerald-500/30 transition-all px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 cursor-pointer">
          {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {copy.BTN_UPLOAD_DIRECT}
          <input type="file" multiple className="hidden" onChange={(e) => handleVaultUpload(e, activeFolder)} disabled={isUploading} />
        </label>
      </div>

      {folderImages.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-black/20 text-center">
           <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{copy.EMPTY_STATE}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folderImages.map((img: any) => (
            <div key={img.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col group">
              <div className="relative aspect-video bg-black overflow-hidden border-b border-zinc-800">
                <img src={img.imageUrl} alt="Portfolio Asset" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button onClick={() => removeImageFromFolder(img.id)} className="bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-rose-500/30 transition-colors cursor-pointer" title={copy.BTN_REMOVE_IMAGE}>
                    {copy.BTN_REMOVE_IMAGE}
                  </button>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <input 
                  type="text" value={img.title || ''} onChange={(e) => updateFolderItem(img.id, 'title', e.target.value)} 
                  placeholder={copy.PLACEHOLDER_TITLE} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <textarea 
                  value={img.description || ''} onChange={(e) => updateFolderItem(img.id, 'description', e.target.value)} 
                  placeholder={copy.PLACEHOLDER_DESC} rows={2} className="w-full bg-zinc-950 border border-zinc-800 rounded-md px-3 py-2 text-xs text-zinc-400 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}