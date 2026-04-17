// sandbox/apps/admin/inventory-editor/components/EditorCommerce.tsx
import React from 'react';
import { DollarSign, Plus, X, Boxes, Minus, TicketPercent, Award, ChefHat, Zap, RotateCcw, Tag } from 'lucide-react';

export default function EditorCommerce({
  updatedItem, setUpdatedItem, 
  handleAddSize, handleRemoveSize, handleSizeChange,
  handleOptionChange, handleAddOption, handleRemoveOption, 
  handleStrainChange, handleAddStrain, handleRemoveStrain,
  showWeightTiers, showVariants, isHardwareOrGear
}: any) {
  return (
    <>
      {/* SECTION 3: WEIGHT TIERS & PRICING (RAW FLOWER ONLY) */}
      {showWeightTiers && (
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
             <span className="flex items-center gap-2"><DollarSign size={16} className="text-amber-400" /> Weight Tiers & Pricing</span>
             <button onClick={handleAddSize} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> Add Tier</button>
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {updatedItem.sizes.map((size: any) => (
               <div key={size.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                 <button onClick={() => handleRemoveSize(size.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                 <div>
                   <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Label</label>
                   <input type="text" value={size.label} onChange={(e) => handleSizeChange(size.id, 'label', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-bold text-zinc-300 outline-none" />
                 </div>
                 <div>
                   <label className="text-[9px] font-bold text-amber-500 uppercase tracking-widest mb-1 block">Base Price</label>
                   <input type="number" value={size.price} onChange={(e) => handleSizeChange(size.id, 'price', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-mono font-bold text-amber-400 outline-none" />
                 </div>
               </div>
             ))}
           </div>
        </section>
      )}

      {/* SECTION 4: VARIANTS & OPTIONS OR GLOBAL STOCK */}
      {showVariants && (
        <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/50">
             <span className="flex items-center gap-2"><Boxes size={16} className="text-indigo-400" /> {isHardwareOrGear ? 'Variants & Options' : 'Variants & Flavors'}</span>
             <button onClick={handleAddOption} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> {isHardwareOrGear ? 'Add Option' : 'Add Variant'}</button>
           </h2>
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
             {updatedItem.options.map((opt: any) => {
               const safeStrains = Array.isArray(opt.strains) ? opt.strains : [{ name: opt.label || '', type: 'N/A' }];

               return (
                 <div key={opt.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                   <button onClick={() => handleRemoveOption(opt.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                   
                   <div className="space-y-3">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">
                        {isHardwareOrGear ? 'Option Name (Color, Size, etc.)' : 'Chambers / Flavors'}
                      </label>
                      {safeStrains.map((strain: any, sIdx: number) => (
                         <div key={sIdx} className="flex flex-col gap-1.5 mb-2 pb-3 border-b border-zinc-800/50 last:mb-0 last:pb-0 last:border-0">
                            
                            {/* TOP ROW: NAME & TYPE */}
                            <div className="flex items-center gap-1.5">
                               <input 
                                  type="text" 
                                  value={strain.name} 
                                  placeholder={isHardwareOrGear ? "Variant Name" : "Flavor Name"}
                                  onChange={(e) => handleStrainChange(opt.id, sIdx, 'name', e.target.value)} 
                                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold text-zinc-300 outline-none focus:border-cyan-500/50 transition-colors" 
                               />
                               {!isHardwareOrGear && (
                                 <select 
                                    value={strain.type || 'N/A'} 
                                    onChange={(e) => handleStrainChange(opt.id, sIdx, 'type', e.target.value)} 
                                    className="w-24 sm:w-28 shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-1 sm:px-2 text-[10px] sm:text-xs font-bold text-emerald-400 outline-none focus:border-cyan-500/50 transition-colors"
                                 >
                                    <option value="N/A">No Type</option>
                                    <option value="Sativa">Sativa</option>
                                    <option value="Indica">Indica</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Sativa Dom Hybrid">Sat. Dom</option>
                                    <option value="Indica Dom Hybrid">Ind. Dom</option>
                                    <option value="CBD">CBD</option>
                                 </select>
                               )}
                               {safeStrains.length > 1 && (
                                   <button onClick={() => handleRemoveStrain(opt.id, sIdx)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800 transition-colors"><Minus size={12}/></button>
                               )}
                            </div>

                            {/* BOTTOM ROW: LINEAGE DNA TREE (HIDDEN FOR HARDWARE) */}
                            {!isHardwareOrGear && (
                              <div className="flex items-center gap-2 pl-2">
                                 <div className="w-3 h-3 border-b-2 border-l-2 border-zinc-700 rounded-bl-md opacity-50 shrink-0 mb-1" />
                                 <input 
                                    type="text"
                                    value={strain.lineage || ''}
                                    onChange={(e) => handleStrainChange(opt.id, sIdx, 'lineage', e.target.value)}
                                    placeholder="Lineage / Cross DNA (e.g. Banana Berries x Animal Cookies)"
                                    className="flex-1 bg-zinc-900/40 border border-zinc-800/80 rounded-lg py-1.5 px-3 text-[10px] text-zinc-400 font-medium outline-none focus:border-indigo-500/50 transition-colors"
                                 />
                              </div>
                            )}
                         </div>
                      ))}
                      {safeStrains.length < 3 && !isHardwareOrGear && (
                         <button onClick={() => handleAddStrain(opt.id)} className="text-[9px] font-black uppercase tracking-widest text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mt-2 pt-1 transition-colors">
                            <Plus size={10} /> Add Chamber/Strain
                         </button>
                      )}
                   </div>

                   <div className="pt-2 border-t border-zinc-800/50 mt-1">
                     <label className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1.5 block">Variant Stock</label>
                     <input type="number" value={opt.stock} onChange={(e) => handleOptionChange(opt.id, 'stock', e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-3 text-xs font-mono font-bold text-indigo-400 outline-none focus:border-indigo-500/50 transition-colors" />
                   </div>
                 </div>
               );
             })}
           </div>
        </section>
      )}
      
      {!showVariants && (
         <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
           <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
             <Boxes size={16} className="text-indigo-400" /> Global Warehouse Stock
           </h2>
           <div>
             <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Total Stock (Units)</label>
             <input type="number" value={updatedItem.onHand} onChange={(e) => setUpdatedItem({ ...updatedItem, onHand: Number(e.target.value) || 0 })} className="w-full bg-zinc-950 border border-indigo-500/30 rounded-xl p-3.5 text-sm font-mono font-bold text-indigo-400 focus:border-indigo-500 outline-none transition-colors" />
           </div>
         </section>
      )}

      {/* SECTION 5: IDENTITY TAGS & LIFECYCLE */}
      <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
         <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
           <TicketPercent size={16} className="text-pink-400" /> Identity Tags & Lifecycle
         </h2>
         
         <div className="mb-8">
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Permanent Classifications</h3>
            <div className="flex flex-wrap gap-4">
               <button onClick={()=>setUpdatedItem({...updatedItem, isTopShelf: !updatedItem.isTopShelf})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isTopShelf ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'}`}><Award size={16}/> Top Shelf</button>
               <button onClick={()=>setUpdatedItem({...updatedItem, isChefsReserve: !updatedItem.isChefsReserve})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isChefsReserve ? 'bg-fuchsia-500 text-zinc-950 border-fuchsia-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-fuchsia-500/50 hover:text-fuchsia-400'}`}><ChefHat size={16}/> Chef's Reserve</button>
            </div>
         </div>

         <div>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              Temporary Lifecycle Tags
              <span className="text-[8px] text-zinc-600 font-normal normal-case hidden sm:block">Turn off when no longer applicable</span>
            </h3>
            <div className="flex flex-wrap gap-4">
               <button onClick={()=>setUpdatedItem({...updatedItem, isNewDrop: !updatedItem.isNewDrop})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isNewDrop ? 'bg-cyan-500 text-zinc-950 border-cyan-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-400'}`}><Zap size={16}/> New Arrival</button>
               <button onClick={()=>setUpdatedItem({...updatedItem, isReturned: !updatedItem.isReturned})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isReturned ? 'bg-lime-500 text-zinc-950 border-lime-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-lime-500/50 hover:text-lime-400'}`}><RotateCcw size={16}/> Returned</button>
               <button onClick={()=>setUpdatedItem({...updatedItem, isClearance: !updatedItem.isClearance})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isClearance ? 'bg-rose-500 text-zinc-950 border-rose-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-rose-500/50 hover:text-rose-400'}`}><Tag size={16}/> Smoky Steal (Clearance)</button>
            </div>
         </div>
      </section>
    </>
  );
}