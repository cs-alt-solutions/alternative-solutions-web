import React from 'react';
import { DollarSign, Plus, X, Boxes, Minus, TicketPercent, Award, Star } from 'lucide-react';

export default function EditorCommerce({
  updatedItem, setUpdatedItem, 
  handleAddSize, handleRemoveSize, handleSizeChange,
  handleOptionChange, handleAddOption, handleRemoveOption, 
  handleStrainChange, handleAddStrain, handleRemoveStrain,
  showWeightTiers, showVariants, openCampaignConfig
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
             <span className="flex items-center gap-2"><Boxes size={16} className="text-indigo-400" /> Variants & Flavors</span>
             <button onClick={handleAddOption} className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-[9px] uppercase tracking-widest flex items-center gap-1 transition-colors"><Plus size={12}/> Add Variant</button>
           </h2>
           <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
             {updatedItem.options.map((opt: any) => {
               // SAFEGUARD: Prevents initial render crash before the Smart Parser populates the array
               const safeStrains = Array.isArray(opt.strains) ? opt.strains : [{ name: opt.label || '', type: 'N/A' }];

               return (
                 <div key={opt.id} className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3 relative group">
                   <button onClick={() => handleRemoveOption(opt.id)} className="absolute top-2 right-2 p-1.5 bg-zinc-900 rounded-md text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"><X size={12}/></button>
                   
                   {/* DYNAMIC MULTI-CHAMBER UI */}
                   <div className="space-y-2">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1 block">Chambers / Flavors</label>
                      {safeStrains.map((strain: any, sIdx: number) => (
                         <div key={sIdx} className="flex items-center gap-1.5">
                            <input 
                               type="text" 
                               value={strain.name} 
                               placeholder="Flavor Name"
                               onChange={(e) => handleStrainChange(opt.id, sIdx, 'name', e.target.value)} 
                               className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg py-2 px-2 text-xs font-bold text-zinc-300 outline-none focus:border-cyan-500/50 transition-colors" 
                            />
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
                            {safeStrains.length > 1 && (
                                <button onClick={() => handleRemoveStrain(opt.id, sIdx)} className="p-2 bg-zinc-900 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 border border-zinc-800 transition-colors"><Minus size={12}/></button>
                            )}
                         </div>
                      ))}
                      {safeStrains.length < 3 && (
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
             <Boxes size={16} className="text-indigo-400" /> Global Vault Stock
           </h2>
           <div>
             <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Total Stock (Units)</label>
             <input type="number" value={updatedItem.onHand} onChange={(e) => setUpdatedItem({ ...updatedItem, onHand: Number(e.target.value) || 0 })} className="w-full bg-zinc-950 border border-indigo-500/30 rounded-xl p-3.5 text-sm font-mono font-bold text-indigo-400 focus:border-indigo-500 outline-none transition-colors" />
           </div>
         </section>
      )}

      {/* SECTION 5: MERCHANDISING & CAMPAIGN TOGGLE */}
      <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
         <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
           <TicketPercent size={16} className="text-pink-400" /> Merchandising & Campaigns
         </h2>
         
         <div className="flex flex-wrap gap-4 mb-8">
            <button onClick={()=>setUpdatedItem({...updatedItem, isTopShelf: !updatedItem.isTopShelf})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.isTopShelf ? 'bg-amber-500 text-zinc-950 border-amber-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-amber-500/50 hover:text-amber-400'}`}><Award size={16}/> Top Shelf / Reserve</button>
            <button onClick={()=>setUpdatedItem({...updatedItem, featured: !updatedItem.featured})} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest border transition-all flex items-center gap-2 ${updatedItem.featured ? 'bg-cyan-500 text-zinc-950 border-cyan-500 shadow-md' : 'bg-zinc-950 text-zinc-500 border-zinc-800 hover:border-cyan-500/50 hover:text-cyan-400'}`}><Star size={16}/> Featured Drop</button>
         </div>

         <div className={`border rounded-2xl p-5 transition-all duration-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${updatedItem.dailyDeal ? 'bg-pink-500/5 border-pink-500/30' : 'bg-zinc-950 border-zinc-800'}`}>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setUpdatedItem({ ...updatedItem, dailyDeal: !updatedItem.dailyDeal, dealType: !updatedItem.dailyDeal ? 'One-Shot' : 'None' })} 
                className={`w-12 h-6 rounded-full relative transition-colors ${updatedItem.dailyDeal ? 'bg-pink-500' : 'bg-zinc-800'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${updatedItem.dailyDeal ? 'left-7' : 'left-1'}`} />
              </button>
              <div>
                <h4 className={`text-sm font-black uppercase tracking-widest ${updatedItem.dailyDeal ? 'text-pink-400' : 'text-zinc-400'}`}>
                  Active Campaign
                </h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mt-0.5">
                  {updatedItem.dailyDeal ? 'Deal is live on the storefront' : 'No active campaigns'}
                </p>
              </div>
            </div>
            
            {updatedItem.dailyDeal && openCampaignConfig && (
              <button 
                onClick={(e) => { e.preventDefault(); openCampaignConfig(updatedItem); }} 
                className="bg-zinc-900 hover:bg-pink-500 hover:text-zinc-950 text-pink-400 border border-pink-500/50 px-4 py-3 sm:py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Configure Strategy
              </button>
            )}
         </div>
      </section>
    </>
  );
}