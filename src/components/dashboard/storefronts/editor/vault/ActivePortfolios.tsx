/* src/components/dashboard/storefronts/editor/vault/ActivePortfolios.tsx */
import React from 'react';
import { Layers, Plus } from 'lucide-react';
import { VAULT_COPY } from '@/config/dashboard/vault';

interface ActivePortfoliosProps {
  folderCategories: string[];
  galleryItems: any[];
  setActiveFolder: (f: string) => void;
  handleCreateFolder: () => void;
}

export default function ActivePortfolios({ folderCategories, galleryItems, setActiveFolder, handleCreateFolder }: ActivePortfoliosProps) {
  const copy = VAULT_COPY.ACTIVE_PORTFOLIOS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Layers className="text-emerald-500 w-5 h-5" />
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-widest">{copy.TITLE}</h2>
            <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">{copy.SUBTITLE}</p>
          </div>
        </div>
        <button 
          onClick={handleCreateFolder}
          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-sm"
        >
          <Plus size={12} /> {copy.BTN_NEW_FOLDER}
        </button>
      </div>

      {folderCategories.length === 0 ? (
        <div className="py-12 border-2 border-dashed border-zinc-800/80 rounded-2xl bg-black/20 text-center">
           <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{copy.EMPTY_STATE}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {folderCategories.map(folder => {
            const coverImg = galleryItems.find((i: any) => i.category === folder && i.imageUrl && i.imageUrl.trim() !== '')?.imageUrl;
            const count = galleryItems.filter((i: any) => i.category === folder && i.imageUrl && i.imageUrl.trim() !== '').length;
            
            return (
              <div 
                key={folder} 
                onClick={() => setActiveFolder(folder)}
                className="aspect-square bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden relative group cursor-pointer shadow-lg hover:border-emerald-500/50 transition-all"
              >
                {coverImg && <img src={coverImg} alt={folder} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-500" />}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-sm font-black text-white uppercase tracking-tight truncate">{folder}</h3>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest">{count} {copy.IMAGES_COUNT}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}