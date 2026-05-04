import React from 'react';
import { UploadCloud, Image as ImageIcon, Fingerprint, DollarSign } from 'lucide-react';

export default function EditorIdentity({
  updatedItem, setUpdatedItem, mainCategories, subCategories,
  handleCategoryChange, handleFileUpload, fileInputRef, iconInputRef,
  dragActive, handleDrag, handleDrop, isUploadingMain, isUploadingIcon, showUnitPrice
}: any) {
  return (
    <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
       <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
         <Fingerprint size={16} className="text-cyan-400" /> Core Identity
       </h2>
       <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">
             <div>
               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Product Graphic</label>
               <div 
                 className={`w-full aspect-square bg-zinc-950 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center p-4 transition-colors cursor-pointer relative overflow-hidden group ${dragActive ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-zinc-800 hover:border-zinc-700'}`}
                 onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                 onClick={() => fileInputRef.current?.click()}
               >
                  {updatedItem.imageUrl && <img src={updatedItem.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-20 transition-opacity" />}
                  <div className="relative z-10 flex flex-col items-center gap-2">
                     {isUploadingMain ? <UploadCloud size={24} className="text-cyan-400 animate-bounce" /> : <ImageIcon size={24} className={updatedItem.imageUrl ? "text-zinc-100" : "text-zinc-600"} />}
                     <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{isUploadingMain ? 'Uploading...' : 'Tap or Drop'}</span>
                  </div>
                  <input type="file" ref={fileInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], 'main');}} className="hidden" accept="image/*" />
               </div>
             </div>

             <div className="pt-4 border-t border-zinc-800/50">
               <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Brand Stamp / Icon</label>
               <div className="flex items-center gap-4">
                 <div 
                   className="w-16 h-16 bg-zinc-950 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400 rounded-full flex flex-col items-center justify-center text-center transition-colors cursor-pointer relative overflow-hidden group shrink-0"
                   onClick={() => iconInputRef.current?.click()}
                 >
                    {updatedItem.iconUrl && <img src={updatedItem.iconUrl} alt="stamp" className="absolute inset-0 w-full h-full object-cover" />}
                    <div className="relative z-10 flex flex-col items-center gap-1">
                       {isUploadingIcon ? <UploadCloud size={16} className="text-emerald-400 animate-bounce" /> : (!updatedItem.iconUrl && <ImageIcon size={16} className="text-zinc-600" />)}
                    </div>
                    <input type="file" ref={iconInputRef} onChange={(e) => {if (e.target.files && e.target.files[0]) handleFileUpload(e.target.files[0], 'icon');}} className="hidden" accept="image/*" />
                 </div>
                 <p className="text-[9px] font-bold text-zinc-500 uppercase leading-tight">Upload a square image to render as a floating badge.</p>
               </div>
             </div>
          </div>

          <div className="flex-1 space-y-5">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Product Name *</label>
                 <input type="text" value={updatedItem.name} onChange={(e) => setUpdatedItem({ ...updatedItem, name: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors" />
               </div>
               <div>
                 <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Brand / Maker</label>
                 <input type="text" value={updatedItem.brand || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, brand: e.target.value })} className="w-full bg-zinc-950 border border-emerald-500/30 rounded-xl p-3.5 text-sm font-bold text-emerald-400 focus:border-emerald-500 outline-none transition-colors" />
               </div>
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
               <div>
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Main Category</label>
                 <select value={updatedItem.mainCategory} onChange={(e) => handleCategoryChange('mainCategory', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors">
                   {mainCategories.map((c:string)=><option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <div>
                 <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Sub Category</label>
                 <select value={updatedItem.subCategory} onChange={(e) => handleCategoryChange('subCategory', e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3.5 text-sm font-bold text-zinc-100 focus:border-cyan-500/50 outline-none transition-colors">
                   {subCategories[updatedItem.mainCategory]?.map((s:string)=><option key={s} value={s}>{s}</option>) || <option value="Uncategorized">Uncategorized</option>}
                 </select>
               </div>
             </div>

             {showUnitPrice && (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-zinc-800/50">
                 <div>
                   <label className="text-[10px] font-bold text-amber-500 uppercase tracking-wider mb-2 block">Standard Unit Price</label>
                   <div className="relative">
                     <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                     <input 
                       type="number" 
                       value={updatedItem.sizes[0]?.price || ''} 
                       onChange={(e) => {
                          const newSizes = [...updatedItem.sizes];
                          if (newSizes.length > 0) newSizes[0].price = Number(e.target.value) || 0;
                          else newSizes.push({ id: `sz-${Date.now()}`, label: 'Standard', price: Number(e.target.value) || 0 });
                          setUpdatedItem({...updatedItem, sizes: newSizes});
                       }}
                       className="w-full bg-zinc-950 border border-amber-500/30 rounded-xl py-3 pl-8 pr-4 text-sm font-mono font-bold text-amber-400 focus:border-amber-500 outline-none" 
                     />
                   </div>
                   <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-2">Flat rate for this product.</p>
                 </div>
               </div>
             )}
          </div>
       </div>
    </section>
  );
}