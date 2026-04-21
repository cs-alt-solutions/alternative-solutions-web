import React from 'react';
import { BookText, Wind, Cookie, Droplet, Sparkles, Activity, Plus, Trash2 } from 'lucide-react';

export default function EditorDNA({
  updatedItem, setUpdatedItem, descMode, setDescMode, showDNA, showLineage, isEdible
}: any) {
  
  // Initialize dynamic details array from existing data or create a blank one
  const edibleDetails = updatedItem.edibleDetails || (updatedItem.descBase ? [{ id: Date.now(), type: 'description', text: updatedItem.descBase }] : []);

  const handleDetailChange = (index: number, field: string, val: string) => {
     const newDetails = [...edibleDetails];
     newDetails[index] = { ...newDetails[index], [field]: val };
     
     // We automatically sync descBase as a fallback so the live storefront doesn't break
     const fallbackDesc = newDetails.map(d => d.text).join('\n\n');
     setUpdatedItem({ ...updatedItem, edibleDetails: newDetails, descBase: fallbackDesc });
  };

  const addDetail = (e: any) => {
     e.preventDefault();
     setUpdatedItem({ ...updatedItem, edibleDetails: [...edibleDetails, { id: Date.now(), type: 'description', text: '' }] });
  };

  const removeDetail = (index: number, e: any) => {
     e.preventDefault();
     const newDetails = [...edibleDetails];
     newDetails.splice(index, 1);
     const fallbackDesc = newDetails.map(d => d.text).join('\n\n');
     setUpdatedItem({ ...updatedItem, edibleDetails: newDetails, descBase: fallbackDesc });
  };

  return (
    <section className="bg-zinc-900/30 border border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm">
       <h2 className="text-sm font-black uppercase tracking-widest text-zinc-100 flex items-center gap-2 mb-6 pb-4 border-b border-zinc-800/50">
         <BookText size={16} className="text-emerald-400" /> {showDNA ? (isEdible ? 'Product Facts & Dosing' : 'Product DNA & Description') : 'Product Description'}
       </h2>
       
       {isEdible ? (
         <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* DOSING & CONTENTS BOX */}
            <div className="bg-zinc-950/50 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)] rounded-2xl p-5 md:p-6">
               <div className="flex items-center gap-2 mb-5 border-b border-zinc-800/80 pb-3">
                  <Activity size={16} className="text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Smart Edibles Data</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* UNIFIED TOTAL PACKAGE INPUT */}
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Total Container Amount</label>
                     <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                        <input 
                          type="text" 
                          value={updatedItem.descFact || ''} 
                          onChange={(e) => setUpdatedItem({...updatedItem, descFact: e.target.value})} 
                          placeholder="e.g. 100mg THC" 
                          className="flex-1 bg-transparent p-3 text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-600 min-w-0" 
                        />
                        <div className="bg-zinc-950 border-l border-zinc-800 flex items-center px-3 shrink-0">
                           <span className="text-[9px] text-zinc-600 font-black uppercase mr-2 tracking-widest">PER</span>
                           <select 
                              value={updatedItem.ediblePackageType || 'Package'} 
                              onChange={(e) => setUpdatedItem({...updatedItem, ediblePackageType: e.target.value})}
                              className="bg-transparent text-emerald-400 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-none"
                           >
                              {['Package', 'Bottle', 'Box', 'Tin', 'Jar', 'Pouch', 'Can'].map(t => <option key={t} value={t} className="bg-zinc-900 text-zinc-300">{t}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* UNIFIED PER SERVING INPUT */}
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Individual Dose Amount</label>
                     <div className="flex bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden focus-within:border-emerald-500/50 transition-colors">
                        <input 
                          type="text" 
                          value={updatedItem.descUses || ''} 
                          onChange={(e) => setUpdatedItem({...updatedItem, descUses: e.target.value})} 
                          placeholder="e.g. 10mg THC" 
                          className="flex-1 bg-transparent p-3 text-sm font-medium text-zinc-100 outline-none placeholder:text-zinc-600 min-w-0" 
                        />
                        <div className="bg-zinc-950 border-l border-zinc-800 flex items-center px-3 shrink-0">
                           <span className="text-[9px] text-zinc-600 font-black uppercase mr-2 tracking-widest">PER</span>
                           <select 
                              value={updatedItem.edibleServingType || 'Serving'} 
                              onChange={(e) => setUpdatedItem({...updatedItem, edibleServingType: e.target.value})}
                              className="bg-transparent text-emerald-400 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer border-none"
                           >
                              {['Serving', 'Piece', 'Gummy', 'Bite', 'Ounce', 'Square', 'Drop', 'Capful', 'G', 'mL'].map(t => <option key={t} value={t} className="bg-zinc-900 text-zinc-300">{t}</option>)}
                           </select>
                        </div>
                     </div>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Flavor Profile</label>
                     <input 
                       type="text" 
                       value={updatedItem.descTaste || ''} 
                       onChange={(e) => setUpdatedItem({...updatedItem, descTaste: e.target.value})} 
                       placeholder="e.g. Sour Watermelon" 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" 
                     />
                  </div>
                  <div>
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Expected Effect</label>
                     <input 
                       type="text" 
                       value={updatedItem.descFeels || ''} 
                       onChange={(e) => setUpdatedItem({...updatedItem, descFeels: e.target.value})} 
                       placeholder="e.g. Heavy couch-lock" 
                       className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" 
                     />
                  </div>
               </div>
            </div>
            
            {/* DYNAMIC DESCRIPTIONS & DISCLAIMERS BOX */}
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 md:p-6">
               <div className="flex items-center justify-between mb-4 border-b border-zinc-800/80 pb-3">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Descriptions & Disclaimers</label>
                  <button onClick={addDetail} className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 active:scale-95">
                     <Plus size={12} /> Add Block
                  </button>
               </div>

               <div className="space-y-3">
                  {edibleDetails.length === 0 && (
                     <div className="text-center py-6 text-zinc-600 text-xs font-bold uppercase tracking-widest italic border border-dashed border-zinc-800 rounded-xl">
                       No details added
                     </div>
                  )}
                  {edibleDetails.map((detail: any, index: number) => (
                     <div key={detail.id || index} className="flex gap-3 items-start bg-zinc-900 border border-zinc-800 rounded-xl p-3 group focus-within:border-emerald-500/30 transition-colors">
                       <div className="flex flex-col gap-2 shrink-0">
                           <select 
                             value={detail.type} 
                             onChange={(e) => handleDetailChange(index, 'type', e.target.value)}
                             className={`bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-[9px] font-black uppercase tracking-widest outline-none w-32 cursor-pointer ${detail.type === 'disclaimer' ? 'text-amber-400' : 'text-zinc-300'}`}
                           >
                             <option value="description">Description</option>
                             <option value="disclaimer">Disclaimer</option>
                           </select>
                       </div>
                       <textarea 
                         value={detail.text}
                         onChange={(e) => handleDetailChange(index, 'text', e.target.value)}
                         rows={2}
                         placeholder={`Enter ${detail.type} text...`}
                         className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none pt-1.5 min-w-0"
                       />
                       <button onClick={(e) => removeDetail(index, e)} className="p-2 text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors mt-0.5">
                          <Trash2 size={16} />
                       </button>
                     </div>
                  ))}
               </div>
            </div>
         </div>
       ) : (
         /* STANDARD DNA FORM FOR NON-EDIBLES */
         <div className="space-y-5 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-2xl p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  Storytelling Format
                </label>
                <div className="flex bg-zinc-950 border border-zinc-800 rounded-lg p-1">
                  <button 
                    onClick={(e) => { e.preventDefault(); setDescMode('desc'); }}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors ${descMode === 'desc' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Standard Description
                  </button>
                  <button 
                    onClick={(e) => { e.preventDefault(); setDescMode('fact'); }}
                    className={`px-4 py-1.5 rounded-md text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1.5 ${descMode === 'fact' ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 shadow-sm' : 'text-zinc-500 hover:text-pink-400/50'}`}
                  >
                    <Sparkles size={10} /> Insider Fact
                  </button>
                </div>
              </div>
              
              {descMode === 'desc' ? (
                <textarea 
                  value={updatedItem.descBase || ''} 
                  onChange={(e) => setUpdatedItem({ ...updatedItem, descBase: e.target.value })} 
                  rows={3} 
                  placeholder="Write a traditional product description..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3.5 text-sm font-medium text-zinc-300 focus:border-emerald-500/50 outline-none transition-colors resize-none" 
                />
              ) : (
                <textarea 
                  value={updatedItem.descFact || ''} 
                  onChange={(e) => setUpdatedItem({ ...updatedItem, descFact: e.target.value })} 
                  rows={3} 
                  placeholder="Write a short, punchy insider fact..."
                  className="w-full bg-zinc-900 border border-pink-500/30 rounded-xl p-3.5 text-sm font-medium text-pink-100 focus:border-pink-500 outline-none transition-colors resize-none" 
                />
              )}
            </div>
            
            {showDNA && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="relative">
                    <Wind size={14} className="absolute left-3 top-10 text-cyan-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Feels</label>
                    <input type="text" value={updatedItem.descFeels || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, descFeels: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                  <div className="relative">
                    <Cookie size={14} className="absolute left-3 top-10 text-amber-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Taste</label>
                    <input type="text" value={updatedItem.descTaste || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, descTaste: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                  <div className="relative">
                    <Droplet size={14} className="absolute left-3 top-10 text-emerald-400" />
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block ml-1">Uses</label>
                    <input type="text" value={updatedItem.descUses || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, descUses: e.target.value })} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" />
                  </div>
                </div>
            )}

            {showLineage && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-5 bg-zinc-950/50 border border-zinc-800/80 rounded-2xl mt-2">
                 <div>
                   <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Lineage / Cross / Strain Detail</label>
                   <input type="text" value={updatedItem.lineage || ''} onChange={(e) => setUpdatedItem({ ...updatedItem, lineage: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none" placeholder="e.g. Gelato × Zkittlez" />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider mb-2 block">Genetics Type</label>
                   <select value={updatedItem.strainType || 'N/A'} onChange={(e) => setUpdatedItem({ ...updatedItem, strainType: e.target.value })} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-medium text-zinc-100 focus:border-emerald-500/50 outline-none">
                     {['Sativa', 'Indica', 'Hybrid', 'Sativa Dom Hybrid', 'Indica Dom Hybrid', 'CBD', 'N/A'].map((st:string)=><option key={st} value={st}>{st}</option>)}
                   </select>
                 </div>
              </div>
            )}
         </div>
       )}
    </section>
  );
}